#!/usr/bin/env node
/**
 * TradeMind Standalone Demo
 * ─────────────────────────
 * Runs WITHOUT an API key. Shows real market data + indicator analysis.
 * This proves the tools work with live data.
 *
 * Usage:
 *   node demo-standalone.js              # Analyze AAPL (default)
 *   node demo-standalone.js TSLA         # Analyze any symbol
 *   node demo-standalone.js MSFT 3mo     # Symbol + period
 */

const { fetchMarketData } = require('./tools/fetch-market-data.js');
const { computeIndicators } = require('./tools/compute-indicators.js');

// ═══════════════════════════════════════════════════════════
// ░░░ TERMINAL FORMATTING ░░░
// ═══════════════════════════════════════════════════════════

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
};

function header(text) {
  const pad = '═'.repeat(60);
  console.log(`\n${C.cyan}${pad}${C.reset}`);
  console.log(`${C.bold}${C.white}  ${text}${C.reset}`);
  console.log(`${C.cyan}${pad}${C.reset}\n`);
}

function subheader(text) {
  console.log(`\n${C.bold}${C.yellow}  ▸ ${text}${C.reset}`);
  console.log(`${C.dim}  ${'─'.repeat(56)}${C.reset}`);
}

function metric(label, value, assessment) {
  const color = assessment === 'bullish' ? C.green
    : assessment === 'bearish' ? C.red
    : assessment === 'neutral' ? C.yellow
    : assessment === 'good' ? C.green
    : assessment === 'warning' ? C.yellow
    : assessment === 'danger' ? C.red
    : C.white;
  console.log(`  ${C.dim}${label.padEnd(24)}${C.reset}${color}${C.bold}${value}${C.reset}`);
}

function sparkline(data, width = 40) {
  const chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  const valid = data.filter(v => v !== null && !isNaN(v));
  if (valid.length === 0) return '';
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min || 1;
  // Sample down to width
  const step = Math.max(1, Math.floor(valid.length / width));
  let line = '';
  for (let i = 0; i < valid.length; i += step) {
    const idx = Math.min(7, Math.floor(((valid[i] - min) / range) * 7));
    line += chars[idx];
  }
  return line;
}

function miniChart(candles, width = 50) {
  const closes = candles.map(c => c.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const height = 12;
  const step = Math.max(1, Math.floor(closes.length / width));
  const sampled = [];
  for (let i = 0; i < closes.length; i += step) {
    sampled.push(closes[i]);
  }

  const grid = Array.from({length: height}, () => Array(sampled.length).fill(' '));

  for (let x = 0; x < sampled.length; x++) {
    const y = Math.floor(((sampled[x] - min) / range) * (height - 1));
    grid[height - 1 - y][x] = '█';
    // Fill below
    for (let fill = height - 1; fill > height - 1 - y; fill--) {
      if (grid[fill][x] === ' ') grid[fill][x] = '░';
    }
  }

  const priceStep = range / (height - 1);
  for (let row = 0; row < height; row++) {
    const price = max - (row * priceStep);
    const priceLabel = price.toFixed(1).padStart(9);
    const rowContent = grid[row].join('');
    const color = row < height / 3 ? C.green : row < (height * 2 / 3) ? C.yellow : C.red;
    console.log(`  ${C.dim}${priceLabel} │${C.reset}${color}${rowContent}${C.reset}`);
  }
  console.log(`  ${''.padStart(9)} ${'└' + '─'.repeat(sampled.length)}`);
}

// ═══════════════════════════════════════════════════════════
// ░░░ ANALYSIS ENGINE ░░░
// ═══════════════════════════════════════════════════════════

function assessRSI(value) {
  if (value > 70) return { text: `${value.toFixed(1)} — OVERBOUGHT`, sentiment: 'bearish' };
  if (value > 60) return { text: `${value.toFixed(1)} — Bullish momentum`, sentiment: 'bullish' };
  if (value > 40) return { text: `${value.toFixed(1)} — Neutral`, sentiment: 'neutral' };
  if (value > 30) return { text: `${value.toFixed(1)} — Bearish momentum`, sentiment: 'bearish' };
  return { text: `${value.toFixed(1)} — OVERSOLD`, sentiment: 'bullish' };
}

function assessMACD(macdData) {
  const hist = macdData.histogram.filter(v => v !== null);
  const latest = hist[hist.length - 1];
  const prev = hist[hist.length - 2];

  if (latest > 0 && latest > prev) return { text: 'Bullish & accelerating', sentiment: 'bullish' };
  if (latest > 0 && latest < prev) return { text: 'Bullish but decelerating', sentiment: 'neutral' };
  if (latest < 0 && latest > prev) return { text: 'Bearish but recovering', sentiment: 'neutral' };
  if (latest < 0 && latest < prev) return { text: 'Bearish & accelerating', sentiment: 'bearish' };
  return { text: 'Neutral', sentiment: 'neutral' };
}

function assessTrend(candles, smaValues) {
  const closes = candles.map(c => c.close);
  const latestClose = closes[closes.length - 1];
  const validSma = smaValues.filter(v => v !== null);
  const latestSma = validSma[validSma.length - 1];

  const change5d = ((closes[closes.length - 1] / closes[Math.max(0, closes.length - 6)]) - 1) * 100;
  const aboveSma = latestClose > latestSma;

  if (aboveSma && change5d > 1) return { text: 'UPTREND — Price above SMA, positive momentum', sentiment: 'bullish' };
  if (aboveSma && change5d < -1) return { text: 'WEAKENING — Above SMA but losing momentum', sentiment: 'neutral' };
  if (!aboveSma && change5d < -1) return { text: 'DOWNTREND — Price below SMA, negative momentum', sentiment: 'bearish' };
  if (!aboveSma && change5d > 1) return { text: 'RECOVERING — Below SMA but gaining momentum', sentiment: 'neutral' };
  return { text: 'RANGING — No clear direction', sentiment: 'neutral' };
}

function calcVolatility(candles) {
  const returns = [];
  for (let i = 1; i < candles.length; i++) {
    returns.push(Math.log(candles[i].close / candles[i - 1].close));
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  const dailyVol = Math.sqrt(variance);
  const annualizedVol = dailyVol * Math.sqrt(252) * 100;
  return annualizedVol;
}

function generateBias(candles, indicators) {
  const rsi = assessRSI(indicators.rsi.filter(v => v !== null).pop());
  const macd = assessMACD(indicators.macd);
  const trend = assessTrend(candles, indicators.sma);

  let bullPoints = 0, bearPoints = 0;
  if (rsi.sentiment === 'bullish') bullPoints += 2;
  if (rsi.sentiment === 'bearish') bearPoints += 2;
  if (macd.sentiment === 'bullish') bullPoints += 2;
  if (macd.sentiment === 'bearish') bearPoints += 2;
  if (trend.sentiment === 'bullish') bullPoints += 3;
  if (trend.sentiment === 'bearish') bearPoints += 3;

  const score = bullPoints - bearPoints;
  if (score >= 4) return { bias: 'BULLISH', confidence: 'HIGH', color: C.green };
  if (score >= 2) return { bias: 'BULLISH', confidence: 'MEDIUM', color: C.green };
  if (score >= 1) return { bias: 'SLIGHTLY BULLISH', confidence: 'LOW', color: C.green };
  if (score <= -4) return { bias: 'BEARISH', confidence: 'HIGH', color: C.red };
  if (score <= -2) return { bias: 'BEARISH', confidence: 'MEDIUM', color: C.red };
  if (score <= -1) return { bias: 'SLIGHTLY BEARISH', confidence: 'LOW', color: C.red };
  return { bias: 'NEUTRAL', confidence: 'LOW', color: C.yellow };
}

function positionSizing(accountSize, riskPct, entry, stop) {
  const riskAmount = accountSize * (riskPct / 100);
  const stopDistance = Math.abs(entry - stop);
  const shares = Math.floor(riskAmount / stopDistance);
  return { riskAmount, shares, stopDistance };
}

// ═══════════════════════════════════════════════════════════
// ░░░ MAIN ░░░
// ═══════════════════════════════════════════════════════════

async function main() {
  const symbol = process.argv[2] || 'AAPL';
  const period = process.argv[3] || '3mo';

  console.log(`\n${C.bgMagenta}${C.bold}${C.white}                                                            ${C.reset}`);
  console.log(`${C.bgMagenta}${C.bold}${C.white}   🧠 TradeMind — AI Trading Strategy Analyst                ${C.reset}`);
  console.log(`${C.bgMagenta}${C.bold}${C.white}   Standalone Demo (No API Key Required)                     ${C.reset}`);
  console.log(`${C.bgMagenta}${C.bold}${C.white}                                                            ${C.reset}`);

  // ── STEP 1: Fetch Market Data ──
  header(`📡 Fetching Live Market Data: ${symbol.toUpperCase()}`);
  console.log(`  ${C.dim}Source: Yahoo Finance | Period: ${period} | Interval: Daily${C.reset}\n`);

  const data = await fetchMarketData({ symbol, timeframe: '1d', period });

  if (data.error) {
    console.log(`  ${C.red}${C.bold}ERROR: ${data.error}${C.reset}`);
    process.exit(1);
  }

  const candles = data.candles;
  const latest = candles[candles.length - 1];
  const first = candles[0];
  const totalReturn = ((latest.close - first.close) / first.close * 100);
  const high52 = Math.max(...candles.map(c => c.high));
  const low52 = Math.min(...candles.map(c => c.low));

  metric('Symbol', symbol.toUpperCase(), 'neutral');
  metric('Period', `${data.metadata.total_candles} trading days`, 'neutral');
  metric('Latest Close', `$${latest.close.toFixed(2)}`, totalReturn >= 0 ? 'bullish' : 'bearish');
  metric('Period Return', `${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%`, totalReturn >= 0 ? 'good' : 'danger');
  metric('Period High', `$${high52.toFixed(2)}`, 'neutral');
  metric('Period Low', `$${low52.toFixed(2)}`, 'neutral');
  metric('Latest Volume', latest.volume?.toLocaleString() || 'N/A', 'neutral');

  // ── STEP 2: Price Chart ──
  subheader('Price Chart');
  miniChart(candles);

  // ── STEP 3: Compute Indicators ──
  header('📊 Technical Indicator Analysis');

  const indicators = computeIndicators({
    candles,
    indicators: [
      { name: 'rsi', params: { period: 14 } },
      { name: 'macd', params: { fast: 12, slow: 26, signal: 9 } },
      { name: 'sma', params: { period: 20 } },
      { name: 'ema', params: { period: 9 } },
      { name: 'bollinger', params: { period: 20, stddev: 2 } },
      { name: 'atr', params: { period: 14 } },
      { name: 'adx', params: { period: 14 } },
      { name: 'stochastic', params: { k: 14, d: 3 } },
      { name: 'obv' },
    ]
  }).results;

  // RSI
  const rsiAssess = assessRSI(indicators.rsi.filter(v => v !== null).pop());
  subheader('RSI (14)');
  metric('Value', rsiAssess.text, rsiAssess.sentiment);
  console.log(`  ${C.dim}Sparkline:${C.reset} ${C.cyan}${sparkline(indicators.rsi)}${C.reset}`);

  // MACD
  const macdAssess = assessMACD(indicators.macd);
  subheader('MACD (12, 26, 9)');
  metric('Signal', macdAssess.text, macdAssess.sentiment);
  console.log(`  ${C.dim}Histogram:${C.reset} ${C.magenta}${sparkline(indicators.macd.histogram)}${C.reset}`);

  // Bollinger Bands
  const validBBUpper = indicators.bollinger.upper.filter(v => v !== null);
  const validBBLower = indicators.bollinger.lower.filter(v => v !== null);
  const validBBMid = indicators.bollinger.middle.filter(v => v !== null);
  subheader('Bollinger Bands (20, 2)');
  metric('Upper Band', `$${validBBUpper[validBBUpper.length - 1]?.toFixed(2)}`, 'neutral');
  metric('Middle (SMA 20)', `$${validBBMid[validBBMid.length - 1]?.toFixed(2)}`, 'neutral');
  metric('Lower Band', `$${validBBLower[validBBLower.length - 1]?.toFixed(2)}`, 'neutral');
  const bbWidth = ((validBBUpper[validBBUpper.length - 1] - validBBLower[validBBLower.length - 1]) / validBBMid[validBBMid.length - 1] * 100);
  metric('Band Width', `${bbWidth.toFixed(2)}% — ${bbWidth < 5 ? 'SQUEEZE (breakout likely)' : bbWidth > 15 ? 'WIDE (volatile)' : 'Normal'}`, bbWidth < 5 ? 'warning' : 'neutral');

  // ATR
  const validATR = indicators.atr.filter(v => v !== null);
  subheader('ATR (14)');
  metric('Value', `$${validATR[validATR.length - 1]?.toFixed(2)}`, 'neutral');
  metric('As % of Price', `${(validATR[validATR.length - 1] / latest.close * 100).toFixed(2)}%`, 'neutral');

  // ADX
  const validADX = indicators.adx.adx.filter(v => v !== null);
  subheader('ADX (14)');
  const adxVal = validADX[validADX.length - 1];
  const adxAssess = adxVal > 25 ? 'Strong trend' : adxVal > 20 ? 'Weak trend' : 'No trend (ranging)';
  metric('Value', `${adxVal?.toFixed(1)} — ${adxAssess}`, adxVal > 25 ? 'good' : 'warning');

  // Stochastic
  const validK = indicators.stochastic.k.filter(v => v !== null);
  const validD = indicators.stochastic.d.filter(v => v !== null);
  subheader('Stochastic (14, 3)');
  const kVal = validK[validK.length - 1];
  const stochAssess = kVal > 80 ? 'bearish' : kVal < 20 ? 'bullish' : 'neutral';
  metric('%K', `${kVal?.toFixed(1)}${kVal > 80 ? ' — OVERBOUGHT' : kVal < 20 ? ' — OVERSOLD' : ''}`, stochAssess);
  metric('%D', validD[validD.length - 1]?.toFixed(1), 'neutral');

  // Volatility
  const vol = calcVolatility(candles);
  subheader('Volatility');
  metric('Annualized', `${vol.toFixed(1)}%`, vol > 40 ? 'danger' : vol > 25 ? 'warning' : 'good');

  // ── STEP 4: Trend & Bias ──
  header('🎯 TradeMind Bias Assessment');

  const trend = assessTrend(candles, indicators.sma);
  const bias = generateBias(candles, indicators);

  metric('Trend', trend.text, trend.sentiment);
  console.log(`\n  ${C.bold}${bias.color}  ┌──────────────────────────────────────────────┐${C.reset}`);
  console.log(`  ${C.bold}${bias.color}  │  DIRECTIONAL BIAS: ${bias.bias.padEnd(26)}│${C.reset}`);
  console.log(`  ${C.bold}${bias.color}  │  CONFIDENCE:       ${bias.confidence.padEnd(26)}│${C.reset}`);
  console.log(`  ${C.bold}${bias.color}  └──────────────────────────────────────────────┘${C.reset}`);

  // ── STEP 5: Position Sizing Example ──
  header('🛡️ Position Sizing Calculator');

  const atrVal = validATR[validATR.length - 1];
  const suggestedStop = latest.close - (atrVal * 1.5);
  const suggestedTP = latest.close + (atrVal * 3);
  const sizing = positionSizing(50000, 1, latest.close, suggestedStop);

  console.log(`  ${C.dim}Example: $50,000 account, 1% risk per trade${C.reset}\n`);
  metric('Entry Price', `$${latest.close.toFixed(2)}`, 'neutral');
  metric('Stop Loss (1.5x ATR)', `$${suggestedStop.toFixed(2)}`, 'danger');
  metric('Take Profit (3x ATR)', `$${suggestedTP.toFixed(2)}`, 'good');
  metric('Risk:Reward', '1:2.0', 'good');
  metric('Risk Amount', `$${sizing.riskAmount.toFixed(2)}`, 'neutral');
  metric('Position Size', `${sizing.shares} shares`, 'neutral');
  metric('Stop Distance', `$${sizing.stopDistance.toFixed(2)} (${(sizing.stopDistance / latest.close * 100).toFixed(2)}%)`, 'neutral');

  // ── STEP 6: Key Levels ──
  header('📍 Key Levels');

  const fibs = computeIndicators({
    candles, indicators: [{ name: 'fibonacci', params: { high: high52, low: low52 } }]
  }).results.fibonacci;

  console.log(`  ${C.dim}${'Level'.padEnd(20)} ${'Price'.padEnd(14)} ${'Distance'.padEnd(12)}${C.reset}`);
  console.log(`  ${'─'.repeat(46)}`);

  const levels = [
    { name: 'Period High', price: high52 },
    { name: 'Fib 78.6%', price: fibs.level_786 },
    { name: 'Fib 61.8% (Golden)', price: fibs.level_618 },
    { name: 'Fib 50.0%', price: fibs.level_500 },
    { name: 'SMA 20', price: validBBMid[validBBMid.length - 1] },
    { name: 'Fib 38.2%', price: fibs.level_382 },
    { name: 'Fib 23.6%', price: fibs.level_236 },
    { name: 'Period Low', price: low52 },
  ];

  for (const lvl of levels) {
    const dist = ((lvl.price - latest.close) / latest.close * 100);
    const marker = Math.abs(dist) < 0.5 ? ' ◄── YOU ARE HERE' : '';
    const color = dist > 0 ? C.green : dist < 0 ? C.red : C.yellow;
    console.log(`  ${C.white}${lvl.name.padEnd(20)}${C.reset} ${color}$${lvl.price.toFixed(2).padEnd(14)}${C.reset}${C.dim}${(dist >= 0 ? '+' : '') + dist.toFixed(2)}%${marker}${C.reset}`);
  }

  // ── Footer ──
  console.log(`\n${C.cyan}${'═'.repeat(60)}${C.reset}`);
  console.log(`${C.dim}  Generated by TradeMind v1.0.0`);
  console.log(`  Data: Yahoo Finance (live) | ${new Date().toISOString()}`);
  console.log(`  ⚠️  This is analysis, not financial advice.${C.reset}`);
  console.log(`${C.cyan}${'═'.repeat(60)}${C.reset}\n`);
}

main().catch(err => {
  console.error(`${C.red}${C.bold}Fatal error: ${err.message}${C.reset}`);
  process.exit(1);
});
