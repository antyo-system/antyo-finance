import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore, Budget } from '../../src/store/useFinanceStore';
import * as Haptics from 'expo-haptics';

export default function BudgetScreen() {
  const systemColorScheme = useColorScheme();
  const { budgets, updateBudgetLimit, addBudgetCategory, deleteBudgetCategory, settings } = useFinanceStore();
  const resolvedScheme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const isDark = resolvedScheme === 'dark';

  // State for limit editing
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [newLimitValue, setNewLimitValue] = useState('');

  // State for category creation
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatLimit, setNewCatLimit] = useState('');
  const [newCatColor, setNewCatColor] = useState('emerald');
  const [newCatIcon, setNewCatIcon] = useState('card');

  // Math totals
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  const formatCurrency = (val: number) => {
    return `${settings.currency} ${val.toLocaleString('id-ID')}`;
  };

  const getCategoryColor = (colorName: string) => {
    switch (colorName) {
      case 'emerald': return '#10b981';
      case 'sky': return '#0ea5e9';
      case 'orange': return '#f97316';
      case 'violet': return '#8b5cf6';
      case 'rose': return '#f43f5e';
      default: return '#6b7280';
    }
  };

  const getCategoryBg = (colorName: string) => {
    switch (colorName) {
      case 'emerald': return '#e6f4ea';
      case 'sky': return '#e0f2fe';
      case 'orange': return '#ffedd5';
      case 'violet': return '#f3e8ff';
      case 'rose': return '#ffe4e6';
      default: return '#f3f4f6';
    }
  };

  const handleSaveLimit = () => {
    if (!editingBudget) return;
    const parsedLimit = parseFloat(newLimitValue.replace(/[^0-9]/g, ''));
    if (isNaN(parsedLimit) || parsedLimit < 0) {
      alert('Please enter a valid amount');
      return;
    }

    updateBudgetLimit(editingBudget.id, parsedLimit);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setEditingBudget(null);
    setNewLimitValue('');
  };

  const handleCreateCategory = () => {
    if (!newCatName.trim()) {
      alert('Please enter a category name');
      return;
    }
    const parsedLimit = parseFloat(newCatLimit.replace(/[^0-9]/g, ''));
    if (isNaN(parsedLimit) || parsedLimit < 0) {
      alert('Please enter a valid limit');
      return;
    }

    addBudgetCategory({
      name: newCatName.trim(),
      limit: parsedLimit,
      color: newCatColor,
      icon: newCatIcon,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCreateModalVisible(false);
    setNewCatName('');
    setNewCatLimit('');
    setNewCatColor('emerald');
    setNewCatIcon('card');
  };

  const handleToDeleteBudget = (id: string) => {
    if (budgets.length <= 1) {
      alert('You must keep at least one category');
      return;
    }
    deleteBudgetCategory(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setEditingBudget(null);
  };

  const COLOR_OPTIONS = ['emerald', 'sky', 'orange', 'violet', 'rose'];
  const ICON_OPTIONS = ['card', 'fast-food', 'car', 'cart', 'receipt', 'film', 'medical', 'airplane', 'gift', 'book'];

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Plan vs Reality Summary */}
        <View style={[styles.summaryCard, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Total Planned</Text>
              <Text style={[styles.summaryLimitText, isDark ? styles.textWhite : styles.textDark]}>
                {formatCurrency(totalLimit)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryCol}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={[styles.summarySpentText, totalSpent > totalLimit ? styles.textRose : isDark ? styles.textWhite : styles.textDark]}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
          </View>
        </View>

        {/* Categories List */}
        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            Categories
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setCreateModalVisible(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons name="add" size={18} color="#10b981" />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {budgets.map((b) => {
          const ratio = b.limit > 0 ? b.spent / b.limit : 0;
          const isOver = ratio > 1.0;
          const isWarning = ratio > 0.8 && ratio <= 1.0;
          const pct = Math.round(ratio * 100);
          const colorVal = getCategoryColor(b.color);

          let statusText = 'Under Budget';
          let statusColor = '#10b981';
          if (isOver) {
            statusText = 'Over Budget';
            statusColor = '#f43f5e';
          } else if (isWarning) {
            statusText = 'Approaching Limit';
            statusColor = '#f59e0b';
          }

          return (
            <TouchableOpacity
              key={b.id}
              activeOpacity={0.9}
              style={[styles.budgetCard, isDark ? styles.cardDark : styles.cardLight]}
              onPress={() => {
                setEditingBudget(b);
                setNewLimitValue(b.limit.toString());
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              {/* Card Header info */}
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: getCategoryBg(b.color) }]}>
                  <Ionicons name={b.icon as any} size={20} color={colorVal} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.catName, isDark ? styles.textWhite : styles.textDark]}>
                    {b.name}
                  </Text>
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {statusText}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.percentageText}>{pct}%</Text>
                  <Text style={styles.limitsComparisonText}>
                    {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(100, pct)}%`,
                      backgroundColor: statusColor,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Editing Limit Modal */}
      {editingBudget && (
        <Modal visible={!!editingBudget} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Budget for {editingBudget.name}</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.currencyLabel}>{settings.currency}</Text>
                <TextInput
                  style={styles.limitInput}
                  keyboardType="numeric"
                  value={newLimitValue}
                  onChangeText={setNewLimitValue}
                  autoFocus
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={() => handleToDeleteBudget(editingBudget.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.buttonTextWhite}>Delete</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEditingBudget(null)}
                  >
                    <Text style={styles.buttonTextCancel}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleSaveLimit}
                  >
                    <Text style={styles.buttonTextWhite}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Creating Category Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Custom Category</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Subscriptions"
              value={newCatName}
              onChangeText={setNewCatName}
            />

            <Text style={styles.label}>Monthly Limit</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencyLabel}>{settings.currency}</Text>
              <TextInput
                style={styles.limitInput}
                keyboardType="numeric"
                placeholder="0"
                value={newCatLimit}
                onChangeText={setNewCatLimit}
              />
            </View>

            {/* Colors */}
            <Text style={styles.label}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {COLOR_OPTIONS.map((c) => {
                const isSelected = newCatColor === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setNewCatColor(c)}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: getCategoryColor(c) },
                      isSelected && styles.selectedCircle,
                    ]}
                  />
                );
              })}
            </ScrollView>

            {/* Icons */}
            <Text style={styles.label}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
              {ICON_OPTIONS.map((i) => {
                const isSelected = newCatIcon === i;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setNewCatIcon(i)}
                    style={[
                      styles.iconCircle,
                      isSelected && { backgroundColor: '#e6f4ea', borderColor: '#10b981' },
                    ]}
                  >
                    <Ionicons name={i as any} size={20} color={isSelected ? '#10b981' : '#6b7280'} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActionsRight}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.buttonTextCancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateCategory}
              >
                <Text style={styles.buttonTextWhite}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
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
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryCol: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryLimitText: {
    fontSize: 18,
    fontWeight: '700',
  },
  summarySpentText: {
    fontSize: 18,
    fontWeight: '700',
  },
  textWhite: {
    color: '#fff',
  },
  textDark: {
    color: '#0f172a',
  },
  textRose: {
    color: '#f43f5e',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 4,
  },
  budgetCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  limitsComparisonText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginRight: 6,
  },
  limitInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  modalActionsRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#111827',
  },
  deleteButton: {
    backgroundColor: '#f43f5e',
    flexDirection: 'row',
  },
  buttonTextWhite: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonTextCancel: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  selectedCircle: {
    borderWidth: 3,
    borderColor: '#0f172a',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
