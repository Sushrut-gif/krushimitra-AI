import React, { useRef } from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Landmark,
  Calendar,
  IndianRupee,
  Smartphone,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
} from 'lucide-react';

export default function BankCreditReceiptModal({ isOpen, onClose, settlement }) {
  const printRef = useRef(null);

  if (!isOpen || !settlement) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = settlement.settledAt
    ? new Date(settlement.settledAt).toLocaleString('mr-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : new Date().toLocaleString('mr-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-gray-950/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bank-receipt-title"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-white/80 hover:text-white bg-black/20 hover:bg-black/40 border border-white/20 transition-all cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-2 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-gray-950 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" />
                DBT बँक जमा पावती (Credit Advice)
              </span>
              <span className="text-[11px] text-emerald-200 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                सोलापूर APMC अधिकृत ई-पेमेंट
              </span>
            </div>

            <h2 id="bank-receipt-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
              सोलापूर कृषी उत्पन्न बाजार समिती (APMC Solapur)
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              थेट शेतकरी बँक खाते जमा प्रमाणपत्र • Direct Benefit Transfer (DBT)
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-5 flex-1 text-xs sm:text-sm bg-gray-50/50">
          
          {/* SMS ALERT NOTIFICATION SIMULATION */}
          <div className="bg-gradient-to-r from-slate-900 to-gray-900 text-white rounded-2xl p-4 shadow-lg border border-gray-700 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-amber-400 border-b border-gray-700/80 pb-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>📱 बँक अधिकृत SMS सूचना (Bank SMS Alert)</span>
              </div>
              <span className="text-[10px] text-gray-400">आत्ताच प्राप्त (Just now)</span>
            </div>

            <p className="text-xs sm:text-sm font-mono leading-relaxed text-gray-200 select-all">
              {settlement.smsAlert ||
                `Dear SBI Customer, your A/C ${settlement.accountMasked} is credited by INR ${settlement.netAmount.toLocaleString('en-IN')}.00 on 03-Oct-26 by APMC Solapur e-Payment. Ref: ${settlement.utr}. Avail Bal: INR ${(settlement.netAmount + 165000).toLocaleString('en-IN')}.00 - State Bank of India`}
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>NPCI / APMC Escrow Gate Verified • व्यवहार यशस्वी</span>
            </div>
          </div>

          {/* Printable Receipt Block */}
          <div ref={printRef} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            
            {/* Top Transaction ID Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">
                  व्यवहार संदर्भ (UTR / Transaction ID)
                </span>
                <span className="text-sm font-black text-emerald-800 font-mono">
                  {settlement.utr}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">
                  जमा दिनांक व वेळ
                </span>
                <span className="text-xs font-bold text-gray-800">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Bank & Account Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block uppercase">नोंदणीकृत बँक</span>
                <span className="font-extrabold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
                  <Landmark className="w-4 h-4 text-emerald-700 shrink-0" />
                  {settlement.bankName}
                </span>
                <span className="text-[11px] text-gray-500 block mt-0.5">{settlement.branch}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block uppercase">खाते व IFSC</span>
                <span className="font-black text-gray-900 text-xs sm:text-sm mt-0.5 block font-mono">
                  A/C: {settlement.accountMasked}
                </span>
                <span className="text-[11px] text-gray-600 block mt-0.5 font-mono">
                  IFSC: {settlement.ifsc}
                </span>
              </div>
            </div>

            {/* Produce & Deal Breakdown Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-2.5 px-3">तपशील</th>
                    <th className="py-2.5 px-3 text-right">माहिती</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2.5 px-3 text-gray-600 font-medium">शेतमाल व जात</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-gray-900">
                      {settlement.cropName} ({settlement.variety})
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-gray-600 font-medium">वजन / परिमाण</td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-800">
                      {settlement.quantity} {settlement.unit}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-gray-600 font-medium">अंतिम लिलाव दर</td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-800">
                      ₹{settlement.winningPrice?.toLocaleString('en-IN')} / {settlement.unit}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-gray-600 font-medium">खरेदीदार व्यापारी</td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-800">
                      {settlement.winningMerchant} ({settlement.merchantLicense})
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-gray-600 font-medium">एकूण लिलाव मूल्य (Gross)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-800">
                      ₹{settlement.grossAmount?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-gray-600 font-medium">बाजार समिती अधिभार (1% Cess)</td>
                    <td className="py-2.5 px-3 text-right text-rose-600 font-semibold">
                      - ₹{settlement.apmcCess?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-gray-600 font-medium">वजन व हाताळणी (0.5% Handling)</td>
                    <td className="py-2.5 px-3 text-right text-rose-600 font-semibold">
                      - ₹{settlement.handlingFee?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/80 font-black text-emerald-950 text-sm">
                    <td className="py-3 px-3">खात्यात जमा निव्वळ रक्कम (Net Credited)</td>
                    <td className="py-3 px-3 text-right text-emerald-800 text-base">
                      ₹{settlement.netAmount?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Stamp & Sign Off */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[11px] text-gray-500 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>डिजिटल स्वाक्षरीकृत व सुरक्षित व्यवहार • APMC Solapur</span>
              </div>
              <div className="text-gray-400">
                पावती क्र: {settlement.receiptId}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-100 border-t border-gray-200 p-4 sm:px-6 flex items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-gray-500 hidden sm:block">
            📌 सदर पावती अधिकृत बँक खात्यात जमा झालेल्या ई-लिलाव रकमेचा कायदेशीर पुरावा आहे.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              <span>प्रिंट करा</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 rounded-xl hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
            >
              बंद करा
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
