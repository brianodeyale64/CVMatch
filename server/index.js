require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyseRouter = require('./routes/analyse');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/analyse', analyseRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CVMatch API running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
