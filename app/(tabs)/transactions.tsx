import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore, Transaction } from '../../src/store/useFinanceStore';
import * as Haptics from 'expo-haptics';

export default function TransactionsScreen() {
  const systemColorScheme = useColorScheme();
  const { transactions, budgets, deleteTransaction, settings } = useFinanceStore();
  const resolvedScheme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const isDark = resolvedScheme === 'dark';

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const formatCurrency = (val: number) => {
    return `${settings.currency} ${val.toLocaleString('id-ID')}`;
  };

  const getCategoryColor = (colorName: string) => {
    switch (colorName) {
      case 'emerald': return '#e6f4ea';
      case 'sky': return '#e0f2fe';
      case 'orange': return '#ffedd5';
      case 'violet': return '#f3e8ff';
      case 'rose': return '#ffe4e6';
      default: return '#f3f4f6';
    }
  };

  const getCategoryTextCol = (colorName: string) => {
    switch (colorName) {
      case 'emerald': return '#10b981';
      case 'sky': return '#0ea5e9';
      case 'orange': return '#f97316';
      case 'violet': return '#8b5cf6';
      case 'rose': return '#f43f5e';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') return 'arrow-down';
    const found = budgets.find((b) => b.id === id);
    return found ? found.icon : 'wallet';
  };

  // Filtered transactions list
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(search.toLowerCase()));

    const matchesType =
      filterType === 'all' ||
      (filterType === 'income' && t.type === 'income') ||
      (filterType === 'expense' && t.type === 'expense');

    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      {/* Search and Filters Header */}
      <View style={[styles.headerSection, isDark ? styles.borderDark : styles.borderLight]}>
        <View style={[styles.searchWrapper, isDark ? styles.searchDark : styles.searchLight]}>
          <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, isDark ? styles.textWhite : styles.textDark]}
            placeholder="Search by category or notes..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Filters */}
        <View style={styles.tabFilters}>
          <TouchableOpacity
            style={[styles.filterTab, filterType === 'all' && styles.filterTabActive]}
            onPress={() => {
              setFilterType('all');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={[styles.filterTabText, filterType === 'all' && styles.filterTabTextActive]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filterType === 'income' && styles.filterTabActive]}
            onPress={() => {
              setFilterType('income');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={[styles.filterTabText, filterType === 'income' && styles.filterTabTextActive]}>
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filterType === 'expense' && styles.filterTabActive]}
            onPress={() => {
              setFilterType('expense');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={[styles.filterTabText, filterType === 'expense' && styles.filterTabTextActive]}>
              Expenses
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={44} color="#94a3b8" />
            <Text style={styles.emptyText}>No transactions found.</Text>
          </View>
        ) : (
          filteredTransactions.map((t) => {
            const isExpense = t.type === 'expense';
            const catColor = isExpense
              ? getCategoryColor(budgets.find((b) => b.id === t.categoryId)?.color || 'gray')
              : '#e6f4ea';
            const catTextCol = isExpense
              ? getCategoryTextCol(budgets.find((b) => b.id === t.categoryId)?.color || 'gray')
              : '#10b981';
            const catIcon = getCategoryIcon(t.categoryId, t.type);

            return (
              <View
                key={t.id}
                style={[styles.transactionItem, isDark ? styles.cardDark : styles.cardLight]}
              >
                <View style={[styles.transIcon, { backgroundColor: catColor }]}>
                  <Ionicons name={catIcon as any} size={18} color={catTextCol} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.transCategory, isDark ? styles.textWhite : styles.textDark]}>
                    {t.categoryName}
                  </Text>
                  {t.note && <Text style={styles.transNote}>{t.note}</Text>}
                  <Text style={styles.transDate}>{t.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
                  <Text
                    style={[
                      styles.transAmount,
                      isExpense ? styles.expenseText : styles.incomeText,
                    ]}
                  >
                    {isExpense ? '-' : '+'} {formatCurrency(t.amount)}
                  </Text>
                </View>

                {/* Delete button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(t.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#f43f5e" />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: {
    backgroundColor: '#f8fafc',
  },
  bgDark: {
    backgroundColor: '#0f172a',
  },
  headerSection: {
    padding: 20,
    borderBottomWidth: 1,
  },
  borderLight: {
    borderBottomColor: '#f1f5f9',
  },
  borderDark: {
    borderBottomColor: '#1e293b',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
  },
  searchLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  searchDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  textWhite: {
    color: '#fff',
  },
  textDark: {
    color: '#0f172a',
  },
  tabFilters: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTabTextActive: {
    color: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 12,
    textAlign: 'center',
  },
  transactionItem: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#f1f5f9',
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  transIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  transNote: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  transDate: {
    fontSize: 10,
    color: '#cbd5e1',
    marginTop: 4,
  },
  transAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  expenseText: {
    color: '#f43f5e',
  },
  incomeText: {
    color: '#10b981',
  },
  deleteButton: {
    padding: 6,
  },
});
