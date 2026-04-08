/**
 * fetch-market-data.js
 * Fetches OHLCV data using Yahoo Finance API (no API key required)
 * Compatible with Node.js / WebContainers (clawless)
 */

const https = require('https');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'TradeMind/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

const INTERVAL_MAP = {
  '1m': '1m', '5m': '5m', '15m': '15m',
  '1h': '60m', '4h': '60m', '1d': '1d', '1w': '1wk'
};

const PERIOD_MAP = {
  '1d': '1d', '5d': '5d', '1mo': '1mo', '3mo': '3mo',
  '6mo': '6mo', '1y': '1y', '2y': '2y', '5y': '5y',
  '30d': '1mo', '90d': '3mo', '180d': '6mo', '365d': '1y'
};

async function fetchMarketData({ symbol, timeframe, period = '6mo', include_volume = true }) {
  const interval = INTERVAL_MAP[timeframe] || '1d';
  const range = PERIOD_MAP[period] || '6mo';

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`;

  try {
    const data = await fetchJSON(url);
    const result = data.chart?.result?.[0];

    if (!result) {
      return { error: `No data found for symbol: ${symbol}` };
    }

    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};

    const candles = timestamps.map((ts, i) => ({
      timestamp: new Date(ts * 1000).toISOString(),
      open: quotes.open?.[i] || 0,
      high: quotes.high?.[i] || 0,
      low: quotes.low?.[i] || 0,
      close: quotes.close?.[i] || 0,
      ...(include_volume ? { volume: quotes.volume?.[i] || 0 } : {})
    })).filter(c => c.open > 0); // Filter out null candles

    return {
      symbol,
      timeframe,
      candles,
      metadata: {
        total_candles: candles.length,
        date_range: candles.length > 0
          ? `${candles[0].timestamp} to ${candles[candles.length - 1].timestamp}`
          : 'N/A',
        source: 'Yahoo Finance'
      }
    };
  } catch (error) {
    return { error: `Failed to fetch data: ${error.message}` };
  }
}

// CLI execution
if (require.main === module) {
  const input = JSON.parse(process.argv[2] || '{}');
  fetchMarketData(input)
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(err => console.error(JSON.stringify({ error: err.message })));
}

module.exports = { fetchMarketData };
