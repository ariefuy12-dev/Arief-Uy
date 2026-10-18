import React from 'react';
import {
  Home,
  PieChart,
  Plus,
  Receipt,
  Smartphone
} from 'lucide-react';

interface BottomNavProps {
  activeTab: 'beranda' | 'statistik' | 'transaksi';
  onSelectTab: (tab: 'beranda' | 'statistik' | 'transaksi') => void;
  onOpenAddModal: () => void;
  onOpenApkModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  onOpenApkModal,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 pb-safe shadow-lg">
      <div className="flex items-center justify-around relative">
        {/* Beranda */}
        <button
          onClick={() => onSelectTab('beranda')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'beranda' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Beranda</span>
        </button>

        {/* Statistik */}
        <button
          onClick={() => onSelectTab('statistik')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'statistik' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px]">Grafik</span>
        </button>

        {/* Centered Floating Action Button (+) */}
        <div className="relative -top-5">
          <button
            onClick={onOpenAddModal}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 border-4 border-slate-50 active:scale-95 transition"
            aria-label="Tambah Transaksi"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Transaksi */}
        <button
          onClick={() => onSelectTab('transaksi')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'transaksi' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px]">Riwayat</span>
        </button>

        {/* Pasang APK */}
        <button
          onClick={onOpenApkModal}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-600 transition"
        >
          <Smartphone className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] text-emerald-700 font-bold">APK</span>
        </button>
      </div>
    </nav>
  );
};
