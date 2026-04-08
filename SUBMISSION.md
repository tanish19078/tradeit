# 🏆 GitAgent Hackathon — Submission

---

## 1. Project Title

**TradeMind — AI Trading Strategy Analyst**

---

## 2. Project Description

TradeMind is an AI-powered trading strategy analyst built on the [gitagent](https://github.com/open-gitagent/gitagent) standard. It lives inside your git repository and acts as your personal **strategy analyst, risk auditor, trade journal coach, Monte Carlo simulator, and Pine Script engineer** — all version-controlled, transparent, and fully yours.

### What makes it unique:
- **6 specialized skills**: Strategy Analyzer, Bias Builder, Trade Journal, Risk Auditor, Pine Engineer, and Risk Simulator — each with deep, structured prompts and real-world trading workflows.
- **3 pure-JavaScript tools** (zero external dependencies): `fetch-market-data` (Yahoo Finance OHLCV), `compute-indicators` (11 technical indicators), and `monte-carlo-simulator` (1,000+ simulation runs with crash stress tests).
- **Skill chaining**: Skills compose together — analyze a strategy → simulate its forward risk → calculate position sizing → build a session plan → review journal performance.
- **Safety-first design**: Never gives financial advice, flags overleveraging, detects emotional/revenge trading, and includes mental health awareness for trading losses.
- **Fully clawless-compatible**: All tools run in WebContainers with zero native dependencies.
- **Standalone demo**: A live-data demo (`demo-standalone.js`) that works **without any API key**, fetching real market data and computing indicators in the terminal.

---

## 3. Link to Public GitHub Repository

> **Repository:** `https://github.com/TanishSingla/trademind`

*(Update this link to your actual public GitHub repo URL before submitting)*

---

## 4. Demo Video (2–5 min)

> **Video Link:** `https://youtu.be/YOUR_VIDEO_LINK_HERE`

*(Record and upload a 2–5 minute demo video showing TradeMind in action. Suggested flow:)*
1. Show the repo structure and `agent.yaml`
2. Run `node demo-standalone.js AAPL 3mo` — live market data analysis without API key
3. Run `npm run demo:strategy` — strategy analysis via gitclaw SDK
4. Run `npm run demo:montecarlo` — Monte Carlo simulation
5. Highlight skill chaining, safety rules, and zero-dependency tools

---

## 5. List of GitAgent Features, Tools, and Frameworks Used

### GitAgent Features
- **agent.yaml** — Full agent manifest with model config, skills, tools, tags, and metadata
- **SOUL.md** — Rich personality definition (veteran trading strategist with 15+ years experience)
- **RULES.md** — Hard safety rules (risk-first, no financial advice, emotional trading detection)
- **CLAUDE.md** — Claude Code integration instructions
- **memory/** — Persistent memory system with weekly rotation (`MEMORY.md` + `memory.yaml`)
- **knowledge/** — Domain knowledge base with indexed trading glossary (186 terms covering ICT/SMC/TA)
- **Skill chaining** — 6 skills designed to compose and feed into each other
- **clawless compatibility** — Zero-dependency tools for WebContainer execution

### Skills (6)
| # | Skill | Description |
|---|-------|-------------|
| 1 | `strategy-analyzer` | Reviews Pine Script strategies, detects overfitting, evaluates statistical edge |
| 2 | `bias-builder` | Constructs daily/weekly market bias with multi-timeframe analysis & scenario planning |
| 3 | `trade-journal` | Reviews journal entries, detects emotional patterns, scores rule adherence |
| 4 | `risk-auditor` | Audits portfolio exposure, position sizing, correlation risk, Kelly criterion |
| 5 | `pine-engineer` | Writes, debugs, and optimizes TradingView Pine Script v5/v6 code |
| 6 | `risk-simulator` | Monte Carlo simulation — drawdown distributions, stress tests, ruin probability |

### Tools (3)
| # | Tool | Description |
|---|------|-------------|
| 1 | `fetch-market-data` | Fetches OHLCV data from Yahoo Finance — stocks, futures, forex, crypto — no API key needed |
| 2 | `compute-indicators` | Pure JS implementation of 11 technical indicators (SMA, EMA, RSI, MACD, ATR, Bollinger, VWAP, Stochastic, ADX, OBV, Fibonacci) |
| 3 | `monte-carlo-simulator` | 1,000+ Monte Carlo simulations with equity distribution, drawdown analysis, risk of ruin, Kelly criterion, streak analysis, and crash stress tests |

### Frameworks & Technologies
- **gitagent spec v0.1.0** — Agent manifest standard
- **gitclaw** — CLI and SDK for running the agent
- **clawless / ClawContainer** — Serverless WebContainer execution
- **Pure JavaScript** — All tools have zero external dependencies
- **Yahoo Finance** — Free market data source (no API key required)
- **Claude claude-sonnet-4-5-20250929** — Preferred LLM (with GPT-4o and Gemini 2.5 Pro fallbacks)

---

## 6. Clear Instructions to Run or Test Locally

### Prerequisites
- **Node.js** v18+ installed
- **npm** installed

### Setup

```bash
# Clone the repository
git clone https://github.com/TanishSingla/trademind.git
cd trademind

# Install dependencies
npm install
```

### Option A: Standalone Demo (No API Key Required) ⭐

```bash
# Analyze AAPL with live market data
node demo-standalone.js AAPL 3mo

# Analyze other symbols
node demo-standalone.js TSLA 6mo
node demo-standalone.js BTC-USD 1y
node demo-standalone.js SPY 3mo

# Or use npm scripts
npm run demo:standalone         # AAPL
npm run demo:standalone:btc     # BTC-USD
npm run demo:standalone:spy     # SPY
```

This fetches live OHLCV data, computes 9 technical indicators, generates a bias assessment, position sizing calculations, and Fibonacci levels — all in the terminal, no API key needed.

### Option B: Full Agent Demo (Requires API Key)

```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY="sk-ant-..."     # Linux/Mac
set ANTHROPIC_API_KEY=sk-ant-...          # Windows CMD
$env:ANTHROPIC_API_KEY="sk-ant-..."       # Windows PowerShell

# Run all 5 demos
npm run demo

# Or run individual demos
npm run demo:strategy       # Strategy analysis
npm run demo:journal        # Trade journal review
npm run demo:risk           # Portfolio risk audit
npm run demo:bias           # Market bias builder
npm run demo:montecarlo     # Monte Carlo simulation
```

### Option C: CLI with gitclaw

```bash
# Install gitclaw globally
npm install -g gitclaw

# Run TradeMind from the repo directory
gitclaw --dir . "Review my EMA crossover strategy for overfitting"
gitclaw --dir . "Simulate 1000 Monte Carlo runs on my 55% win rate strategy"
gitclaw --dir . "What's my directional bias for ES tomorrow?"
```

### Validate Agent Structure

```bash
npx @open-gitagent/gitagent validate
npx @open-gitagent/gitagent info
```

---

*Built by [Tanish Singla](https://github.com/TanishSingla) for the GitAgent Hackathon*
