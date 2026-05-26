module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, instId } = req.query;
  if (!instId || !type) return res.status(400).json({ error: 'missing params' });

  const safe = encodeURIComponent(instId);
  const endpoints = {
    book:   `https://www.okx.com/api/v5/market/books?instId=${safe}&sz=25`,
    trades: `https://www.okx.com/api/v5/market/trades?instId=${safe}&limit=40`,
    ticker: `https://www.okx.com/api/v5/market/ticker?instId=${safe}`,
  };

  const url = endpoints[type];
  if (!url) return res.status(400).json({ error: 'invalid type' });

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
    });
    if (!r.ok) throw new Error(`OKX ${r.status}`);
    const data = await r.json();
    const ttl = type === 'book' ? 1 : type === 'trades' ? 3 : 5;
    res.setHeader('Cache-Control', `s-maxage=${ttl}, stale-while-revalidate=${ttl * 2}`);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
};
