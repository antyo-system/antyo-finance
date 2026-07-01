import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { expoFileSystemStorage } from '../utils/storage';

export interface Budget {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string; // Tailwind color name like 'emerald', 'sky', 'orange', 'violet', 'rose'
  icon: string;  // Ionicons name
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string; // budget.id or 'income'
  categoryName: string; // budget.name or 'Income' / 'Salary'
  type: 'income' | 'expense';
  date: string; // YYYY-MM-DD
  note?: string;
}

export interface Settings {
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

interface FinanceState {
  budgets: Budget[];
  transactions: Transaction[];
  settings: Settings;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudgetLimit: (id: string, limit: number) => void;
  addBudgetCategory: (b: Omit<Budget, 'id' | 'spent'>) => void;
  deleteBudgetCategory: (id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
  clearAllData: () => void;
  recalculateSpent: () => void; // Helper to sync spent amounts
}

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const DEFAULT_BUDGETS: Budget[] = [
  { id: 'b1', name: 'Food', limit: 3000000, spent: 195000, color: 'emerald', icon: 'fast-food' },
  { id: 'b2', name: 'Transport', limit: 1000000, spent: 45000, color: 'sky', icon: 'car' },
  { id: 'b3', name: 'Shopping', limit: 1500000, spent: 800000, color: 'orange', icon: 'cart' },
  { id: 'b4', name: 'Bills', limit: 2000000, spent: 0, color: 'violet', icon: 'receipt' },
  { id: 'b5', name: 'Entertainment', limit: 1000000, spent: 0, color: 'rose', icon: 'film' },
];

const getTodayString = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 't1', amount: 12000000, categoryId: 'income', categoryName: 'Salary', type: 'income', date: getTodayString(5), note: 'Monthly Salary' },
  { id: 't2', amount: 150000, categoryId: 'b1', categoryName: 'Food', type: 'expense', date: getTodayString(0), note: 'Team Lunch' },
  { id: 't3', amount: 45000, categoryId: 'b1', categoryName: 'Food', type: 'expense', date: getTodayString(1), note: 'Coffee and snacks' },
  { id: 't4', amount: 45000, categoryId: 'b2', categoryName: 'Transport', type: 'expense', date: getTodayString(0), note: 'Taxi home' },
  { id: 't5', amount: 800000, categoryId: 'b3', categoryName: 'Shopping', type: 'expense', date: getTodayString(2), note: 'New sneakers' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      budgets: DEFAULT_BUDGETS,
      transactions: DEFAULT_TRANSACTIONS,
      settings: {
        currency: 'Rp',
        theme: 'system',
      },

      addTransaction: (t) => {
        const id = generateUUID();
        const newTransaction: Transaction = { ...t, id };
        
        set((state) => {
          const nextTransactions = [newTransaction, ...state.transactions];
          // Update budget spent amount
          let nextBudgets = [...state.budgets];
          if (t.type === 'expense') {
            nextBudgets = state.budgets.map((b) =>
              b.id === t.categoryId ? { ...b, spent: b.spent + t.amount } : b
            );
          }
          return {
            transactions: nextTransactions,
            budgets: nextBudgets,
          };
        });
      },

      deleteTransaction: (id) => {
        set((state) => {
          const transactionToDelete = state.transactions.find((t) => t.id === id);
          if (!transactionToDelete) return state;

          const nextTransactions = state.transactions.filter((t) => t.id !== id);
          let nextBudgets = [...state.budgets];

          if (transactionToDelete.type === 'expense') {
            nextBudgets = state.budgets.map((b) =>
              b.id === transactionToDelete.categoryId
                ? { ...b, spent: Math.max(0, b.spent - transactionToDelete.amount) }
                : b
            );
          }

          return {
            transactions: nextTransactions,
            budgets: nextBudgets,
          };
        });
      },

      updateBudgetLimit: (id, limit) => {
        set((state) => ({
          budgets: state.budgets.map((b) => (b.id === id ? { ...b, limit } : b)),
        }));
      },

      addBudgetCategory: (b) => {
        const id = generateUUID();
        const newBudget: Budget = { ...b, id, spent: 0 };
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },

      deleteBudgetCategory: (id) => {
        set((state) => {
          // Re-route transactions of this category to income/uncategorized?
          // For simplicity, we just filter out this category, but keep transactions
          const nextBudgets = state.budgets.filter((b) => b.id !== id);
          const nextTransactions = state.transactions.map((t) => 
            t.categoryId === id ? { ...t, categoryId: 'uncategorized', categoryName: 'Uncategorized' } : t
          );
          return {
            budgets: nextBudgets,
            transactions: nextTransactions,
          };
        });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      clearAllData: () => {
        set({
          budgets: DEFAULT_BUDGETS.map(b => ({ ...b, spent: 0 })),
          transactions: [],
          settings: {
            currency: 'Rp',
            theme: 'system',
          },
        });
      },

      recalculateSpent: () => {
        set((state) => {
          // Reset spent to 0
          const resetBudgets = state.budgets.map(b => ({ ...b, spent: 0 }));
          
          // Accumulate from expenses
          state.transactions.forEach(t => {
            if (t.type === 'expense') {
              const target = resetBudgets.find(b => b.id === t.categoryId);
              if (target) {
                target.spent += t.amount;
              }
            }
          });

          return { budgets: resetBudgets };
        });
      },
    }),
    {
      name: 'antyo-finance-storage',
      storage: createJSONStorage(() => expoFileSystemStorage),
    }
  )
);
