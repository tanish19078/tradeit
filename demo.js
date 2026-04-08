/**
 * TradeMind Demo — gitclaw SDK
 *
 * Run this demo to see TradeMind in action:
 *   node demo.js all          # Run all 5 demos
 *   node demo.js strategy     # Pine Script strategy review
 *   node demo.js journal      # Trade journal analysis
 *   node demo.js risk         # Portfolio risk audit
 *   node demo.js bias         # Market bias builder
 *   node demo.js montecarlo   # Monte Carlo risk simulation
 *
 * Requires: API key set (ANTHROPIC_API_KEY, OPENAI_API_KEY, or GOOGLE_API_KEY)
 */

const { query } = require('gitclaw');

const MODEL = process.env.TRADEMIND_MODEL || 'anthropic:claude-sonnet-4-5-20250929';

// ═══════════════════════════════════════════════════════════
// Demo 1: Strategy Analysis
// ═══════════════════════════════════════════════════════════

async function demoStrategyAnalysis() {
  console.log('\n🔬 Demo 1: Strategy Analysis\n');
  console.log('═'.repeat(60));

  const pineScript = `
//@version=5
strategy("Golden Cross", overlay=true)
fast = ta.sma(close, 50)
slow = ta.sma(close, 200)
if ta.crossover(fast, slow)
    strategy.entry("Long", strategy.long)
if ta.crossunder(fast, slow)
    strategy.close("Long")
plot(fast, color=color.orange)
plot(slow, color=color.blue)
  `;

  for await (const msg of query({
    prompt: `Analyze this Pine Script strategy for edge quality, overfitting risk, and suggest improvements:\n\n${pineScript}`,
    dir: '.',
    model: MODEL,
  })) {
    if (msg.type === 'delta') process.stdout.write(msg.content);
    if (msg.type === 'assistant') console.log('\n');
  }
}

// ═══════════════════════════════════════════════════════════
// Demo 2: Trade Journal Review
// ═══════════════════════════════════════════════════════════

async function demoJournalReview() {
  console.log('\n📓 Demo 2: Trade Journal Review\n');
  console.log('═'.repeat(60));

  const journalEntries = `
Trade 1 - Jan 15: Went long ES at 4850, SL 4845, TP 4870. Hit TP +$2,500. Setup: 4H order block with 15m CHoCH. Felt confident.

Trade 2 - Jan 16: Shorted NQ at 17200, SL 17250, TP 17100. Stopped out -$1,000. Got frustrated, immediately re-entered short at 17220 without confirmation. Stopped out again -$500. Shouldn't have revenge traded.

Trade 3 - Jan 17: Long AAPL at 185, SL 183, TP 190. Still holding, currently at 184.50. Moving stop to breakeven even though it hasn't reached 1:1 yet. Nervous about this one.

Trade 4 - Jan 17: Added another long on MSFT at 390 while AAPL trade is still open. Same sector exposure. Sized at 3% risk because "I feel good about tech."

Trade 5 - Jan 18: Closed AAPL at 184.80 for breakeven. FOMO'd into BTC at 43000 during the ETF pump. No stop loss. "It can only go up from here."
  `;

  for await (const msg of query({
    prompt: `Review these trade journal entries. Identify behavioral patterns, emotional flags, risk management violations, and provide coaching feedback:\n\n${journalEntries}`,
    dir: '.',
    model: MODEL,
  })) {
    if (msg.type === 'delta') process.stdout.write(msg.content);
    if (msg.type === 'assistant') console.log('\n');
  }
}

// ═══════════════════════════════════════════════════════════
// Demo 3: Risk Audit
// ═══════════════════════════════════════════════════════════

async function demoRiskAudit() {
  console.log('\n🛡️ Demo 3: Portfolio Risk Audit\n');
  console.log('═'.repeat(60));

  for await (const msg of query({
    prompt: `I have a $50,000 account. Currently holding:
1. ES long from 4850, stop at 4835, 2 contracts
2. NQ long from 17100, stop at 17000, 1 contract  
3. AAPL long from 185, stop at 180, 200 shares
4. SPY calls expiring Friday, 3 contracts

Please audit my portfolio risk — check position sizing, correlation risk, total exposure, and tell me if I'm overleveraged.`,
    dir: '.',
    model: MODEL,
  })) {
    if (msg.type === 'delta') process.stdout.write(msg.content);
    if (msg.type === 'assistant') console.log('\n');
  }
}

// ═══════════════════════════════════════════════════════════
// Demo 4: Bias Building
// ═══════════════════════════════════════════════════════════

async function demoBiasBuilder() {
  console.log('\n📊 Demo 4: Market Bias Builder\n');
  console.log('═'.repeat(60));

  for await (const msg of query({
    prompt: `Build me a daily bias for ES (S&P 500 futures) for tomorrow's session. Here's what I'm seeing:

- Weekly: Still in an uptrend, but we're at the upper range
- Daily: Made a higher high yesterday but closed with a long upper wick
- 4H: Showed a change of character (CHoCH) in the afternoon session
- Yesterday's range: High 4875, Low 4845
- Previous week high: 4880 (untapped)
- There's a fair value gap on the 4H between 4840-4835
- FOMC minutes release at 2 PM ET tomorrow

I'm a day trader who trades the 15-minute chart during NY session.`,
    dir: '.',
    model: MODEL,
  })) {
    if (msg.type === 'delta') process.stdout.write(msg.content);
    if (msg.type === 'assistant') console.log('\n');
  }
}

// ═══════════════════════════════════════════════════════════
// Demo 5: Monte Carlo Risk Simulation
// ═══════════════════════════════════════════════════════════

async function demoMonteCarlo() {
  console.log('\n🎲 Demo 5: Monte Carlo Risk Simulation\n');
  console.log('═'.repeat(60));

  for await (const msg of query({
    prompt: `I've been trading for 3 months and tracked my stats:
- Win rate: 58%
- Average winner: $340
- Average loser: $220
- Account size: $25,000
- I risk about 2% per trade
- I take about 4-5 trades per week

Questions:
1. Run a Monte Carlo simulation — what does my next year look like?
2. What's my risk of ruin?
3. Stress test this against a flash crash and a COVID-like sell-off
4. Am I sizing correctly, or should I adjust?

Use the monte-carlo-simulator tool to run the actual numbers.`,
    dir: '.',
    model: MODEL,
  })) {
    if (msg.type === 'delta') process.stdout.write(msg.content);
    if (msg.type === 'assistant') console.log('\n');
  }
}

// ═══════════════════════════════════════════════════════════
// Run demos
// ═══════════════════════════════════════════════════════════

async function main() {
  const demo = process.argv[2] || 'all';

  console.log('\n' + '🧠 TradeMind — AI Trading Strategy Analyst'.padStart(50));
  console.log('═'.repeat(60));

  switch (demo) {
    case '1': case 'strategy': await demoStrategyAnalysis(); break;
    case '2': case 'journal': await demoJournalReview(); break;
    case '3': case 'risk': await demoRiskAudit(); break;
    case '4': case 'bias': await demoBiasBuilder(); break;
    case '5': case 'montecarlo': case 'monte-carlo': await demoMonteCarlo(); break;
    case 'all':
      await demoStrategyAnalysis();
      await demoJournalReview();
      await demoRiskAudit();
      await demoBiasBuilder();
      await demoMonteCarlo();
      break;
    default:
      console.log('Usage: node demo.js [1|2|3|4|5|all|strategy|journal|risk|bias|montecarlo]');
  }
}

main().catch(console.error);
