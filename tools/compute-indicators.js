/**
 * compute-indicators.js
 * Pure JavaScript technical indicator calculations
 * No external dependencies — compatible with WebContainers (clawless)
 */

// ═══════════════════════════════════════════════════════════
// ░░░ CORE INDICATOR FUNCTIONS ░░░
// ═══════════════════════════════════════════════════════════

function sma(closes, period) {
  const result = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    const slice = closes.slice(i - period + 1, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / period);
  }
  return result;
}

function ema(closes, period) {
  const result = [];
  const multiplier = 2 / (period + 1);

  // First EMA value is SMA
  let prevEma = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    if (i === period - 1) {
      result.push(prevEma);
      continue;
    }
    const currentEma = (closes[i] - prevEma) * multiplier + prevEma;
    result.push(currentEma);
    prevEma = currentEma;
  }
  return result;
}

function rsi(closes, period = 14) {
  const result = [];
  const changes = [];

  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }

  let avgGain = 0, avgLoss = 0;

  // Initial average
  for (let i = 0; i < period; i++) {
    if (changes[i] >= 0) avgGain += changes[i];
    else avgLoss += Math.abs(changes[i]);
  }
  avgGain /= period;
  avgLoss /= period;

  result.push(...new Array(period).fill(null));

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push(100 - (100 / (1 + rs)));

  for (let i = period; i < changes.length; i++) {
    const gain = changes[i] >= 0 ? changes[i] : 0;
    const loss = changes[i] < 0 ? Math.abs(changes[i]) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push(100 - (100 / (1 + rs)));
  }

  return result;
}

function macd(closes, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEma = ema(closes, fastPeriod);
  const slowEma = ema(closes, slowPeriod);

  const macdLine = fastEma.map((fast, i) => {
    if (fast === null || slowEma[i] === null) return null;
    return fast - slowEma[i];
  });

  const validMacd = macdLine.filter(v => v !== null);
  const signalLine = ema(validMacd, signalPeriod);

  // Pad signal line
  const paddedSignal = new Array(macdLine.length - signalLine.length).fill(null).concat(signalLine);

  const histogram = macdLine.map((m, i) => {
    if (m === null || paddedSignal[i] === null) return null;
    return m - paddedSignal[i];
  });

  return { macd: macdLine, signal: paddedSignal, histogram };
}

function atr(highs, lows, closes, period = 14) {
  const trueRanges = [highs[0] - lows[0]];

  for (let i = 1; i < closes.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    trueRanges.push(tr);
  }

  const result = [];
  let atrVal = trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = 0; i < period - 1; i++) result.push(null);
  result.push(atrVal);

  for (let i = period; i < trueRanges.length; i++) {
    atrVal = (atrVal * (period - 1) + trueRanges[i]) / period;
    result.push(atrVal);
  }

  return result;
}

function bollinger(closes, period = 20, stddev = 2) {
  const middle = sma(closes, period);
  const upper = [], lower = [];

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      upper.push(null);
      lower.push(null);
      continue;
    }
    const slice = closes.slice(i - period + 1, i + 1);
    const mean = middle[i];
    const std = Math.sqrt(slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period);
    upper.push(mean + stddev * std);
    lower.push(mean - stddev * std);
  }

  return { upper, middle, lower };
}

function vwap(highs, lows, closes, volumes) {
  const result = [];
  let cumulativeTPV = 0, cumulativeVolume = 0;

  for (let i = 0; i < closes.length; i++) {
    const typicalPrice = (highs[i] + lows[i] + closes[i]) / 3;
    cumulativeTPV += typicalPrice * volumes[i];
    cumulativeVolume += volumes[i];
    result.push(cumulativeVolume > 0 ? cumulativeTPV / cumulativeVolume : typicalPrice);
  }

  return result;
}

function stochastic(highs, lows, closes, kPeriod = 14, dPeriod = 3) {
  const kValues = [];

  for (let i = 0; i < closes.length; i++) {
    if (i < kPeriod - 1) {
      kValues.push(null);
      continue;
    }
    const highSlice = highs.slice(i - kPeriod + 1, i + 1);
    const lowSlice = lows.slice(i - kPeriod + 1, i + 1);
    const highestHigh = Math.max(...highSlice);
    const lowestLow = Math.min(...lowSlice);
    const range = highestHigh - lowestLow;
    kValues.push(range > 0 ? ((closes[i] - lowestLow) / range) * 100 : 50);
  }

  const validK = kValues.filter(v => v !== null);
  const dValues = sma(validK, dPeriod);
  const paddedD = new Array(kValues.length - dValues.length).fill(null).concat(dValues);

  return { k: kValues, d: paddedD };
}

function fibonacci(high, low) {
  const diff = high - low;
  return {
    level_0: low,
    level_236: low + diff * 0.236,
    level_382: low + diff * 0.382,
    level_500: low + diff * 0.5,
    level_618: low + diff * 0.618,
    level_786: low + diff * 0.786,
    level_1000: high,
    level_1272: low + diff * 1.272,
    level_1618: low + diff * 1.618
  };
}

function obv(closes, volumes) {
  const result = [0];
  for (let i = 1; i < closes.length; i++) {
    if (closes[i] > closes[i - 1]) result.push(result[i - 1] + volumes[i]);
    else if (closes[i] < closes[i - 1]) result.push(result[i - 1] - volumes[i]);
    else result.push(result[i - 1]);
  }
  return result;
}

function adx(highs, lows, closes, period = 14) {
  const trueRanges = [highs[0] - lows[0]];
  const plusDM = [0], minusDM = [0];

  for (let i = 1; i < closes.length; i++) {
    trueRanges.push(Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    ));
    const upMove = highs[i] - highs[i - 1];
    const downMove = lows[i - 1] - lows[i];
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }

  const smoothTR = ema(trueRanges, period);
  const smoothPlusDM = ema(plusDM, period);
  const smoothMinusDM = ema(minusDM, period);

  const plusDI = smoothPlusDM.map((v, i) =>
    v !== null && smoothTR[i] !== null && smoothTR[i] > 0 ? (v / smoothTR[i]) * 100 : null
  );
  const minusDI = smoothMinusDM.map((v, i) =>
    v !== null && smoothTR[i] !== null && smoothTR[i] > 0 ? (v / smoothTR[i]) * 100 : null
  );

  const dx = plusDI.map((p, i) => {
    if (p === null || minusDI[i] === null) return null;
    const sum = p + minusDI[i];
    return sum > 0 ? (Math.abs(p - minusDI[i]) / sum) * 100 : 0;
  });

  const validDx = dx.filter(v => v !== null);
  const adxValues = ema(validDx, period);
  const paddedAdx = new Array(dx.length - adxValues.length).fill(null).concat(adxValues);

  return { adx: paddedAdx, plusDI, minusDI };
}

// ═══════════════════════════════════════════════════════════
// ░░░ MAIN COMPUTE FUNCTION ░░░
// ═══════════════════════════════════════════════════════════

function computeIndicators({ candles, indicators }) {
  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const volumes = candles.map(c => c.volume || 0);

  const results = {};

  for (const ind of indicators) {
    const params = ind.params || {};

    switch (ind.name) {
      case 'sma':
        results.sma = sma(closes, params.period || 20);
        break;
      case 'ema':
        results.ema = ema(closes, params.period || 20);
        break;
      case 'rsi':
        results.rsi = rsi(closes, params.period || 14);
        break;
      case 'macd':
        results.macd = macd(closes, params.fast || 12, params.slow || 26, params.signal || 9);
        break;
      case 'atr':
        results.atr = atr(highs, lows, closes, params.period || 14);
        break;
      case 'bollinger':
        results.bollinger = bollinger(closes, params.period || 20, params.stddev || 2);
        break;
      case 'vwap':
        results.vwap = vwap(highs, lows, closes, volumes);
        break;
      case 'stochastic':
        results.stochastic = stochastic(highs, lows, closes, params.k || 14, params.d || 3);
        break;
      case 'adx':
        results.adx = adx(highs, lows, closes, params.period || 14);
        break;
      case 'obv':
        results.obv = obv(closes, volumes);
        break;
      case 'fibonacci':
        const high = params.high || Math.max(...highs);
        const low = params.low || Math.min(...lows);
        results.fibonacci = fibonacci(high, low);
        break;
      default:
        results[ind.name] = { error: `Unknown indicator: ${ind.name}` };
    }
  }

  return { results };
}

// CLI execution
if (require.main === module) {
  const input = JSON.parse(process.argv[2] || '{}');
  const result = computeIndicators(input);
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { computeIndicators };
