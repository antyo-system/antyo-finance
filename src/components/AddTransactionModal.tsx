import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore } from '../store/useFinanceStore';
import * as Haptics from 'expo-haptics';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ visible, onClose }: AddTransactionModalProps) {
  const { budgets, addTransaction, settings } = useFinanceStore();
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('b1'); // Default to Food
  const [note, setNote] = useState('');

  const handleSave = () => {
    const parsedAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    let categoryName = 'Income';
    if (type === 'expense') {
      const selectedBudget = budgets.find((b) => b.id === categoryId);
      categoryName = selectedBudget ? selectedBudget.name : 'Uncategorized';
    }

    addTransaction({
      amount: parsedAmount,
      categoryId: type === 'income' ? 'income' : categoryId,
      categoryName: type === 'income' ? 'Income' : categoryName,
      type,
      date: new Date().toISOString().split('T')[0],
      note: note.trim() || undefined,
    });

    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Reset state and close
    setAmount('');
    setNote('');
    setType('expense');
    setCategoryId(budgets[0]?.id || 'b1');
    onClose();
  };

  const selectedCategoryColor = (colorName: string) => {
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Add Transaction</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close-circle" size={28} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Type Selector */}
            <View style={styles.typeSelectorContainer}>
              <TouchableOpacity
                onPress={() => {
                  setType('expense');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[
                  styles.typeButton,
                  type === 'expense' && styles.expenseActiveButton,
                ]}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={18}
                  color={type === 'expense' ? '#fff' : '#f43f5e'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'expense' ? styles.activeText : { color: '#f43f5e' },
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setType('income');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[
                  styles.typeButton,
                  type === 'income' && styles.incomeActiveButton,
                ]}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={18}
                  color={type === 'income' ? '#fff' : '#10b981'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'income' ? styles.activeText : { color: '#10b981' },
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <View style={styles.amountContainer}>
              <Text style={styles.currencyPrefix}>{settings.currency}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>

            {/* Category Selector (Only for Expenses) */}
            {type === 'expense' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Category</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesScroll}
                >
                  {budgets.map((b) => {
                    const isSelected = categoryId === b.id;
                    const catColor = selectedCategoryColor(b.color);
                    return (
                      <TouchableOpacity
                        key={b.id}
                        onPress={() => {
                          setCategoryId(b.id);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        style={[
                          styles.categoryChip,
                          isSelected && { backgroundColor: catColor, borderColor: catColor },
                        ]}
                      >
                        <Ionicons
                          name={b.icon as any}
                          size={16}
                          color={isSelected ? '#fff' : catColor}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.categoryChipText,
                            isSelected ? styles.activeText : { color: '#4b5563' },
                          ]}
                        >
                          {b.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Note Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Note</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="create-outline" size={18} color="#9ca3af" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.textInput}
                  placeholder="What was this for? (optional)"
                  placeholderTextColor="#9ca3af"
                  value={note}
                  onChangeText={setNote}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardContainer: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    padding: 2,
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  expenseActiveButton: {
    backgroundColor: '#f43f5e',
  },
  incomeActiveButton: {
    backgroundColor: '#10b981',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeText: {
    color: '#fff',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 12,
    marginBottom: 24,
  },
  currencyPrefix: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4b5563',
    marginRight: 6,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    minWidth: 120,
    textAlign: 'left',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  categoriesScroll: {
    paddingVertical: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
