---
name: risk-auditor
description: "Audits portfolio risk exposure, position sizing, correlation risk, drawdown scenarios, and calculates optimal position sizes using Kelly criterion and fixed-fractional methods"
license: MIT
allowed-tools: Bash Read Write
metadata:
  author: "trademind"
  version: "1.0.0"
  category: "risk-management"
---

# Risk Auditor

## Purpose
Comprehensive risk analysis for trading portfolios and individual positions. This skill ensures traders never blow up by catching sizing errors, concentration risk, and unrealistic expectations before real money is on the line.

## Instructions

### Position Sizing Calculations

When a user asks "how much should I risk?" or provides a trade setup:

1. **Gather Required Inputs**
   - Account size
   - Risk per trade (default: 1-2% of account)
   - Entry price
   - Stop loss price
   - Instrument details (tick size, tick value, contract specs for futures)

2. **Calculate and Present**
   ```
   ## Position Size Calculator
   
   Account: $50,000
   Risk per trade: 1% = $500
   
   Entry: 4850.00
   Stop: 4845.00
   Distance: 5.00 points = 20 ticks
   
   Tick value: $12.50/tick (ES)
   Risk per contract: 20 × $12.50 = $250
   
   Position size: $500 ÷ $250 = 2 contracts
   
   ✅ Risk: $500 (1.0% of account)
   ```

3. **Kelly Criterion (when strategy stats are available)**
   ```
   Kelly % = W - [(1-W) / R]
   
   Where:
   W = Win rate (e.g., 0.55)
   R = Win/Loss ratio (e.g., 1.8)
   
   Kelly = 0.55 - (0.45 / 1.8) = 0.55 - 0.25 = 0.30 (30%)
   
   ⚠️ Full Kelly is too aggressive. Recommend:
   - Half Kelly: 15% risk per trade
   - Quarter Kelly: 7.5% risk per trade (conservative, recommended)
   ```

### Portfolio Risk Audit

When reviewing a trader's open positions:

1. **Individual Position Analysis**
   - Risk per position vs. account size
   - Distance to stop in ATR multiples
   - Time in trade vs. expected hold time

2. **Portfolio-Level Risk**
   ```
   ## Portfolio Heat Check
   
   | Position    | Direction | Risk $  | Risk %  | Status  |
   |-------------|-----------|---------|---------|---------|
   | ES Long     | ↑         | $500    | 1.0%    | ✅      |
   | NQ Long     | ↑         | $750    | 1.5%    | ⚠️      |
   | AAPL Short  | ↓         | $400    | 0.8%    | ✅      |
   
   Total portfolio heat: $1,650 (3.3%)
   Maximum recommended: $3,000 (6.0%)
   
   ⚠️ CORRELATION WARNING: ES and NQ are 95%+ correlated.
   Effective directional risk is 2.5% long equity index,
   not the 1.0% + 1.5% it appears to be.
   ```

3. **Correlation Matrix**
   - Flag positions in the same direction on correlated instruments
   - Calculate effective portfolio exposure after correlation adjustment
   - Recommend hedges or position reductions if concentrated

### Drawdown Analysis

1. **Maximum Drawdown Scenarios**
   ```
   Based on your strategy stats:
   - Win rate: 55%
   - Average win: $300
   - Average loss: $200
   
   Simulated max drawdowns (1000 Monte Carlo runs):
   - 50th percentile: -8.5%
   - 75th percentile: -12.3%
   - 95th percentile: -18.7%
   - 99th percentile: -24.1%
   
   ❓ Can you psychologically and financially survive a -18.7% drawdown?
   That's a $9,350 drawdown on a $50,000 account.
   It would take approximately 47 winning trades to recover.
   ```

2. **Risk of Ruin Calculation**
   ```
   Risk of Ruin = ((1 - Edge) / (1 + Edge)) ^ (Capital Units)
   
   Edge = (Win% × Avg Win) - (Loss% × Avg Loss) / Avg Loss
   Capital Units = Account / Risk per trade
   
   Your risk of ruin: X.XX%
   
   [SAFE / CAUTION / DANGEROUS] — Recommendation: [adjust]
   ```

### Pre-Trade Risk Checklist

Before any trade, run this checklist:

```
## Pre-Trade Risk Audit ✓

- [ ] Position size ≤ 2% account risk
- [ ] Portfolio heat ≤ 6% after this trade  
- [ ] No more than 3 correlated positions
- [ ] Stop loss is structure-based (not arbitrary)
- [ ] Risk-reward ratio ≥ 2:1
- [ ] Trade is in direction of HTF bias
- [ ] No major news events in next [holding period]
- [ ] Not revenge trading (last trade was a loss?)
- [ ] Account is not in drawdown recovery mode
```

### Red Flags to Immediately Escalate

If any of these are detected, **stop all analysis and flag loudly**:

- Risk per trade > 5% of account
- Portfolio heat > 15%
- No stop loss on any position
- Leverage exceeding 10:1 on retail account
- Adding to a losing position without a plan (averaging down without structure)
- Using money they "can't afford to lose" (mentioned in conversation)
