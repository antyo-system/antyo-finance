import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Coins, Building, ShieldCheck, Briefcase } from 'lucide-react';
import { useFinanceStore, AssetCategory } from '../store/useFinanceStore';
import { formatNumberInput, parseNumberInput } from '../utils/currency';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ASSET_CATEGORIES: { id: AssetCategory; label: string; icon: any }[] = [
  { id: 'stocks', label: 'Stocks / Mutual Funds', icon: TrendingUp },
  { id: 'gold', label: 'Gold / Precious Metal', icon: Coins },
  { id: 'savings', label: 'Cash / High-Yield Savings', icon: ShieldCheck },
  { id: 'crypto', label: 'Crypto Assets', icon: DollarSign },
  { id: 'realestate', label: 'Real Estate / Property', icon: Building },
  { id: 'other', label: 'Other Asset', icon: Briefcase },
];

export default function AddAssetModal({ isOpen, onClose }: AddAssetModalProps) {
  const { addAsset, settings } = useFinanceStore();
  const [name, setName] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [category, setCategory] = useState<AssetCategory>('stocks');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountInput(formatNumberInput(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an asset name');
      return;
    }
    const parsedAmount = parseNumberInput(amountInput);
    if (!parsedAmount || parsedAmount < 0) {
      alert('Please enter a valid amount');
      return;
    }

    addAsset({
      name: name.trim(),
      amount: parsedAmount,
      category,
      note: note.trim() || undefined,
    });

    setName('');
    setAmountInput('');
    setCategory('stocks');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Mobile Bottom-Sheet Container */}
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:max-h-[92vh] max-sm:overflow-y-auto">
        {/* Mobile Drag Handle Bar */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">Add Asset / Portfolio</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Asset Category Selector */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Asset Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AssetCategory)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:border-emerald-600 transition"
            >
              {ASSET_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Asset Name */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Asset Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Antam Gold 10g or SBN Bond"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:border-emerald-600 transition"
            />
          </div>

          {/* Current Value Amount Input */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Current Valuation ({settings.currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                {settings.currency}
              </span>
              <input
                type="text"
                required
                placeholder="0"
                value={amountInput}
                onChange={handleAmountChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-slate-100 font-black text-xl focus:outline-none focus:border-emerald-600 transition"
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Kept in safe deposit box"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:border-emerald-600 transition"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-600/30"
            >
              Add Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
