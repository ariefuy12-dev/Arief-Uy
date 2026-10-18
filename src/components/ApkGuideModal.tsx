import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Code2,
  Copy,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  WifiOff,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct' | 'builder' | 'developer'>('direct');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pwabuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(currentUrl)}`;

  const capacitorCommands = `# 1. Build aplikasi web
npm run build

# 2. Inisialisasi Capacitor Android
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Dompetku" "id.dompetku.app" --web-dir="dist"
npx cap add android

# 3. Sinkronkan file & buka di Android Studio untuk Build APK
npx cap copy
npx cap open android`;

  const handleCopy = () => {
    navigator.clipboard.writeText(capacitorCommands);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        
        {/* Header with Emerald Gradient */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Smartphone className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-[11px] font-semibold text-emerald-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Android APK Ready
                </span>
                {isInstalled && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-300 text-emerald-900 text-[11px] font-bold">
                    Terpasang di Perangkat
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Pasang & Ekspor Jadi APK</h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg mt-1">
            Gunakan Dompetku layaknya aplikasi Android asli langsung dari HP, lengkap dengan akses offline dan ikon aplikasi di beranda Anda.
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 bg-black/15 p-1 rounded-xl backdrop-blur-sm border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'direct'
                  ? 'bg-white text-emerald-800 shadow'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pasang Langsung (WebAPK)</span>
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`flex-1 py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'builder'
                  ? 'bg-white text-emerald-800 shadow'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>File .APK (PWA Builder)</span>
            </button>
            <button
              onClick={() => setActiveTab('developer')}
              className={`flex-1 py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'developer'
                  ? 'bg-white text-emerald-800 shadow'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Capacitor / CLI</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* TAB 1: DIRECT INSTALL (WebAPK) */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                      Metode 1: Pasang Otomatis sebagai WebAPK Android
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Sistem operasi Android (melalui Google Chrome / Edge) menggunakan <strong>WebAPK Service</strong> resmi Google. Saat Anda menekan Pasang, Android secara otomatis menghasilkan file paket APK asli ke sistem ponsel Anda!
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-white/70 p-2 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Muncul di App Drawer & Settings Android</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-white/70 p-2 rounded-xl">
                    <WifiOff className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bekerja 100% Offline Tanpa Internet</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 bg-white/70 p-2 rounded-xl">
                    <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tampilan Fullscreen Tanpa URL Bar</span>
                  </div>
                </div>

                <div className="mt-5">
                  {isInstalled ? (
                    <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Aplikasi sudah terpasang di perangkat Anda!
                    </div>
                  ) : isInstallable ? (
                    <button
                      onClick={async () => {
                        await install();
                      }}
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2.5 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Pasang Aplikasi ke Ponsel Sekarang
                    </button>
                  ) : isIOS ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs space-y-1.5">
                      <p className="font-bold text-sm text-amber-800">Panduan untuk Pengguna iPhone / iPad (iOS):</p>
                      <p>1. Tekan tombol <strong>Share / Bagikan</strong> (ikon kotak panah ke atas) di menu Safari.</p>
                      <p>2. Gulir ke bawah lalu pilih <strong>Add to Home Screen (Tambah ke Layar Utama)</strong>.</p>
                    </div>
                  ) : (
                    <div className="bg-slate-100 border border-slate-200 text-slate-700 p-4 rounded-xl text-xs space-y-2">
                      <p className="font-semibold text-slate-800">Cara Pasang Cepat di Browser Chrome Android:</p>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600">
                        <li>Buka menu titik tiga (⋮) di pojok kanan atas browser Chrome.</li>
                        <li>Pilih <strong>"Install app"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                        <li>Sistem Android akan memproses paket APK dan ikon Dompetku akan langsung muncul di beranda HP Anda!</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PWA BUILDER (GENERATE STANDALONE .APK FILE) */}
          {activeTab === 'builder' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-b from-slate-50 to-white">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                      Metode 2: Download Berkas .APK Fisik via PWABuilder (Resmi Microsoft)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Jika Anda membutuhkan berkas fisik mentah <strong>.apk</strong> (untuk di-sideload, dikirim via WhatsApp/Telegram, atau diunggah ke Google Play Console), Anda bisa menggunakan PWA Builder gratis dalam hitungan detik.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-blue-900">Langkah Membuat Berkas .APK:</div>
                  <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside leading-relaxed">
                    <li>Klik tombol di bawah untuk membuka PWABuilder dengan URL aplikasi ini.</li>
                    <li>PWABuilder akan memverifikasi manifest PWA, service worker, dan icon (semua sudah 100% siap!).</li>
                    <li>Klik tombol <strong>"Package for Stores"</strong> &gt; pilih <strong>"Android"</strong>.</li>
                    <li>Pilih <strong>"Generate Package"</strong> untuk mendownload file <code>.apk</code> siap install.</li>
                  </ol>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href={pwabuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-600/20"
                  >
                    <span>Buka PWABuilder untuk Download .APK</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEVELOPER CLI (CAPACITOR) */}
          {activeTab === 'developer' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-900 text-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-slate-300">
                      Build Native APK dengan Capacitor
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Skrip</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Jalankan perintah ini di terminal proyek untuk mengemas aplikasi ini menjadi project Android Studio asli dan meng-export APK Debug / Release:
                </p>

                <pre className="bg-slate-950 p-3.5 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 leading-relaxed">
                  {capacitorCommands}
                </pre>
              </div>
            </div>
          )}

          {/* Summary Features */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Keunggulan Dompetku APK
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Privasi 100% Lokal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tanpa Iklan & Ringan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Ekspor CSV / JSON</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Grafik Pengeluaran</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Versi PWA 1.0.0 • Kompatibel Android 8.0+ & iOS</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
