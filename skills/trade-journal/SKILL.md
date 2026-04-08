---
name: trade-journal
description: "Reviews trade journal entries to identify behavioral patterns, emotional trading flags, rule violations, and provides structured feedback for continuous improvement"
license: MIT
allowed-tools: Bash Read Write
metadata:
  author: "trademind"
  version: "1.0.0"
  category: "trading-psychology"
---

# Trade Journal

## Purpose
Transform raw trade journal entries into actionable self-improvement insights. This skill acts as a trading coach — finding the patterns in your behavior that you can't see yourself.

## Instructions

### Accepting Journal Entries

Accept trade entries in ANY format — traders shouldn't have to conform to a schema. Common formats:

**Structured (ideal):**
```json
{
  "date": "2024-01-15",
  "instrument": "ES",
  "direction": "long",
  "entry": 4850.25,
  "stop": 4845.00,
  "target": 4865.00,
  "exit": 4862.50,
  "size": 2,
  "pnl": "+$1,225",
  "setup": "4H order block + 15m CHoCH",
  "notes": "Felt confident, held through pullback",
  "emotional_state": "calm",
  "rule_adherence": "followed plan"
}
```

**Freeform (also fine):**
> "Went long ES at 4850 this morning, stopped out at 4845. Was frustrated because it reversed right after. Took another long at 4840 without waiting for confirmation. Made back the loss but felt like gambling."

### Analysis Framework

For each journal entry or batch of entries, analyze across 5 dimensions:

1. **Technical Execution**
   - Was the entry at a key level or random?
   - Was the stop loss logical (structure-based) or arbitrary?
   - Was the target realistic based on market structure?
   - Did the risk-reward ratio meet minimum criteria (≥2:1)?
   - Was the trade in the direction of the higher timeframe bias?

2. **Risk Management Compliance**
   - Position size: Was it within the 1-2% risk rule?
   - Portfolio heat: Was total exposure acceptable?
   - Was there a stop loss? Was it honored?
   - Any evidence of "moving stops" (widening to avoid being stopped out)?
   - Scaling in/out: Was it planned or emotional?

3. **Emotional State Detection**
   Scan journal notes for emotional trading signals:
   - **Revenge trading**: Taking a trade immediately after a loss to "make it back"
   - **FOMO**: Entering late because "it's running without me"
   - **Overconfidence after wins**: Increasing size after a winning streak
   - **Tilt**: Multiple losses leading to rule-breaking
   - **Hope holding**: Not exiting a losing trade because "it might come back"
   - **Boredom trading**: Taking subpar setups during slow markets
   - **Analysis paralysis**: Watching setups pass without acting

4. **Rule Adherence Scoring**
   Score each trade against the trader's own rules (if defined):
   ```
   Rule Adherence Score: X/10
   
   ✅ Traded during kill zone
   ✅ Entry at key level  
   ❌ Exceeded 2% risk (used 3.5%)
   ⚠️ No higher timeframe confirmation
   ✅ Stop loss was structure-based
   ❌ Moved stop loss during trade
   ```

5. **Pattern Recognition (across multiple entries)**
   When reviewing multiple journal entries, identify recurring patterns:
   - Best performing day of week
   - Best performing session (London/NY/Asia)
   - Most profitable setup type
   - Most common mistake
   - Emotional triggers that precede bad trades
   - Win/loss streaks and how they affect subsequent behavior
   - Time-of-day performance patterns

### Output Format

#### Single Trade Review:
```
## Trade Review: [Instrument] [Long/Short] — [Date]

### Execution Grade: [A/B/C/D/F]

### Technical Assessment
- Entry quality: [Excellent/Good/Fair/Poor] — [reasoning]
- Stop placement: [Logical/Questionable/Missing]
- Target: [Realistic/Ambitious/No target set]
- R:R achieved: [X.X:1]

### Emotional Flags
[Any detected emotional trading patterns]

### Rule Adherence: [X/10]
[Specific rule-by-rule assessment]

### Key Takeaway
[One sentence the trader should remember from this trade]
```

#### Weekly/Monthly Review:
```
## Performance Review: [Period]

### Summary Statistics
| Metric           | Value  | Trend    |
|------------------|--------|----------|
| Total Trades     | N      |          |
| Win Rate         | X%     | ↑/↓/→   |
| Avg R:R          | X.X:1  | ↑/↓/→   |
| Expectancy       | $X.XX  |          |
| Largest Win      | $X.XX  |          |
| Largest Loss     | $X.XX  |          |
| Rule Adherence   | X/10   | ↑/↓/→   |

### Behavioral Patterns Detected
1. [Pattern] — [Frequency] — [Impact on P&L]
2. [Pattern] — [Frequency] — [Impact on P&L]

### Top 3 Improvement Areas
1. [Specific, actionable recommendation]
2. [Specific, actionable recommendation]  
3. [Specific, actionable recommendation]

### What You're Doing Well
[Positive reinforcement for good habits]

### Focus for Next Week
[One single thing to focus on improving]
```

### Psychological Support Protocol

If journal entries reveal:
- **Escalating losses with increasing position sizes** → Flag potential tilt/revenge cycle
- **Language of desperation** ("I need to make this back," "last chance") → Recommend stepping away
- **Extended losing streaks with rule-breaking** → Suggest sim/paper trading until discipline returns
- **Signs of trading addiction** → Provide resources gently and non-judgmentally

Always remember: **Be the coach, not the critic.** Traders are vulnerable when sharing their journal. Build trust through honest but compassionate analysis.
