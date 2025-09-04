# Write a fully updated pages/index.jsx that matches the user's latest requirements
from pathlib import Path
base = Path("/mnt/data")
proj = base / "lp-memecoin-class-updates"
proj.mkdir(exist_ok=True)
pages = proj / "pages"
pages.mkdir(exist_ok=True)

index_code = r"""import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// Helper: format IDR
const idr = (n) => n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

// Impermanent Loss formula (simplified)
function impermanentLossRatio(priceRatio){
  if(!priceRatio || priceRatio <= 0) return 0;
  const r = priceRatio;
  const il = (2 * Math.sqrt(r)) / (1 + r) - 1;
  return Math.max(0, -il);
}

// === Real-time Volume from Dexscreener (Solana) ===
function LiveVolume(){
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [pairs, setPairs] = React.useState([]);

  React.useEffect(()=>{
    async function run(){
      try{
        const res = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana');
        if(!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const list = data?.pairs || [];
        const top = list
          .filter(p => p?.volume?.h24)
          .sort((a,b)=> (b.volume.h24||0) - (a.volume.h24||0))
          .slice(0, 8);
        setPairs(top);
      }catch(e){ setError(e.message); }
      finally{ setLoading(false); }
    }
    run();
  },[]);

  if (loading) return <div className="mt-6 text-neutral-400">Memuat data volume dari DEX Solana…</div>;
  if (error)   return <div className="mt-6 text-red-400">Gagal memuat data: {String(error)}</div>;

  const total24h = pairs.reduce((sum,p)=> sum + (p?.volume?.h24 || 0), 0);

  return (
    <div className="mt-6">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="text-sm text-neutral-300">Perkiraan Total Volume 24 jam (Top 8 Pairs)</div>
        <div className="text-3xl font-extrabold text-emerald-400">
          {total24h.toLocaleString('en-US', { style:'currency', currency:'USD', maximumFractionDigits: 0 })}
        </div>
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {pairs.map((p, i)=> (
            <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <div className="text-sm font-semibold">{p.baseToken?.symbol} / {p.quoteToken?.symbol}</div>
              <div className="text-xs text-neutral-400 truncate">{p.dexId} • {p.chainId}</div>
              <div className="mt-2 text-neutral-300 text-sm">
                Vol 24h: {(p.volume?.h24||0).toLocaleString('en-US', { style:'currency', currency:'USD', maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-neutral-400">Tx 24h: {(p.txns?.h24?.buys||0) + (p.txns?.h24?.sells||0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  // Kalkulator states
  const [capital, setCapital] = useState(1500000); // IDR
  const [apy, setApy] = useState(24); // % APR
  const [months, setMonths] = useState(12);
  const [priceChangePct, setPriceChangePct] = useState(15);
  const [feeApr, setFeeApr] = useState(12);

  const monthlyRate = useMemo(() => (apy + feeApr) / 12 / 100, [apy, feeApr]);
  const estMonthly = useMemo(() => capital * monthlyRate, [capital, monthlyRate]);
  const ilFraction = useMemo(() => impermanentLossRatio(1 + priceChangePct/100), [priceChangePct]);
  const ilCost = useMemo(() => capital * ilFraction, [capital, ilFraction]);
  const netEst1m = useMemo(() => Math.max(0, estMonthly - (ilCost/months)), [estMonthly, ilCost, months]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-neutral-950/70 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500" />
            <span className="font-semibold tracking-wide">LP Memecoin Class</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#benefits" className="hover:text-white">Manfaat</a>
            <a href="#calculator" className="hover:text-white">Kalkulator</a>
            <a href="#curriculum" className="hover:text-white">Materi</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <a href="#checkout" className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 font-semibold hover:bg-emerald-400 text-neutral-900">Gabung Sekarang</a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 via-fuchsia-600/5 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{opacity:0,y:
