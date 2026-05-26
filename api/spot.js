const TICKERS = [
  'BINANCE:BTCUSDT','BINANCE:ETHUSDT','BINANCE:BNBUSDT','BINANCE:SOLUSDT',
  'BINANCE:XRPUSDT','BINANCE:ADAUSDT','BINANCE:DOGEUSDT','BINANCE:AVAXUSDT',
  'BINANCE:LINKUSDT','BINANCE:DOTUSDT','BINANCE:NEARUSDT','BINANCE:UNIUSDT',
  'BINANCE:LTCUSDT','BINANCE:TRXUSDT','BINANCE:ATOMUSDT',
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const tvRes = await fetch('https://scanner.tradingview.com/crypto/scan', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin':       'https://www.tradingview.com',
        'Referer':      'https://www.tradingview.com/',
        'User-Agent':   'Mozilla/5.0 (compatible)',
      },
      body: JSON.stringify({
        symbols: { tickers: TICKERS },
        columns: ['name','description','close','change','change_abs','volume','high','low'],
      }),
    });

    if (!tvRes.ok) throw new Error(`TradingView returned HTTP ${tvRes.status}`);

    const data = await tvRes.json();
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
};
