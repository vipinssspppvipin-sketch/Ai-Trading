require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const { scoreMarketSignal } = require('./src/ai/signalScorer');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE = 'https://apiconnect.angelone.in';

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function buildHeaders({ apiKey, jwtToken }) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-UserType': 'USER',
    'X-SourceID': 'WEB',
    'X-ClientLocalIP': '127.0.0.1',
    'X-ClientPublicIP': '127.0.0.1',
    'X-MACAddress': '00:00:00:00:00:00',
    'X-PrivateKey': apiKey
  };

  if (jwtToken) {
    headers.Authorization = 'Bearer ' + jwtToken;
  }

  return headers;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'ai-trading' });
});

app.post('/api/login', async (req, res) => {
  try {
    const { apiKey, clientCode, password, totp } = req.body || {};

    if (!apiKey || !clientCode || !password || !totp) {
      return res.status(400).json({ success: false, message: 'apiKey, clientCode, password, and totp are required.' });
    }

    const response = await axios.post(
      `${BASE}/rest/auth/angelbroking/user/v1/loginByPassword`,
      { clientcode: clientCode, password, totp },
      { headers: buildHeaders({ apiKey }) }
    );

    const data = response.data || {};
    if (!data.status || !data.data) {
      return res.status(401).json({ success: false, message: data.message || 'Login failed.' });
    }

    const profileResponse = await axios.get(
      `${BASE}/rest/secure/angelbroking/user/v1/getProfile`,
      { headers: buildHeaders({ apiKey, jwtToken: data.data.jwtToken }) }
    );

    const profile = profileResponse.data || {};

    return res.json({
      success: true,
      userName: profile.data?.name || clientCode,
      jwtToken: data.data.jwtToken,
      refreshToken: data.data.refreshToken || '',
      feedToken: data.data.feedToken || ''
    });
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed.';
    return res.status(500).json({ success: false, message });
  }
});

app.post('/api/quote', async (req, res) => {
  try {
    const { apiKey, jwtToken, exchange, token } = req.body || {};

    if (!apiKey || !jwtToken || !exchange || !token) {
      return res.status(400).json({ success: false, message: 'apiKey, jwtToken, exchange, and token are required.' });
    }

    const payload = {
      mode: 'FULL',
      exchangeTokens: {
        [exchange]: [token]
      }
    };

    const response = await axios.post(
      `${BASE}/rest/secure/angelbroking/market/v1/quote`,
      payload,
      { headers: buildHeaders({ apiKey, jwtToken }) }
    );

    const data = response.data || {};
    if (!data.status || !data.data || !data.data.fetched || !data.data.fetched.length) {
      return res.status(400).json({ success: false, message: data.message || 'Quote fetch failed.' });
    }

    return res.json({ success: true, quote: data.data.fetched[0] });
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Quote fetch failed.';
    return res.status(500).json({ success: false, message });
  }
});

app.post('/api/ai/signal', (req, res) => {
  try {
    const payload = req.body || {};
    const signal = scoreMarketSignal({
      symbol: payload.symbol || 'UNKNOWN',
      ltp: payload.ltp,
      previousClose: payload.previousClose,
      volume: payload.volume,
      averageVolume: payload.averageVolume,
      trendScore: payload.trendScore,
      momentumScore: payload.momentumScore
    });

    return res.json({ success: true, signal });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'AI model scoring failed.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Trading server running on http://localhost:${PORT}`);
});
