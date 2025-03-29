const express = require('express');
const axios = require('axios');
const app = express();

// Middleware ?? parse JSON (n?u c?n)
app.use(express.json());

// Endpoint proxy cho Redmine API
app.get('/redmine-api/*', async (req, res) => {
  try {
    // L?y URL Redmine t? header
    const targetUrl = req.headers['x-target-url'];
    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing X-Target-URL header' });
    }

    // L?y API key t? header
    const apiKey = req.headers['x-redmine-api-key'];
    if (!apiKey) {
      return res.status(400).json({ error: 'Missing X-Redmine-API-Key header' });
    }

    // T?o URL ??y ?? cho Redmine API
    const redmineUrl = `${targetUrl}${req.url.replace('/redmine-api', '')}`;
    console.log('Proxying request to:', redmineUrl);

    // G?i y?u c?u t?i Redmine API
    const response = await axios.get(redmineUrl, {
      headers: { 'X-Redmine-API-Key': apiKey },
    });

    // Tr? k?t qu? v? cho client
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Redmine', details: error.message });
  }
});

// Ch?y server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});