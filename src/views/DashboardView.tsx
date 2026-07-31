import React from 'react';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Receipt,
  PieChart,
  ShieldCheck,
  Heart,
  AlertCircle,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';

interface DashboardViewProps {
  onOpenAddTransaction: () => void;
}

export default function DashboardView({ onOpenAddTransaction }: DashboardViewProps) {
  const { transactions, budgets, settings } = useFinanceStore();

  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const totalPlannedBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpentBudget = budgets.reduce((sum, b) => sum + b.spent, 0);

  const budgetProgressPct =
    totalPlannedBudget > 0
      ? Math.min(100, Math.round((totalSpentBudget / totalPlannedBudget) * 100))
      : 0;

  const formatCurrency = (val: number) => {
    return `${settings.currency} ${val.toLocaleString('id-ID')}`;
  };

  const recentTransactions = transactions.slice(0, 5);

  // Check for Debt Due Date Alerts (Day of month calculation)
  const currentDay = new Date().getDate();
  const debtAlerts = budgets.filter((b) => {
    if (!b.isDebt || !b.dueDate) return false;
    const dueDay = parseInt(b.dueDate, 10);
    if (isNaN(dueDay)) return false;
    const daysLeft = dueDay - currentDay;
    return daysLeft >= 0 && daysLeft <= 7;
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Smart Due Date Alert Banner (If Debt Due Soon) */}
      {debtAlerts.map((b) => {
        const dueDay = parseInt(b.dueDate!, 10);
        const daysLeft = dueDay - currentDay;

        return (
          <div
            key={b.id}
            className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    Due Date Alert
                  </span>
                  <span className="text-[10px] font-black bg-amber-200 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full">
                    {daysLeft === 0 ? 'Today!' : `${daysLeft} Days Left`}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {b.name} ({formatCurrency(b.limit)}) — Due on Day {b.dueDate}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAddTransaction}
              className="w-full sm:w-auto px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs transition shadow-md shadow-amber-500/20 shrink-0 text-center"
            >
              Pay Now
            </button>
          </div>
        );
      })}

      {/* MASTER UNIFIED HERO SNAPSHOT CARD (Clean without duplicate + button) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs w-full min-w-0 space-y-4">
        {/* Top Net Balance Header */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">
            <span>Net Balance</span>
          </div>
          <div className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
            {formatCurrency(netBalance)}
          </div>
        </div>

        {/* Middle Income vs Expense Bar */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Income</span>
            </div>
            <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 truncate block">
              +{formatCurrency(totalIncome)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Expenses</span>
            </div>
            <span className="text-sm sm:text-base font-black text-rose-500 dark:text-rose-400 truncate block">
              -{formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>

        {/* Bottom Budget Progress Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-black min-w-0">
            <span className="text-slate-400">Monthly Budget Progress</span>
            <span className="text-slate-900 dark:text-slate-100 font-extrabold">
              {budgetProgressPct}% ({formatCurrency(totalSpentBudget)} / {formatCurrency(totalPlannedBudget)})
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                budgetProgressPct > 100 ? 'bg-rose-500' : 'bg-blue-600'
              }`}
              style={{ width: `${budgetProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 w-full min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Recent Activity
          </h2>
          <span className="text-xs font-bold text-slate-400">Latest 5</span>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-semibold">
            No transactions logged yet. Tap + to add your first transaction.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentTransactions.map((tx) => {
              const isInc = tx.type === 'income';
              return (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                        isInc
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20'
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20'
                      }`}
                    >
                      {isInc ? (
                        <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {tx.categoryName}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-400 truncate">
                        {tx.note || tx.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs sm:text-sm font-black shrink-0 ${
                      isInc ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {isInc ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
