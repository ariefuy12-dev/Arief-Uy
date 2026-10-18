import React from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  PieChart,
  Percent
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface SummaryCardsProps {
  totalSaldo: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  onOpenAddModal: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSaldo,
  totalPemasukan,
  totalPengeluaran,
  onOpenAddModal,
}) => {
  const savingsRate =
    totalPemasukan > 0
      ? Math.max(0, Math.round(((totalPemasukan - totalPengeluaran) / totalPemasukan) * 100))
      : 0;

  const isSurplus = totalSaldo >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Sisa Saldo Main Card */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl shadow-emerald-700/20 flex flex-col justify-between relative overflow-hidden group">
        {/* Background Decorative Circles */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition duration-500" />
        <div className="absolute top-2 right-4 text-white/10">
          <Wallet className="w-24 h-24" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-md">
              Sisa Saldo Dompet
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
              isSurplus ? 'bg-emerald-400/20 text-emerald-100' : 'bg-rose-400/30 text-rose-100'
            }`}>
              {isSurplus ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isSurplus ? 'Kondisi Aman' : 'Defisit'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black mt-3 tracking-tight font-mono">
            {formatRupiah(totalSaldo)}
          </h2>
        </div>

        <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-emerald-100/90 relative z-10">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>Tersimpan di perangkat lokal</span>
          </div>
          <button
            onClick={onOpenAddModal}
            className="text-white hover:text-emerald-200 font-semibold underline underline-offset-4 cursor-pointer text-xs"
          >
            + Catat Cepat
          </button>
        </div>
      </div>

      {/* Total Pemasukan Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition duration-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pemasukan
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 font-mono">
              {formatRupiah(totalPemasukan)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Arus Kas Masuk
          </span>
          <span className="text-slate-400">Pemasukan Akumulasi</span>
        </div>
      </div>

      {/* Total Pengeluaran Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-rose-300 transition duration-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 font-mono">
              {formatRupiah(totalPengeluaran)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-rose-500 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Arus Kas Keluar
          </span>
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Percent className="w-3 h-3 text-slate-400" /> Rasio Hemat: {savingsRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
