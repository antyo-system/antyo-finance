import React, { useState } from 'react';
import {
  X,
  FolderPlus,
  ShieldCheck,
  Heart,
  TrendingUp,
  Utensils,
  Car,
  Home,
  Coffee,
  ShoppingBag,
  Plane,
  Gamepad2,
  Tag,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { useFinanceStore, BudgetGroup } from '../store/useFinanceStore';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  { name: 'blue', bg: 'bg-blue-600' },
  { name: 'emerald', bg: 'bg-emerald-500' },
  { name: 'amber', bg: 'bg-amber-500' },
  { name: 'rose', bg: 'bg-rose-500' },
  { name: 'violet', bg: 'bg-violet-500' },
  { name: 'sky', bg: 'bg-sky-500' },
  { name: 'indigo', bg: 'bg-indigo-500' },
  { name: 'pink', bg: 'bg-pink-500' },
];

const ICON_OPTIONS = [
  { id: 'utensils', icon: Utensils, label: 'Food' },
  { id: 'car', icon: Car, label: 'Transport' },
  { id: 'home', icon: Home, label: 'Housing' },
  { id: 'coffee', icon: Coffee, label: 'Cafe' },
  { id: 'shopping-bag', icon: ShoppingBag, label: 'Shopping' },
  { id: 'credit-card', icon: CreditCard, label: 'Debt' },
  { id: 'trending-up', icon: TrendingUp, label: 'Invest' },
  { id: 'plane', icon: Plane, label: 'Travel' },
  { id: 'gamepad', icon: Gamepad2, label: 'Hobbies' },
  { id: 'tag', icon: Tag, label: 'Other' },
];

export default function AddBudgetModal({ isOpen, onClose }: AddBudgetModalProps) {
  const { addBudgetCategory, settings } = useFinanceStore();
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [group, setGroup] = useState<BudgetGroup>('need');
  const [color, setColor] = useState('blue');
  const [selectedIcon, setSelectedIcon] = useState('utensils');

  // Debt tracking fields
  const [isDebt, setIsDebt] = useState(false);
  const [totalDebt, setTotalDebt] = useState('');
  const [dueDate, setDueDate] = useState('5');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }
    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit < 0) {
      alert('Please enter a valid monthly limit');
      return;
    }

    let parsedTotalDebt: number | undefined = undefined;
    if (isDebt) {
      parsedTotalDebt = parseFloat(totalDebt);
      if (isNaN(parsedTotalDebt) || parsedTotalDebt < 0) {
        alert('Please enter a valid total debt amount');
        return;
      }
    }

    addBudgetCategory({
      name: name.trim(),
      limit: parsedLimit,
      color,
      icon: isDebt ? 'credit-card' : selectedIcon,
      group: isDebt ? 'save' : group,
      isDebt,
      totalDebt: parsedTotalDebt,
      dueDate: isDebt ? dueDate : undefined,
    });

    setName('');
    setLimit('');
    setGroup('need');
    setColor('blue');
    setSelectedIcon('utensils');
    setIsDebt(false);
    setTotalDebt('');
    setDueDate('5');
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
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FolderPlus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">Create Custom Category</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Is Debt Toggle Checkbox */}
          <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-rose-500" />
              <div>
                <label htmlFor="isDebt" className="text-xs font-black text-slate-900 dark:text-slate-100 block cursor-pointer">
                  Is this a Debt / Loan Payoff?
                </label>
                <span className="text-[10px] text-slate-400 font-semibold block">Track payoff progress & due date alerts</span>
              </div>
            </div>
            <input
              type="checkbox"
              id="isDebt"
              checked={isDebt}
              onChange={(e) => setIsDebt(e.target.checked)}
              className="w-5 h-5 rounded-lg border-slate-300 text-rose-600 focus:ring-rose-500 accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Conditional Debt Extra Fields */}
          {isDebt && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Total Initial Debt Amount ({settings.currency})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 5000000"
                  value={totalDebt}
                  onChange={(e) => setTotalDebt(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-black text-base focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Monthly Due Date Day (1 - 31)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    max="31"
                    placeholder="5 (Day 5 of month)"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 50/30/20 Pillar Group Toggle (Hidden if Debt) */}
          {!isDebt && (
            <div>
              <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                Budget Pillar (50/30/20 Rule)
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGroup('need')}
                  className={`py-2 rounded-full font-bold text-xs transition flex items-center justify-center gap-1 ${
                    group === 'need'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Need
                </button>
                <button
                  type="button"
                  onClick={() => setGroup('want')}
                  className={`py-2 rounded-full font-bold text-xs transition flex items-center justify-center gap-1 ${
                    group === 'want'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  Want
                </button>
                <button
                  type="button"
                  onClick={() => setGroup('save')}
                  className={`py-2 rounded-full font-bold text-xs transition flex items-center justify-center gap-1 ${
                    group === 'save'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Custom Name */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              placeholder={isDebt ? "e.g. Cicilan Kartu Kredit" : "e.g. Coffee & Snacks"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          {/* Custom Limit */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              {isDebt ? 'Monthly Installment Target' : 'Monthly Limit'} ({settings.currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                {settings.currency}
              </span>
              <input
                type="number"
                required
                min="0"
                step="any"
                placeholder="0"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-slate-100 font-black text-lg focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Custom Icon Selector */}
          {!isDebt && (
            <div>
              <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                Category Icon
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-28 overflow-y-auto no-scrollbar p-1">
                {ICON_OPTIONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = selectedIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIcon(item.id)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition border ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800 text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
              className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs transition shadow-lg shadow-blue-600/30"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
