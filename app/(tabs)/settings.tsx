import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { APP_VERSION, CHANGELOG } from '../../src/constants/changelog';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const { settings, updateSettings, clearAllData } = useFinanceStore();
  const [changelogVisible, setChangelogVisible] = useState(false);

  const resolvedScheme = settings.theme === 'system' ? systemColorScheme : settings.theme;
  const isDark = resolvedScheme === 'dark';

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCurrencyChange = (currency: string) => {
    updateSettings({ currency });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will erase all your transactions, custom categories, and restore initial defaults. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            clearAllData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Reset Successful', 'App data has been wiped and restored.');
          },
        },
      ]
    );
  };

  const CURRENCIES = [
    { code: 'Rp', name: 'Rupiah (Rp)' },
    { code: '$', name: 'Dollar ($)' },
    { code: '€', name: 'Euro (€)' },
    { code: '£', name: 'Pound (£)' },
    { code: '¥', name: 'Yen (¥)' },
  ];

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card / Header */}
        <View style={[styles.profileCard, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#10b981" />
          </View>
          <View>
            <Text style={[styles.profileName, isDark ? styles.textWhite : styles.textDark]}>
              Conscious Planner
            </Text>
            <Text style={styles.profileSub}>Local-First Wallet</Text>
          </View>
        </View>

        {/* Currency Section */}
        <Text style={styles.sectionHeader}>Preferred Currency</Text>
        <View style={[styles.optionsGroup, isDark ? styles.cardDark : styles.cardLight]}>
          {CURRENCIES.map((curr) => {
            const isSelected = settings.currency === curr.code;
            return (
              <TouchableOpacity
                key={curr.code}
                style={[
                  styles.optionRow,
                  isSelected && (isDark ? styles.selectedRowDark : styles.selectedRowLight),
                ]}
                onPress={() => handleCurrencyChange(curr.code)}
              >
                <Text style={[styles.optionText, isDark ? styles.textWhite : styles.textDark]}>
                  {curr.name}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={18} color="#10b981" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Theme Selector */}
        <Text style={styles.sectionHeader}>Interface Theme</Text>
        <View style={[styles.themeGroup, isDark ? styles.cardDark : styles.cardLight]}>
          <TouchableOpacity
            style={[styles.themeButton, settings.theme === 'light' && styles.themeButtonActive]}
            onPress={() => handleThemeChange('light')}
          >
            <Ionicons name="sunny-outline" size={18} color={settings.theme === 'light' ? '#10b981' : '#64748b'} />
            <Text style={[styles.themeText, settings.theme === 'light' && styles.themeTextActive]}>Light</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.themeButton, settings.theme === 'dark' && styles.themeButtonActive]}
            onPress={() => handleThemeChange('dark')}
          >
            <Ionicons name="moon-outline" size={18} color={settings.theme === 'dark' ? '#10b981' : '#64748b'} />
            <Text style={[styles.themeText, settings.theme === 'dark' && styles.themeTextActive]}>Dark</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.themeButton, settings.theme === 'system' && styles.themeButtonActive]}
            onPress={() => handleThemeChange('system')}
          >
            <Ionicons name="phone-portrait-outline" size={18} color={settings.theme === 'system' ? '#10b981' : '#64748b'} />
            <Text style={[styles.themeText, settings.theme === 'system' && styles.themeTextActive]}>System</Text>
          </TouchableOpacity>
        </View>

        {/* Reset Actions */}
        <Text style={styles.sectionHeader}>Maintenance & Diagnostics</Text>
        <View style={[styles.optionsGroup, isDark ? styles.cardDark : styles.cardLight]}>
          <TouchableOpacity style={styles.optionRow} onPress={handleReset}>
            <Text style={styles.resetText}>Factory Reset Data</Text>
            <Ionicons name="trash-outline" size={18} color="#f43f5e" />
          </TouchableOpacity>
        </View>

        {/* App Info / Version Details */}
        <Text style={styles.sectionHeader}>App Details</Text>
        <View style={[styles.optionsGroup, isDark ? styles.cardDark : styles.cardLight]}>
          <TouchableOpacity style={styles.optionRow} onPress={() => setChangelogVisible(true)}>
            <View>
              <Text style={[styles.optionText, isDark ? styles.textWhite : styles.textDark]}>
                Version Updates
              </Text>
              <Text style={styles.versionSubText}>Current version v{APP_VERSION}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>"Where your money goes, your future grows."</Text>

      </ScrollView>

      {/* Changelog Modal popup */}
      <Modal visible={changelogVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Release Changelog</Text>
              <TouchableOpacity onPress={() => setChangelogVisible(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.changelogScroll} showsVerticalScrollIndicator={false}>
              {CHANGELOG.map((entry) => (
                <View key={entry.version} style={styles.changelogEntry}>
                  <View style={styles.versionHeader}>
                    <Text style={styles.versionText}>v{entry.version}</Text>
                    <Text style={styles.dateText}>{entry.date}</Text>
                  </View>
                  {entry.notes.map((note, index) => (
                    <View key={index} style={styles.noteBullet}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.noteText}>{note}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f4ea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 12,
  },
  optionsGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectedRowLight: {
    backgroundColor: '#f8fafc',
  },
  selectedRowDark: {
    backgroundColor: '#334155',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textWhite: {
    color: '#fff',
  },
  textDark: {
    color: '#0f172a',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f43f5e',
  },
  versionSubText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  themeGroup: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    padding: 6,
    marginBottom: 24,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  themeButtonActive: {
    backgroundColor: '#e6f4ea',
  },
  themeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 6,
  },
  themeTextActive: {
    color: '#10b981',
  },
  footerNote: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  changelogScroll: {
    marginBottom: 16,
  },
  changelogEntry: {
    marginBottom: 24,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  dateText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  noteBullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 6,
    lineHeight: 18,
  },
  noteText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    flex: 1,
  },
});
