import React, { useState } from 'react';
import { PieChart, TrendingDown, ArrowUpRight, ArrowDownLeft, BarChart3 } from 'lucide-react';
import { Transaction, KATEGORI_PENGELUARAN } from '../types';
import { formatRupiah, getCategoryColor } from '../utils/formatters';

interface AnalyticsChartsProps {
  transactions: Transaction[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ transactions }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Filter only pengeluaran
  const expenseTransactions = transactions.filter((t) => t.jenis === 'Pengeluaran');
  const totalExpense = expenseTransactions.reduce((acc, curr) => acc + Number(curr.nominal), 0);

  // Group by category
  const categoryTotals: { [category: string]: number } = {};
  expenseTransactions.forEach((t) => {
    categoryTotals[t.kategori] = (categoryTotals[t.kategori] || 0) + Number(t.nominal);
  });

  const categoriesSorted = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
      color: getCategoryColor(name, 'Pengeluaran'),
    }));

  // Calculate SVG donut segments
  const size = 260;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const donutSegments = categoriesSorted.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += (cat.percentage / 100) * circumference;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Calculate Income vs Expense for quick ratio
  const totalIncome = transactions
    .filter((t) => t.jenis === 'Pemasukan')
    .reduce((acc, curr) => acc + Number(curr.nominal), 0);

  const maxCompare = Math.max(totalIncome, totalExpense, 1);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm mb-6 sm:mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <span>Analisis & Grafik Pengeluaran</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Komposisi pengeluaran terdistribusi berdasarkan kategori
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold self-start sm:self-auto">
          {categoriesSorted.length} Kategori Aktif
        </span>
      </div>

      {totalExpense === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-300">
            <PieChart className="w-7 h-7" />
          </div>
          <p className="font-semibold text-slate-600 text-sm">Belum Ada Data Pengeluaran</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Tambahkan catatan pengeluaran Anda untuk melihat diagram proporsi visual di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Donut Chart Visual (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-[240px] h-[240px] sm:w-[260px] sm:h-[260px]">
              <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
                {/* Background Track */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth={strokeWidth}
                />

                {/* Donut Segments */}
                {donutSegments.map((segment) => {
                  const isHovered = hoveredCategory === segment.name;
                  return (
                    <circle
                      key={segment.name}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      strokeLinecap="butt"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(segment.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onTouchStart={() => setHoveredCategory(segment.name)}
                    />
                  );
                })}
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {hoveredCategory || 'Total Keluar'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-800 font-mono mt-0.5">
                  {hoveredCategory
                    ? formatRupiah(categoryTotals[hoveredCategory] || 0)
                    : formatRupiah(totalExpense)}
                </span>
                {hoveredCategory && (
                  <span className="text-xs font-semibold text-emerald-600 mt-0.5">
                    {((categoryTotals[hoveredCategory] / totalExpense) * 100).toFixed(1)}% dari total
                  </span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Sentuh atau arahkan kursor ke segmen untuk melihat detail
            </p>
          </div>

          {/* Category Breakdown Progress Bars (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Rincian Pengeluaran Terbesar
            </h4>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {categoriesSorted.map((cat) => {
                const isHovered = hoveredCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`p-2.5 rounded-2xl border transition duration-200 cursor-pointer ${
                      isHovered
                        ? 'bg-slate-50 border-emerald-300 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          {formatRupiah(cat.amount)}
                        </span>
                        <span className="text-slate-400 font-semibold w-11 text-right">
                          {cat.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Arus Kas Masuk vs Keluar Ratio Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Perbandingan Kas Masuk vs Kas Keluar
          </span>
          <span className="text-slate-500 text-[11px]">
            Masuk: {formatRupiah(totalIncome)} • Keluar: {formatRupiah(totalExpense)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Income Bar */}
          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> Total Masuk
              </span>
              <span className="font-mono font-bold text-emerald-900">
                {formatRupiah(totalIncome)}
              </span>
            </div>
            <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(totalIncome / maxCompare) * 100}%` }}
              />
            </div>
          </div>

          {/* Expense Bar */}
          <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-rose-800 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" /> Total Keluar
              </span>
              <span className="font-mono font-bold text-rose-900">
                {formatRupiah(totalExpense)}
              </span>
            </div>
            <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${(totalExpense / maxCompare) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
