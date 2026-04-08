---
name: strategy-analyzer
description: "Analyzes TradingView Pine Script strategies and backtesting results — identifies statistical edge, detects overfitting, evaluates risk-adjusted returns, and provides actionable improvement suggestions"
license: MIT
allowed-tools: Bash Read Write
metadata:
  author: "trademind"
  version: "1.0.0"
  category: "trading-analysis"
---

# Strategy Analyzer

## Purpose
Deep-dive analysis of trading strategies — from Pine Script code review to backtest result interpretation. This skill identifies whether a strategy has a genuine statistical edge or is curve-fitted noise.

## Instructions

### When the user provides Pine Script code:

1. **Code Quality Review**
   - Check for common Pine Script anti-patterns: repainting indicators, future data leakage, incorrect use of `security()` or `request.security()`, improper `barstate` handling
   - Verify proper use of `var` keyword for persistent state
   - Check `strategy()` declaration parameters: `overlay`, `default_qty_type`, `commission_type`, `slippage`, `pyramiding`
   - Flag hardcoded magic numbers — suggest converting to `input()` parameters
   - Assess code readability and maintainability

2. **Logic Analysis**
   - Map out the complete entry/exit logic flow
   - Identify all conditions that must be true for entries (AND/OR logic)
   - Check if the strategy handles both long and short directions appropriately
   - Verify stop loss and take profit logic is correct
   - Look for missing edge cases: what happens at market open? After gaps? During low volume?

3. **Overfitting Detection**
   - Count the number of free parameters — more than 5-7 tunable inputs on a simple strategy is a red flag
   - Check if optimal parameter values are suspiciously precise (e.g., 13-period EMA instead of "somewhere around 10-15")
   - Look for data-snooping: was the strategy designed to fit a specific historical period?
   - Suggest walk-forward analysis methodology if not already implemented

4. **Output Format**
   ```
   ## Strategy Review: [Strategy Name]
   
   ### Edge Assessment: [STRONG / MODERATE / WEAK / NO EDGE DETECTED]
   
   ### Code Quality
   - Repainting risk: [YES/NO] — [details]
   - Parameter count: [N] — [assessment]
   - Code issues: [list]
   
   ### Logic Flow
   [Visual flow of entry/exit conditions]
   
   ### Statistical Concerns
   [Overfitting flags, sample size issues, etc.]
   
   ### Recommendations
   1. [Specific, actionable improvement]
   2. [Specific, actionable improvement]
   3. [Specific, actionable improvement]
   ```

### When the user provides backtest results:

1. **Core Metrics Analysis**
   - Net profit (absolute & percentage)
   - Total trades (minimum 100 for statistical significance)
   - Win rate + average win/loss ratio → calculate expectancy
   - Profit factor (must be > 1.5 for a robust edge)
   - Max drawdown (absolute & percentage) — is it survivable?
   - Sharpe ratio (if available) — above 1.0 is acceptable, above 2.0 is excellent
   - Average trade duration — does it match the user's trading style?

2. **Distribution Analysis**
   - Is profit concentrated in a few large winners? (fragile strategy)
   - Is the equity curve smooth or lumpy? (consistency check)
   - What's the longest losing streak? Can the trader psychologically handle it?
   - What's the largest single loss? Is it within risk parameters?

3. **Robustness Checks**
   - Would the strategy survive 2x slippage assumptions?
   - What happens with commission adjustments?
   - Does the strategy work across multiple instruments?
   - Performance across different market regimes (trending, ranging, volatile)

4. **Output Format**
   ```
   ## Backtest Analysis: [Strategy Name]
   
   ### Verdict: [TRADEABLE / NEEDS WORK / NOT TRADEABLE]
   
   ### Key Metrics
   | Metric              | Value  | Benchmark | Assessment |
   |---------------------|--------|-----------|------------|
   | Win Rate            | X%     | >40%      | ✅/⚠️/❌   |
   | Profit Factor       | X.XX   | >1.5      | ✅/⚠️/❌   |
   | Max Drawdown        | X%     | <20%      | ✅/⚠️/❌   |
   | Expectancy/Trade    | $X.XX  | >0        | ✅/⚠️/❌   |
   | Sample Size         | N      | >100      | ✅/⚠️/❌   |
   
   ### Risk Assessment
   [Position sizing recommendations based on Kelly criterion]
   
   ### Improvement Opportunities
   [Specific, ranked suggestions]
   ```
