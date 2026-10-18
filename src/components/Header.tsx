import React, { useState, useRef, useEffect } from 'react';
import {
  Wallet,
  Download,
  Sliders,
  FileSpreadsheet,
  FileJson,
  Upload,
  RotateCcw,
  WifiOff,
  Smartphone,
  Sparkles,
  Info
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderProps {
  onOpenApkModal: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  onLoadSampleData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApkModal,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  onResetData,
  onLoadSampleData,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [dataMenuOpen, setDataMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDataMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white shadow-lg sticky top-0 z-40">
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-1 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-inner">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mode Offline — Anda tetap dapat mencatat & data tersimpan di ponsel.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md shadow-inner border border-white/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                Dompetku
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/25 border border-emerald-300/30 text-emerald-100">
                  APK
                </span>
              </h1>
            </div>
            <p className="text-xs text-emerald-100/80 hidden sm:block">
              Pembukuan & Pengelolaan Keuangan Pribadi Siap Pasang di Android
            </p>
          </div>
        </div>

        {/* Right Actions: APK Button + Data Dropdown */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* APK Install / Guide Button */}
          <button
            onClick={() => {
              if (isInstallable) {
                install();
              } else {
                onOpenApkModal();
              }
            }}
            className="bg-emerald-500/90 hover:bg-emerald-500 active:scale-95 text-white px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/20 border border-emerald-400/40 transition flex items-center gap-1.5"
            title="Pasang atau Unduh APK"
          >
            <Smartphone className="w-4 h-4 text-emerald-100 animate-pulse" />
            <span className="hidden sm:inline">
              {isInstalled ? 'Status APK' : isInstallable ? 'Pasang APK' : 'Menu APK'}
            </span>
            <span className="sm:hidden">APK</span>
          </button>

          {/* Manage Data Dropdown */}
          <div className="relative inline-block text-left" ref={menuRef}>
            <button
              onClick={() => setDataMenuOpen(!dataMenuOpen)}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-1.5 border border-white/20 active:scale-95"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden md:inline">Kelola Data</span>
            </button>

            {dataMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl bg-white ring-1 ring-black/5 divide-y divide-slate-100 z-50 animate-scale-up text-slate-700">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setDataMenuOpen(false);
                      onOpenApkModal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2 mb-1"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Panduan & Unduh APK</span>
                  </button>

                  <button
                    onClick={() => {
                      setDataMenuOpen(false);
                      onExportJSON();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium rounded-xl hover:bg-slate-100 flex items-center gap-2"
                  >
                    <FileJson className="w-4 h-4 text-emerald-600" />
                    <span>Cadangkan (Ekspor JSON)</span>
                  </button>

                  <button
                    onClick={() => {
                      setDataMenuOpen(false);
                      onExportCSV();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium rounded-xl hover:bg-slate-100 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Laporan Excel (Ekspor CSV)</span>
                  </button>

                  <label className="w-full text-left px-3 py-2 text-xs font-medium rounded-xl hover:bg-slate-100 cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Pulihkan (Impor JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        setDataMenuOpen(false);
                        onImportJSON(e);
                      }}
                    />
                  </label>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setDataMenuOpen(false);
                      onLoadSampleData();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Isi Data Contoh (Demo)</span>
                  </button>

                  <button
                    onClick={() => {
                      setDataMenuOpen(false);
                      onResetData();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Semua Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
