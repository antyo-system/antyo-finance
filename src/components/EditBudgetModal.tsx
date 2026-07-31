import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2, ShieldCheck, Heart, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { useFinanceStore, Budget, BudgetGroup } from '../store/useFinanceStore';

interface EditBudgetModalProps {
  budget: Budget | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditBudgetModal({ budget, isOpen, onClose }: EditBudgetModalProps) {
  const { updateBudgetLimit, deleteBudgetCategory, budgets, settings } = useFinanceStore();
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [group, setGroup] = useState<BudgetGroup>('need');
  const [isDebt, setIsDebt] = useState(false);
  const [totalDebt, setTotalDebt] = useState('');
  const [dueDate, setDueDate] = useState('5');

  useEffect(() => {
    if (budget) {
      setName(budget.name);
      setLimit(budget.limit.toString());
      setGroup(budget.group || 'need');
      setIsDebt(!!budget.isDebt);
      setTotalDebt(budget.totalDebt ? budget.totalDebt.toString() : '');
      setDueDate(budget.dueDate || '5');
    }
  }, [budget]);

  if (!isOpen || !budget) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(limit);
    if (isNaN(parsed) || parsed < 0) {
      alert('Please enter a valid limit');
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

    updateBudgetLimit(
      budget.id,
      parsed,
      isDebt ? 'save' : group,
      name.trim(),
      isDebt,
      parsedTotalDebt,
      isDebt ? dueDate : undefined
    );
    onClose();
  };

  const handleDelete = () => {
    if (budgets.length <= 1) {
      alert('You must keep at least one category');
      return;
    }
    if (confirm(`Are you sure you want to delete "${budget.name}" category?`)) {
      deleteBudgetCategory(budget.id);
      onClose();
    }
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
              <Edit3 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">Edit Category</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Is Debt Toggle Checkbox */}
          <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-rose-500" />
              <div>
                <label htmlFor="editIsDebt" className="text-xs font-black text-slate-900 dark:text-slate-100 block cursor-pointer">
                  Is this a Debt / Loan Payoff?
                </label>
                <span className="text-[10px] text-slate-400 font-semibold block">Track payoff progress & due date alerts</span>
              </div>
            </div>
            <input
              type="checkbox"
              id="editIsDebt"
              checked={isDebt}
              onChange={(e) => setIsDebt(e.target.checked)}
              className="w-5 h-5 rounded-lg border-slate-300 text-rose-600 focus:ring-rose-500 accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Conditional Debt Fields */}
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

          {/* Pillar Group Selector */}
          {!isDebt && (
            <div>
              <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                Budget Pillar
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

          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:border-blue-600 transition"
            />
          </div>

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
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-slate-100 font-black text-lg focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete Category</span>
              <span className="sm:hidden">Delete</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs transition shadow-lg shadow-blue-600/30"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
