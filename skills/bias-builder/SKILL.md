---
name: bias-builder
description: "Builds structured daily/weekly market bias using multi-timeframe analysis, key level identification, and scenario planning with clear invalidation criteria"
license: MIT
allowed-tools: Bash Read Write
metadata:
  author: "trademind"
  version: "1.0.0"
  category: "market-analysis"
---

# Bias Builder

## Purpose
Construct a structured, evidence-based market bias for any instrument across any timeframe. The output is a complete pre-market analysis that a trader can reference throughout their session.

## Instructions

### Information Gathering

Before building a bias, collect from the user:
1. **Instrument** — What are you trading? (e.g., ES, NQ, BTC, EUR/USD, AAPL)
2. **Timeframe** — What's your execution timeframe? (1m, 5m, 15m, 1H, 4H, Daily)
3. **Trading style** — Scalp, day trade, swing, or position?
4. **Key observations** — What does the user already see on their chart? (Don't override their analysis — build on it)
5. **Previous session context** — What happened in the last session? Key moves, failed breakouts, etc.

### Bias Construction Process

1. **Higher Timeframe Structure (Top-Down)**
   - Start 2-3 timeframes above execution TF
   - Identify: trend direction, current structure (HH/HL for bullish, LH/LL for bearish)
   - Mark major market structure breaks (MSBs) or changes of character (CHoCH)
   - Note any higher-timeframe order blocks, liquidity pools, or fair value gaps

2. **Key Level Identification**
   - Previous day/week high and low (PDH/PDL, PWH/PWL)
   - Significant swing points on the analysis timeframe
   - Round psychological numbers
   - Volume-based levels (VPOC, value area high/low if available)
   - Unfilled fair value gaps (FVGs) on higher timeframes
   - Untapped order blocks

3. **Liquidity Analysis**
   - Where is resting liquidity likely? (above equal highs, below equal lows)
   - Old high/lows that haven't been swept
   - Stop loss clusters (where would most retail traders place stops?)
   - Previous day's high/low as liquidity targets

4. **Scenario Planning**
   Build exactly **3 scenarios** with probabilities:

   - **Scenario A (Primary)**: [55-60%] — The most likely path based on HTF structure
   - **Scenario B (Secondary)**: [25-30%] — Alternative path if key level holds/breaks
   - **Scenario C (Outlier)**: [10-15%] — Black swan / unexpected move scenario

   Each scenario must include:
   - Trigger condition (what price action confirms this scenario?)
   - Expected path (key levels it would target)
   - Invalidation (when is this scenario dead?)

5. **Session Roadmap**
   - Pre-market key events (economic calendar, earnings, FOMC, etc.)
   - Session timing: London open, NY open, NY lunch, NY close
   - "Kill zones" where the user should be most alert
   - Levels where the user should NOT trade (chop zones)

### Output Format

```
# 📊 Daily Bias Report: [INSTRUMENT] — [DATE]

## Higher Timeframe Context
**Weekly**: [Bullish/Bearish/Ranging] — [Key observation]
**Daily**: [Bullish/Bearish/Ranging] — [Key observation]  
**4H**: [Bullish/Bearish/Ranging] — [Key observation]

## Directional Bias: [BULLISH / BEARISH / NEUTRAL]
**Confidence**: [HIGH / MEDIUM / LOW]
**Bias valid above/below**: [KEY LEVEL]

## Key Levels
| Level     | Price    | Type              | Significance |
|-----------|----------|-------------------|--------------|
| Resistance| XXXX.XX  | [PDH/OB/FVG/etc]  | [High/Med]   |
| Support   | XXXX.XX  | [PDL/OB/FVG/etc]  | [High/Med]   |

## Scenarios

### 🟢 Scenario A: [Name] — [55%]
**Trigger**: [specific price action]
**Path**: [level] → [level] → [target]
**Invalidation**: Price breaks below [level]

### 🟡 Scenario B: [Name] — [30%]
**Trigger**: [specific price action]
**Path**: [level] → [level] → [target]  
**Invalidation**: [condition]

### 🔴 Scenario C: [Name] — [15%]
**Trigger**: [specific price action]
**Path**: [level] → [level] → [target]
**Invalidation**: [condition]

## Session Plan
- **London Open (02:00-05:00 ET)**: [expectations]
- **NY Open (09:30-11:00 ET)**: [expectations]
- **Afternoon (13:00-15:00 ET)**: [expectations]

## ⚠️ Don't Trade If...
- [Condition that invalidates all scenarios]
- [Chop zone boundaries]

## 📋 Checklist Before Entering
- [ ] Is price at a key level from this bias?
- [ ] Does the entry timeframe confirm?
- [ ] Is risk defined (stop loss placed)?
- [ ] Is position size within rules (≤2% risk)?
- [ ] Is there a clear target (≥2:1 RR)?
```

### Bias Update Protocol
If the user returns mid-session with new information:
- Re-evaluate which scenario is playing out
- Update probabilities based on new price action
- If all scenarios are invalidated → declare "No bias, no trade" and recommend sitting out
