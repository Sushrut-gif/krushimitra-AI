import React, { useState, useEffect, useRef } from 'react';
import { WifiOff, Wifi, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePWA } from '../context/PWAContext';

export default function PWAOfflineNotice() {
  const { isOnline } = usePWA();
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
    } else if (wasOffline.current) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        wasOffline.current = false;
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  return (
    <>
      {/* Offline Alert Bar */}
      {!isOnline && (
        <aside
          aria-label="ऑफलाइन सूचना"
          className="sticky top-16 sm:top-18 z-40 bg-amber-500 text-amber-950 px-3 sm:px-4 py-2 border-b border-amber-600/40 shadow-xs flex items-center justify-between text-xs font-medium"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-800 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-900"></span>
              </span>
              <WifiOff className="w-4 h-4 text-amber-950 shrink-0" />
              <span>
                <strong>ऑफलाइन मोड सक्रिय:</strong> इंटरनेट कनेक्शन खंडित आहे. तुमच्या फोनमधील सेव्ह केलेले सोलापूर बाजार भाव व नोंदी उपलब्ध आहेत.
              </span>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="shrink-0 inline-flex items-center gap-1 bg-amber-900/15 hover:bg-amber-900/25 text-amber-950 px-2 py-1 rounded-md text-[11px] font-bold border border-amber-800/30 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>पुन्हा तपासा</span>
            </button>
          </div>
        </aside>
      )}

      {/* Reconnected Toast */}
      {showReconnected && (
        <aside
          aria-label="इंटरनेट पूर्ववत झाले"
          className="fixed top-20 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-500/50 flex items-center gap-2.5 text-xs font-semibold">
            <Wifi className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>इंटरनेट पूर्ववत जोडले गेले! डेटा समक्रमित होत आहे...</span>
          </div>
        </aside>
      )}
    </>
  );
}
