import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const idr = (n) => n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

function impermanentLossRatio(priceRatio){
  if(!priceRatio || priceRatio <= 0) return 0;
  const r = priceRatio;
  const il = (2 * Math.sqrt(r)) / (1 + r) - 1;
  return Math.max(0, -il);
}

const volumeData = [
  { day: 'Senin', volume: 180 },
  { day: 'Selasa', volume: 220 },
  { day: 'Rabu', volume: 300 },
  { day: 'Kamis', volume: 250 },
  { day: 'Jumat', volume: 400 },
  { day: 'Sabtu', volume: 350 },
  { day: 'Minggu', volume: 420 },
];

export default function Home() {
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

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 via-fuchsia-600/5 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-4xl md:text-5xl font-extrabold leading-tight">
              Dapatkan <span className="text-emerald-400">Income</span> dari Menjadi Liquidity Provider di Solana
            </motion.h1>
            <p className="mt-4 text-neutral-300">
              Lupakan trading memecoin yang berisiko tinggi. Jadilah Liquidity Provider dengan risiko yang lebih minim dan pendapatan dari fee swap.
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

          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.6, delay:0.1}} className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl" id="calculator">
            <h3 className="text-lg font-semibold">Simulasi Bulanan</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm text-neutral-300">Modal (IDR)</label>
                <input type="range" min={500000} max={10000000} value={capital} onChange={(e)=>setCapital(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-neutral-400"><span>500K</span><span>10jt</span></div>
                <div className="mt-1 text-emerald-400 font-semibold">{idr(capital)}</div>
              </div>
              <div>
                <label className="text-sm text-neutral-300">APR Dasar (%)</label>
                <input type="range" min={5} max={60} value={apy} onChange={(e)=>setApy(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-neutral-400"><span>5%</span><span>60%</span></div>
                <div className="mt-1">{apy}%/tahun</div>
              </div>
              <div>
                <label className="text-sm text-neutral-300">Fee & Reward (APR %)</label>
                <input type="range" min={0} max={50} value={feeApr} onChange={(e)=>setFeeApr(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-neutral-400"><span>0%</span><span>50%</span></div>
                <div className="mt-1">{feeApr}%/tahun</div>
              </div>
              <div>
                <label className="text-sm text-neutral-300">Perubahan Harga Aset (%)</label>
                <input type="range" min={-50} max={100} value={priceChangePct} onChange={(e)=>setPriceChangePct(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-neutral-400"><span>-50%</span><span>+100%</span></div>
                <div className="mt-1">{priceChangePct}% selama {months} bulan</div>
              </div>
              <div>
                <label className="text-sm text-neutral-300">Durasi (bulan)</label>
                <input type="range" min={1} max={24} value={months} onChange={(e)=>setMonths(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-neutral-400"><span>1</span><span>24</span></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-neutral-800 p-3">
                  <div className="text-xs text-neutral-400">Estimasi Income/Bulan</div>
                  <div className="text-2xl font-extrabold text-emerald-400">{idr(netEst1m)}</div>
                </div>
                <div className="rounded-2xl bg-neutral-800 p-3">
                  <div className="text-xs text-neutral-400">Perkiraan IL (total)</div>
                  <div className="text-xl font-bold">{idr(ilCost)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="benefits" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Kenapa Memilih Menjadi Liquidity Provider?</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {t:'Pendapatan dari Fee', d:'Dapatkan bagian dari biaya transaksi setiap kali ada swap di pool tempat Anda menyetor likuiditas.'},
            {t:'Diversifikasi Strategi', d:'Tidak mengandalkan timing pasar seperti trading memecoin; fokus pada yield & manajemen risiko.'},
            {t:'Panduan Praktis', d:'Ikuti langkah-langkah jelas: memilih pool yang ramai, menghindari token scam, dan cara meminimalkan impermanent loss.'},
          ].map((b,i)=> (
            <motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.05*i}} className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 mb-3" />
              <h3 className="font-semibold">{b.t}</h3>
              <p className="mt-2 text-neutral-300 text-sm">{b.d}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-xs text-neutral-400">Catatan: Menjadi LP tetap mengandung risiko. Produk ini bersifat edukasi, bukan ajakan/anjuran investasi, dan tidak menjanjikan profit.</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Volume Memecoin di Solana</h2>
        <p className="mt-4 text-neutral-300 max-w-3xl">
          Ratusan juta USD volume harian memecoin terjadi di blockchain Solana. Dengan biaya transaksi yang murah dan ekosistem DEX yang berkembang pesat, Solana menjadi tempat favorit untuk trading memecoin. Hal ini menciptakan peluang besar bagi Liquidity Provider untuk mendapatkan fee dari setiap swap yang terjadi.
        </p>
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-neutral-300 max-w-3xl">
          Menjadi LP di Solana berarti Anda berpartisipasi di ekosistem dengan volume tinggi. Semakin ramai pool, semakin besar potensi pendapatan dari biaya transaksi. Inilah alasan utama mengapa Solana adalah pilihan tepat untuk memaksimalkan strategi LP Anda.
        </p>
      </section>

      <section id="curriculum" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Apa yang Akan Anda Pelajari</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <ul className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 space-y-3 text-sm">
            <li>✅ Dasar-dasar AMM & pool di Solana</li>
            <li>✅ Cara memilih pool dengan volume tinggi</li>
            <li>✅ Menghindari impermanent loss berlebih</li>
            <li>✅ Mendeteksi token scam & menjaga modal</li>
            <li>✅ Tools eksekusi di ekosistem Solana (DEX, analytics, wallet)</li>
            <li>✅ Step-by-step setup & monitoring</li>
          </ul>
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="font-semibold">Bonus</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>🎁 Akses Grup Telegram private</li>
              <li>🎁 Update rutin tentang pool menarik</li>
              <li>🎁 Checklist siap pakai</li>
            </ul>
            <a href="#checkout" className="mt-6 inline-flex rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-neutral-900 hover:bg-emerald-400">Ambil Paket</a>
          </div>
        </div>
      </section>

      <section id="checkout" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Paket All-in-One</h2>
        <div className="mt-6 grid md:grid-cols-1 gap-6">
          <div className="rounded-3xl border border-emerald-500/50 bg-neutral-900/90 p-6 flex flex-col">
            <div className="mb-2 text-xs font-semibold text-emerald-400">Diskon Spesial</div>
            <div className="text-lg font-semibold">All in One</div>
            <div className="mt-1 text-3xl font-extrabold">{idr(200000)}</div>
            <div className="mt-1 text-sm line-through text-neutral-500">{idr(500000)}</div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>• E-book lengkap</li>
              <li>• Akses Grup Telegram Private</li>
              <li>• Monitoring & update strategi</li>
            </ul>
            <a href="https://t.me/ashitherewego" className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold bg-emerald-500 text-neutral-900 hover:bg-emerald-400">Gabung via Telegram</a>
          </div>
        </div>
        <p className="mt-4 text-xs text-neutral-400">Pembelian dilakukan dengan menghubungi akun Telegram @ashitherewego.</p>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Pertanyaan Umum</h2>
        <div className="mt-6 space-y-4">
          <Faq q="Apakah pasti dapat Income tiap bulan?" a="Tidak ada jaminan profit. Hasil bergantung pada modal, kondisi pasar, strategi, dan eksekusi." />
          <Faq q="Apakah menjadi LP tanpa risiko?" a="Tidak. Risiko utama termasuk impermanent loss, fluktuasi yield, risiko protokol/kontrak pintar, dan volatilitas aset. Materi membantu mengenali dan mengelolanya." />
          <Faq q="Apa saja yang saya dapatkan?" a="Anda mendapat e-book, akses grup Telegram, monitoring, panduan memilih pool ramai, cara menghindari impermanent loss, serta menghindari token scam." />
          <Faq q="Bagaimana cara bergabung ke grup?" a="Setelah melakukan pembayaran/konfirmasi ke Telegram @ashitherewego, Anda akan langsung diberikan link ke grup private." />
          <Faq q="Apakah ada refund?" a="Tidak ada kebijakan refund." />
        </div>
        <p className="mt-6 text-xs text-neutral-400">Disclaimer: Konten untuk tujuan edukasi. Bukan nasihat keuangan atau ajakan membeli aset kripto.</p>
      </section>

      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-neutral-400">
          <div className="font-semibold text-neutral-200">LP Memecoin Class</div>
          <p className="mt-2">Edukasi praktis untuk mendapatkan Income sebagai Liquidity Provider di blockchain Solana.</p>
          <p className="mt-2">Kontak Telegram: @ashitherewego</p>
        </div>
      </footer>
    </div>
  );
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
