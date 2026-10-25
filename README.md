function ensureAiSignalWidget() {
  if (document.getElementById('ai-signal-widget')) return;

  const widget = document.createElement('div');
  widget.id = 'ai-signal-widget';
  widget.style.cssText = `
    margin-top: 18px;
    background: rgba(16, 34, 48, 0.96);
    border: 1px solid rgba(113, 183, 255, 0.35);
    border-radius: 16px;
    padding: 16px 18px;
    box-shadow: 0 14px 32px rgba(0,0,0,0.18);
  `;

  widget.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px;">
      <div style="font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#9bb4c8;">AI Signal</div>
      <div id="ai-signal-badge" style="padding:6px 10px; border-radius:999px; background:rgba(42,209,157,0.12); color:#2ad19d; font-weight:700; font-size:0.76rem;">Scanning...</div>
    </div>
    <div style="display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:10px; margin-bottom:10px;">
      <div style="background:rgba(8,17,28,0.7); border:1px solid rgba(44,74,101,0.9); border-radius:10px; padding:10px;">
        <div style="color:#9bb4c8; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.08em;">Confidence</div>
        <div id="ai-confidence" style="margin-top:8px; font-size:1.2rem; font-weight:800; color:#ebf4ff;">--</div>
      </div>
      <div style="background:rgba(8,17,28,0.7); border:1px solid rgba(44,74,101,0.9); border-radius:10px; padding:10px;">
        <div style="color:#9bb4c8; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.08em;">Trend</div>
        <div id="ai-trend" style="margin-top:8px; font-size:1.2rem; font-weight:800; color:#ebf4ff;">--</div>
      </div>
      <div style="background:rgba(8,17,28,0.7); border:1px solid rgba(44,74,101,0.9); border-radius:10px; padding:10px;">
        <div style="color:#9bb4c8; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.08em;">Volume</div>
        <div id="ai-volume" style="margin-top:8px; font-size:1.2rem; font-weight:800; color:#ebf4ff;">--</div>
      </div>
    </div>
    <div id="ai-signal-reason" style="line-height:1.6; color:#9bb4c8; font-size:0.84rem;">
      Signal engine waiting for fresh market data.
    </div>
  `;

  const target = document.querySelector('.strategy-body') || document.querySelector('.panel');
  if (target) {
    target.appendChild(widget);
  }
}

async function fetchAiSignal() {
  if (!state.quote) return;

  const quote = state.quote;
  const symbol = document.getElementById('symbolInput')?.value || 'SBIN-EQ';
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
      body: JSON.stringify({
        symbol,
        ltp,
        previousClose,
        volume,
        averageVolume,
        trendScore,
        momentumScore
      })
    });

    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'AI signal request failed');
    }

    const signal = payload.signal || {};
    const badge = document.getElementById('ai-signal-badge');
    const confidenceEl = document.getElementById('ai-confidence');
    const trendEl = document.getElementById('ai-trend');
    const volumeEl = document.getElementById('ai-volume');
    const reasonEl = document.getElementById('ai-signal-reason');

    if (!badge || !confidenceEl || !trendEl || !volumeEl || !reasonEl) {
      ensureAiSignalWidget();
      return fetchAiSignal();
    }

    badge.textContent = signal.label || 'Neutral';
    badge.style.background = signal.isBullish ? 'rgba(42,209,157,0.12)' : signal.isBearish ? 'rgba(255,104,134,0.12)' : 'rgba(113,183,255,0.12)';
    badge.style.color = signal.isBullish ? '#2ad19d' : signal.isBearish ? '#ff6886' : '#71b7ff';

    confidenceEl.textContent = `${signal.confidence || 0}%`;
    trendEl.textContent = signal.delta >= 0 ? `+${signal.delta || 0}` : `${signal.delta || 0}`;
    volumeEl.textContent = `${(signal.volumeRatio || 1).toFixed(2)}x`;
    reasonEl.textContent = signal.reason || 'Signal engine is monitoring the market.';
  } catch (error) {
    if (document.getElementById('ai-signal-badge')) {
      document.getElementById('ai-signal-badge').textContent = 'Signal Error';
      document.getElementById('ai-signal-badge').style.background = 'rgba(255,104,134,0.12)';
      document.getElementById('ai-signal-badge').style.color = '#ff6886';
      if (document.getElementById('ai-signal-reason')) {
        document.getElementById('ai-signal-reason').textContent = error.message || 'AI signal engine could not score the market.';
      }
    }
  }
}

function trackAiSignalOnQuote() {
  ensureAiSignalWidget();
  fetchAiSignal();
}

const originalRenderQuote = window.renderQuote || null;
if (originalRenderQuote) {
  window.renderQuote = function(quote, symbol, exchange, token) {
    originalRenderQuote(quote, symbol, exchange, token);
    trackAiSignalOnQuote();
  };
} else {
  const originalFetchQuote = window.fetchQuote;
  window.fetchQuote = async function() {
    const result = await originalFetchQuote();
    trackAiSignalOnQuote();
    return result;
  };
}

window.addEventListener('DOMContentLoaded', () => {
  ensureAiSignalWidget();
});
