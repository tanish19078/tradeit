/**
 * monte-carlo-simulator.js
 * Pure JavaScript Monte Carlo simulation for trading strategy risk analysis
 * No external dependencies — compatible with WebContainers (clawless)
 *
 * Simulates thousands of trade sequences to estimate:
 * - Probability of various drawdown levels
 * - Risk of ruin
 * - Expected equity curves
 * - Confidence intervals for returns
 */

// ═══════════════════════════════════════════════════════════
// ░░░ PSEUDO-RANDOM NUMBER GENERATOR (seedable) ░░░
// ═══════════════════════════════════════════════════════════

// Mulberry32 — fast, seedable PRNG for reproducible simulations
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ═══════════════════════════════════════════════════════════
// ░░░ CORE SIMULATION ENGINE ░░░
// ═══════════════════════════════════════════════════════════

/**
 * Run a Monte Carlo simulation of trading outcomes
 *
 * @param {Object} params
 * @param {number} params.initialCapital    - Starting account balance
 * @param {number} params.winRate           - Win probability (0-1)
 * @param {number} params.avgWin            - Average winning trade ($)
 * @param {number} params.avgLoss           - Average losing trade ($, positive number)
 * @param {number} params.tradesPerSim      - Trades per simulation run
 * @param {number} params.numSimulations    - Number of Monte Carlo runs (default: 1000)
 * @param {number} [params.riskPerTrade]    - Risk as fraction of account (0-1), for position sizing
 * @param {boolean} [params.fixedSize]      - Use fixed $ amounts (true) vs. % of equity (false)
 * @param {number} [params.ruinThreshold]   - Account % at which ruin is declared (default: 0.5 = 50% loss)
 * @param {number} [params.seed]            - Random seed for reproducibility
 */
function monteCarloSimulation({
  initialCapital = 50000,
  winRate = 0.55,
  avgWin = 300,
  avgLoss = 200,
  tradesPerSim = 200,
  numSimulations = 1000,
  riskPerTrade = 0.01,
  fixedSize = true,
  ruinThreshold = 0.5,
  seed = null,
}) {
  const rng = mulberry32(seed || Date.now());

  const finalEquities = [];
  const maxDrawdowns = [];
  const maxDrawdownPercents = [];
  const ruinCount = { total: 0 };
  const longestLoseStreaks = [];
  const longestWinStreaks = [];
  const equityCurves = []; // Store a subset for visualization

  // Track percentile equity curves (store ~10 sample curves)
  const sampleInterval = Math.max(1, Math.floor(numSimulations / 10));

  for (let sim = 0; sim < numSimulations; sim++) {
    let equity = initialCapital;
    let peak = equity;
    let maxDD = 0;
    let maxDDPct = 0;
    let currentLoseStreak = 0;
    let currentWinStreak = 0;
    let longestLose = 0;
    let longestWin = 0;
    let ruined = false;

    const curve = [equity];

    for (let t = 0; t < tradesPerSim; t++) {
      if (equity <= 0) { ruined = true; break; }

      const isWin = rng() < winRate;

      let pnl;
      if (fixedSize) {
        pnl = isWin ? avgWin : -avgLoss;
      } else {
        // Percent-of-equity sizing
        const riskAmount = equity * riskPerTrade;
        const rr = avgWin / avgLoss; // risk-reward ratio
        pnl = isWin ? riskAmount * rr : -riskAmount;
      }

      equity += pnl;

      // Track peak and drawdown
      if (equity > peak) peak = equity;
      const dd = peak - equity;
      const ddPct = peak > 0 ? dd / peak : 0;
      if (dd > maxDD) maxDD = dd;
      if (ddPct > maxDDPct) maxDDPct = ddPct;

      // Streak tracking
      if (isWin) {
        currentWinStreak++;
        currentLoseStreak = 0;
        if (currentWinStreak > longestWin) longestWin = currentWinStreak;
      } else {
        currentLoseStreak++;
        currentWinStreak = 0;
        if (currentLoseStreak > longestLose) longestLose = currentLoseStreak;
      }

      // Ruin check
      if (equity <= initialCapital * (1 - ruinThreshold)) {
        ruined = true;
      }

      curve.push(Math.round(equity * 100) / 100);
    }

    finalEquities.push(equity);
    maxDrawdowns.push(maxDD);
    maxDrawdownPercents.push(maxDDPct * 100);
    longestLoseStreaks.push(longestLose);
    longestWinStreaks.push(longestWin);
    if (ruined) ruinCount.total++;

    // Store sample curves
    if (sim % sampleInterval === 0 || sim === numSimulations - 1) {
      equityCurves.push(curve);
    }
  }

  // ── Compute Statistics ──
  finalEquities.sort((a, b) => a - b);
  maxDrawdownPercents.sort((a, b) => a - b);
  longestLoseStreaks.sort((a, b) => a - b);

  function percentile(arr, p) {
    const idx = Math.floor(arr.length * p);
    return arr[Math.min(idx, arr.length - 1)];
  }

  function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function stddev(arr) {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / arr.length);
  }

  const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss);
  const profitFactor = (winRate * avgWin) / ((1 - winRate) * avgLoss);

  // Kelly criterion
  const kellyPct = winRate - ((1 - winRate) / (avgWin / avgLoss));

  const results = {
    // Input echo
    parameters: {
      initialCapital,
      winRate,
      avgWin,
      avgLoss,
      tradesPerSim,
      numSimulations,
      fixedSize,
      riskPerTrade: fixedSize ? null : riskPerTrade,
      ruinThreshold,
    },

    // Strategy metrics
    strategyMetrics: {
      expectancyPerTrade: Math.round(expectancy * 100) / 100,
      profitFactor: Math.round(profitFactor * 100) / 100,
      kellyOptimal: `${(kellyPct * 100).toFixed(1)}%`,
      kellyHalf: `${(kellyPct * 50).toFixed(1)}%`,
      kellyQuarter: `${(kellyPct * 25).toFixed(1)}%`,
    },

    // Final equity distribution
    finalEquity: {
      mean: Math.round(mean(finalEquities)),
      median: Math.round(percentile(finalEquities, 0.5)),
      stddev: Math.round(stddev(finalEquities)),
      best: Math.round(percentile(finalEquities, 1.0)),
      worst: Math.round(percentile(finalEquities, 0.0)),
      percentile_5: Math.round(percentile(finalEquities, 0.05)),
      percentile_25: Math.round(percentile(finalEquities, 0.25)),
      percentile_75: Math.round(percentile(finalEquities, 0.75)),
      percentile_95: Math.round(percentile(finalEquities, 0.95)),
    },

    // Return distribution
    returns: {
      meanReturn: `${(((mean(finalEquities) - initialCapital) / initialCapital) * 100).toFixed(1)}%`,
      medianReturn: `${(((percentile(finalEquities, 0.5) - initialCapital) / initialCapital) * 100).toFixed(1)}%`,
      probabilityOfProfit: `${((finalEquities.filter(e => e > initialCapital).length / numSimulations) * 100).toFixed(1)}%`,
      probabilityOfDoubling: `${((finalEquities.filter(e => e >= initialCapital * 2).length / numSimulations) * 100).toFixed(1)}%`,
    },

    // Drawdown analysis
    drawdown: {
      meanMaxDrawdown: `${mean(maxDrawdownPercents).toFixed(1)}%`,
      medianMaxDrawdown: `${percentile(maxDrawdownPercents, 0.5).toFixed(1)}%`,
      percentile_75_dd: `${percentile(maxDrawdownPercents, 0.75).toFixed(1)}%`,
      percentile_95_dd: `${percentile(maxDrawdownPercents, 0.95).toFixed(1)}%`,
      percentile_99_dd: `${percentile(maxDrawdownPercents, 0.99).toFixed(1)}%`,
      worstDrawdown: `${percentile(maxDrawdownPercents, 1.0).toFixed(1)}%`,
    },

    // Risk of ruin
    riskOfRuin: {
      ruinThreshold: `${(ruinThreshold * 100).toFixed(0)}% loss`,
      ruinProbability: `${((ruinCount.total / numSimulations) * 100).toFixed(2)}%`,
      ruinCount: ruinCount.total,
      assessment: ruinCount.total === 0 ? 'SAFE'
        : (ruinCount.total / numSimulations) < 0.01 ? 'LOW RISK'
        : (ruinCount.total / numSimulations) < 0.05 ? 'MODERATE RISK'
        : (ruinCount.total / numSimulations) < 0.10 ? 'HIGH RISK'
        : 'DANGEROUS',
    },

    // Streak analysis
    streaks: {
      medianLongestLoseStreak: percentile(longestLoseStreaks, 0.5),
      percentile_95_loseStreak: percentile(longestLoseStreaks, 0.95),
      worstLoseStreak: percentile(longestLoseStreaks, 1.0),
      medianLongestWinStreak: percentile(longestWinStreaks, 0.5),
    },

    // Recovery analysis
    recovery: {
      tradesRequiredToRecoverFromMedianDD: Math.ceil(
        (initialCapital * percentile(maxDrawdownPercents, 0.5) / 100) / Math.max(expectancy, 0.01)
      ),
      tradesRequiredToRecoverFrom95DD: Math.ceil(
        (initialCapital * percentile(maxDrawdownPercents, 0.95) / 100) / Math.max(expectancy, 0.01)
      ),
    },

    // Sample equity curves for visualization
    sampleCurves: equityCurves.length > 5 ? equityCurves.slice(0, 5) : equityCurves,
  };

  return results;
}

// ═══════════════════════════════════════════════════════════
// ░░░ STRESS TEST: Historical Crash Scenarios ░░░
// ═══════════════════════════════════════════════════════════

/**
 * Stress-test a strategy against historical crash scenarios
 */
function stressTest({
  initialCapital = 50000,
  riskPerTrade = 0.01,
  avgWin = 300,
  avgLoss = 200,
  winRate = 0.55,
}) {
  // Historical scenarios: consecutive losing days
  const scenarios = [
    { name: 'Normal Losing Streak', consecutiveLosses: 5, description: 'Typical bad week' },
    { name: 'Flash Crash (2010-style)', consecutiveLosses: 8, slippageFactor: 2.0, description: 'Stops missed, 2x normal loss' },
    { name: 'COVID March 2020', consecutiveLosses: 12, slippageFactor: 1.5, description: 'Extended sell-off, 1.5x losses' },
    { name: 'Black Monday Replay', consecutiveLosses: 15, slippageFactor: 3.0, description: 'Catastrophic gap, 3x normal loss' },
    { name: 'Slow Bleed (Death by 1000 cuts)', consecutiveLosses: 20, slippageFactor: 1.0, description: '20 losses at normal size' },
  ];

  return scenarios.map(scenario => {
    const slippage = scenario.slippageFactor || 1.0;
    const totalLoss = scenario.consecutiveLosses * avgLoss * slippage;
    const accountAfter = initialCapital - totalLoss;
    const drawdownPct = (totalLoss / initialCapital) * 100;
    const tradesBackToEven = Math.ceil(totalLoss / ((winRate * avgWin) - ((1 - winRate) * avgLoss)));
    const survived = accountAfter > 0;

    return {
      scenario: scenario.name,
      description: scenario.description,
      consecutiveLosses: scenario.consecutiveLosses,
      slippageFactor: slippage,
      totalLoss: Math.round(totalLoss),
      accountAfter: Math.round(accountAfter),
      drawdownPercent: `${drawdownPct.toFixed(1)}%`,
      tradesToRecover: survived ? tradesBackToEven : 'N/A (blown)',
      survived,
      verdict: !survived ? '💀 ACCOUNT BLOWN'
        : drawdownPct > 30 ? '🔴 CRITICAL — reduce size immediately'
        : drawdownPct > 15 ? '🟡 PAINFUL but survivable'
        : '🟢 Within acceptable parameters',
    };
  });
}

// CLI execution
if (require.main === module) {
  const input = JSON.parse(process.argv[2] || '{}');
  const command = input.command || 'simulate';

  if (command === 'simulate') {
    const result = monteCarloSimulation(input);
    console.log(JSON.stringify(result, null, 2));
  } else if (command === 'stress-test') {
    const result = stressTest(input);
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(JSON.stringify({ error: `Unknown command: ${command}. Use 'simulate' or 'stress-test'.` }));
  }
}

module.exports = { monteCarloSimulation, stressTest };
