export default async function handler(req, res) {
  try {
    const r = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana', {
      // Hindari cache agresif di edge
      headers: { 'User-Agent': 'lp-memecoin-class' },
      next: { revalidate: 60 }, // cache 60s di Vercel
    });
    if (!r.ok) return res.status(r.status).json({ error: 'upstream_not_ok' });

    const data = await r.json();
    const pairs = (data?.pairs || [])
      .filter(p => p?.volume?.h24)
      .sort((a,b)=> (b.volume.h24||0) - (a.volume.h24||0))
      .slice(0, 8);

    return res.status(200).json({ pairs });
  } catch (e) {
    return res.status(500).json({ error: 'proxy_failed', message: String(e) });
  }
}
