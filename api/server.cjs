const express = require('express');
const { execSync } = require('child_process');
const path = require('path');

const app = express();
const PORT = 8001;

app.use(express.json());

// CORS for local dev
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, company, industry, message, phone, howHeard } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Sanitize inputs for SQL
  const sanitize = (s) => (s || '').replace(/'/g, "''");
  const serviceInterest = sanitize(industry || '');
  const companyVal = sanitize(company || '');

  try {
    const sql = `INSERT INTO contact_submissions (name, email, company, service_interest, message) VALUES ('${sanitize(name)}', '${sanitize(email)}', '${companyVal}', '${serviceInterest}', '${sanitize(message)}')`;
    execSync(`team-db "${sql}"`, { timeout: 10000 });
    res.json({ success: true, message: 'Message received! We will get back to you within one business day.' });
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: 'Failed to save your message. Please try again later.' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`API server running on http://127.0.0.1:${PORT}`);
});