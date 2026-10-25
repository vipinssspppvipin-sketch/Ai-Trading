<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Trading Dashboard</title>
    <style>
      * { box-sizing: border-box; }
      :root {
        --bg: #07111d;
        --bg2: #0d1c2b;
        --panel: #12273a;
        --line: #2c4a65;
        --text: #ebf4ff;
        --muted: #9bb4c8;
        --green: #2ad19d;
        --green-soft: rgba(42, 209, 157, 0.16);
        --red: #ff6886;
        --red-soft: rgba(255, 104, 134, 0.12);
        --yellow: #ffd166;
        --blue: #71b7ff;
      }

      html, body {
        margin: 0;
        min-height: 100%;
        background: var(--bg);
        color: var(--text);
        font-family: Inter, 'Segoe UI', sans-serif;
      }

      body { min-height: 100vh; }

      .login-screen {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px;
        background: radial-gradient(circle at top, rgba(56,105,186,0.28), rgba(7,17,29,1) 40%);
      }

      .login-card {
        width: min(100%, 420px);
        background: linear-gradient(180deg, rgba(18,39,58,0.96), rgba(10,22,35,0.96));
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 30px 80px rgba(0,0,0,0.28);
      }

      .login-card h1 { margin: 0 0 8px; font-size: 2rem; }
      .login-card h1 span, .brand span { color: var(--green); }
      .subtitle { margin: 0 0 18px; color: var(--muted); line-height: 1.5; }
      .field-group { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
      .field-group label { font-size: 0.76rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; }
      input, select, button { font: inherit; }
      input, select {
        width: 100%; background: rgba(10,18,29,0.9); border: 1px solid var(--line); color: var(--text);
        border-radius: 10px; min-height: 42px; padding: 10px 12px; outline: none;
      }
      input:focus, select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(113,183,255,0.12); }
      .primary-btn, .secondary-btn, .warning-btn {
        border: none; border-radius: 10px; cursor: pointer; font-weight: 700; min-height: 42px; padding: 10px 16px;
        transition: transform 0.12s ease, opacity 0.12s ease;
      }
      .primary-btn:hover, .secondary-btn:hover, .warning-btn:hover { transform: translateY(-1px); }
      .primary-btn { width: 100%; background: linear-gradient(135deg, var(--green), #7ce7c2); color: #061510; }
      .secondary-btn { background: rgba(113,183,255,0.12); color: var(--text); border: 1px solid rgba(113,183,255,0.35); }
      .warning-btn { background: linear-gradient(135deg, var(--yellow), #ffe199); color: #2f2205; }
      .error-box { display: none; margin-bottom: 12px; background: rgba(255,104,134,0.08); border: 1px solid rgba(255,104,134,0.35); color: var(--red); border-radius: 10px; padding: 10px 12px; line-height: 1.4; }
      .hidden { display: none !important; }

      .app-shell { min-height: 100vh; }
      .topbar {
        display: flex; justify-content: space-between; align-items: center; padding: 18px 24px;
        border-bottom: 1px solid var(--line); background: rgba(7,17,29,0.9); position: sticky; top: 0; z-index: 10;
      }
      .brand { font-size: 1.2rem; font-weight: 800; }
      .brand span { color: var(--green); }
      .topbar-right { display: flex; align-items: center; gap: 12px; }
      .status-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(18,39,58,0.8); border: 1px solid var(--line); border-radius: 999px; padding: 7px 12px; font-size: 0.8rem; color: var(--muted); }
      .status-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--muted); box-shadow: 0 0 12px rgba(255,255,255,0.15); }
      .status-dot.live { background: var(--green); box-shadow: 0 0 12px rgba(42,209,157,0.7); }
      .status-dot.error { background: var(--red); box-shadow: 0 0 12px rgba(255,104,134,0.7); }

      .main-grid { display: grid; grid-template-columns: 1.35fr 0.95fr; gap: 22px; padding: 22px; }
      .panel {
        background: linear-gradient(180deg, rgba(18,39,58,0.96), rgba(10,22,35,0.96)); border: 1px solid var(--line);
        border-radius: 18px; overflow: hidden;
      }
      .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 18px 12px; border-bottom: 1px solid var(--line); }
      .panel-header h3 { margin: 0; letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.78rem; color: var(--muted); }
      .market-body, .strategy-body { padding: 18px; }
      .toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: end; margin-bottom: 18px; }
      .compact { min-width: 120px; margin-bottom: 0; }
      .ltp-box { display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid var(--line); border-radius: 14px; background: rgba(8,17,28,0.7); padding: 18px 20px; margin-bottom: 18px; }
      .symbol-name { font-weight: 800; font-size: 1.2rem; }
      .price-box { text-align: right; }
      .ltp-price { font-size: clamp(2rem, 3vw, 2.8rem); font-weight: 800; letter-spacing: -0.05em; }
      .ltp-change { display: inline-block; margin-top: 5px; padding: 5px 9px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; background: rgba(255,255,255,0.04); }
      .ltp-change.up { background: var(--green-soft); color: var(--green); }
      .ltp-change.down { background: var(--red-soft); color: var(--red); }
      .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px; }
      .stat-box { background: rgba(8,17,28,0.72); border: 1px solid var(--line); border-radius: 12px; padding: 14px 12px; text-align: center; }
      .stat-label { font-size: 0.68rem; letter-spacing: 0.12em; color: var(--muted); text-transform: uppercase; }
      .stat-value { margin-top: 8px; font-size: 1rem; font-weight: 800; }
      .green { color: var(--green); }
      .red { color: var(--red); }
      .muted { color: var(--muted); }
      .small { font-size: 0.8rem; }
      .table-wrap { border-radius: 12px; overflow: hidden; border: 1px solid var(--line); }
      .table-wrap table { width: 100%; border-collapse: collapse; }
      .table-wrap th, .table-wrap td { text-align:left; padding:10px 12px; border-top:1px solid rgba(44,74,101,0.9); font-size:0.9rem; }
      .table-wrap thead th { background: rgba(26,53,80,0.8); color: var(--muted); text-transform: uppercase; font-size:0.7rem; letter-spacing:0.08em; }
      .table-wrap td { font-family: ui-monospace, SFMono-Regular, monospace; }

      .side-stack { display: flex; flex-direction: column; gap: 22px; }
      .two-col { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
      .strategy-list { list-style: none; margin: 16px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
      .strategy-list li { padding: 10px 12px; background: rgba(8,17,28,0.75); border: 1px solid var(--line); border-radius: 10px; color: var(--muted); font-size: 0.84rem; line-height: 1.5; }
      .actions { display:flex; gap:10px; margin-top:18px; flex-wrap:wrap; }
      .actions button { flex:1; min-width:140px; }
      .log-box { min-height: 180px; padding: 16px; color: var(--muted); line-height: 1.6; white-space: pre-wrap; font-size: 0.9rem; }

      .chart-area {
        margin-top: 20px; background: rgba(9, 18, 30, 0.9); border: 1px solid var(--line); border-radius: 14px; overflow: hidden;
      }
      .chart-header { display:flex; justify-content:space-between; align-items:center; padding: 12px 14px; border-bottom:1px solid var(--line); }
      .legend { display:flex; gap:8px; align-items:center; font-size:0.75rem; color: var(--muted); }
      .swatch { width:10px; height:10px; border-radius:50%; display:inline-block; }
      canvas { display:block; width:100%; height:280px; }

      @media (max-width: 980px) { .main-grid { grid-template-columns: 1fr; } }
      @media (max-width: 620px) { .toolbar, .two-col, .stats-grid { grid-template-columns: 1fr; display: grid; } .ltp-box { flex-direction:column; align-items:flex-start; } .price-box { text-align:left; } }
    </style>
  </head>
  <body>
    <div class="login-screen" id="loginScreen">
      <div class="login-card">
        <h1>AI <span>Trading</span></h1>
        <p class="subtitle">Angel One SmartAPI dashboard with charting, strategy planning, and AI support.</p>
        <div id="loginError" class="error-box"></div>
        <div class="field-group">
          <label>API Key</label>
          <input id="apiKey" type="text" placeholder="SmartAPI key" />
        </div>
        <div class="field-group">
          <label>Client Code</label>
          <input id="clientCode" type="text" placeholder="Client code" />
        </div>
        <div class="field-group">
          <label>Password / MPIN</label>
          <input id="password" type="password" placeholder="Password or MPIN" />
        </div>
        <div class="field-group">
          <label>TOTP</label>
          <input id="totp" type="text" maxlength="6" placeholder="6-digit TOTP" />
        </div>
        <button id="loginBtn" class="primary-btn">Connect</button>
      </div>
    </div>

    <div id="appShell" class="app-shell hidden">
      <header class="topbar">
        <div class="brand">AI <span>Trading</span></div>
        <div class="topbar-right">
          <span class="status-pill"><span id="statusDot" class="status-dot"></span> <span id="statusText">Disconnected</span></span>
          <button id="logoutBtn" class="secondary-btn">Logout</button>
        </div>
      </header>

      <main class="main-grid">
        <section class="panel">
          <div class="panel-header">
            <h3>Live Market</h3>
            <span id="userLabel" class="small muted">User</span>
          </div>

          <div class="market-body">
            <div class="toolbar">
              <div class="field-group compact">
                <label>Exchange</label>
                <select id="exchangeSelect">
                  <option value="NSE">NSE</option>
                  <option value="NFO">NFO</option>
                  <option value="BSE">BSE</option>
                </select>
              </div>
              <div class="field-group compact">
                <label>Symbol</label>
                <input id="symbolInput" value="SBIN-EQ" />
              </div>
              <div class="field-group compact">
                <label>Token</label>
                <input id="tokenInput" value="3045" />
              </div>
              <button id="loadQuoteBtn" class="primary-btn" style="width:auto;">Load</button>
            </div>

            <div class="ltp-box">
              <div>
                <div id="symbolName" class="symbol-name">SBIN-EQ</div>
                <div id="symbolMeta" class="muted small">NSE • Token 3045</div>
              </div>
              <div class="price-box">
                <div id="ltpPrice" class="ltp-price">—</div>
                <div id="ltpChange" class="ltp-change">—</div>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-box"><div class="stat-label">Open</div><div id="openValue" class="stat-value">—</div></div>
              <div class="stat-box"><div class="stat-label">High</div><div id="highValue" class="stat-value green">—</div></div>
              <div class="stat-box"><div class="stat-label">Low</div><div id="lowValue" class="stat-value red">—</div></div>
              <div class="stat-box"><div class="stat-label">Volume</div><div id="volumeValue" class="stat-value">—</div></div>
            </div>

            <div class="chart-area">
              <div class="chart-header">
                <div style="font-size:0.75rem; letter-spacing:0.12em; text-transform:uppercase; color: var(--muted);">Price Chart</div>
                <div class="legend">
                  <span><span class="swatch" style="background: var(--green);"></span> SMA9</span>
                  <span><span class="swatch" style="background: var(--blue);"></span> EMA9</span>
                </div>
              </div>
              <canvas id="priceChart" width="900" height="280"></canvas>
            </div>

            <div class="table-wrap" style="margin-top: 18px;">
              <table>
                <thead>
                  <tr>
                    <th>Bid Qty</th>
                    <th>Bid Orders</th>
                    <th>Price</th>
                    <th>Ask Orders</th>
                    <th>Ask Qty</th>
                  </tr>
                </thead>
                <tbody id="depthTableBody">
                  <tr><td colspan="5" class="muted">Waiting for quote...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside class="side-stack">
          <section class="panel strategy-panel">
            <div class="panel-header"><h3>Strategy Setup</h3></div>
            <div class="strategy-body">
              <div class="two-col">
                <div class="field-group">
                  <label>Strategy</label>
                  <select id="strategyType">
                    <option value="breakout">Breakout Ladder</option>
                    <option value="pullback">Pullback Add-On</option>
                    <option value="scalp">Scalp Grid</option>
                  </select>
                </div>
                <div class="field-group">
                  <label>Side</label>
                  <select id="tradeSide">
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
              </div>

              <div class="two-col">
                <div class="field-group"><label>Qty</label><input id="strategyQty" type="number" value="50" min="1" /></div>
                <div class="field-group"><label>Risk %</label><input id="riskPercent" type="number" value="1.5" step="0.1" /></div>
              </div>

              <div class="field-group"><label>Levels</label><input id="levelOffsets" type="text" value="0.5, 1.0, 2.0, 3.5" /></div>

              <div class="two-col">
                <div class="field-group"><label>TP Offset</label><input id="tpOffset" type="number" value="1.8" step="0.1" /></div>
                <div class="field-group"><label>SL Offset</label><input id="slOffset" type="number" value="0.8" step="0.1" /></div>
              </div>

              <div class="actions">
                <button id="generateStrategyBtn" class="primary-btn">Generate Plan</button>
                <button id="placeDemoOrderBtn" class="warning-btn">Place Demo Order</button>
              </div>

              <ul id="strategyList" class="strategy-list">
                <li>Waiting for strategy generation.</li>
              </ul>

              <div id="aiSignalWidget" style="margin-top: 18px; background: rgba(16,34,48,0.96); border: 1px solid rgba(113,183,255,0.35); border-radius: 16px; padding: 16px 18px;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px;">
                  <div style="font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#9bb4c8;">AI Signal</div>
                  <div id="aiSignalBadge" style="padding:6px 10px; border-radius:999px; background:rgba(42,209,157,0.12); color:#2ad19d; font-weight:700; font-size:0.76rem;">Scanning...</div>
                </div>
                <div style="display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:10px; margin-bottom:10px;">
                  <div style="background:rgba(8,17,28,0.7); border:1px solid rgba(44,74,101,0.9); border-radius:10px; padding:10px;">
                    <div style="color:#9bb4c8; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.08em;">Confidence</div>
                    <div id="aiConfidence" style="margin-top:8px; font-size:1.2rem; font-weight:800; color:#ebf4ff;">--</div>
                  </div>
                  <div style="background:rgba(8,17,28,0.7); border:1px solid rgba(44,74,101,0.9); border-radius:10px; padding:10px;">
                    <div style="color:#9bb4c8; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.08em;">Trend</div>
                    <div id="aiTrend" style="margin-top:8px; font-size:1.2rem; font-weight:800; color:#ebf4ff;">--</div>
                  </div>
                  <div style="background:rgba(8,17,28,0.7); border:1px solid rgba(44,74,101,0.9); border-radius:10px; padding:10px;">
                    <div style="color:#9bb4c8; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.08em;">Volume</div>
                    <div id="aiVolume" style="margin-top:8px; font-size:1.2rem; font-weight:800; color:#ebf4ff;">--</div>
                  </div>
                </div>
                <div id="aiSignalReason" style="line-height:1.6; color:#9bb4c8; font-size:0.84rem;">Signal engine waiting for fresh market data.</div>
              </div>
            </div>
          </section>

          <section class="panel log-panel">
            <div class="panel-header"><h3>Trade Log</h3></div>
            <div id="tradeLogBox" class="log-box">System ready.</div>
          </section>
        </aside>
      </main>
    </div>

    <script>
      const state = {
        apiKey: '',
        jwtToken: '',
        userName: '',
        quote: null,
        strategyPlan: [],
        chartData: []
      };

      const loginScreen = document.getElementById('loginScreen');
      const appShell = document.getElementById('appShell');
      const loginError = document.getElementById('loginError');
      const tradeLogBox = document.getElementById('tradeLogBox');
      const strategyList = document.getElementById('strategyList');
      const statusDot = document.getElementById('statusDot');
      const statusText = document.getElementById('statusText');

      function showError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
      }
      function clearError() {
        loginError.textContent = '';
        loginError.style.display = 'none';
      }
      function logTrade(message) {
        const stamp = new Date().toLocaleTimeString('en-IN', { hour12: false });
        tradeLogBox.textContent = `[${stamp}] ${message}\n\n${tradeLogBox.textContent}`;
      }
      function setStatus(connected, label) {
        statusDot.classList.toggle('live', connected);
        statusDot.classList.toggle('error', !connected);
        statusText.textContent = label || 'Disconnected';
      }
      function formatPrice(value) {
        if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
        return Number(value).toFixed(2);
      }
      function formatNumber(value) {
        if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
        const n = Number(value);
        if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
        if (n >= 100000) return `${(n / 100000).toFixed(2)} L`;
        if (n >= 1000) return n.toLocaleString('en-IN');
        return n.toString();
      }

      async function doLogin() {
        const apiKey = document.getElementById('apiKey').value.trim();
        const clientCode = document.getElementById('clientCode').value.trim();
        const password = document.getElementById('password').value.trim();
        const totp = document.getElementById('totp').value.trim();

        if (!apiKey || !clientCode || !password || !totp) {
          showError('Please fill in all login fields.');
          return;
        }

        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey, clientCode, password, totp })
          });
          const payload = await response.json();
          if (!response.ok || !payload.success) {
            throw new Error(payload.message || 'Login failed.');
          }

          state.apiKey = apiKey;
          state.jwtToken = payload.jwtToken;
          state.userName = payload.userName || clientCode;
          document.getElementById('userLabel').textContent = state.userName;
          loginScreen.classList.add('hidden');
          appShell.classList.remove('hidden');
          clearError();
          setStatus(true, 'Connected');
          logTrade('Login successful.');
          await fetchQuote();
          await loadChartData();
        } catch (error) {
          console.error(error);
          showError(error.message || 'Login failed.');
          setStatus(false, 'Auth Failed');
        }
      }

      async function fetchQuote() {
        if (!state.apiKey || !state.jwtToken) return;
        const exchange = document.getElementById('exchangeSelect').value;
        const symbol = document.getElementById('symbolInput').value.trim() || 'SBIN-EQ';
        const token = document.getElementById('tokenInput').value.trim() || '3045';

        try {
          const response = await fetch('/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: state.apiKey, jwtToken: state.jwtToken, exchange, token, symbol })
          });
          const payload = await response.json();
          if (!response.ok || !payload.success) {
            throw new Error(payload.message || 'Quote fetch failed.');
          }

          state.quote = payload.quote;
          renderQuote(payload.quote, symbol, exchange, token);
          setStatus(true, 'Live');
          logTrade(`Quote refreshed for ${symbol} (${exchange}).`);
          await fetchAiSignal();
        } catch (error) {
          console.error(error);
          setStatus(false, 'Quote Error');
          logTrade(`Quote error: ${error.message}`);
        }
      }

      function renderQuote(quote, symbol, exchange, token) {
        const ltp = Number(quote.ltp || 0);
        const previousClose = Number(quote.close || 0);
        const delta = ltp - previousClose;
        const pct = previousClose ? (delta / previousClose) * 100 : 0;

        document.getElementById('symbolName').textContent = symbol;
        document.getElementById('symbolMeta').textContent = `${exchange} • Token ${token}`;
        document.getElementById('ltpPrice').textContent = formatPrice(ltp);

        const changeEl = document.getElementById('ltpChange');
        changeEl.textContent = `${delta >= 0 ? '+' : ''}${delta.toFixed(2)} (${pct.toFixed(2)}%)`;
        changeEl.className = 'ltp-change ' + (delta >= 0 ? 'up' : 'down');

        document.getElementById('openValue').textContent = formatPrice(quote.open);
        document.getElementById('highValue').textContent = formatPrice(quote.high);
        document.getElementById('lowValue').textContent = formatPrice(quote.low);
        document.getElementById('volumeValue').textContent = formatNumber(quote.tradeVolume || quote.volume || 0);

        const buy = quote.depth?.buy || [];
        const sell = quote.depth?.sell || [];
        const rows = [];
        const maxLevel = Math.max(buy.length, sell.length, 6);
        for (let i = 0; i < maxLevel; i++) {
          const b = buy[i] || { quantity: '', orders: '', price: '' };
          const s = sell[i] || { quantity: '', orders: '', price: '' };
          rows.push(`
            <tr>
              <td class="green">${b.quantity !== '' ? formatNumber(b.quantity) : '—'}</td>
              <td class="muted">${b.orders || '—'}</td>
              <td>${b.price !== '' ? formatPrice(b.price) : '—'}</td>
              <td class="muted">${s.orders || '—'}</td>
              <td class="red">${s.quantity !== '' ? formatNumber(s.quantity) : '—'}</td>
            </tr>
          `);
        }
        document.getElementById('depthTableBody').innerHTML = rows.join('');
      }

      function parseOffsets(input) {
        return String(input || '')
          .split(',')
          .map((value) => Number(value.trim()))
          .filter((value) => Number.isFinite(value) && value > 0)
          .sort((a, b) => a - b);
      }

      function generateStrategy() {
        if (!state.quote) {
          logTrade('No live quote available. Load a symbol before generating a plan.');
          return;
        }

        const symbol = document.getElementById('symbolInput').value.trim() || 'SBIN-EQ';
        const ltp = Number(state.quote.ltp || 0);
        const strategyType = document.getElementById('strategyType').value;
        const tradeSide = document.getElementById('tradeSide').value;
        const totalQty = Number(document.getElementById('strategyQty').value || 0);
        const tpOffset = Number(document.getElementById('tpOffset').value || 1.5);
        const slOffset = Number(document.getElementById('slOffset').value || 0.8);
        const offsets = parseOffsets(document.getElementById('levelOffsets').value || '0.5,1,2,3');

        if (!ltp || !totalQty || !offsets.length) {
          logTrade('Strategy parameters are invalid.');
          return;
        }

        const direction = tradeSide === 'BUY' ? 1 : -1;
        const qtyWeights = [0.35, 0.25, 0.2, 0.2];
        const plan = offsets.map((offset, index) => {
          const entryPrice = Number((ltp + direction * offset).toFixed(2));
          const qty = Math.max(1, Math.round(totalQty * (qtyWeights[index] || 0.2)));
          const tp = Number((entryPrice + (direction === 1 ? tpOffset : -tpOffset)).toFixed(2));
          const sl = Number((entryPrice - (direction === 1 ? slOffset : -slOffset)).toFixed(2));
          return { level: index + 1, side: tradeSide, entry: entryPrice, qty, tp, sl, strategyType };
        });

        state.strategyPlan = plan;
        strategyList.innerHTML = plan.map((item) => `
          <li><strong>Level ${item.level}:</strong> ${item.side} @ ${formatPrice(item.entry)} | Qty ${item.qty} | TP ${formatPrice(item.tp)} | SL ${formatPrice(item.sl)}</li>
        `).join('');
        logTrade(`Generated ${plan.length}-level ${strategyType} plan for ${symbol}.`);
      }

      function placeDemoOrder() {
        if (!state.strategyPlan.length) {
          generateStrategy();
        }
        if (!state.strategyPlan.length) {
          logTrade('No strategy plan generated.');
          return;
        }

        const first = state.strategyPlan[0];
        const payload = {
          symbol: document.getElementById('symbolInput').value.trim() || 'SBIN-EQ',
          exchange: document.getElementById('exchangeSelect').value,
          side: first.side,
          quantity: first.qty,
          price: first.entry,
          takeProfit: first.tp,
          stopLoss: first.sl,
          productType: 'CNC',
          orderType: 'LIMIT'
        };
        logTrade(`Demo order prepared: ${JSON.stringify(payload)}`);
      }

      async function fetchAiSignal() {
        if (!state.quote) return;

        const quote = state.quote;
        const symbol = document.getElementById('symbolInput').value.trim() || 'SBIN-EQ';
        const previousClose = Number(quote.close || 0);
        const ltp = Number(quote.ltp || 0);
        const volume = Number(quote.tradeVolume || quote.volume || 0);
        const averageVolume = volume * 0.8;
        const trendScore = ltp - previousClose;
        const momentumScore = previousClose ? ((ltp - previousClose) / previousClose) * 100 : 0;

        try {
          const response = await fetch('/api/ai/signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol, ltp, previousClose, volume, averageVolume, trendScore, momentumScore })
          });
          const payload = await response.json();
          if (!response.ok || !payload.success) throw new Error(payload.message || 'AI signal failed');

          const signal = payload.signal || {};
          const badge = document.getElementById('aiSignalBadge');
          const confidenceEl = document.getElementById('aiConfidence');
          const trendEl = document.getElementById('aiTrend');
          const volumeEl = document.getElementById('aiVolume');
          const reasonEl = document.getElementById('aiSignalReason');

          badge.textContent = signal.label || 'Neutral';
          badge.style.background = signal.isBullish ? 'rgba(42,209,157,0.12)' : signal.isBearish ? 'rgba(255,104,134,0.12)' : 'rgba(113,183,255,0.12)';
          badge.style.color = signal.isBullish ? '#2ad19d' : signal.isBearish ? '#ff6886' : '#71b7ff';
          confidenceEl.textContent = `${signal.confidence || 0}%`;
          trendEl.textContent = signal.delta >= 0 ? `+${signal.delta || 0}` : `${signal.delta || 0}`;
          volumeEl.textContent = `${(signal.volumeRatio || 1).toFixed(2)}x`;
          reasonEl.textContent = signal.reason || 'Signal engine is monitoring the market.';
        } catch (error) {
          document.getElementById('aiSignalBadge').textContent = 'Signal Error';
          document.getElementById('aiSignalBadge').style.background = 'rgba(255,104,134,0.12)';
          document.getElementById('aiSignalBadge').style.color = '#ff6886';
          document.getElementById('aiSignalReason').textContent = error.message || 'AI signal engine could not score the market.';
        }
      }

      async function loadChartData() {
        const symbol = document.getElementById('symbolInput').value.trim() || 'SBIN-EQ';
        try {
          const response = await fetch(`/api/chart-data?symbol=${encodeURIComponent(symbol)}`);
          const payload = await response.json();
          if (!response.ok || !payload.success) throw new Error(payload.message || 'Chart data unavailable');
          state.chartData = payload.candles || [];
          renderChart();
        } catch (error) {
          console.error(error);
          state.chartData = [];
          renderChart();
        }
      }

      function renderChart() {
        const canvas = document.getElementById('priceChart');
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#07111d';
        ctx.fillRect(0, 0, width, height);

        if (!state.chartData.length) {
          ctx.fillStyle = '#9bb4c8';
          ctx.font = '16px sans-serif';
          ctx.fillText('Chart data unavailable', 24, 30);
          return;
        }

        const prices = state.chartData.map((c) => Number(c.close || 0));
        const minPrice = Math.min(...prices, ...state.chartData.map((c) => Number(c.low || 0))) * 0.995;
        const maxPrice = Math.max(...prices, ...state.chartData.map((c) => Number(c.high || 0))) * 1.005;
        const pad = 28;
        const chartWidth = width - pad * 2;
        const chartHeight = height - pad * 2;

        ctx.strokeStyle = 'rgba(156,180,200,0.25)';
        for (let i = 0; i <= 4; i++) {
          const y = pad + (chartHeight / 4) * i;
          ctx.beginPath();
          ctx.moveTo(pad, y);
          ctx.lineTo(width - pad, y);
          ctx.stroke();
        }

        const sma9 = state.chartData.map((_, index) => {
          if (index < 8) return null;
          const slice = state.chartData.slice(index - 8, index + 1);
          const avg = slice.reduce((sum, c) => sum + Number(c.close || 0), 0) / slice.length;
          return avg;
        });

        const ema9 = [];
        let ema = null;
        state.chartData.forEach((c, index) => {
          const close = Number(c.close || 0);
          if (index === 0) {
            ema = close;
            ema9.push(close);
            return;
          }
          const k = 2 / (9 + 1);
          ema = (close - ema) * k + ema;
          ema9.push(ema);
        });

        function plotLine(values, color, offset = 0) {
          ctx.beginPath();
          values.forEach((value, index) => {
            if (value === null || value === undefined) return;
            const x = pad + (chartWidth / Math.max(values.length - 1, 1)) * index;
            const y = height - pad - ((value - minPrice) / Math.max((maxPrice - minPrice), 0.001)) * chartHeight + offset;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        plotLine(sma9, '#2ad19d');
        plotLine(ema9, '#71b7ff');

        ctx.strokeStyle = 'rgba(113,183,255,0.15)';
        ctx.beginPath();
        ctx.moveTo(pad, height - pad);
        ctx.lineTo(width - pad, height - pad);
        ctx.stroke();

        state.chartData.forEach((candle, index) => {
          const x = pad + (chartWidth / state.chartData.length) * index + 2;
          const open = Number(candle.open || 0);
          const close = Number(candle.close || 0);
          const high = Number(candle.high || 0);
          const low = Number(candle.low || 0);
          const yOpen = height - pad - ((open - minPrice) / Math.max((maxPrice - minPrice), 0.001)) * chartHeight;
          const yClose = height - pad - ((close - minPrice) / Math.max((maxPrice - minPrice), 0.001)) * chartHeight;
          const yHigh = height - pad - ((high - minPrice) / Math.max((maxPrice - minPrice), 0.001)) * chartHeight;
          const yLow = height - pad - ((low - minPrice) / Math.max((maxPrice - minPrice), 0.001)) * chartHeight;
          const color = close >= open ? '#2ad19d' : '#ff6886';
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(x + 2, yHigh);
          ctx.lineTo(x + 2, yLow);
          ctx.stroke();
          ctx.fillStyle = color;
          ctx.fillRect(x, Math.min(yOpen, yClose), 6, Math.max(2, Math.abs(yClose - yOpen)));
        });
      }

      document.getElementById('loginBtn').addEventListener('click', doLogin);
      document.getElementById('logoutBtn').addEventListener('click', () => {
        state.apiKey = '';
        state.jwtToken = '';
        state.userName = '';
        state.quote = null;
        state.strategyPlan = [];
        appShell.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        setStatus(false, 'Disconnected');
        logTrade('Logged out.');
      });
      document.getElementById('loadQuoteBtn').addEventListener('click', fetchQuote);
      document.getElementById('generateStrategyBtn').addEventListener('click', generateStrategy);
      document.getElementById('placeDemoOrderBtn').addEventListener('click', placeDemoOrder);
      document.getElementById('symbolInput').addEventListener('change', () => loadChartData());
      document.getElementById('exchangeSelect').addEventListener('change', () => loadChartData());

      setStatus(false, 'Disconnected');
      logTrade('System ready. Log in to begin.');
      loadChartData();
    </script>
  </body>
</html>
