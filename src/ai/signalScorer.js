function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function scoreMarketSignal({
  symbol = 'UNKNOWN',
  ltp = 0,
  previousClose = 0,
  volume = 0,
  averageVolume = 0,
  trendScore = 0,
  momentumScore = 0
} = {}) {
  const delta = Number(ltp || 0) - Number(previousClose || 0);
  const pctMove = Number(previousClose || 0) ? (delta / Number(previousClose)) * 100 : 0;
  const volumeRatio = Number(averageVolume || 0) > 0 ? Number(volume || 0) / Number(averageVolume) : 1;
  const momentum = Number(momentumScore || 0) || pctMove;
  const trendBias = Number(trendScore || 0) || (delta >= 0 ? 1 : -1) * Math.abs(pctMove) * 2;

  let score = 50;
  score += pctMove * 10;
  score += volumeRatio * 18;
  score += trendBias * 0.8;
  score += momentum * 3;

  const confidence = clamp(Math.round(score), 0, 100);

  let label = 'Neutral';
  let reason = 'Price action is balanced with average activity.';

  if (confidence >= 75 && delta >= 0) {
    label = 'Bullish Breakout';
    reason = 'Strong upward momentum with volume support and positive trend bias.';
  } else if (confidence >= 75 && delta < 0) {
    label = 'Bearish Breakdown';
    reason = 'Sharp downside pressure with volume confirmation and negative trend bias.';
  } else if (confidence >= 60 && delta >= 0) {
    label = 'Bullish Bias';
    reason = 'Positive trend structure with moderate confirmation.';
  } else if (confidence >= 60 && delta < 0) {
    label = 'Bearish Bias';
    reason = 'Weakening trend with some downward pressure and caution suggested.';
  } else if (confidence >= 45) {
    label = 'Consolidation';
    reason = 'The market is range-bound and waiting for a stronger directional trigger.';
  } else {
    label = 'Risk-Off';
    reason = 'Low conviction setup. Consider waiting for better confirmation.';
  }

  return {
    symbol,
    label,
    confidence,
    reason,
    delta: Number(delta.toFixed(2)),
    pctMove: Number(pctMove.toFixed(2)),
    volumeRatio: Number(volumeRatio.toFixed(2)),
    trendBias: Number(trendBias.toFixed(2)),
    isBullish: delta >= 0,
    isBearish: delta < 0
  };
}

module.exports = { scoreMarketSignal };
