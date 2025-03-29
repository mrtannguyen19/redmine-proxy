const express = require('express');
const axios = require('axios');
const app = express();

// Th?m middleware ?? x? l? CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://mrtannguyen19.github.io'); // Cho ph?p origin c?a GitHub Pages
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Cho ph?p ph??ng th?c GET v? OPTIONS
  res.header('Access-Control-Allow-Headers', 'X-Redmine-API-Key, X-Target-URL'); // Cho ph?p c?c header c?n thi?t
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Ph?n h?i nhanh cho preflight request
  }
  next();
});

app.use(express.json());

app.get('/redmine-api/*', async (req, res) => {
  try {
    const targetUrl = req.headers['x-target-url'];
    if (!targetUrl) return res.status(400).json({ error: 'Missing X-Target-URL header' });
    const apiKey = req.headers['x-redmine-api-key'];
    if (!apiKey) return res.status(400).json({ error: 'Missing X-Redmine-API-Key header' });

    const redmineUrl = `${targetUrl}${req.url.replace('/redmine-api', '')}`;
    console.log('Proxying request to:', redmineUrl);

    const response = await axios.get(redmineUrl, {
      headers: { 'X-Redmine-API-Key': apiKey },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Redmine', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});