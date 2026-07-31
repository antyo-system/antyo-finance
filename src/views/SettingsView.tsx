import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Sliders,
  Sparkles,
  Trash2,
  Check,
  FileText,
  X,
  CreditCard,
  ShieldCheck,
  Languages,
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { APP_VERSION, CHANGELOG } from '../constants/changelog';
import SetRatioModal from '../components/SetRatioModal';

export default function SettingsView() {
  const { settings, updateSettings, clearAllData } = useFinanceStore();
  const [currency, setCurrency] = useState(settings.currency);
  const [language, setLanguage] = useState<'id' | 'en'>(settings.language || 'id');
  const [showChangelog, setShowChangelog] = useState(false);
  const [isRatioModalOpen, setIsRatioModalOpen] = useState(false);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrency(val);
    updateSettings({ currency: val });
  };

  const handleLanguageChange = (lang: 'id' | 'en') => {
    setLanguage(lang);
    updateSettings({ language: lang });
  };

  const handleResetData = () => {
    if (
      confirm(
        'Are you sure you want to reset all app data? This action cannot be undone.'
      )
    ) {
      clearAllData();
      alert('All transactions and budgets have been reset.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Settings
        </h1>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          App Config
        </span>
      </div>

      {/* Language Selection Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Languages className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Display Language / Bahasa
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Format compact currency suffixes (jt / rb vs M / k)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => handleLanguageChange('id')}
            className={`py-2.5 rounded-full font-extrabold text-xs transition flex items-center justify-center gap-1.5 ${
              language === 'id'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🇮🇩 Bahasa Indonesia (jt / rb)
          </button>

          <button
            onClick={() => handleLanguageChange('en')}
            className={`py-2.5 rounded-full font-extrabold text-xs transition flex items-center justify-center gap-1.5 ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🇬🇧 English (M / k)
          </button>
        </div>
      </div>

      {/* Customizable 50/30/20 Target Ratio Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                50/30/20 Target Ratio
              </h2>
              <p className="text-xs font-medium text-slate-400">
                Customize Needs, Wants & Savings target allocation
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRatioModalOpen(true)}
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs transition shadow-md shadow-blue-600/30 shrink-0"
          >
            Customize
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
            <span className="block text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
              Needs Target
            </span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100">
              {settings.needsTarget || 50}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
            <span className="block text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
              Wants Target
            </span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100">
              {settings.wantsTarget || 30}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
            <span className="block text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
              Savings Target
            </span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100">
              {settings.savingsTarget || 20}%
            </span>
          </div>
        </div>
      </div>

      {/* Currency Preferences Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Globe className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Currency Symbol
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Used across transactions, budgets & reports
            </p>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
            Currency Symbol / Code
          </label>
          <input
            type="text"
            value={currency}
            onChange={handleCurrencyChange}
            placeholder="e.g. Rp or $"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-slate-100 font-bold text-sm focus:outline-none focus:border-blue-600 transition"
          />
        </div>
      </div>

      {/* About & Release Notes Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Antyo Finance v{APP_VERSION}
              </h2>
              <p className="text-xs font-medium text-slate-400">
                Identity & Budget Decision System
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowChangelog(true)}
            className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
          >
            Release Notes
          </button>
        </div>
      </div>

      {/* Danger Zone: Data Reset */}
      <div className="bg-rose-50/60 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-rose-600 dark:text-rose-400">
              Reset Application Data
            </h2>
            <p className="text-xs font-medium text-rose-500/80">
              Clear all saved transactions and restore default budgets
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md shadow-rose-600/30 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            Reset Data
          </button>
        </div>
      </div>

      {/* Set Custom Ratio Modal */}
      <SetRatioModal
        isOpen={isRatioModalOpen}
        onClose={() => setIsRatioModalOpen(false)}
      />

      {/* Release Notes Modal */}
      {showChangelog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Changelog & Updates
              </h3>
              <button
                onClick={() => setShowChangelog(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-6">
              {CHANGELOG.map((c) => (
                <div
                  key={c.version}
                  className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                      v{c.version}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {c.date}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {c.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
