# Trading Glossary & Concepts Reference

## Market Structure

### Break of Structure (BOS)
Price breaking a significant swing high (bullish BOS) or swing low (bearish BOS), confirming trend continuation.

### Change of Character (CHoCH)
The first break of structure against the prevailing trend, signaling a potential reversal. A bullish trend shows CHoCH when price breaks below a significant swing low.

### Higher High (HH) / Higher Low (HL)
Bullish market structure pattern where each successive swing point is higher than the previous one.

### Lower High (LH) / Lower Low (LL)
Bearish market structure pattern where each successive swing point is lower than the previous one.

### Market Structure Break (MSB)
Synonym for Break of Structure — price violating a key swing level.

## ICT / Smart Money Concepts (SMC)

### Order Block (OB)
The last bearish candle before a significant bullish move (bullish OB) or the last bullish candle before a significant bearish move (bearish OB). Represents institutional order flow.

### Fair Value Gap (FVG)
A three-candle pattern where the wicks of candle 1 and candle 3 don't overlap, creating an imbalance zone. Price often returns to fill these gaps.

### Liquidity
Resting orders above swing highs (buy-side liquidity) or below swing lows (sell-side liquidity). Smart money targets these pools to fill large orders.

### Liquidity Sweep / Grab
Price temporarily moves beyond a key level to trigger stop losses and resting orders, then reverses. Also called a "stop hunt."

### Premium Zone
Price above the 50% equilibrium of a range — considered expensive for buying. Smart money sells in premium zones.

### Discount Zone
Price below the 50% equilibrium of a range — considered cheap for buying. Smart money buys in discount zones.

### Displacement
An aggressive price move characterized by large-bodied candles with minimal wicks, indicating strong institutional participation.

### Inducement
A minor liquidity level that attracts retail traders into the wrong direction before a larger move. A trap.

### Mitigation
When price returns to an order block or point of interest and reacts, said to be "mitigating" the institutional orders left there.

### Kill Zone
Specific time windows during a trading session where institutional activity is highest:
- **London Kill Zone**: 02:00-05:00 ET
- **New York Kill Zone**: 08:30-11:00 ET
- **London Close Kill Zone**: 10:00-12:00 ET (overlap)

## Classical Technical Analysis

### Support & Resistance
Price levels where buying pressure (support) or selling pressure (resistance) has historically been significant.

### Moving Averages
- **SMA**: Simple Moving Average — arithmetic mean of N candles
- **EMA**: Exponential Moving Average — weighted toward recent prices
- Common periods: 9, 20, 50, 100, 200

### RSI (Relative Strength Index)
Momentum oscillator measuring speed and magnitude of price changes. Range: 0-100.
- Overbought: >70
- Oversold: <30
- Divergence: price makes new high/low but RSI doesn't = potential reversal

### MACD (Moving Average Convergence Divergence)
Trend-following momentum indicator. Signal: MACD line crosses signal line.
Components: MACD line, Signal line, Histogram.

### ATR (Average True Range)
Volatility indicator measuring average range per candle. Used for stop loss placement and position sizing.

### Bollinger Bands
Volatility bands at ±2 standard deviations from a 20-period SMA. Band squeeze = low volatility (breakout incoming).

### VWAP (Volume Weighted Average Price)
Price weighted by volume throughout the session. Institutional benchmark for intraday trading.

### Fibonacci Retracement
Key retracement levels derived from the Fibonacci sequence:
- 23.6%, 38.2%, 50%, 61.8%, 78.6%
- 61.8% ("golden ratio") is the most commonly watched level

## Risk Management

### Risk-Reward Ratio (R:R)
The ratio of potential profit to potential loss. Example: $300 target / $100 risk = 3:1 R:R.

### Position Sizing
Calculating the number of shares/contracts/lots based on account size, risk percentage, and stop distance.

**Formula**: Position Size = (Account × Risk%) / (Entry - Stop)

### Kelly Criterion
Optimal bet sizing formula: Kelly% = W - [(1-W)/R]
- W = Win rate
- R = Win/Loss ratio
- Half-Kelly or Quarter-Kelly recommended in practice

### Portfolio Heat
Total risk across all open positions as a percentage of account. 
- Conservative: ≤3%
- Moderate: ≤6%
- Aggressive: ≤10% (not recommended)

### Max Drawdown
The largest peak-to-trough decline in account equity. Key metric for strategy robustness.

### Risk of Ruin
The probability of losing a specified percentage of capital (usually 50% or 100%) given a strategy's win rate, reward ratio, and per-trade risk.

### Expectancy
The average amount you expect to win (or lose) per trade.
**Formula**: Expectancy = (Win% × Avg Win) - (Loss% × Avg Loss)

### Sharpe Ratio
Risk-adjusted return metric. (Return - Risk Free Rate) / Standard Deviation.
- <1.0 = Subpar
- 1.0-2.0 = Acceptable
- 2.0-3.0 = Very good
- >3.0 = Excellent

## Trading Psychology

### Revenge Trading
Immediately taking a trade after a loss to "make back" the money. Emotional, not strategic.

### FOMO (Fear of Missing Out)
Entering a trade because price is moving aggressively and you feel left out. Usually leads to buying tops or selling bottoms.

### Tilt
A poker term adopted by traders — being in a negative emotional state that causes decision-making to deteriorate. Often follows a string of losses.

### Disposition Effect
The tendency to sell winners too early (locking in profits) and hold losers too long (avoiding the pain of realizing a loss).

### Confirmation Bias
Seeking information that supports your existing market thesis while ignoring contradicting evidence.

### Recency Bias
Weighting recent events more heavily than historical patterns. Example: being overly bullish after 3 green days despite being in a longer-term downtrend.

## Session Timing (Eastern Time)

| Session | Hours (ET) | Characteristics |
|---------|-----------|-----------------|
| Asia | 19:00-04:00 | Low volume, ranging, sets daily bias |
| London | 02:00-11:00 | Volume increase, trend initiation |
| NY Open | 09:30-11:30 | Highest volume, major moves |
| NY Lunch | 12:00-13:30 | Low volume, choppy, avoid trading |
| NY Close | 14:00-16:00 | Second wind, position squaring |

## Pine Script Quick Reference

### Version Declaration
```pine
//@version=5
indicator("Name", overlay=true)
```

### Common Functions
- `ta.sma(source, length)` — Simple Moving Average
- `ta.ema(source, length)` — Exponential Moving Average
- `ta.rsi(source, length)` — RSI
- `ta.atr(length)` — ATR
- `ta.crossover(a, b)` — A crosses above B
- `ta.crossunder(a, b)` — A crosses below B
- `ta.highest(source, length)` — Highest value in N bars
- `ta.lowest(source, length)` — Lowest value in N bars
- `request.security(symbol, timeframe, expression)` — Multi-timeframe data

### Anti-Repainting
```pine
// Only trigger on confirmed bars
if barstate.isconfirmed
    // your signal logic here

// Use proper lookahead
htf_close = request.security(syminfo.tickerid, "D", close, lookahead=barmerge.lookahead_off)
```
