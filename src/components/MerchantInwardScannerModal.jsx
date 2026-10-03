import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  PackageCheck,
  Scale,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

/**
 * Merchant APMC Inward Gate Pass Scanner & Verification Modal
 * Validates real lot ID against entered code or simulated camera scan.
 * On success, updates status to 'यार्डात प्राप्त (Delivered at Yard)'.
 */
export default function MerchantInwardScannerModal({
  isOpen,
  onClose,
  lot,
  onVerificationSuccess,
}) {
  const [gatePassCodeInput, setGatePassCodeInput] = useState('');
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [successPayload, setSuccessPayload] = useState(null);

  useEffect(() => {
    if (isOpen && lot) {
      setGatePassCodeInput('');
      setErrorMsg('');
      setIsVerifying(false);
      setSuccessPayload(null);
      setIsScanningActive(true);
    }
  }, [isOpen, lot]);

  if (!isOpen || !lot) return null;

  const expectedPassId = `GP-SLP-${lot.id}`;
  const quantity = lot.quantity || 1;
  const unit = lot.unit || 'क्विंटल';
  const cropName = lot.cropName || lot.crop || 'शेतमाल';

  // Handle Verification
  const handleVerify = () => {
    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      const trimmed = gatePassCodeInput.trim();

      // Check if input matches lot.id or GP-SLP-{lot.id} or JSON payload containing passId
      let matched = false;

      if (
        trimmed === expectedPassId ||
        trimmed.toUpperCase() === expectedPassId.toUpperCase() ||
        trimmed === lot.id ||
        trimmed.toUpperCase() === lot.id.toUpperCase()
      ) {
        matched = true;
      } else {
        // Try parsing JSON if user pasted QR JSON
        try {
          const parsed = JSON.parse(trimmed);
          if (parsed && (parsed.passId === lot.id || parsed.gatePassId === expectedPassId)) {
            matched = true;
          }
        } catch {
          // not json
        }
      }

      if (matched) {
        const timestamp = new Date().toISOString();
        const payload = {
          verifiedLotId: lot.id,
          gatePassId: expectedPassId,
          verifiedAt: timestamp,
          verifiedTimeFormatted: new Date().toLocaleTimeString('mr-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setSuccessPayload(payload);
        setIsVerifying(false);
        if (onVerificationSuccess) {
          onVerificationSuccess(payload);
        }
      } else {
        setIsVerifying(false);
        setErrorMsg(`अवैध गेट पास कोड! कृपया या शेतमालाचा खरा गेट पास (${expectedPassId}) प्रविष्ट करा.`);
      }
    }, 400);
  };

  // Quick auto-fill helper for smooth testing
  const handleQuickFill = () => {
    setGatePassCodeInput(expectedPassId);
    setErrorMsg('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-indigo-400 relative my-6 animate-in fade-in-50 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border-b-2 border-indigo-500 relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500 text-white shadow-xs">
                  यार्ड माल आवक स्कॅनर
                </span>
                <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  APMC Solapur Inward
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                गेट पास पडताळणी व माल जमा (Verify Inward)
              </h3>
              <p className="text-xs text-slate-300">
                शेतकऱ्याने यार्डात आणलेल्या मालाचा QR कोड स्कॅन करून आवक निश्चित करा.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 bg-gradient-to-b from-indigo-50/20 via-white to-white">
          {/* Target Lot Summary Strip */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3 border border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{cropName}</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {lot.qualityGrade || 'Grade A'}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                शेतकरी: <strong className="text-slate-200">{lot.farmerName}</strong> • {quantity} {unit}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">अपेक्षित कोड:</span>
              <span className="font-mono text-xs font-bold text-amber-300">{expectedPassId}</span>
            </div>
          </div>

          {/* Success State */}
          {successPayload ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center space-y-4 animate-in fade-in-50 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg sm:text-xl font-black text-emerald-950">
                  माल आवक यशस्वी!
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                  गेट पास <strong className="font-mono">{successPayload.gatePassId}</strong> ची पडताळणी पूर्ण झाली आहे.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-900 font-bold bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 mt-1">
                  <span>स्थिती: यार्डात प्राप्त (Delivered at Yard)</span>
                  <span>•</span>
                  <span>{successPayload.verifiedTimeFormatted}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  पूर्ण करा व पेमेंट रिलीज करा
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Camera Scanner Simulation Viewfinder */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-indigo-500/80 p-6 text-center space-y-3">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Viewfinder Reticle */}
                  <div className="w-48 h-48 border-2 border-dashed border-emerald-400 rounded-2xl relative">
                    <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                    <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                    {/* Scanning Line Animation */}
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                </div>

                <div className="relative z-10 py-6 space-y-2">
                  <Camera className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-xs font-bold text-white">
                    कॅमेरा व्ह्यू: शेतकऱ्याचा डिजिटल गेट पास QR कोड फ्रेममध्ये धरा
                  </div>
                  <p className="text-[11px] text-slate-400">
                    किंवा खालील बॉक्समध्ये गेट पास कोड टाईप करा
                  </p>
                </div>
              </div>

              {/* Code Input Form */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <label htmlFor="gatePassCodeInput">गेट पास क्रमांक (Enter Gate Pass ID):</label>
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold underline cursor-pointer"
                  >
                    चाचणीसाठी कोड भरा ({expectedPassId})
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <QrCode className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="gatePassCodeInput"
                    type="text"
                    value={gatePassCodeInput}
                    onChange={(e) => {
                      setGatePassCodeInput(e.target.value);
                      setErrorMsg('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerify();
                    }}
                    placeholder={`उदा. ${expectedPassId}`}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl text-sm font-mono uppercase font-bold text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!gatePassCodeInput.trim() || isVerifying}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-600 hover:to-indigo-800 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PackageCheck className="w-5 h-5" />
                  <span>
                    {isVerifying ? 'पडताळणी सुरू आहे...' : 'पडताळणी करा व माल जमा करा (Verify & Receive)'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
