const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/', upload.single('cv'), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    let cvText = req.body.cvText || '';

    if (req.file) {
      const pdfData = await pdf(req.file.buffer);
      cvText = pdfData.text;
    }

    if (!cvText.trim()) {
      return res.status(400).json({ error: 'Please provide your CV text or upload a PDF.' });
    }

    const prompt = `You are an expert career coach and technical recruiter specialising in software engineering roles.

A candidate has provided their CV and a job description. Analyse the match thoroughly and return ONLY a valid JSON object with no markdown, no backticks, no preamble.

CV:
${cvText}

Job Description:
${jobDescription}

Return this exact JSON structure:
{
  "matchScore": <number 0-100>,
  "matchVerdict": "<one of: Strong Match | Good Match | Partial Match | Weak Match>",
  "summary": "<2-3 sentence overall assessment>",
  "strengths": [
    { "title": "<strength title>", "detail": "<explanation>" }
  ],
  "gaps": [
    { "title": "<gap title>", "detail": "<explanation>", "fix": "<how to address it>" }
  ],
  "cvTweaks": [
    { "section": "<CV section>", "suggestion": "<specific improvement>" }
  ],
  "coverLetter": "<full tailored cover letter as a string, 3-4 paragraphs, professional tone, references specific job requirements>"
}

Be specific, honest and actionable. The strengths array should have 3-5 items. The gaps array should have 2-4 items. The cvTweaks array should have 3-5 items.`;

    let message;
    try {
      message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });
    } catch (apiErr) {
      console.error('Claude API error:', apiErr);
      if (apiErr.status === 429) {
        return res.status(429).json({ error: 'The AI service is receiving too many requests right now. Please try again shortly.' });
      }
      if (apiErr.status === 529 || apiErr.error?.error?.type === 'overloaded_error') {
        return res.status(503).json({ error: 'The AI service is temporarily overloaded. Please try again in a moment.' });
      }
      return res.status(502).json({ error: 'The AI service could not be reached. Please try again.' });
    }

    const raw = message.content[0].text.trim();
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}') + 1;
    const jsonStr = raw.slice(jsonStart, jsonEnd);

    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('Failed to parse Claude response as JSON:', parseErr, raw);
      return res.status(502).json({ error: 'The AI returned an unexpected response format. Please try again.' });
    }

    res.json(result);
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

module.exports = router;
