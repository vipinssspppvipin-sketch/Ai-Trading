* { box-sizing: border-box; }
:root {
  --bg: #07111d;
  --bg2: #0d1c2b;
  --panel: #12273a;
  --panel-strong: #1a3550;
  --line: #2c4a65;
  --text: #ebf4ff;
  --muted: #9bb4c8;
  --green: #2ad19d;
  --green-soft: rgba(42, 209, 157, 0.16);
  --red: #ff6886;
  --red-soft: rgba(255, 104, 134, 0.14);
  --yellow: #ffd166;
  --blue: #71b7ff;
}

html, body {
  margin: 0;
  padding: 0;
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
  background: radial-gradient(circle at top, rgba(56, 105, 186, 0.28), rgba(7,17,29,1) 40%);
}

.login-card {
  width: min(100%, 420px);
  background: linear-gradient(180deg, rgba(18,39,58,0.96), rgba(10,22,35,0.96));
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.28);
}

.login-card h1 {
  margin: 0 0 8px;
  font-size: 2rem;
}

.login-card h1 span, .brand span { color: var(--green); }

.subtitle { margin: 0 0 18px; color: var(--muted); line-height: 1.5; }

.field-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 14px;
}

.field-group label {
  font-size: 0.76rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

input, select, button { font: inherit; }

input, select {
  width: 100%;
  background: rgba(10, 18, 29, 0.9);
  border: 1px solid var(--line);
  color: var(--text);
  border-radius: 10px;
  min-height: 42px;
  padding: 10px 12px;
  outline: none;
}

input:focus, select:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(113, 183, 255, 0.15);
}

.primary-btn, .secondary-btn, .warning-btn {
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  min-height: 42px;
  padding: 10px 16px;
  transition: transform 0.12s ease, opacity 0.12s ease;
}

.primary-btn:hover, .secondary-btn:hover, .warning-btn:hover { transform: translateY(-1px); }

.primary-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--green), #7ce7c2);
  color: #061510;
}

.secondary-btn {
  background: rgba(113, 183, 255, 0.12);
  color: var(--text);
  border: 1px solid rgba(113, 183, 255, 0.35);
}

.warning-btn {
  background: linear-gradient(135deg, var(--yellow), #ffe199);
  color: #2f2205;
}

.error-box {
  display: none;
  margin-bottom: 12px;
  background: rgba(255, 104, 134, 0.08);
  border: 1px solid rgba(255,104,134,0.35);
  color: var(--red);
  border-radius: 10px;
  padding: 10px 12px;
  line-height: 1.4;
}

.app-shell.hidden, .login-screen.hidden { display: none !important; }
.app-shell { display: block; min-height: 100vh; }

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid var(--line);
  background: rgba(7, 17, 29, 0.9);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand { font-size: 1.2rem; font-weight: 800; }
.topbar-right { display: flex; align-items: center; gap: 12px; }

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(18,39,58,0.8);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 0.8rem;
  color: var(--muted);
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--muted);
  box-shadow: 0 0 12px rgba(255,255,255,0.15);
}

.status-dot.live { background: var(--green); box-shadow: 0 0 12px rgba(42,209,157,0.7); }
.status-dot.error { background: var(--red); box-shadow: 0 0 12px rgba(255,104,134,0.7); }

.main-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.95fr;
  gap: 22px;
  padding: 22px;
}

.panel {
  background: linear-gradient(180deg, rgba(18,39,58,0.96), rgba(10,22,35,0.96));
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--line);
}

.panel-header h3 {
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78rem;
  color: var(--muted);
}

.market-body, .strategy-body { padding: 18px; }

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
  margin-bottom: 18px;
}

.compact { min-width: 120px; margin-bottom: 0; }

.ltp-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(8, 17, 28, 0.7);
  padding: 18px 20px;
  margin-bottom: 18px;
}

.symbol-name { font-weight: 800; font-size: 1.2rem; }
.price-box { text-align: right; }
.ltp-price {
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.05em;
}

.ltp-change {
  display: inline-block;
  margin-top: 5px;
  padding: 5px 9px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.8rem;
  background: rgba(255,255,255,0.04);
}

.ltp-change.up { background: var(--green-soft); color: var(--green); }
.ltp-change.down { background: var(--red-soft); color: var(--red); }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.stat-box {
  background: rgba(8,17,28,0.72);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 12px;
  text-align: center;
}

.stat-label {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  color: var(--muted);
  text-transform: uppercase;
}

.stat-value {
  margin-top: 8px;
  font-size: 1rem;
  font-weight: 800;
}

.green { color: var(--green); }
.red { color: var(--red); }
.muted { color: var(--muted); }
.small { font-size: 0.8rem; }

.chart-panel {
  background: rgba(8, 17, 28, 0.75);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 18px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.chart-title {
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.chart-subtitle {
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.74rem;
}

.chart-indicators {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chart-indicators span {
  background: rgba(113, 183, 255, 0.12);
  color: var(--text);
  border: 1px solid rgba(113, 183, 255, 0.35);
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 0.7rem;
}

#candlestickChart {
  width: 100%;
  height: 260px;
  display: block;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(17, 30, 42, 0.7), rgba(9, 17, 27, 0.9));
  border: 1px solid rgba(44,74,101,0.9);
}

.signal-strip {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.signal-box {
  background: rgba(12, 21, 33, 0.82);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
}

.signal-box label {
  display: block;
  color: var(--muted);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.signal-box strong {
  display: block;
  margin-top: 8px;
  font-size: 1rem;
}

.table-wrap {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--line);
}

.table-wrap table { width: 100%; border-collapse: collapse; }
.table-wrap th, .table-wrap td {
  text-align: left;
  padding: 10px 12px;
  border-top: 1px solid rgba(44,74,101,0.9);
  font-size: 0.9rem;
}

.table-wrap thead th {
  background: rgba(26,53,80,0.8);
  color: var(--muted);
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
}

.table-wrap td { font-family: ui-monospace, SFMono-Regular, monospace; }

.side-stack {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.strategy-list {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.strategy-list li {
  padding: 10px 12px;
  background: rgba(8,17,28,0.75);
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.actions button { flex: 1; min-width: 140px; }

.log-box {
  min-height: 180px;
  padding: 16px;
  color: var(--muted);
  line-height: 1.6;
  white-space: pre-wrap;
  font-size: 0.9rem;
}

@media (max-width: 980px) {
  .main-grid { grid-template-columns: 1fr; }
}

@media (max-width: 620px) {
  .toolbar, .two-col, .stats-grid, .signal-strip { grid-template-columns: 1fr; display: grid; }
  .ltp-box { flex-direction: column; align-items: flex-start; }
  .price-box { text-align: left; }
}
