import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle, Edit3, Check } from 'lucide-react';
import { BudgetGoal } from '../types';
import { formatRupiah } from '../utils/formatters';

interface BudgetTrackerProps {
  budget: BudgetGoal;
  currentExpense: number;
  onUpdateBudget: (newBudget: BudgetGoal) => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  budget,
  currentExpense,
  onUpdateBudget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [limitInput, setLimitInput] = useState(budget.monthlyLimit.toString());

  const percentage =
    budget.monthlyLimit > 0
      ? Math.min(100, Math.round((currentExpense / budget.monthlyLimit) * 100))
      : 0;

  const isOverBudget = budget.monthlyLimit > 0 && currentExpense > budget.monthlyLimit;
  const isNearBudget = budget.monthlyLimit > 0 && currentExpense >= budget.monthlyLimit * 0.8 && !isOverBudget;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(limitInput);
    if (!isNaN(val) && val >= 0) {
      onUpdateBudget({
        monthlyLimit: val,
        enabled: val > 0,
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              Anggaran Pengeluaran Bulanan
              {isOverBudget ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Melebihi Batas
                </span>
              ) : isNearBudget ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Mendekati Batas (80%+)
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Terkendali
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Pantau pengeluaran Anda agar tidak melebihi rencana
            </p>
          </div>
        </div>

        {/* Edit Button */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ubah Target</span>
          </button>
        ) : (
          <form onSubmit={handleSave} className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
              <input
                type="number"
                min="0"
                step="50000"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                className="pl-8 pr-2 py-1.5 w-36 rounded-xl border border-emerald-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Limit bulanan"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="p-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
              title="Simpan"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              Batal
            </button>
          </form>
        )}
      </div>

      {/* Progress Bar & Details */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700">
            Terpakai: <span className="font-mono text-slate-900">{formatRupiah(currentExpense)}</span>
          </span>
          <span className="text-slate-500">
            Batas: <span className="font-mono font-semibold text-slate-700">{formatRupiah(budget.monthlyLimit)}</span> ({percentage}%)
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-gradient-to-r from-rose-500 to-red-600'
                : isNearBudget
                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
          <span>
            {isOverBudget
              ? `Pengeluaran melebihi limit sebesar ${formatRupiah(currentExpense - budget.monthlyLimit)}`
              : `Sisa kuota belanja bulan ini: ${formatRupiah(Math.max(0, budget.monthlyLimit - currentExpense))}`}
          </span>
          <span>Target Bulanan</span>
        </div>
      </div>
    </div>
  );
};
