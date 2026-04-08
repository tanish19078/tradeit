#  TradeMind

### AI Trading Strategy Analyst — Your Disciplined, Data-Driven Edge

> *"I think in probabilities, not predictions. I speak in risk-reward, not hope."*

TradeMind is an AI agent that lives in your git repo, built on the [gitagent](https://github.com/open-gitagent/gitagent) standard. It's your **trading strategy analyst, risk auditor, journal coach, Monte Carlo simulator, and Pine Script engineer** — all version-controlled, all transparent, all yours.

---

## 🎯 What Does TradeMind Do?

| Skill | What It Does | Example |
|-------|-------------|---------|
| **Strategy Analyzer** | Reviews Pine Script strategies, detects overfitting, evaluates statistical edge | *"Is my golden cross strategy actually profitable, or am I curve-fitting?"* |
| **Bias Builder** | Constructs daily/weekly market bias with multi-timeframe analysis & scenario planning | *"What's my directional bias for ES tomorrow? Build me 3 scenarios."* |
| **Trade Journal** | Reviews journal entries, detects emotional patterns, scores rule adherence | *"Review my last 20 trades and tell me what I'm doing wrong."* |
| **Risk Auditor** | Audits portfolio exposure, position sizing, correlation risk, calculates Kelly criterion | *"Am I overleveraged? What's my risk of ruin?"* |
| **Pine Engineer** | Writes, debugs, and optimizes TradingView Pine Script v5/v6 indicators & strategies | *"Build me a Fair Value Gap detector with alerts."* |
| **Risk Simulator** 🆕 | Monte Carlo simulation of trade sequences — drawdown distributions, stress tests, ruin probability | *"Simulate my next 200 trades. Can my strategy survive a flash crash?"* |

---

## 🚀 Quick Start

### Option 1: CLI with gitclaw

```bash
# Install gitclaw
npm install -g gitclaw

# Set your API key
export ANTHROPIC_API_KEY="sk-..."

# Run TradeMind
gitclaw --dir . "Review my EMA crossover strategy for overfitting"
```

### Option 2: SDK (Programmatic)

```javascript
import { query } from 'gitclaw';

for await (const msg of query({
  prompt: "Simulate 1000 Monte Carlo runs on my 55% win rate strategy",
  dir: "./",
  model: "anthropic:claude-sonnet-4-5-20250929",
})) {
  if (msg.type === "delta") process.stdout.write(msg.content);
}
```

### Option 3: Serverless (clawless)

```javascript
import { ClawContainer } from 'clawcontainer';

const cc = new ClawContainer('#app', {
  template: 'gitclaw',
  env: { ANTHROPIC_API_KEY: 'sk-ant-...' }
});
await cc.start();
```

> ✅ All 3 tools are **pure JavaScript, zero external dependencies** — fully compatible with WebContainers (clawless).

### Option 4: Standalone Demo (No API Key Required)

See the tools in action with **live market data** — no LLM needed:

```bash
# Analyze any stock with real Yahoo Finance data
node demo-standalone.js AAPL 3mo
node demo-standalone.js TSLA 6mo
node demo-standalone.js BTC-USD 1y
```

This fetches live OHLCV data, computes 9 technical indicators, generates a bias assessment, position sizing calculations, and key Fibonacci levels — all in the terminal.

---

## 📁 Repository Structure

```
trademind/
├── agent.yaml                    # Agent manifest — model, 6 skills, 3 tools, metadata
├── SOUL.md                       # Identity — veteran trading strategist personality
├── RULES.md                      # Hard rules — risk-first, no financial advice, safety
├── CLAUDE.md                     # Claude Code integration instructions
├── README.md                     # You are here
│
├── skills/
│   ├── strategy-analyzer/
│   │   └── SKILL.md              # Pine Script & backtest analysis
│   ├── bias-builder/
│   │   └── SKILL.md              # Multi-timeframe bias construction
│   ├── trade-journal/
│   │   └── SKILL.md              # Journal review & behavioral coaching
│   ├── risk-auditor/
│   │   └── SKILL.md              # Portfolio risk & position sizing
│   ├── pine-engineer/
│   │   └── SKILL.md              # Pine Script development & debugging
│   └── risk-simulator/           # 🆕
│       └── SKILL.md              # Monte Carlo simulation & stress testing
│
├── tools/
│   ├── fetch-market-data.yaml + .js    # Fetch OHLCV from Yahoo Finance (no API key)
│   ├── compute-indicators.yaml + .js   # 11 technical indicators (pure JS, zero deps)
│   └── monte-carlo-simulator.yaml + .js # 🆕 Monte Carlo + crash stress tests (pure JS)
│
├── knowledge/
│   ├── index.yaml                # Knowledge base index
│   └── trading-glossary.md       # ICT/SMC/TA terminology reference (186 lines)
│
├── memory/
│   ├── MEMORY.md                 # Persistent state (trader profile, patterns)
│   └── memory.yaml               # Memory configuration (weekly rotation)
│
├── demo.js                       # Interactive demo — 5 scenarios via gitclaw SDK
├── demo-standalone.js            # 🆕 Standalone demo — live data, no API key needed
└── package.json                  # Dependencies & scripts
```

---

## 🎬 Demo

### With API Key (gitclaw SDK)

```bash
npm install
npm run demo                # Run all 5 demos
npm run demo:strategy       # Strategy analysis
npm run demo:journal        # Trade journal review
npm run demo:risk           # Portfolio risk audit
npm run demo:bias           # Market bias builder
npm run demo:montecarlo     # 🆕 Monte Carlo simulation
```

### Without API Key (Standalone)

```bash
npm run demo:standalone        # AAPL analysis
npm run demo:standalone:btc    # BTC-USD analysis
npm run demo:standalone:spy    # SPY analysis
```

---

## 🛠️ Built-In Tools

### `fetch-market-data` — Zero dependencies, no API key
Fetches historical OHLCV data from Yahoo Finance. Supports stocks, futures, forex, and crypto.

### `compute-indicators` — Zero dependencies
Pure JavaScript implementation of 11 technical indicators:

| Indicator | Parameters |
|-----------|-----------|
| SMA | period |
| EMA | period |
| RSI | period |
| MACD | fast, slow, signal |
| ATR | period |
| Bollinger Bands | period, stddev |
| VWAP | (none) |
| Stochastic | k, d |
| ADX | period |
| OBV | (none) |
| Fibonacci | high, low |

### `monte-carlo-simulator` 🆕 — Zero dependencies
Runs 1,000+ Monte Carlo simulations to quantify forward-looking risk:

| Feature | What It Calculates |
|---------|-------------------|
| **Equity Distribution** | Where your account will likely end up (5th to 95th percentile) |
| **Drawdown Analysis** | Median, 95th, 99th percentile max drawdowns |
| **Risk of Ruin** | Probability of losing X% of your account |
| **Kelly Criterion** | Optimal, half, and quarter Kelly position sizing |
| **Streak Analysis** | Expected longest losing/winning streaks |
| **Crash Stress Tests** | Survival against Flash Crash, COVID, Black Monday scenarios |

All tools are **pure JavaScript with zero external dependencies**, making them fully compatible with WebContainers (clawless).

---

## 🔗 Skill Chaining

TradeMind's skills are designed to compose together:

```
Strategy Analyzer → "57% win rate, 1.8:1 R:R detected"
        │
        ▼
Risk Simulator → "Monte Carlo: 95th percentile DD is 12%, risk of ruin 0%"
        │
        ▼
Risk Auditor → "Quarter Kelly sizing: $125 per trade on $25K account"
        │
        ▼
Bias Builder → "Using these parameters for today's session plan"
        │
        ▼
Trade Journal → "After 20 trades, here's how your actual stats compare to simulation"
```

---

## 🔒 Safety & Ethics

TradeMind takes trading safety seriously:

- ❌ **Never gives financial advice** — analysis only, always disclaimed
- ❌ **Never guarantees outcomes** — probability-based language always
- 🛑 **Flags overleveraging** — if you exceed 2% risk per trade, it will stop and warn you
- 🛑 **Detects emotional trading** — revenge trading, FOMO, and tilt are flagged immediately
- 💚 **Mental health awareness** — if journal entries suggest distress from losses, TradeMind provides crisis resources
- 💚 **Gambling addiction recognition** — patterns suggesting addictive behavior are flagged compassionately

---

## ✅ Validation

```bash
# Validate agent structure
npx @open-gitagent/gitagent validate

# Show agent info
npx @open-gitagent/gitagent info

# Export as system prompt
npx @open-gitagent/gitagent export -f system-prompt
```

---


## 📜 License

MIT — Trade responsibly. This is a tool, not a financial advisor.

---
