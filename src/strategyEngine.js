function parseOffsets(input) {
  return String(input || '')
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => a - b);
}

function generateStrategyPlan({
  ltp,
  strategyType = 'breakout',
  tradeSide = 'BUY',
  totalQty = 50,
  levelOffsets = '0.5,1,2,3',
  tpOffset = 1.5,
  slOffset = 0.8,
  symbol = 'SBIN-EQ'
}) {
  if (!Number.isFinite(Number(ltp)) || Number(ltp) <= 0) {
    throw new Error('Invalid LTP value.');
  }

  const parsedOffsets = parseOffsets(levelOffsets);
  if (!parsedOffsets.length) {
    throw new Error('Strategy levels must include positive numeric offsets.');
  }

  const direction = tradeSide === 'BUY' ? 1 : -1;
  const qtySplit = [0.35, 0.25, 0.2, 0.2];

  const plan = parsedOffsets.map((offset, index) => {
    const price = Number((Number(ltp) + (direction * offset)).toFixed(2));
    const quantity = Math.max(1, Math.round(Number(totalQty) * (qtySplit[index] || 0.2)));
    const tp = Number((price + (direction === 1 ? tpOffset : -tpOffset)).toFixed(2));
    const sl = Number((price - (direction === 1 ? slOffset : -slOffset)).toFixed(2));

    return {
      level: index + 1,
      side: tradeSide,
      symbol,
      strategyType,
      entryPrice: price,
      quantity,
      takeProfit: tp,
      stopLoss: sl,
      offset
    };
  });

  return plan;
}

module.exports = { generateStrategyPlan };
