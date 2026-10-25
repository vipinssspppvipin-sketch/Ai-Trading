const { PaperTradingEngine } = require('./src/trading/paperTradingEngine');
const { PortfolioAnalytics } = require('./src/analytics/portfolioAnalytics');

const paperTradingEngine = new PaperTradingEngine();

app.get('/api/paper-trading/summary', (_req, res) => {
  const summary = paperTradingEngine.getSummary();
  res.json({ success: true, summary });
});

app.get('/api/paper-trading/history', (_req, res) => {
  res.json({ success: true, trades: paperTradingEngine.getTradeHistory() });
});

app.post('/api/paper-trading/simulate', (req, res) => {
  try {
    const { symbol, side, quantity, entryPrice, currentPrice, strategy } = req.body || {};

    if (!symbol || !side || !quantity || !entryPrice || !currentPrice) {
      return res.status(400).json({
        success: false,
        message: 'symbol, side, quantity, entryPrice, and currentPrice are required.'
      });
    }

    const result = paperTradingEngine.simulateTrade({
      symbol,
      side,
      quantity,
      entryPrice,
      currentPrice,
      strategy: strategy || 'paper-trading'
    });

    const summary = paperTradingEngine.getSummary();
    const analytics = new PortfolioAnalytics({ trades: paperTradingEngine.getTradeHistory() });

    return res.json({
      success: true,
      trade: result.trade,
      summary,
      portfolio: analytics.computeSummary()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Paper trade simulation failed.' });
  }
});

app.post('/api/paper-trading/backtest', (req, res) => {
  try {
    const { data = [], strategy = 'breakout' } = req.body || {};

    if (!Array.isArray(data) || !data.length) {
      return res.status(400).json({ success: false, message: 'data array is required for backtest.' });
    }

    const results = data.map((bar, index) => {
      const prev = data[index - 1] || bar;
      const momentum = Number(bar.close || 0) - Number(prev.close || 0);
      const side = momentum >= 0 ? 'BUY' : 'SELL';
      const signalStrength = Math.abs(momentum) / Math.max(Number(prev.close || 1), 1);
      return {
        index,
        symbol: bar.symbol || 'NIFTY',
        timestamp: bar.timestamp || new Date().toISOString(),
        side,
        signalStrength: Number(signalStrength.toFixed(4)),
        strategy
      };
    });

    const analytics = new PortfolioAnalytics({ trades: paperTradingEngine.getTradeHistory() });

    return res.json({
      success: true,
      results,
      summary: analytics.computeSummary()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Backtest failed.' });
  }
});
