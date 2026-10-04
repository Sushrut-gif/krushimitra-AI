import React from 'react';
import { Download, X, Share, PlusSquare, Smartphone, Zap, WifiOff, CheckCircle2 } from 'lucide-react';
import { usePWA } from '../context/PWAContext';

export default function PWAInstallPrompt() {
  const {
    isInstallable,
    isInstalled,
    isDismissed,
    isIOS,
    showIOSPrompt,
    setShowIOSPrompt,
    promptInstall,
    dismissInstallPrompt,
  } = usePWA();

  // If already running standalone or dismissed (and not explicitly opening iOS dialog)
  if (isInstalled) return null;

  return (
    <>
      {/* Native Install Banner (Android / Chrome / Desktop) */}
      {isInstallable && !isDismissed && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-950 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 p-2 shrink-0 flex items-center justify-center">
                <img
                  src="/icons/icon.svg"
                  alt="KrushiMitra Logo"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <Smartphone className="w-6 h-6 text-emerald-300" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-emerald-50 truncate">
                    कृषिमित्र ॲप फोनवर इन्स्टॉल करा
                  </h4>
                  <button
                    type="button"
                    onClick={dismissInstallPrompt}
                    className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                    title="बंद करा (Dismiss)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                  जलद सोलापूर बाजार भाव, गेटपास व विना इंटरनेट ऑफलाइन सुविधा मिळवा!
                </p>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-emerald-200/80 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <WifiOff className="w-3 h-3 text-emerald-400" /> ऑफलाइन मोड
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-300" /> ०.५ सेकंदात उघडा
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={promptInstall}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-emerald-950 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>इन्स्टॉल करा (Install Free)</span>
                  </button>
                  <button
                    type="button"
                    onClick={dismissInstallPrompt}
                    className="text-xs text-emerald-300/80 hover:text-white px-2 py-2 rounded-lg transition-colors"
                  >
                    नंतर
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari 'Add to Home Screen' Instructional Modal */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-6 text-gray-900 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">iPhone / iPad वर इन्स्टॉल करा</h3>
                  <p className="text-[11px] text-gray-500">KrushiMitra AI PWA Setup</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSPrompt(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-gray-700">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  १
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Safari चा शेअर आयकॉन दाबा</p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    खालील मेन्यूमधील <Share className="w-3.5 h-3.5 text-blue-600 inline" /> (Share) बटणावर टॅप करा.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  २
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Add to Home Screen निवडा</p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    खाली स्क्रोल करून <PlusSquare className="w-3.5 h-3.5 text-gray-700 inline" />{' '}
                    <strong>"Add to Home Screen"</strong> वर दाबा.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  ३
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">'Add' वर टॅप करा</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    वरच्या उजव्या कोपऱ्यात <strong>"Add"</strong> दाबताच ॲप तुमच्या होम स्क्रीनवर येईल!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSPrompt(false)}
              className="mt-5 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              समजले (Got it)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
