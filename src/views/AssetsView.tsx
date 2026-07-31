import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  Trash2,
  ShieldCheck,
  Coins,
  DollarSign,
  Building,
  Briefcase,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { useFinanceStore, AssetCategory, Asset, Budget } from '../store/useFinanceStore';
import { formatCompactCurrency } from '../utils/currency';
import AddAssetModal from '../components/AddAssetModal';
import AddBudgetModal from '../components/AddBudgetModal';
import EditBudgetModal from '../components/EditBudgetModal';

export default function AssetsView() {
  const { assets, budgets, settings, deleteAsset } = useFinanceStore();
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'assets' | 'debts'>('all');

  // Asset Totals
  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);

  // Debt Totals (From budgets where isDebt is true)
  const debtBudgets = budgets.filter((b) => b.isDebt);
  const totalDebts = debtBudgets.reduce((sum, b) => {
    const total = b.totalDebt || 0;
    const paid = b.paidDebt || 0;
    return sum + Math.max(0, total - paid);
  }, 0);

  // Net Worth = Total Assets - Remaining Debts
  const netWorth = totalAssets - totalDebts;

  // Portfolio Allocation breakdown by asset category
  const stocksAssetVal = assets.filter((a) => a.category === 'stocks').reduce((sum, a) => sum + a.amount, 0);
  const goldAssetVal = assets.filter((a) => a.category === 'gold').reduce((sum, a) => sum + a.amount, 0);
  const savingsAssetVal = assets.filter((a) => a.category === 'savings').reduce((sum, a) => sum + a.amount, 0);

  const stocksPct = totalAssets > 0 ? Math.round((stocksAssetVal / totalAssets) * 100) : 0;
  const goldPct = totalAssets > 0 ? Math.round((goldAssetVal / totalAssets) * 100) : 0;
  const savingsPct = totalAssets > 0 ? Math.round((savingsAssetVal / totalAssets) * 100) : 0;
  const otherPct = Math.max(0, 100 - stocksPct - goldPct - savingsPct);

  const formatCurrency = (val: number) => {
    return `${settings.currency} ${val.toLocaleString('id-ID')}`;
  };

  const formatCompact = (val: number) => {
    return formatCompactCurrency(val, settings.currency);
  };

  const getAssetCategoryIcon = (cat: AssetCategory) => {
    switch (cat) {
      case 'stocks':
        return TrendingUp;
      case 'gold':
        return Coins;
      case 'savings':
        return ShieldCheck;
      case 'crypto':
        return DollarSign;
      case 'realestate':
        return Building;
      default:
        return Briefcase;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Clean Minimalist Title Header (No duplicate + button) */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
          Assets & Net Worth
        </h1>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          Net Worth Mode
        </span>
      </div>

      {/* DISTINCT PORTFOLIO ALLOCATION BREAKDOWN CARD (With Compact Currency Header Badges) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs w-full min-w-0 space-y-4">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">Net Worth Valuation</span>
            </div>
            <div className={`text-2xl sm:text-4xl font-black tracking-tight truncate ${netWorth >= 0 ? 'text-slate-900 dark:text-slate-100' : 'text-rose-500'}`}>
              {formatCurrency(netWorth)}
            </div>
          </div>

          {/* Compact Currency Badges preventing text truncation */}
          <div className="text-right shrink-0">
            <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 block bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-500/20">
              Assets: +{formatCompact(totalAssets)}
            </span>
            <span className="text-xs sm:text-sm font-black text-rose-500 block bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-200/60 dark:border-rose-500/20 mt-1">
              Debts: -{formatCompact(totalDebts)}
            </span>
          </div>
        </div>

        {/* Multi-Color Portfolio Allocation Progress Bar */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-black text-slate-400">
            <span className="flex items-center gap-1"><PieChart className="w-3.5 h-3.5" /> Asset Allocation</span>
            <span>{assets.length} Assets Registered</span>
          </div>

          <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-200/60 dark:border-slate-800 gap-0.5">
            <div className="bg-emerald-500 h-full rounded-l-full transition-all" style={{ width: `${stocksPct}%` }} title={`Stocks: ${stocksPct}%`} />
            <div className="bg-amber-500 h-full transition-all" style={{ width: `${goldPct}%` }} title={`Gold: ${goldPct}%`} />
            <div className="bg-blue-600 h-full transition-all" style={{ width: `${savingsPct}%` }} title={`Savings: ${savingsPct}%`} />
            <div className="bg-violet-500 h-full rounded-r-full transition-all" style={{ width: `${otherPct}%` }} title={`Other: ${otherPct}%`} />
          </div>

          {/* Asset Allocation Chips */}
          <div className="grid grid-cols-4 gap-1.5 text-[9px] font-extrabold text-center pt-1">
            <div className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 truncate">
              Stocks ({stocksPct}%)
            </div>
            <div className="p-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 truncate">
              Gold ({goldPct}%)
            </div>
            <div className="p-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 truncate">
              Savings ({savingsPct}%)
            </div>
            <div className="p-1 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 truncate">
              Other ({otherPct}%)
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs: All, Assets, Debts */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-full shrink-0">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 rounded-full text-xs font-bold transition text-center ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          All ({assets.length + debtBudgets.length})
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`py-2 rounded-full text-xs font-bold transition text-center ${
            activeTab === 'assets'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          Assets ({assets.length})
        </button>
        <button
          onClick={() => setActiveTab('debts')}
          className={`py-2 rounded-full text-xs font-bold transition text-center ${
            activeTab === 'debts'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          Debts ({debtBudgets.length})
        </button>
      </div>

      {/* ASSETS SECTION */}
      {(activeTab === 'all' || activeTab === 'assets') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              🟢 PORTFOLIO ASSETS ({formatCompact(totalAssets)})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
            {assets.map((a) => {
              const IconComp = getAssetCategoryIcon(a.category);

              return (
                <div
                  key={a.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-5 hover:border-emerald-500/40 transition group shadow-xs flex items-center justify-between gap-3 min-w-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{a.name}</h3>
                      <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                        {a.note || a.category.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(a.amount)}
                    </span>
                    <button
                      onClick={() => deleteAsset(a.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 transition opacity-80 sm:opacity-0 group-hover:opacity-100"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DEBTS & LIABILITIES SECTION */}
      {(activeTab === 'all' || activeTab === 'debts') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-rose-500 dark:text-rose-400">
              🔴 DEBTS & LIABILITIES ({formatCompact(totalDebts)})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
            {debtBudgets.map((b) => {
              const totalDebtVal = b.totalDebt || 1;
              const paidVal = b.paidDebt || 0;
              const remainingDebt = Math.max(0, totalDebtVal - paidVal);
              const freedomPct = Math.min(100, Math.round((paidVal / totalDebtVal) * 100));

              return (
                <div
                  key={b.id}
                  onClick={() => setEditingBudget(b)}
                  className="bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/30 rounded-3xl p-4 sm:p-5 hover:border-rose-500/40 transition cursor-pointer group shadow-xs min-w-0 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{b.name}</h3>
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-500">
                          Due Day {b.dueDate || '5'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-black text-rose-500 dark:text-rose-400">
                        -{formatCurrency(remainingDebt)}
                      </span>
                      <span className="block text-[9px] font-bold text-slate-400">{freedomPct}% Paid</span>
                    </div>
                  </div>

                  {/* Payoff Progress */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-300 bg-emerald-500"
                      style={{ width: `${freedomPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddAssetModal isOpen={isAddAssetOpen} onClose={() => setIsAddAssetOpen(false)} />
      <AddBudgetModal isOpen={isAddDebtOpen} onClose={() => setIsAddDebtOpen(false)} />
      <EditBudgetModal
        budget={editingBudget}
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
      />
    </div>
  );
}
