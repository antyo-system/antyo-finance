import React, { useState, useEffect } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';

interface SetRatioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetRatioModal({ isOpen, onClose }: SetRatioModalProps) {
  const { settings, updateSettings } = useFinanceStore();
  const [needs, setNeeds] = useState(50);
  const [wants, setWants] = useState(30);
  const [savings, setSavings] = useState(20);

  useEffect(() => {
    if (settings) {
      setNeeds(settings.needsTarget || 50);
      setWants(settings.wantsTarget || 30);
      setSavings(settings.savingsTarget || 20);
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handlePreset = (n: number, w: number, s: number) => {
    setNeeds(n);
    setWants(w);
    setSavings(s);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      needsTarget: needs,
      wantsTarget: wants,
      savingsTarget: savings,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Mobile Bottom-Sheet Container */}
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:max-h-[90vh] max-sm:overflow-y-auto">
        {/* Mobile Drag Handle Bar */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">Set Ratio Target</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2 mb-5">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
            Popular Rule Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handlePreset(50, 30, 20)}
              className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500 text-left transition"
            >
              <span className="block text-xs font-black text-blue-600 dark:text-blue-400">50/30/20</span>
              <span className="text-[10px] text-slate-400 font-semibold">Standard</span>
            </button>
            <button
              type="button"
              onClick={() => handlePreset(60, 20, 20)}
              className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500 text-left transition"
            >
              <span className="block text-xs font-black text-amber-600 dark:text-amber-400">60/20/20</span>
              <span className="text-[10px] text-slate-400 font-semibold">High Need</span>
            </button>
            <button
              type="button"
              onClick={() => handlePreset(40, 20, 40)}
              className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500 text-left transition"
            >
              <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400">40/20/40</span>
              <span className="text-[10px] text-slate-400 font-semibold">Wealth Build</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 mb-1">
                Needs %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={needs}
                onChange={(e) => setNeeds(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-3 py-2 text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 mb-1">
                Wants %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={wants}
                onChange={(e) => setWants(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-3 py-2 text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-1">
                Savings %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={savings}
                onChange={(e) => setSavings(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl px-3 py-2 text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Apply Ratio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
