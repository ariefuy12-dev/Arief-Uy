import { Transaction, KATEGORI_PENGELUARAN, KATEGORI_PEMASUKAN, BudgetGoal } from '../types';

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatShortRupiah(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} Miliar`;
  }
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} Jt`;
  }
  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(0)} Rb`;
  }
  return value.toString();
}

export function formatDateID(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    }
  } catch {
    // fallback
  }
  return dateString;
}

export function getCategoryColor(categoryName: string, type: 'Pemasukan' | 'Pengeluaran'): string {
  const list = type === 'Pengeluaran' ? KATEGORI_PENGELUARAN : KATEGORI_PEMASUKAN;
  const match = list.find((k) => k.name === categoryName);
  return match ? match.color : '#64748b';
}

export function exportToCSV(transactions: Transaction[]) {
  if (transactions.length === 0) {
    alert('Belum ada transaksi untuk diekspor.');
    return;
  }

  const headers = ['ID', 'Tanggal', 'Keterangan', 'Kategori', 'Jenis', 'Metode', 'Nominal'];
  const rows = transactions.map((t) => [
    t.id,
    t.tanggal,
    `"${(t.keterangan || '').replace(/"/g, '""')}"`,
    `"${(t.kategori || '').replace(/"/g, '""')}"`,
    t.jenis,
    t.metode || 'Tunai',
    t.nominal,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `dompetku_laporan_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(transactions: Transaction[], budget: BudgetGoal) {
  const backup = {
    app: 'Dompetku APK',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    budget,
    transactions,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `dompetku_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
