import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  categoryName: string;
  date: string;
  note?: string;
}

export type BudgetGroup = 'need' | 'want' | 'save';

export interface Budget {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
  group: BudgetGroup;
  isDebt?: boolean;
  totalDebt?: number;
  dueDate?: string;
  paidDebt?: number;
}

export type AssetCategory = 'stocks' | 'crypto' | 'gold' | 'savings' | 'realestate' | 'other';

export interface Asset {
  id: string;
  name: string;
  amount: number;
  category: AssetCategory;
  note?: string;
}

export interface AppSettings {
  currency: string;
  theme: 'system' | 'light' | 'dark';
  needsTarget: number;
  wantsTarget: number;
  savingsTarget: number;
}

interface FinanceStore {
  transactions: Transaction[];
  budgets: Budget[];
  assets: Asset[];
  settings: AppSettings;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updatedTx: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  updateBudgetLimit: (
    categoryId: string,
    limit: number,
    group?: BudgetGroup,
    name?: string,
    isDebt?: boolean,
    totalDebt?: number,
    dueDate?: string
  ) => void;
  addBudgetCategory: (category: Omit<Budget, 'id' | 'spent' | 'paidDebt'>) => void;
  deleteBudgetCategory: (id: string) => void;
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (id: string, updatedAsset: Partial<Omit<Asset, 'id'>>) => void;
  deleteAsset: (id: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  clearAllData: () => void;
}

const DEFAULT_BUDGETS: Budget[] = [
  { id: 'b1', name: 'Food & Groceries', limit: 3500000, spent: 195000, color: 'sky', icon: 'utensils', group: 'need' },
  { id: 'b2', name: 'Transport & Fuel', limit: 1500000, spent: 45000, color: 'blue', icon: 'car', group: 'need' },
  { id: 'b3', name: 'Bills & Housing', limit: 1000000, spent: 0, color: 'indigo', icon: 'home', group: 'need' },
  { id: 'b4', name: 'Dining & Entertainment', limit: 1500000, spent: 0, color: 'orange', icon: 'coffee', group: 'want' },
  { id: 'b5', name: 'Shopping & Hobbies', limit: 1000000, spent: 800000, color: 'violet', icon: 'shopping-bag', group: 'want' },
  {
    id: 'b6',
    name: 'Credit Card Debt',
    limit: 500000,
    spent: 0,
    color: 'rose',
    icon: 'credit-card',
    group: 'save',
    isDebt: true,
    totalDebt: 3000000,
    dueDate: '5',
    paidDebt: 1000000,
  },
  { id: 'b7', name: 'Emergency & Investment', limit: 2000000, spent: 0, color: 'emerald', icon: 'trending-up', group: 'save' },
];

const DEFAULT_ASSETS: Asset[] = [
  { id: 'a1', name: 'Reksadana Mutual Funds', amount: 5000000, category: 'stocks', note: 'Equity fund' },
  { id: 'a2', name: 'Physical Gold (Antam)', amount: 10000000, category: 'gold', note: '10 grams gold' },
  { id: 'a3', name: 'Emergency Savings Bank', amount: 10000000, category: 'savings', note: 'High yield savings' },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    amount: 12000000,
    type: 'income',
    categoryId: 'income',
    categoryName: 'Salary',
    date: '2026-07-26',
    note: 'Monthly Salary',
  },
  {
    id: 't2',
    amount: 150000,
    type: 'expense',
    categoryId: 'b1',
    categoryName: 'Food & Groceries',
    date: '2026-07-31',
    note: 'Team Lunch',
  },
  {
    id: 't3',
    amount: 45000,
    type: 'expense',
    categoryId: 'b1',
    categoryName: 'Food & Groceries',
    date: '2026-07-30',
    note: 'Coffee and snacks',
  },
  {
    id: 't4',
    amount: 45000,
    type: 'expense',
    categoryId: 'b2',
    categoryName: 'Transport & Fuel',
    date: '2026-07-31',
    note: 'Taxi home',
  },
  {
    id: 't5',
    amount: 800000,
    type: 'expense',
    categoryId: 'b5',
    categoryName: 'Shopping & Hobbies',
    date: '2026-07-29',
    note: 'New sneakers',
  },
];

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      transactions: DEFAULT_TRANSACTIONS,
      budgets: DEFAULT_BUDGETS,
      assets: DEFAULT_ASSETS,
      settings: {
        currency: 'Rp',
        theme: 'system',
        needsTarget: 50,
        wantsTarget: 30,
        savingsTarget: 20,
      },

      addTransaction: (tx) => {
        const id = 't_' + Date.now();
        const newTx = { ...tx, id };

        set((state) => {
          const updatedTxs = [newTx, ...state.transactions];

          let updatedBudgets = state.budgets;
          if (tx.type === 'expense') {
            updatedBudgets = state.budgets.map((b) => {
              if (b.id === tx.categoryId) {
                const newSpent = b.spent + tx.amount;
                const newPaidDebt = b.isDebt ? (b.paidDebt || 0) + tx.amount : b.paidDebt;
                return { ...b, spent: newSpent, paidDebt: newPaidDebt };
              }
              return b;
            });
          }

          return { transactions: updatedTxs, budgets: updatedBudgets };
        });
      },

      updateTransaction: (id, updatedFields) => {
        set((state) => {
          const existingTx = state.transactions.find((t) => t.id === id);
          if (!existingTx) return state;

          const newTx = { ...existingTx, ...updatedFields };
          const updatedTxs = state.transactions.map((t) => (t.id === id ? newTx : t));

          // Re-calculate budget spent & paid debt accurately
          const newBudgets = state.budgets.map((b) => {
            let spent = b.spent;
            let paidDebt = b.paidDebt || 0;

            if (existingTx.type === 'expense' && existingTx.categoryId === b.id) {
              spent -= existingTx.amount;
              if (b.isDebt) paidDebt -= existingTx.amount;
            }
            if (newTx.type === 'expense' && newTx.categoryId === b.id) {
              spent += newTx.amount;
              if (b.isDebt) paidDebt += newTx.amount;
            }

            return { ...b, spent: Math.max(0, spent), paidDebt: Math.max(0, paidDebt) };
          });

          return { transactions: updatedTxs, budgets: newBudgets };
        });
      },

      deleteTransaction: (id) => {
        set((state) => {
          const targetTx = state.transactions.find((t) => t.id === id);
          const updatedTxs = state.transactions.filter((t) => t.id !== id);

          let updatedBudgets = state.budgets;
          if (targetTx && targetTx.type === 'expense') {
            updatedBudgets = state.budgets.map((b) => {
              if (b.id === targetTx.categoryId) {
                const newSpent = Math.max(0, b.spent - targetTx.amount);
                const newPaidDebt = b.isDebt ? Math.max(0, (b.paidDebt || 0) - targetTx.amount) : b.paidDebt;
                return { ...b, spent: newSpent, paidDebt: newPaidDebt };
              }
              return b;
            });
          }

          return { transactions: updatedTxs, budgets: updatedBudgets };
        });
      },

      updateBudgetLimit: (categoryId, limit, group, name, isDebt, totalDebt, dueDate) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === categoryId
              ? {
                  ...b,
                  limit,
                  group: group || b.group,
                  name: name || b.name,
                  isDebt: isDebt !== undefined ? isDebt : b.isDebt,
                  totalDebt: totalDebt !== undefined ? totalDebt : b.totalDebt,
                  dueDate: dueDate !== undefined ? dueDate : b.dueDate,
                }
              : b
          ),
        }));
      },

      addBudgetCategory: (category) => {
        const id = 'b_' + Date.now();
        const newBudget: Budget = {
          ...category,
          id,
          spent: 0,
          group: category.group || 'want',
          paidDebt: 0,
        };

        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },

      deleteBudgetCategory: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },

      addAsset: (asset) => {
        const id = 'a_' + Date.now();
        const newAsset: Asset = { ...asset, id };
        set((state) => ({
          assets: [newAsset, ...state.assets],
        }));
      },

      updateAsset: (id, updatedAsset) => {
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, ...updatedAsset } : a)),
        }));
      },

      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      clearAllData: () => {
        set({
          transactions: [],
          budgets: DEFAULT_BUDGETS,
          assets: DEFAULT_ASSETS,
        });
      },
    }),
    {
      name: 'antyo-finance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
