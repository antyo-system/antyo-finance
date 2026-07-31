import React, { useState } from 'react';
import {
  PieChart,
  Settings2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Heart,
  TrendingUp,
  Sliders,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { useFinanceStore, Budget, BudgetGroup } from '../store/useFinanceStore';
import EditBudgetModal from '../components/EditBudgetModal';
import AddBudgetModal from '../components/AddBudgetModal';
import SetRatioModal from '../components/SetRatioModal';

interface BudgetsViewProps {
  onOpenAddBudget?: () => void;
}

export default function BudgetsView({ onOpenAddBudget }: BudgetsViewProps) {
  const { budgets, settings } = useFinanceStore();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRatioModalOpen, setIsRatioModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | BudgetGroup>('all');

  // Group calculations
  const needsBudgets = budgets.filter((b) => b.group === 'need');
  const wantsBudgets = budgets.filter((b) => b.group === 'want');
  const savesBudgets = budgets.filter((b) => b.group === 'save');

  const filteredBudgets = activeFilter === 'all'
    ? budgets
    : budgets.filter((b) => b.group === activeFilter);

  const formatCurrency = (val: number) => {
    return `${settings.currency} ${val.toLocaleString('id-ID')}`;
  };

  const renderUnifiedBadge = (b: Budget) => {
    if (b.isDebt) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold shrink-0 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20">
          <CreditCard className="w-3 h-3" />
          Debt Payoff • Due Day {b.dueDate || '5'}
        </span>
      );
    }

    const ratio = b.limit > 0 ? b.spent / b.limit : 0;
    const isOver = ratio > 1.0;
    const isWarning = ratio > 0.8 && ratio <= 1.0;

    let groupLabel = 'Need';
    let groupBg = 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-500/20';

    if (b.group === 'want') {
      groupLabel = 'Want';
      groupBg = 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20';
    } else if (b.group === 'save') {
      groupLabel = 'Save';
      groupBg = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20';
    }

    let statusText = 'Under';
    let StatusIcon = CheckCircle2;
    if (isOver) {
      statusText = 'Over';
      StatusIcon = XCircle;
      groupBg = 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20';
    } else if (isWarning) {
      statusText = 'Limit';
      StatusIcon = AlertTriangle;
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold shrink-0 ${groupBg}`}>
        <StatusIcon className="w-3 h-3" />
        {groupLabel} • {statusText}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full overflow-x-hidden">
      {/* Ultra-Clean View Header with Single Ratio Pill Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
            Category Budgets
          </h1>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {budgets.length}
          </span>
        </div>

        {/* Single Ultra-Clean Ratio Pill Button */}
        <button
          onClick={() => setIsRatioModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition border border-slate-200/60 dark:border-slate-700/60 shrink-0"
          title="Configure Target Ratio"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Ratio ({settings.needsTarget || 50}/{settings.wantsTarget || 30}/{settings.savingsTarget || 20})</span>
        </button>
      </div>

      {/* Pillar Filter Tabs (Scrollable on Mobile) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-full shrink-0 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          All ({budgets.length})
        </button>
        <button
          onClick={() => setActiveFilter('need')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
            activeFilter === 'need'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Needs ({needsBudgets.length})
        </button>
        <button
          onClick={() => setActiveFilter('want')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
            activeFilter === 'want'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Wants ({wantsBudgets.length})
        </button>
        <button
          onClick={() => setActiveFilter('save')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
            activeFilter === 'save'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Savings ({savesBudgets.length})
        </button>
      </div>

      {/* Ultra-Clean Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
        {filteredBudgets.map((b) => {
          if (b.isDebt) {
            // Debt Payoff Card Progress Calculation
            const totalDebtVal = b.totalDebt || 1;
            const paidVal = b.paidDebt || 0;
            const freedomPct = Math.min(100, Math.round((paidVal / totalDebtVal) * 100));

            return (
              <div
                key={b.id}
                onClick={() => setEditingBudget(b)}
                className="bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/30 rounded-3xl p-4 sm:p-5 hover:border-rose-500/40 transition cursor-pointer group shadow-xs w-full min-w-0 overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 flex items-center justify-center font-bold text-rose-500 dark:text-rose-400 group-hover:scale-105 transition shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{b.name}</h3>
                      <div className="mt-0.5">{renderUnifiedBadge(b)}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-rose-600 dark:text-rose-400">{freedomPct}%</span>
                    <span className="block text-[9px] font-bold text-slate-400">Paid Off</span>
                  </div>
                </div>

                {/* Freedom Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800 mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-emerald-500"
                    style={{ width: `${freedomPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 min-w-0">
                  <span className="truncate">
                    Paid: {formatCurrency(paidVal)} / Total: {formatCurrency(totalDebtVal)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-rose-600 transition shrink-0">
                    Edit <Settings2 className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          }

          // Normal Category Card
          const ratio = b.limit > 0 ? b.spent / b.limit : 0;
          const isOver = ratio > 1.0;
          const isWarning = ratio > 0.8 && ratio <= 1.0;
          const pct = Math.round(ratio * 100);

          return (
            <div
              key={b.id}
              onClick={() => setEditingBudget(b)}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-5 hover:border-blue-500/40 transition cursor-pointer group shadow-xs w-full min-w-0 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 group-hover:scale-105 transition shrink-0">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{b.name}</h3>
                    <div className="mt-0.5">{renderUnifiedBadge(b)}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-slate-900 dark:text-slate-100">{pct}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800 mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 min-w-0">
                <span className="truncate">
                  {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-blue-600 transition shrink-0">
                  Edit <Settings2 className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <EditBudgetModal
        budget={editingBudget}
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
      />
      <AddBudgetModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <SetRatioModal isOpen={isRatioModalOpen} onClose={() => setIsRatioModalOpen(false)} />
    </div>
  );
}
