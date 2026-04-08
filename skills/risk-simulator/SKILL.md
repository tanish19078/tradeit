---
name: risk-simulator
description: "Runs Monte Carlo simulations and stress tests on trading strategies — estimates risk of ruin, drawdown distributions, optimal position sizing via Kelly criterion, and survival probability against historical crash scenarios"
license: MIT
allowed-tools: Bash Read Write
metadata:
  author: "trademind"
  version: "1.0.0"
  category: "quantitative-risk-analysis"
---

# Risk Simulator

## Purpose
Go beyond static risk calculations. This skill uses Monte Carlo simulation — the same technique used by hedge funds and prop firms — to answer the question every trader should ask but few ever do: **"If I trade this strategy for 200 trades, what's the realistic range of outcomes?"**

This skill chains with other TradeMind capabilities:
- Uses **risk-auditor** parameters as simulation inputs
- Feeds results back into **strategy-analyzer** for edge validation
- Informs **bias-builder** confidence levels based on strategy robustness

## Instructions

### When to Trigger This Skill
- User asks about "risk of ruin," "will my strategy survive," or "what are the odds"
- User provides strategy stats (win rate, average win/loss) and wants forward-looking analysis
- User is deciding between position sizing approaches (fixed vs. percent-of-equity)
- After a **strategy-analyzer** review identifies an edge — simulate its forward performance
- User is on a losing streak and needs data to calm emotions

### Simulation Workflow

1. **Gather Strategy Parameters**
   Ask for or extract from previous conversation:
   - Win rate (%)
   - Average winning trade ($)
   - Average losing trade ($)
   - Account size ($)
   - Current risk per trade (%)
   - Number of trades to simulate (default: 200 = ~1 year of active trading)

2. **Run Monte Carlo Simulation**
   Use the `monte-carlo-simulator` tool with `command: simulate`:
   ```
   Tool: monte-carlo-simulator
   Input: {
     "command": "simulate",
     "initialCapital": 50000,
     "winRate": 0.55,
     "avgWin": 300,
     "avgLoss": 200,
     "tradesPerSim": 200,
     "numSimulations": 1000,
     "fixedSize": true
   }
   ```

3. **Run Stress Test**
   Always follow up with crash scenario analysis:
   ```
   Tool: monte-carlo-simulator
   Input: {
     "command": "stress-test",
     "initialCapital": 50000,
     "avgWin": 300,
     "avgLoss": 200,
     "winRate": 0.55
   }
   ```

4. **Compare Position Sizing Methods**
   If the user hasn't specified, run both fixed and percent-of-equity:
   - Fixed sizing: flat dollar amounts per trade
   - Percent-of-equity: risk scales with account (compounds gains AND losses)

### Output Format

```
# 🎲 Monte Carlo Risk Simulation

## Strategy DNA
| Metric              | Value    | Assessment        |
|---------------------|----------|-------------------|
| Expectancy/Trade    | $X.XX    | [Positive edge ✅ / No edge ❌] |
| Profit Factor       | X.XX     | [>1.5 = robust / <1.2 = fragile] |
| Kelly Optimal       | XX.X%    | [Full Kelly — DON'T USE THIS] |
| Recommended Size    | XX.X%    | [Quarter Kelly — practical] |

## Equity Curve Distribution (1000 simulations × 200 trades)

### 📈 Where You'll Likely End Up
| Percentile | Final Equity | Return  | What This Means         |
|------------|-------------|---------|-------------------------|
| Best Case  | $XX,XXX     | +XX%    | Everything goes right   |
| 95th       | $XX,XXX     | +XX%    | Excellent outcome       |
| 75th       | $XX,XXX     | +XX%    | Good — above average    |
| Median     | $XX,XXX     | +XX%    | Most likely outcome     |
| 25th       | $XX,XXX     | +XX%    | Below average but fine  |
| 5th        | $XX,XXX     | -XX%    | Bad luck scenario       |
| Worst Case | $XX,XXX     | -XX%    | Murphy's Law            |

### Probability of profit: XX.X%
### Probability of doubling: XX.X%

## 📉 Drawdown Reality Check

This is the most important section. Every trader overestimates their drawdown tolerance.

| Scenario          | Max Drawdown | $ Amount  | Trades to Recover |
|-------------------|-------------|-----------|-------------------|
| Typical (50th)    | -X.X%       | $X,XXX    | XX trades         |
| Bad month (75th)  | -X.X%       | $X,XXX    | XX trades         |
| Bad quarter (95th)| -X.X%       | $X,XXX    | XX trades         |
| Nightmare (99th)  | -X.X%       | $X,XXX    | XX trades         |

> ❓ **Can you stomach a $X,XXX drawdown and still follow your rules?**
> If the answer is "I'm not sure," reduce position size until the 95th percentile drawdown feels manageable.

## ☠️ Risk of Ruin: [SAFE / LOW / MODERATE / HIGH / DANGEROUS]

Ruin threshold: losing XX% of account
Probability: X.XX%
Out of 1000 simulations: X accounts were ruined

[Assessment and recommendation]

## 🔥 Stress Test: Can Your Strategy Survive...

| Scenario              | Losses | Slippage | Loss $   | Account After | Verdict    |
|-----------------------|--------|----------|----------|---------------|------------|
| Normal bad week       | 5      | 1.0x     | $X,XXX   | $XX,XXX       | [verdict]  |
| Flash Crash           | 8      | 2.0x     | $X,XXX   | $XX,XXX       | [verdict]  |
| COVID March 2020      | 12     | 1.5x     | $X,XXX   | $XX,XXX       | [verdict]  |
| Black Monday          | 15     | 3.0x     | $X,XXX   | $XX,XXX       | [verdict]  |
| 20 consec. losses     | 20     | 1.0x     | $X,XXX   | $XX,XXX       | [verdict]  |

## 🎯 Losing Streaks: What to Expect
- **Typical longest losing streak**: X trades in a row
- **Bad luck (95th percentile)**: X trades in a row
- **Worst simulated**: X trades in a row

> This is NORMAL. It's not you failing — it's statistics. The question is: will you still follow your rules on trade X+1?

## Recommendation

[Tailored recommendation based on simulation results — position sizing, psychological preparation, account management]
```

### Chaining with Other Skills

**After Strategy Analyzer finds an edge:**
> "Your strategy shows a 57% win rate with 1.8:1 R:R. Let me simulate 200 trades to see if this edge is robust enough to trade with real money..."

**Before Bias Builder generates a session plan:**
> "Based on your simulation results, your optimal risk per trade is 0.75% (quarter Kelly). I'll use this in today's bias calculations."

**When Trade Journal reveals a losing streak:**
> "You've lost 7 in a row. Let me show you from the Monte Carlo data — this was expected to happen in 12% of simulations. Your strategy isn't broken. Here's why..."

### Key Principles

1. **Always show both the upside AND downside** — never cherry-pick optimistic scenarios
2. **Drawdown tolerance is the #1 predictor of strategy survival** — emphasize this
3. **Quarter Kelly is the practical recommendation** — full Kelly is mathematically optimal but psychologically impossible
4. **Losing streaks are NOT bugs** — they're a feature of any probabilistic edge. Normalize them.
5. **If risk of ruin exceeds 5%, reduce position size before trading** — this is non-negotiable
