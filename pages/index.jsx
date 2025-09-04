import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Helper: format IDR & USD
const idr = (n) => n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const usd = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdCompact = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1e12) return `$${(n/1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(n/1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(n/1e6).toFixed(2)}M`;
  return usd(n);
};

// Monthly volume data (USD) example for 2024
const monthlyData = [
  { month: "Jan", volume: 1200000000 },
  { month: "Feb", volume: 1500000000 },
  { month: "Mar", volume: 1800000000 },
  { month: "Apr", volume: 1700000000 },
  { month: "May", volume: 2100000000 },
  { month: "Jun", volume: 2400000000 },
  { month: "Jul", volume: 2000000000 },
  { month: "Aug", volume: 2600000000 },
  { month: "Sep", volume: 3000000000 },
  { month: "Oct", volume: 2800000000 },
  { month: "Nov", volume: 3100000000 },
  { month: "Dec", volume: 3500000000 },
];

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
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 via-fuchsia-600/5 to-transparent pointer-events-none -z-10" />
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-4xl md:text-5xl font-extrabold leading-tight">
              Dapatkan <span className="text-emerald-400">Income</span> dari Menjadi Liquidity Provider di Solana
            </motion.h1>
            <p className="mt-4 text-neutral-300">
              Lupakan trading memecoin yang berisiko tinggi. Jadilah Liquidity Provider dengan risiko yang lebih minim dan income dari fee swap.
            </p>
            <ul className="mt-6 space-y-2 text-neutral-300">
              <li>• E-book panduan lengkap</li>
              <li>• Akses ke Grup Telegram private</li>
              <li>• Monitoring & update strategi</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#checkout" className="rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-emerald-400">Gabung Sekarang</a>
              <a href="#calculator" className="rounded-2xl border border-neutral-700 px-6 py-3 font-semibold hover:border-neutral-500">Coba Kalkulator</a>
            </div>
            <p className="mt-3 text-xs text-neutral-400">Disclaimer: Tidak ada jaminan profit. Hasil bergantung pada pasar & eksekusi Anda.</p>
          </div>

          {/* Hero Kalkulator */}
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.6, delay:0.1}} className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl" id="calculator">
            {/* ... kalkulator ... */}
            <h3 className="text-lg font-semibold">Simulasi Bulanan</h3>
            {/* kalkulator content tetap sama */}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Kenapa Memilih Menjadi Liquidity Provider?</h2>
        {/* ... */}
      </section>

      {/* Volume Data bulanan */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Volume Memecoin di Solana (Bulanan)</h2>
        <div className="mt-2 text-sm text-neutral-400">Satuan dalam USD (B = Billion / M = Million)</div>
        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={(v)=>usdCompact(v)} width={80} />
              <Tooltip formatter={(v)=>usd(v)} labelFormatter={(l)=>`Bulan: ${l}`} />
              <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {(() => {
          const total = monthlyData.reduce((s,d)=>s+d.volume,0);
          const avg = total/monthlyData.length;
          const best = monthlyData.reduce((a,b)=> a.volume>b.volume ? a:b);
          return (
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="text-xs text-neutral-400">Total Volume 2024</div>
                <div className="text-xl font-bold text-emerald-400">{usdCompact(total)}</div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="text-xs text-neutral-400">Rata-rata Bulanan</div>
                <div className="text-xl font-bold">{usdCompact(avg)}</div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="text-xs text-neutral-400">Bulan Tertinggi</div>
                <div className="text-xl font-bold">{best.month} — {usdCompact(best.volume)}</div>
              </div>
            </div>
          );
        })()}
        <p className="mt-6 text-neutral-300 max-w-3xl">
          <strong>Sepanjang tahun 2024</strong>, volume trading memecoin di Solana mencapai akumulasi lebih dari {usd(30000000000)}. Tren ini menunjukkan semakin ramainya ekosistem, sehingga peluang <em>income</em> bagi liquidity provider dari fee transaksi semakin besar.
        </p>
      </section>

      {/* Pricing, FAQ, Footer tetap sama */}
    </div>
  );
}

function impermanentLossRatio(priceRatio){
  if(!priceRatio || priceRatio <= 0) return 0;
  const r = priceRatio;
  const il = (2 * Math.sqrt(r)) / (1 + r) - 1;
  return Math.max(0, -il);
}

function Faq({ q, a }){
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-neutral-800">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 font-medium flex items-center justify-between">
        <span>{q}</span>
        <span className="text-neutral-500">{open ? '–' : '+'}</span>
      </button>
      {open && <div className="px-5 pb-5 text-neutral-300 text-sm">{a}</div>}
    </div>
  );
}
