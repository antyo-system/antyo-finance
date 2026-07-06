import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import AddTransactionModal from '../../src/components/AddTransactionModal';
import * as Haptics from 'expo-haptics';

export default function DashboardScreen() {
  const systemColorScheme = useColorScheme();
  const { transactions, budgets, settings } = useFinanceStore();
  const [modalVisible, setModalVisible] = useState(false);

  const resolvedScheme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const isDark = resolvedScheme === 'dark';

  // Get current year-month (YYYY-MM)
  const currentMonthPrefix = new Date().toISOString().slice(0, 7);

  // Filter current month transactions
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonthPrefix));

  // Math totals
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Budgets total limit
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalLimit - totalSpent;



  // Format currency helper
  const formatCurrency = (val: number) => {
    return `${settings.currency} ${val.toLocaleString('id-ID')}`;
  };

  // Recent 3 transactions
  const recentTransactions = transactions.slice(0, 3);

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

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Balance Hero Card */}
        <View style={[styles.heroCard, isDark ? styles.heroCardDark : styles.heroCardLight]}>
          <Text style={[styles.heroLabel, isDark ? styles.textGrayLight : styles.textGrayDark]}>
            Net Balance (This Month)
          </Text>
          <Text style={[styles.heroAmount, isDark ? styles.textWhite : styles.textDark]}>
            {formatCurrency(totalIncome - totalExpense)}
          </Text>

          {/* Mini income / expense splits */}
          <View style={styles.heroSplit}>
            <View style={styles.heroSplitItem}>
              <View style={[styles.splitIcon, { backgroundColor: '#e6f4ea' }]}>
                <Ionicons name="arrow-down" size={16} color="#10b981" />
              </View>
              <View>
                <Text style={styles.splitLabel}>Income</Text>
                <Text style={styles.splitValueGreen}>{formatCurrency(totalIncome)}</Text>
              </View>
            </View>

            <View style={styles.heroSplitItem}>
              <View style={[styles.splitIcon, { backgroundColor: '#ffe4e6' }]}>
                <Ionicons name="arrow-up" size={16} color="#f43f5e" />
              </View>
              <View>
                <Text style={styles.splitLabel}>Expenses</Text>
                <Text style={styles.splitValueRed}>{formatCurrency(totalExpense)}</Text>
              </View>
            </View>
          </View>
        </View>


        {/* Budget Health Overview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            Monthly Budget Summary
          </Text>
        </View>

        <View style={[styles.summaryCard, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.summarySplit}>
            <View style={styles.summarySplitItem}>
              <Text style={styles.summaryLabel}>Total Limit</Text>
              <Text style={[styles.summaryValue, isDark ? styles.textWhite : styles.textDark]}>
                {formatCurrency(totalLimit)}
              </Text>
            </View>
            <View style={styles.summarySplitDivider} />
            <View style={styles.summarySplitItem}>
              <Text style={styles.summaryLabel}>Remaining</Text>
              <Text
                style={[
                  styles.summaryValue,
                  remainingBudget < 0 ? { color: '#f43f5e' } : isDark ? styles.textWhite : styles.textDark,
                ]}
              >
                {formatCurrency(remainingBudget)}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          {totalLimit > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(100, (totalSpent / totalLimit) * 100)}%`,
                      backgroundColor: totalSpent > totalLimit ? '#f43f5e' : '#10b981',
                    },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressPercentage}>
                  {Math.round((totalSpent / totalLimit) * 100)}% Spent
                </Text>
                <Text style={styles.progressRemaining}>
                  {formatCurrency(totalSpent)} spent
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            Recent Transactions
          </Text>
        </View>

        {recentTransactions.length === 0 ? (
          <View style={[styles.emptyCard, isDark ? styles.cardDark : styles.cardLight]}>
            <Ionicons name="receipt-outline" size={32} color="#9ca3af" />
            <Text style={styles.emptyText}>No recent transactions logged.</Text>
          </View>
        ) : (
          recentTransactions.map((t) => {
            const isExpense = t.type === 'expense';
            const catColor = isExpense ? getCategoryColor(budgets.find(b => b.id === t.categoryId)?.color || 'gray') : '#e6f4ea';
            const catTextCol = isExpense ? getCategoryTextCol(budgets.find(b => b.id === t.categoryId)?.color || 'gray') : '#10b981';
            const catIcon = isExpense ? (budgets.find(b => b.id === t.categoryId)?.icon || 'wallet') : 'arrow-down';

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
                <Text
                  style={[
                    styles.transAmount,
                    isExpense ? styles.expenseText : styles.incomeText,
                  ]}
                >
                  {isExpense ? '-' : '+'} {formatCurrency(t.amount)}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setModalVisible(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <AddTransactionModal visible={modalVisible} onClose={() => setModalVisible(false)} />
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // extra padding for FAB offset
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  heroCardLight: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  heroCardDark: {
    backgroundColor: '#1e293b',
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
  },
  textWhite: {
    color: '#ffffff',
  },
  textDark: {
    color: '#0f172a',
  },
  textGrayLight: {
    color: '#94a3b8',
  },
  textGrayDark: {
    color: '#64748b',
  },
  heroSplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  heroSplitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  splitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  splitLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  splitValueGreen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  splitValueRed: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f43f5e',
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  summaryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  summarySplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summarySplitItem: {
    flex: 1,
  },
  summarySplitDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPercentage: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  progressRemaining: {
    fontSize: 11,
    color: '#94a3b8',
  },
  emptyCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 10,
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
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 104 : 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
