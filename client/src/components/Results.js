import React, { useState } from 'react';
import './Results.css';

/* The score, circled in red pen */
function ScoreMark({ score }) {
  return (
    <div className="score-mark" aria-label={`Match score ${score} out of 100`}>
      <svg className="score-circle" viewBox="0 0 320 220" aria-hidden="true" preserveAspectRatio="none">
        <path
          d="M 70 46 C 140 6, 270 14, 296 88 C 318 156, 230 206, 142 200
             C 58 194, 8 148, 24 92 C 36 52, 92 26, 176 24"
          pathLength="1"
        />
      </svg>
      <span className="score-num">{score}</span>
      <span className="score-out">/100</span>
    </div>
  );
}

function Stamp({ verdict }) {
  return <div className="stamp">{verdict}</div>;
}

function Results({ data, onReset }) {
  const [copied, setCopied] = useState(false);

  const strengths = data.strengths || [];
  const gaps = data.gaps || [];
  const tweaks = data.cvTweaks || [];

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(data.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="review">
      <div className="review-bar">
        <button className="back-btn" onClick={onReset}>← New review</button>
        <nav className="toc" aria-label="Sections">
          <a href="#marked-up">I. Marked up</a>
          <a href="#edits">II. Edits</a>
          <a href="#letter">III. The letter</a>
        </nav>
      </div>

      {/* Verdict */}
      <section className="verdict">
        <ScoreMark score={data.matchScore} />
        <div className="verdict-body">
          <span className="eyebrow">The verdict</span>
          <Stamp verdict={data.matchVerdict} />
          <p className="lede">{data.summary}</p>
        </div>
      </section>

      {/* I. Strengths & gaps */}
      <section className="chapter" id="marked-up">
        <header className="chapter-head">
          <span className="chapter-num">I.</span>
          <h2>Marked up</h2>
          <span className="chapter-note">highlighted = lines up · circled = missing</span>
        </header>

        <div className="columns">
          <div className="column">
            <h3 className="column-title">What works <span className="count">{strengths.length}</span></h3>
            <ol className="notes">
              {strengths.map((s, i) => (
                <li key={i} className="note note-strength" style={{ '--i': i }}>
                  <span className="tick" aria-hidden="true">✓</span>
                  <h4><mark>{s.title}</mark></h4>
                  <p>{s.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="column">
            <h3 className="column-title">What's missing <span className="count">{gaps.length}</span></h3>
            <ol className="notes">
              {gaps.map((g, i) => (
                <li key={i} className="note note-gap" style={{ '--i': i }}>
                  <h4><span className="ring">{g.title}</span></h4>
                  <p>{g.detail}</p>
                  {g.fix && <p className="fix"><span>fix&nbsp;→</span> {g.fix}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* II. CV tweaks */}
      <section className="chapter" id="edits">
        <header className="chapter-head">
          <span className="chapter-num">II.</span>
          <h2>Edits to your CV</h2>
          <span className="chapter-note">section by section</span>
        </header>

        <ol className="edits">
          {tweaks.map((t, i) => (
            <li key={i} className="edit">
              <span className="edit-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <span className="edit-section">§ {t.section}</span>
                <p><span className="caret" aria-hidden="true">‸</span>{t.suggestion}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* III. Cover letter */}
      <section className="chapter" id="letter">
        <header className="chapter-head">
          <span className="chapter-num">III.</span>
          <h2>The letter</h2>
          <button className="copy-btn" onClick={copyCoverLetter}>
            {copied ? 'Copied ✓' : 'Copy letter'}
          </button>
        </header>

        <div className="letter">
          <div className="letter-text">{data.coverLetter}</div>
          <span className="letter-note" aria-hidden="true">tailored to this role, give it a read before you send</span>
        </div>
      </section>
    </article>
  );
}

export default Results;
