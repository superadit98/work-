import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

// Helper: format IDR
const idr = (n) => n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

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
            <h3 className="text-lg font-semibold">Simulasi Bulanan</h3>
            {/* kalkulator content */}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Kenapa Memilih Menjadi Liquidity Provider?</h2>
        {/* ... */}
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
