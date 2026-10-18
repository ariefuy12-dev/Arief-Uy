import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  MinusCircle,
  Calendar,
  CreditCard,
  Tag,
  AlignLeft,
  Coins,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Transaction,
  TransactionType,
  PaymentMethod,
  KATEGORI_PENGELUARAN,
  KATEGORI_PEMASUKAN,
  PAYMENT_METHODS
} from '../types';
import { formatRupiah } from '../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>, idToEdit?: string) => void;
  editingTransaction?: Transaction | null;
}

const QUICK_AMOUNTS = [
  { label: '+10 Rb', value: 10000 },
  { label: '+20 Rb', value: 20000 },
  { label: '+50 Rb', value: 50000 },
  { label: '+100 Rb', value: 100000 },
  { label: '+500 Rb', value: 500000 },
  { label: '+1 Jt', value: 1000000 },
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
}) => {
  const [jenis, setJenis] = useState<TransactionType>('Pengeluaran');
  const [nominal, setNominal] = useState('');
  const [kategori, setKategori] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [keterangan, setKeterangan] = useState('');
  const [metode, setMetode] = useState<PaymentMethod>('Tunai');

  // Populate data when editing or opening
  useEffect(() => {
    if (editingTransaction) {
      setJenis(editingTransaction.jenis);
      setNominal(editingTransaction.nominal.toString());
      setKategori(editingTransaction.kategori);
      setTanggal(editingTransaction.tanggal);
      setKeterangan(editingTransaction.keterangan);
      setMetode(editingTransaction.metode || 'Tunai');
    } else {
      setJenis('Pengeluaran');
      setNominal('');
      setKategori(KATEGORI_PENGELUARAN[0].name);
      setTanggal(new Date().toISOString().split('T')[0]);
      setKeterangan('');
      setMetode('Tunai');
    }
  }, [editingTransaction, isOpen]);

  // Adjust default category when switching type
  const handleTypeChange = (newType: TransactionType) => {
    setJenis(newType);
    if (newType === 'Pengeluaran') {
      setKategori(KATEGORI_PENGELUARAN[0].name);
    } else {
      setKategori(KATEGORI_PEMASUKAN[0].name);
    }
  };

  const handleAddQuickAmount = (amount: number) => {
    const current = parseFloat(nominal) || 0;
    setNominal((current + amount).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(nominal);
    if (!val || val <= 0) {
      alert('Mohon masukkan nominal yang valid.');
      return;
    }
    if (!keterangan.trim()) {
      alert('Mohon isi keterangan transaksi.');
      return;
    }

    onSave(
      {
        jenis,
        nominal: val,
        kategori: kategori || (jenis === 'Pengeluaran' ? KATEGORI_PENGELUARAN[0].name : KATEGORI_PEMASUKAN[0].name),
        tanggal,
        keterangan: keterangan.trim(),
        metode,
      },
      editingTransaction ? editingTransaction.id : undefined
    );

    // Confetti celebration if Pemasukan
    if (jenis === 'Pemasukan') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }
    }

    onClose();
  };

  if (!isOpen) return null;

  const currentCategories = jenis === 'Pengeluaran' ? KATEGORI_PENGELUARAN : KATEGORI_PEMASUKAN;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {editingTransaction ? 'Ubah Catatan Transaksi' : 'Catat Transaksi Baru'}
              </h3>
              <p className="text-xs text-emerald-100">
                Data otomatis tersimpan langsung di ponsel Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Jenis Transaksi Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('Pengeluaran')}
                className={`py-3 px-4 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 border ${
                  jenis === 'Pengeluaran'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MinusCircle className="w-4 h-4 text-rose-500" />
                <span>Pengeluaran</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('Pemasukan')}
                className={`py-3 px-4 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 border ${
                  jenis === 'Pemasukan'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                <span>Pemasukan</span>
              </button>
            </div>
          </div>

          {/* Nominal Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nominal
              </label>
              {nominal && parseFloat(nominal) > 0 && (
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {formatRupiah(parseFloat(nominal))}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-base">
                Rp
              </div>
              <input
                type="number"
                min="1"
                step="500"
                required
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_AMOUNTS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleAddQuickAmount(chip.value)}
                  className="px-2.5 py-1 text-xs font-medium rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 transition border border-slate-200/60"
                >
                  {chip.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setNominal('')}
                className="px-2.5 py-1 text-xs font-medium rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-400 transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Kategori Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Kategori</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50/50">
              {currentCategories.map((cat) => {
                const isSelected = kategori === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setKategori(cat.name)}
                    className={`p-2 rounded-xl text-left text-xs font-medium transition flex items-center gap-1.5 border ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                        : 'border-transparent hover:bg-white text-slate-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tanggal & Metode Pembayaran (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tanggal */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Tanggal</span>
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            {/* Metode / Dompet */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>Dompet / Rekening</span>
              </label>
              <select
                value={metode}
                onChange={(e) => setMetode(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Keterangan / Catatan</span>
            </label>
            <input
              type="text"
              required
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Makan siang warteg, Belanja bulanan, Gaji bulanan"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-sm transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editingTransaction ? 'Simpan Perubahan' : 'Simpan Transaksi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
