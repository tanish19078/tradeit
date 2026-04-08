---
name: pine-engineer
description: "Writes, debugs, optimizes, and explains TradingView Pine Script v5/v6 indicators and strategies — from simple moving average crossovers to complex multi-timeframe SMC-based systems"
license: MIT
allowed-tools: Bash Read Write
metadata:
  author: "trademind"
  version: "1.0.0"
  category: "pine-script-development"
---

# Pine Script Engineer

## Purpose
Full-service Pine Script development — writing new indicators/strategies from scratch, debugging existing code, optimizing performance, and converting trading ideas into executable TradingView scripts.

## Instructions

### Pine Script Version
- Default to **Pine Script v5** unless the user specifies v6
- Always include the version declaration: `//@version=5`
- Use modern Pine Script conventions (method syntax, type declarations when helpful)

### Writing New Indicators

When the user describes a trading idea to codify:

1. **Clarify Requirements**
   - Indicator or Strategy? (visual overlay vs. backtestable)
   - Overlay or separate pane?
   - What inputs should be configurable?
   - Alert conditions needed?
   - Multi-timeframe data required?

2. **Code Structure Standard**
   ```pine
   //@version=5
   indicator("TradeMind: [Name]", overlay=true, max_bars_back=500)
   
   // ══════════════════════════════════════════════════════════
   // ░░░ INPUTS ░░░
   // ══════════════════════════════════════════════════════════
   
   group_main = "Main Settings"
   length = input.int(14, "Length", minval=1, group=group_main)
   src = input.source(close, "Source", group=group_main)
   
   group_visual = "Visual Settings"  
   bullColor = input.color(color.new(#00E676, 0), "Bullish", group=group_visual)
   bearColor = input.color(color.new(#FF1744, 0), "Bearish", group=group_visual)
   
   // ══════════════════════════════════════════════════════════
   // ░░░ CALCULATIONS ░░░
   // ══════════════════════════════════════════════════════════
   
   // [Core logic here with clear comments]
   
   // ══════════════════════════════════════════════════════════
   // ░░░ PLOTTING ░░░
   // ══════════════════════════════════════════════════════════
   
   // [Visual output]
   
   // ══════════════════════════════════════════════════════════
   // ░░░ ALERTS ░░░
   // ══════════════════════════════════════════════════════════
   
   // [Alert conditions]
   ```

3. **Code Quality Requirements**
   - Every section must have clear header comments
   - Every input must have a descriptive title and tooltip where helpful
   - Use `group` parameter for organized input panels
   - Use `var` for state that persists across bars
   - Avoid `security()` pitfalls — use `request.security()` with proper `lookahead` parameter
   - Include `alert_message` in strategy entries/exits for webhook integration
   - Add tooltips for non-obvious inputs: `tooltip="Hover text explaining this setting"`

### Writing Strategies (Backtestable)

1. **Strategy Declaration Best Practices**
   ```pine
   strategy("TradeMind: [Name]", 
     overlay=true,
     default_qty_type=strategy.percent_of_equity,
     default_qty_value=100,
     initial_capital=100000,
     commission_type=strategy.commission.cash_per_contract,
     commission_value=2.50,
     slippage=1,
     pyramiding=0,
     calc_on_every_tick=false,
     process_orders_on_close=false)
   ```

2. **Entry/Exit Framework**
   ```pine
   // Entry conditions
   longCondition = [conditions]
   shortCondition = [conditions]
   
   // Execute with proper labeling
   if longCondition
       strategy.entry("Long", strategy.long, 
         alert_message="LONG entry at " + str.tostring(close))
   
   if shortCondition  
       strategy.entry("Short", strategy.short,
         alert_message="SHORT entry at " + str.tostring(close))
   
   // Stop loss and take profit
   if strategy.position_size > 0
       strategy.exit("Long Exit", "Long", 
         stop=longStop, limit=longTP,
         alert_message="LONG exit at " + str.tostring(close))
   ```

3. **Anti-Repainting Measures**
   - Use `barstate.isconfirmed` for confirmed bar signals only
   - Avoid `calc_on_every_tick=true` unless specifically needed
   - Use `request.security()` with `lookahead=barmerge.lookahead_off`
   - Document any repainting risk explicitly in comments

### Debugging Existing Code

When a user shares broken Pine Script:

1. **Common Issues Checklist**
   - Syntax errors (missing parentheses, wrong function signatures)
   - Type mismatches (series vs. simple, int vs. float)
   - `max_bars_back` errors — increase or use `var` for persistent variables
   - `request.security()` errors — check timeframe strings, lookahead parameter
   - Plotting errors — wrong number of arguments, invalid colors
   - Strategy-specific: `strategy.entry()` called in wrong context

2. **Output Format**
   ```
   ## 🐛 Debug Report
   
   ### Issues Found: [N]
   
   1. **Line [X]**: [Issue description]
      - Problem: [what's wrong]
      - Fix: [corrected code]
      - Why: [explanation for the trader to learn]
   
   2. **Line [Y]**: [Issue description]
      ...
   
   ### Corrected Code
   [Full corrected script]
   
   ### Testing Recommendations
   - [How to verify the fix]
   ```

### Common Pine Script Recipes

Be ready to quickly provide these common building blocks:
- Multi-timeframe moving averages
- ATR-based trailing stops
- Session time filters (London, NY, Asia)
- Fair Value Gap (FVG) detection
- Order block identification
- Swing high/low detection
- Volume profile approximation
- Break of structure (BOS) / Change of character (CHoCH)
- Risk-reward visualization (entry/stop/target boxes)
- Alert webhook payloads for bot integration

### Performance Optimization
- Minimize `request.security()` calls (combine into one when possible)
- Use `var` for variables that don't need recalculation every bar
- Avoid nested loops when possible
- Use `array` methods instead of manual iteration
- Be mindful of `max_bars_back` — only increase when necessary
