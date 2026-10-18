export type TransactionType = 'Pemasukan' | 'Pengeluaran';

export type PaymentMethod = 'Tunai' | 'BCA' | 'BRI' | 'Mandiri' | 'GoPay' | 'OVO' | 'Dana' | 'ShopeePay' | 'Lainnya';

export interface Transaction {
  id: string;
  tanggal: string; // YYYY-MM-DD
  keterangan: string;
  kategori: string;
  jenis: TransactionType;
  nominal: number;
  metode?: PaymentMethod;
}

export interface BudgetGoal {
  monthlyLimit: number;
  enabled: boolean;
}

export const KATEGORI_PENGELUARAN: { name: string; icon: string; color: string }[] = [
  { name: 'Makanan & Minuman', icon: 'Utensils', color: '#f59e0b' },
  { name: 'Transportasi', icon: 'Car', color: '#3b82f6' },
  { name: 'Belanja', icon: 'ShoppingBag', color: '#ec4899' },
  { name: 'Tagihan & Utilitas', icon: 'Receipt', color: '#ef4444' },
  { name: 'Hiburan', icon: 'Film', color: '#8b5cf6' },
  { name: 'Kesehatan', icon: 'HeartPulse', color: '#10b981' },
  { name: 'Pendidikan', icon: 'GraduationCap', color: '#06b6d4' },
  { name: 'Keluarga & Anak', icon: 'Users', color: '#f97316' },
  { name: 'Lainnya (Pengeluaran)', icon: 'MoreHorizontal', color: '#64748b' },
];

export const KATEGORI_PEMASUKAN: { name: string; icon: string; color: string }[] = [
  { name: 'Gaji', icon: 'Briefcase', color: '#10b981' },
  { name: 'Bonus / Insentif', icon: 'Award', color: '#059669' },
  { name: 'Investasi', icon: 'TrendingUp', color: '#3b82f6' },
  { name: 'Hasil Usaha', icon: 'Store', color: '#8b5cf6' },
  { name: 'Hadiah / Uang Saku', icon: 'Gift', color: '#ec4899' },
  { name: 'Penjualan Barang', icon: 'Tag', color: '#f59e0b' },
  { name: 'Lainnya (Pemasukan)', icon: 'PlusCircle', color: '#14b8a6' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Tunai',
  'BCA',
  'BRI',
  'Mandiri',
  'GoPay',
  'OVO',
  'Dana',
  'ShopeePay',
  'Lainnya',
];
