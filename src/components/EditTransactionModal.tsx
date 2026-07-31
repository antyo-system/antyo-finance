import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useFinanceStore, Transaction } from '../store/useFinanceStore';
import { formatNumberInput, parseNumberInput } from '../utils/currency';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTransactionModal({ transaction, isOpen, onClose }: EditTransactionModalProps) {
  const { budgets, updateTransaction, deleteTransaction, settings } = useFinanceStore();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountInput, setAmountInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmountInput(formatNumberInput(transaction.amount));
      setCategoryId(transaction.categoryId);
      setNote(transaction.note || '');
      setDate(transaction.date);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountInput(formatNumberInput(e.target.value));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseNumberInput(amountInput);
    if (!numAmount || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    let categoryName = 'Income';
    if (type === 'expense') {
      const found = budgets.find((b) => b.id === categoryId);
      if (found) categoryName = found.name;
    }

    updateTransaction(transaction.id, {
      amount: numAmount,
      type,
      categoryId: type === 'expense' ? categoryId : 'income',
      categoryName: type === 'expense' ? categoryName : 'Income',
      date,
      note: note.trim() || undefined,
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
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
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">Edit Transaction</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Segmented Expense vs Income Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
              Income
            </button>
          </div>

          {/* Read-Friendly Amount Input */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Amount ({settings.currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                {settings.currency}
              </span>
              <input
                type="text"
                required
                value={amountInput}
                onChange={handleAmountChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-slate-100 font-black text-2xl focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Category Select (Only for Expenses) */}
          {type === 'expense' && (
            <div>
              <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:border-blue-600 transition"
              >
                {budgets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
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
