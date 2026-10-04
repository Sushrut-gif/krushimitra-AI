import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { usePWA } from '../context/PWAContext';

export default function PWAUpdateToast() {
  const { isUpdateAvailable, updateApp } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isUpdateAvailable || dismissed) return null;

  return (
    <aside
      aria-label="ॲप अपडेट सूचना"
      className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-top-3 duration-300"
    >
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">
              KrushiMitra AI ची नवीन आवृत्ती उपलब्ध आहे
            </p>
            <p className="text-[11px] text-slate-300">
              नवीन सुधारणा व सोलापूर APMC दर मिळवण्यासाठी अपडेट करा.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={updateApp}
            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
            <span>अपडेट करा</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-md"
            title="रद्द करा"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
