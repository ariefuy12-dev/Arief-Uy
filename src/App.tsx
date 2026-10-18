/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  RotateCcw,
  Smartphone,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  WifiOff
} from 'lucide-react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { BudgetTracker } from './components/BudgetTracker';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { ApkGuideModal } from './components/ApkGuideModal';
import { BottomNav } from './components/BottomNav';
import { Transaction, BudgetGoal } from './types';
import { exportToCSV, exportToJSON } from './utils/formatters';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const STORAGE_KEY = 'dompetku_transactions';
const BUDGET_KEY = 'dompetku_budget';

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: 'Gaji Bulanan',
    kategori: 'Gaji',
    jenis: 'Pemasukan',
    nominal: 5000000,
    metode: 'BCA',
  },
  {
    id: 'tx-2',
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: 'Belanja Mingguan Supermarket',
    kategori: 'Belanja',
    jenis: 'Pengeluaran',
    nominal: 450000,
    metode: 'GoPay',
  },
  {
    id: 'tx-3',
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: 'Makan Malam Resto',
    kategori: 'Makanan & Minuman',
    jenis: 'Pengeluaran',
    nominal: 125000,
    metode: 'Tunai',
  },
  {
    id: 'tx-4',
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: 'Beli Kuota Internet & Listrik',
    kategori: 'Tagihan & Utilitas',
    jenis: 'Pengeluaran',
    nominal: 200000,
    metode: 'Dana',
  },
];

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return SAMPLE_TRANSACTIONS;
  });

  const [budget, setBudget] = useState<BudgetGoal>(() => {
    try {
      const saved = localStorage.getItem(BUDGET_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      monthlyLimit: 3000000,
      enabled: true,
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'beranda' | 'statistik' | 'transaksi'>('beranda');

  const statsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  }, [budget]);

  // Aggregate calculations
  const { totalSaldo, totalPemasukan, totalPengeluaran } = useMemo(() => {
    let masuk = 0;
    let keluar = 0;
    transactions.forEach((t) => {
      if (t.jenis === 'Pemasukan') {
        masuk += Number(t.nominal);
      } else if (t.jenis === 'Pengeluaran') {
        keluar += Number(t.nominal);
      }
    });
    return {
      totalSaldo: masuk - keluar,
      totalPemasukan: masuk,
      totalPengeluaran: keluar,
    };
  }, [transactions]);

  // Handlers
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id'>,
    idToEdit?: string
  ) => {
    if (idToEdit) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === idToEdit ? { ...txData, id: idToEdit } : t))
      );
    } else {
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
    setEditingTransaction(null);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetData = () => {
    setTransactions([]);
    setIsResetConfirmOpen(false);
  };

  const handleLoadSampleData = () => {
    setTransactions(SAMPLE_TRANSACTIONS);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          setTransactions(parsed);
          alert('Berhasil mengimpor transaksi!');
        } else if (parsed && Array.isArray(parsed.transactions)) {
          setTransactions(parsed.transactions);
          if (parsed.budget) setBudget(parsed.budget);
          alert('Berhasil memulihkan cadangan Dompetku!');
        } else {
          alert('Format berkas JSON cadangan tidak valid.');
        }
      } catch {
        alert('Gagal memproses file JSON cadangan.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Scroll to section for mobile bottom nav
  const handleSelectTab = (tab: 'beranda' | 'statistik' | 'transaksi') => {
    setActiveTab(tab);
    if (tab === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'statistik' && statsRef.current) {
      statsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'transaksi' && listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-emerald-500 selection:text-white pb-20 md:pb-6">
      {/* Top Navbar */}
      <Header
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onExportCSV={() => exportToCSV(transactions)}
        onExportJSON={() => exportToJSON(transactions, budget)}
        onImportJSON={handleImportJSON}
        onResetData={() => setIsResetConfirmOpen(true)}
        onLoadSampleData={handleLoadSampleData}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 w-full flex-grow">
        
        {/* Banner Quick PWA / APK Conversion Banner */}
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-md border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  Jadikan Aplikasi Android (APK)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold text-[10px] uppercase">
                  Siap Pasang
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Pasang langsung ke ponsel via WebAPK Android tanpa buka Play Store, bekerja 100% offline, atau unduh berkas .apk mandiri.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {isInstallable && (
              <button
                onClick={() => install()}
                className="flex-1 sm:flex-initial py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-bold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pasang Sekarang</span>
              </button>
            )}
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="flex-1 sm:flex-initial py-2.5 px-4 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs rounded-2xl transition border border-white/20 flex items-center justify-center gap-1.5"
            >
              <span>Panduan APK</span>
            </button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <SummaryCards
          totalSaldo={totalSaldo}
          totalPemasukan={totalPemasukan}
          totalPengeluaran={totalPengeluaran}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
        />

        {/* Budget Limit Tracker */}
        <BudgetTracker
          budget={budget}
          currentExpense={totalPengeluaran}
          onUpdateBudget={setBudget}
        />

        {/* Visual Analytics Chart */}
        <div ref={statsRef}>
          <AnalyticsCharts transactions={transactions} />
        </div>

        {/* Transaction History & Records */}
        <div ref={listRef}>
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onOpenAddModal={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-600">
            © Dompetku APK - Aplikasi Pembukuan & Manajemen Keuangan Pribadi
          </p>
          <p className="text-[11px] text-slate-400">
            Privasi Aman: Semua data transaksi tersimpan 100% di penyimpanan lokal perangkat HP Anda.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsModalOpen(true);
        }}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Modal Tambah / Ubah Transaksi */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />

      {/* Modal Panduan & Download APK */}
      <ApkGuideModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Modal Konfirmasi Reset Semua Data */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">Reset Semua Data?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Seluruh catatan riwayat pengeluaran dan pemasukan akan dihapus permanen dari perangkat ini. Pastikan Anda sudah mengekspor cadangan terlebih dahulu jika diperlukan.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-xs transition"
              >
                Batal
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs transition shadow-md shadow-rose-600/20"
              >
                Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
