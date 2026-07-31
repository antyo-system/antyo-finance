import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Info, RotateCcw, ShieldCheck, Sliders } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { APP_VERSION, CHANGELOG } from '../constants/changelog';

export default function SettingsView() {
  const { settings, updateSettings, clearAllData } = useFinanceStore();
  const [showChangelog, setShowChangelog] = useState(false);

  const CURRENCY_OPTIONS = [
    { label: 'Indonesian Rupiah (Rp)', value: 'Rp' },
    { label: 'US Dollar ($)', value: '$' },
    { label: 'Euro (€)', value: '€' },
    { label: 'British Pound (£)', value: '£' },
  ];

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all data? This will reset all budgets and clear all transactions.')) {
      clearAllData();
      alert('All app data has been reset successfully.');
    }
  };

  const handleRatioChange = (key: 'needsTarget' | 'wantsTarget' | 'savingsTarget', value: number) => {
    updateSettings({ [key]: value });
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl w-full max-w-full overflow-x-hidden">
      {/* Clean Minimalist Title */}
      <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
        Settings
      </h1>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-5 shadow-xs w-full min-w-0">
        <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <SettingsIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">Preferences</h2>
            <p className="text-[11px] font-medium text-slate-400">Formatting & theme configuration</p>
          </div>
        </div>

        {/* Currency Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-0.5">Currency Symbol</label>
            <p className="text-[11px] font-medium text-slate-400">Used for formatting financial amounts.</p>
          </div>
          <select
            value={settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm focus:outline-none focus:border-blue-600 transition"
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-0.5">App Theme</label>
            <p className="text-[11px] font-medium text-slate-400">Select light or dark visual mode.</p>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-full">
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'system' })}
              className={`py-1.5 rounded-full text-xs font-bold transition ${
                settings.theme === 'system'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              System
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`py-1.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-1 ${
                settings.theme === 'dark'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Dark
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'light' })}
              className={`py-1.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-1 ${
                settings.theme === 'light'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Light
            </button>
          </div>
        </div>
      </div>

      {/* Customizable 50/30/20 Ratio Target Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xs w-full min-w-0">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">Custom Budget Ratio Targets</h2>
            <p className="text-[11px] font-medium text-slate-400">Customize target allocation percentages (Default 50/30/20)</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 mb-1">Needs Target %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.needsTarget}
              onChange={(e) => handleRatioChange('needsTarget', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-3 py-2 text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 mb-1">Wants Target %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.wantsTarget}
              onChange={(e) => handleRatioChange('wantsTarget', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-3 py-2 text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-1">Savings Target %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.savingsTarget}
              onChange={(e) => handleRatioChange('savingsTarget', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-3 py-2 text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* About & Security */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xs w-full min-w-0">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">About Antyo Finance</h2>
              <p className="text-[11px] font-medium text-slate-400">Version {APP_VERSION} (Web Edition)</p>
            </div>
          </div>
          <button
            onClick={() => setShowChangelog(true)}
            className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
          >
            Release Notes
          </button>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div className="text-[11px] text-slate-600 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-slate-100 mb-0.5">100% Local-First Data Privacy</p>
            Stored locally in your browser's <code className="text-blue-600 font-bold">localStorage</code>. No external tracking.
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/30 rounded-3xl p-4 sm:p-6 space-y-3 shadow-xs w-full min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-rose-500 dark:text-rose-400">Data Reset</h2>
            <p className="text-[11px] font-medium text-slate-400">Clear all local budgets and transactions</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-500/30 transition"
        >
          Factory Reset Data
        </button>
      </div>

      {/* Release Notes Modal */}
      {showChangelog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Release Notes</h3>
              <button
                onClick={() => setShowChangelog(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-6">
              {CHANGELOG.map((c) => (
                <div key={c.version} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400">v{c.version}</span>
                    <span className="text-xs font-semibold text-slate-400">{c.date}</span>
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
