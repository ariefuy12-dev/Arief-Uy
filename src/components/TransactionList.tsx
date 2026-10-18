import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Trash2,
  Edit2,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Transaction, KATEGORI_PENGELUARAN, KATEGORI_PEMASUKAN } from '../types';
import { formatRupiah, formatDateID } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  onOpenAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('Semua');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterPeriode, setFilterPeriode] = useState<'semua' | 'bulan' | 'minggu' | 'hari'>('semua');
  const [sortBy, setSortBy] = useState<'terbaru' | 'terlama' | 'terbesar'>('terbaru');
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // All combined categories for filter
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    KATEGORI_PENGELUARAN.forEach((k) => set.add(k.name));
    KATEGORI_PEMASUKAN.forEach((k) => set.add(k.name));
    return Array.from(set);
  }, []);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Current month prefix YYYY-MM
    const currentMonthPrefix = todayStr.substring(0, 7);

    // 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    return transactions
      .filter((t) => {
        // Jenis match
        if (filterJenis !== 'Semua' && t.jenis !== filterJenis) return false;

        // Kategori match
        if (filterKategori !== 'Semua' && t.kategori !== filterKategori) return false;

        // Search match
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchKet = t.keterangan.toLowerCase().includes(q);
          const matchKat = t.kategori.toLowerCase().includes(q);
          const matchMet = (t.metode || '').toLowerCase().includes(q);
          if (!matchKet && !matchKat && !matchMet) return false;
        }

        // Period filter
        if (filterPeriode === 'hari') {
          return t.tanggal === todayStr;
        } else if (filterPeriode === 'minggu') {
          return t.tanggal >= sevenDaysAgoStr;
        } else if (filterPeriode === 'bulan') {
          return t.tanggal.startsWith(currentMonthPrefix);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'terbaru') {
          return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
        } else if (sortBy === 'terlama') {
          return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
        } else if (sortBy === 'terbesar') {
          return b.nominal - a.nominal;
        }
        return 0;
      });
  }, [transactions, search, filterJenis, filterKategori, filterPeriode, sortBy]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-12">
      {/* Header & Filter Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <span>Riwayat Transaksi Keuangan</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Menampilkan {filteredTransactions.length} dari total {transactions.length} transaksi
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="self-start sm:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <span>+ Tambah Transaksi</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari transaksi..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Filter Jenis */}
          <div className="relative">
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition appearance-none cursor-pointer"
            >
              <option value="Semua">Semua Arus Kas</option>
              <option value="Pemasukan">Pemasukan Saja (+)</option>
              <option value="Pengeluaran">Pengeluaran Saja (-)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter Kategori */}
          <div className="relative">
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition appearance-none cursor-pointer"
            >
              <option value="Semua">Semua Kategori</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition appearance-none cursor-pointer"
            >
              <option value="terbaru">Urutkan: Tanggal Terbaru</option>
              <option value="terlama">Urutkan: Tanggal Terlama</option>
              <option value="terbesar">Urutkan: Nominal Terbesar</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Quick Period Filters */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Periode:
          </span>
          {(['semua', 'bulan', 'minggu', 'hari'] as const).map((p) => {
            const labels = {
              semua: 'Semua Waktu',
              bulan: 'Bulan Ini',
              minggu: '7 Hari Terakhir',
              hari: 'Hari Ini',
            };
            const active = filterPeriode === p;
            return (
              <button
                key={p}
                onClick={() => setFilterPeriode(p)}
                className={`px-3 py-1 rounded-xl font-medium transition whitespace-nowrap ${
                  active
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-3 text-slate-300">
            <Receipt className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-700 text-base mb-1">
            Tidak Ada Catatan Transaksi
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {transactions.length === 0
              ? 'Mulai catat pengeluaran dan pemasukan harian Anda sekarang.'
              : 'Tidak ada transaksi yang cocok dengan kata kunci atau filter yang Anda pilih.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition inline-flex items-center gap-1.5 shadow-sm"
          >
            + Catat Transaksi Baru
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-6">Tanggal</th>
                  <th className="py-3 px-6">Keterangan</th>
                  <th className="py-3 px-6">Kategori</th>
                  <th className="py-3 px-6">Dompet</th>
                  <th className="py-3 px-6 text-center">Jenis</th>
                  <th className="py-3 px-6 text-right">Nominal</th>
                  <th className="py-3 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.map((t) => {
                  const isMasuk = t.jenis === 'Pemasukan';
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/80 transition duration-150 group"
                    >
                      <td className="py-3.5 px-6 whitespace-nowrap text-slate-500 font-medium">
                        {formatDateID(t.tanggal)}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-800">
                        {t.keterangan}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl text-[11px] font-medium border border-slate-200/60">
                          {t.kategori}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap text-slate-500">
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {t.metode || 'Tunai'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center whitespace-nowrap">
                        <span
                          className={`inline-block border text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isMasuk
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {t.jenis}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-6 text-right whitespace-nowrap font-mono font-bold text-sm ${
                          isMasuk ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {isMasuk ? '+ ' : '- '}
                        {formatRupiah(t.nominal)}
                      </td>
                      <td className="py-3.5 px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEdit(t)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                            title="Ubah"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidateId(t.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Optimized for Smartphone Screens) */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredTransactions.map((t) => {
              const isMasuk = t.jenis === 'Pemasukan';
              return (
                <div
                  key={t.id}
                  className="p-4 flex items-center justify-between gap-3 active:bg-slate-50 transition"
                >
                  {/* Left Icon + Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isMasuk
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}
                    >
                      {isMasuk ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                        {t.keterangan}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>{formatDateID(t.tanggal)}</span>
                        <span>•</span>
                        <span className="text-slate-600 font-medium truncate">{t.kategori}</span>
                        {t.metode && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 font-semibold">{t.metode}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Nominal & Action Buttons */}
                  <div className="text-right shrink-0 flex flex-col items-end">
                    <span
                      className={`font-mono font-bold text-xs sm:text-sm ${
                        isMasuk ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isMasuk ? '+' : '-'} {formatRupiah(t.nominal)}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        title="Ubah"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidateId(t.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">Hapus Transaksi?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Catatan transaksi ini akan dihapus dari penyimpanan lokal Anda.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (deleteCandidateId) {
                    onDelete(deleteCandidateId);
                    setDeleteCandidateId(null);
                  }
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
