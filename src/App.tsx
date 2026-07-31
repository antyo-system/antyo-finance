import React, { useState } from 'react';
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Settings,
  Plus,
  Wallet,
  Briefcase,
} from 'lucide-react';
import DashboardView from './views/DashboardView';
import BudgetsView from './views/BudgetsView';
import AssetsView from './views/AssetsView';
import TransactionsView from './views/TransactionsView';
import SettingsView from './views/SettingsView';
import AddTransactionModal from './components/AddTransactionModal';
import AddBudgetModal from './components/AddBudgetModal';
import AddAssetModal from './components/AddAssetModal';

type TabView = 'dashboard' | 'budgets' | 'assets' | 'transactions' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  const handleFabClick = () => {
    if (activeTab === 'budgets') {
      setIsAddBudgetOpen(true);
    } else if (activeTab === 'assets') {
      setIsAddAssetOpen(true);
    } else {
      setIsAddTxOpen(true);
    }
  };

  const NAV_ITEMS = [
    { id: 'dashboard' as TabView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'budgets' as TabView, label: 'Budgets', icon: PieChart },
    { id: 'assets' as TabView, label: 'Assets & Debt', icon: Briefcase },
    { id: 'transactions' as TabView, label: 'History', icon: Receipt },
    { id: 'settings' as TabView, label: 'Settings', icon: Settings },
  ];

  const MOBILE_NAV_ITEMS = [
    { id: 'dashboard' as TabView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'budgets' as TabView, label: 'Budgets', icon: PieChart },
    { id: 'assets' as TabView, label: 'Assets', icon: Briefcase },
    { id: 'transactions' as TabView, label: 'History', icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-[Inter] selection:bg-blue-600 selection:text-white relative">
      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-8 pt-4 sm:pt-8 flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-64 shrink-0 space-y-4">
          {/* Sidebar Brand Logo */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Wallet className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight">Antyo</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-500/20">
                  Finance
                </span>
              </div>
            </div>
          </div>

          <nav className="sticky top-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3 space-y-1 shadow-sm">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            <div className="pt-2 space-y-2">
              <button
                onClick={() => setIsAddTxOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs transition shadow-md shadow-blue-600/25"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Add Transaction
              </button>
              <button
                onClick={() => setIsAddAssetOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition border border-emerald-200/60 dark:border-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </button>
            </div>
          </nav>
        </aside>

        {/* Dynamic View Container */}
        <main className="flex-1 pb-24 md:pb-8 min-w-0 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView onOpenAddTransaction={() => setIsAddTxOpen(true)} />
          )}
          {activeTab === 'budgets' && (
            <BudgetsView onOpenAddBudget={() => setIsAddBudgetOpen(true)} />
          )}
          {activeTab === 'assets' && <AssetsView />}
          {activeTab === 'transactions' && (
            <TransactionsView onOpenAddTransaction={() => setIsAddTxOpen(true)} />
          )}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Standalone Mobile Floating Action Button (FAB) */}
      <button
        onClick={handleFabClick}
        className="md:hidden fixed bottom-20 right-5 z-50 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-90 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center transition duration-150"
        title="Add Action"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Symmetrical 4-Tab Equal 25% Grid Mobile Floating Bottom Capsule Bar */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200/80 dark:border-slate-800 rounded-full px-2 py-2 grid grid-cols-4 items-center shadow-xl shadow-slate-950/10">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="flex justify-center">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`p-2.5 rounded-full transition ${
                  isActive
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 font-black'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Global Modals */}
      <AddTransactionModal isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} />
      <AddBudgetModal isOpen={isAddBudgetOpen} onClose={() => setIsAddBudgetOpen(false)} />
      <AddAssetModal isOpen={isAddAssetOpen} onClose={() => setIsAddAssetOpen(false)} />
    </div>
  );
}
