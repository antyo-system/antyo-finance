import React, { useState, useMemo } from 'react';
import {
  Search,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  ShieldCheck,
  Heart,
  TrendingUp,
  DollarSign,
  Calendar,
  Settings2,
} from 'lucide-react';
import { useFinanceStore, Transaction, BudgetGroup } from '../store/useFinanceStore';
import { isToday, isYesterday, isThisWeek, parseISO, format } from 'date-fns';
import EditTransactionModal from '../components/EditTransactionModal';

interface TransactionsViewProps {
  onOpenAddTransaction?: () => void;
}

export default function TransactionsView({ onOpenAddTransaction }: TransactionsViewProps) {
  const { transactions, budgets, settings, deleteTransaction } = useFinanceStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Map categoryId to Budget for pillar lookups
  const budgetMap = useMemo(() => {
    const map = new Map<string, { name: string; group: BudgetGroup }>();
    budgets.forEach((b) => map.set(b.id, { name: b.name, group: b.group }));
    return map;
  }, [budgets]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (activeFilter !== 'all' && tx.type !== activeFilter) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const catMatch = tx.categoryName.toLowerCase().includes(query);
        const noteMatch = tx.note ? tx.note.toLowerCase().includes(query) : false;
        const amountMatch = tx.amount.toString().includes(query);
        return catMatch || noteMatch || amountMatch;
      }

      return true;
    });
  }, [transactions, activeFilter, search]);

  const formatCurrency = (val: number) => {
    return `${settings.currency} ${val.toLocaleString('id-ID')}`;
  };

  // Group transactions by date sections
  const groupedTransactions = useMemo(() => {
    const groups: { title: string; items: Transaction[] }[] = [];
    const map = new Map<string, Transaction[]>();

    filteredTransactions.forEach((tx) => {
      let key = tx.date;
      try {
        const d = parseISO(tx.date);
        if (isToday(d)) {
          key = 'Today';
        } else if (isYesterday(d)) {
          key = 'Yesterday';
        } else if (isThisWeek(d)) {
          key = 'Earlier this Week';
        } else {
          key = format(d, 'MMMM yyyy');
        }
      } catch {
        key = tx.date;
      }

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(tx);
    });

    map.forEach((items, title) => {
      groups.push({ title, items });
    });

    return groups;
  }, [filteredTransactions]);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Category', 'Pillar', 'Amount', 'Note'];
    const rows = filteredTransactions.map((tx) => {
      const budgetInfo = budgetMap.get(tx.categoryId);
      const pillar = tx.type === 'income' ? 'Income' : budgetInfo?.group || 'Want';
      return [
        tx.id,
        tx.date,
        tx.type,
        `"${tx.categoryName}"`,
        pillar,
        tx.amount,
        `"${tx.note || ''}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Antyo_Finance_Transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPillarBadge = (tx: Transaction) => {
    if (tx.type === 'income') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold shrink-0">
          <DollarSign className="w-3 h-3" />
          Income
        </span>
      );
    }

    const budgetInfo = budgetMap.get(tx.categoryId);
    const group = budgetInfo?.group || 'want';

    if (group === 'need') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold shrink-0">
          <ShieldCheck className="w-3 h-3" />
          Need
        </span>
      );
    }
    if (group === 'save') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold shrink-0">
          <TrendingUp className="w-3 h-3" />
          Save
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold shrink-0">
        <Heart className="w-3 h-3" />
        Want
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full overflow-x-hidden">
      {/* Clean Minimalist Header with Export CSV Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
            Transactions
          </h1>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {filteredTransactions.length}
          </span>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition border border-slate-200/60 dark:border-slate-700/60 shrink-0"
          title="Export CSV Spreadsheet"
        >
          <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search category or note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-slate-900 dark:text-slate-100 font-medium text-xs sm:text-sm focus:outline-none focus:border-blue-600 transition shadow-xs"
        />
      </div>

      {/* Original Simple Filter Pills: All, Expenses, Income */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-full shrink-0">
        <button
          onClick={() => setActiveFilter('all')}
          className={`py-2 rounded-full text-xs font-bold transition text-center ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('expense')}
          className={`py-2 rounded-full text-xs font-bold transition text-center ${
            activeFilter === 'expense'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveFilter('income')}
          className={`py-2 rounded-full text-xs font-bold transition text-center ${
            activeFilter === 'income'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          Income
        </button>
      </div>

      {/* Smart Date-Grouped Transaction History List */}
      <div className="space-y-4">
        {groupedTransactions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs font-semibold">
            No transactions found matching criteria.
          </div>
        ) : (
          groupedTransactions.map((group) => (
            <div key={group.title} className="space-y-2">
              {/* Clean Date Section Divider Header */}
              <div className="flex items-center gap-2 px-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{group.title}</span>
                <div className="flex-1 h-px bg-slate-200/60 dark:bg-slate-800/80" />
              </div>

              {/* Transactions in Group */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden shadow-xs">
                {group.items.map((tx) => {
                  const isInc = tx.type === 'income';

                  return (
                    <div
                      key={tx.id}
                      onClick={() => setEditingTransaction(tx)}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Transaction Icon */}
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

                        {/* Title & Pillar Badge */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                              {tx.categoryName}
                            </h4>
                            {renderPillarBadge(tx)}
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                            {tx.note || tx.categoryName}
                          </p>
                        </div>
                      </div>

                      {/* Right Amount & Edit Action */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span
                          className={`text-xs sm:text-sm font-black ${
                            isInc ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {isInc ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition shrink-0">
                          Edit <Settings2 className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />
    </div>
  );
}
