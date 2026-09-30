require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const analyseRouter = require('./routes/analyse');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY. Set it in your .env file before starting the server.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5050;

// Trust X-Forwarded-For only from a proxy on this machine (the React dev proxy, or a local
// reverse proxy) so the rate limiter sees the real client IP without letting remote clients spoof it
app.set('trust proxy', 'loopback');

const analyseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many analysis requests. Please try again in a few minutes.' },
});

app.use(cors());
app.use(express.json());

app.use('/api/analyse', analyseLimiter, analyseRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CVMatch API running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
