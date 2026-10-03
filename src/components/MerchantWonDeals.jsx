import React, { useState } from 'react';
import { useListings } from '../context/ListingsContext';
import { usePayments } from '../context/PaymentsContext';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Phone,
  QrCode,
  ShieldCheck,
  Building,
  Scale,
  X,
  ExternalLink,
  Store,
  ArrowRight,
  TrendingUp,
  Landmark,
  BadgePercent,
  Check,
} from 'lucide-react';

export default function MerchantWonDeals({ onSwitchToFeed }) {
  const { listings, markPaymentReleased } = useListings();
  const { markSettlementSettled } = usePayments();
  const { merchantUser } = useAuth();

  const [selectedLotForInvoice, setSelectedLotForInvoice] = useState(null);
  const [selectedLotForPayment, setSelectedLotForPayment] = useState(null);
  const [celebrationToast, setCelebrationToast] = useState('');

  // 1. Filter listings where status is 'विक्री पूर्ण (Sold)'
  const wonLots = listings.filter((item) => {
    return item.status && item.status.includes('विक्री पूर्ण');
  });

  // Calculate high-level summary metrics
  const totalWonCount = wonLots.length;
  const totalPurchaseValue = wonLots.reduce((acc, curr) => {
    const qty = Number(curr.quantity) || 1;
    const rate = Number(curr.winningPrice || curr.basePrice) || 0;
    return acc + Math.round(qty * rate);
  }, 0);

  const pendingPaymentsCount = wonLots.filter((item) => item.paymentStatus !== 'खात्यात जमा (Completed)').length;
  const completedPaymentsCount = wonLots.filter((item) => item.paymentStatus === 'खात्यात जमा (Completed)').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {celebrationToast && (
        <div className="p-4 rounded-2xl bg-emerald-900/90 text-white border border-emerald-500 shadow-xl flex items-center justify-between gap-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">पेमेंट हस्तांतरण यशस्वी!</h4>
              <p className="text-xs text-emerald-200">{celebrationToast}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCelebrationToast('')}
            className="text-emerald-300 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Won Deals Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-900/50 p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                  APMC अधिकृत खरेदी नोंदवही • Settled Deals
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                माझे जिंकलेले सौदे व खरेदी बिले
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                शेतकऱ्यांनी मान्य केलेले ई-लिलाव सौदे, अधिकृत बाजार समिती खरेदी बीजक आणि एस्क्रो पेमेंट प्रणाली.
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-indigo-900/80 border border-indigo-700/80 backdrop-blur-sm self-start md:self-auto">
              <span className="text-xs font-bold text-white">
                एकूण जिंकलेले लॉट्स: <span className="text-emerald-400 text-base font-extrabold">{totalWonCount}</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-indigo-900/60">
            <div className="bg-slate-900/70 p-3 rounded-xl border border-indigo-950">
              <span className="text-[11px] text-slate-400 font-medium block">जिंकलेले सौदे</span>
              <span className="text-lg font-bold text-white">{totalWonCount} लॉट्स</span>
            </div>
            <div className="bg-slate-900/70 p-3 rounded-xl border border-indigo-950">
              <span className="text-[11px] text-slate-400 font-medium block">एकूण खरेदी रक्कम</span>
              <span className="text-lg font-bold text-emerald-400">₹{totalPurchaseValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-900/70 p-3 rounded-xl border border-indigo-950">
              <span className="text-[11px] text-slate-400 font-medium block">प्रलंबित देयके</span>
              <span className="text-lg font-bold text-amber-400">{pendingPaymentsCount} प्रलंबित</span>
            </div>
            <div className="bg-slate-900/70 p-3 rounded-xl border border-indigo-950">
              <span className="text-[11px] text-slate-400 font-medium block">पूर्ण झालेली देयके</span>
              <span className="text-lg font-bold text-indigo-300">{completedPaymentsCount} पूर्ण</span>
            </div>
          </div>
        </div>
      </div>

      {/* Won Lots Grid or Empty State */}
      {wonLots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
            <Store className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              अद्याप कोणताही जिंकलेला सौदा उपलब्ध नाही
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              थेट लिलावात शेतीमालावर आपली बोली नोंदवा. शेतकऱ्याने आपली बोली स्वीकारताच येथे अधिकृत खरेदी बिल व पेमेंट रिलीज पर्याय दिसेल.
            </p>
          </div>
          {onSwitchToFeed && (
            <button
              type="button"
              onClick={onSwitchToFeed}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <span>थेट लिलाव फीडवर जा (Live Auction Feed)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {wonLots.map((lot) => {
            const quantity = Number(lot.quantity) || 1;
            const winningRate = Number(lot.winningPrice || lot.basePrice) || 0;
            const grossAmount = Math.round(quantity * winningRate);
            const apmcCess = Math.round(grossAmount * 0.0105);
            const handling = Math.round(grossAmount * 0.005);
            const netAmount = grossAmount - (apmcCess + handling);

            const isPaid = lot.paymentStatus === 'खात्यात जमा (Completed)';

            return (
              <div
                key={lot.id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Card Top Banner */}
                <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{lot.cropName}</span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {lot.qualityGrade || 'Grade A'}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500">लॉट क्र: {lot.id} • {lot.receiptId || 'APMC-SLP-2026'}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>खात्यात जमा (Settled)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>पेमेंट प्रलंबित (Pending)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Farmer Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-gray-400 block text-[10px] font-medium">विक्रेता शेतकरी</span>
                      <span className="font-bold text-gray-900 text-xs sm:text-sm">{lot.farmerName}</span>
                      <span className="text-gray-500 block text-[11px] mt-0.5">{lot.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] font-medium">संपर्क व दिनांक</span>
                      <span className="font-semibold text-gray-800 block">{lot.farmerMobile || 'नोंदणीकृत शेतकरी'}</span>
                      <span className="text-gray-500 text-[11px] block mt-0.5">{lot.dealFinalizedAt ? new Date(lot.dealFinalizedAt).toLocaleDateString('mr-IN') : (lot.listingDate || 'आज')}</span>
                    </div>
                  </div>

                  {/* Deal Metrics: Quantity, Winning Rate & Total */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-500 block">खरेदी प्रमाण</span>
                      <span className="font-extrabold text-gray-900 text-xs sm:text-sm">
                        {lot.quantity} {lot.unit || 'क्विंटल'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                      <span className="text-[10px] text-indigo-700 block">अंतिम लिलाव दर</span>
                      <span className="font-extrabold text-indigo-950 text-xs sm:text-sm">
                        ₹{winningRate.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 block">एकूण खरेदी रक्कम</span>
                      <span className="font-extrabold text-emerald-950 text-xs sm:text-sm">
                        ₹{grossAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Reference if paid */}
                  {isPaid && lot.utr && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 flex items-center justify-between">
                      <span className="font-medium text-[11px]">बँक UTR क्रमांक:</span>
                      <span className="font-mono font-bold text-xs">{lot.utr}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="p-4 sm:p-5 pt-0 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedLotForInvoice(lot)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 flex items-center justify-center gap-2 shadow-2xs transition-colors"
                  >
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>अधिकृत खरेदी पावती (View Invoice)</span>
                  </button>

                  {isPaid ? (
                    <div className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1.5 shrink-0">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>पेमेंट जमा झाले</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedLotForPayment(lot)}
                      className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:from-emerald-700 active:to-teal-800 text-white flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all shrink-0"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>शेतकऱ्याला पेमेंट रिलीज करा</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official APMC Purchase Invoice Modal */}
      {selectedLotForInvoice && (
        <PurchaseInvoiceModal
          lot={selectedLotForInvoice}
          merchantUser={merchantUser}
          onClose={() => setSelectedLotForInvoice(null)}
        />
      )}

      {/* Payment Release Escrow Modal */}
      {selectedLotForPayment && (
        <PaymentReleaseModal
          lot={selectedLotForPayment}
          onClose={() => setSelectedLotForPayment(null)}
          onPaymentSuccess={(utrNo, netAmount) => {
            markPaymentReleased(selectedLotForPayment.id, { utr: utrNo });
            markSettlementSettled(selectedLotForPayment.id, utrNo, selectedLotForPayment);
            setSelectedLotForPayment(null);
            setCelebrationToast(`₹${netAmount.toLocaleString('en-IN')} रक्कम शेतकऱ्याच्या खात्यात जमा झाली आहे (UTR: ${utrNo}).`);
            setTimeout(() => setCelebrationToast(''), 5000);
          }}
        />
      )}
    </div>
  );
}

/**
 * Official APMC Solapur Purchase Invoice Modal
 */
function PurchaseInvoiceModal({ lot, merchantUser, onClose }) {
  const quantity = Number(lot.quantity) || 1;
  const winningRate = Number(lot.winningPrice || lot.basePrice) || 0;
  const grossAmount = Math.round(quantity * winningRate);
  const apmcCess = Math.round(grossAmount * 0.0105);
  const handling = Math.round(grossAmount * 0.005);
  const netAmount = grossAmount - (apmcCess + handling);

  const invoiceNo = `APMC/INV/SLP-${lot.id.replace('KM-', '')}`;
  const currentDateFormatted = new Date().toLocaleDateString('mr-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-3xl border border-gray-300 shadow-2xl max-w-2xl w-full overflow-hidden transition-all text-gray-900 print:m-0 print:border-none print:shadow-none">
        {/* Top APMC Solapur Visual Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
                🏛️
              </div>
              <div>
                <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
                  महाराष्ट्र शासन • कृषी पणन मंडळ
                </span>
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  सोलापूर कृषी उत्पन्न बाजार समिती (APMC Solapur)
                </h2>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  अधिकृत व्यापारी खरेदी पावती व सौदे बिल (Official APMC Purchase Bill)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors print:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300">
            <span>पावती क्र: <strong className="text-white font-mono">{invoiceNo}</strong></span>
            <span>तारीख: <strong className="text-white">{currentDateFormatted}</strong></span>
          </div>
        </div>

        {/* Invoice Body Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Parties Meta Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-wider">खरेदीदार व्यापारी (Buyer / Trader)</span>
              <span className="font-extrabold text-indigo-950 text-sm block mt-0.5">
                {merchantUser?.firmName || lot.winningMerchant || 'सोलापूर ॲग्रो ट्रेडर्स'}
              </span>
              <span className="text-gray-600 block mt-0.5">
                परवाना क्र: {merchantUser?.licenseNo || lot.merchantLicense || 'APMC/SLP/TRD-8841'}
              </span>
              <span className="text-gray-500 block">
                यार्ड: {merchantUser?.operatingYard || 'मंगळवार पेठ मुख्य मार्केट यार्ड'}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-wider">विक्रेता शेतकरी (Seller / Farmer)</span>
              <span className="font-extrabold text-gray-900 text-sm block mt-0.5">
                {lot.farmerName}
              </span>
              <span className="text-gray-600 block mt-0.5">गाव / तालुका: {lot.location}</span>
              <span className="text-gray-500 block">मोबाईल: {lot.farmerMobile || 'नोंदणीकृत शेतकरी'}</span>
            </div>
          </div>

          {/* Line Items Table Breakdown */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-[11px] font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">तपशील (Item Description)</th>
                  <th className="py-2.5 px-3 text-center">वजन / प्रमाण</th>
                  <th className="py-2.5 px-3 text-right">अंतिम लिलाव दर</th>
                  <th className="py-2.5 px-3 text-right">एकूण रक्कम</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
                <tr>
                  <td className="py-3 px-3">
                    <span className="font-bold text-gray-900 block">{lot.cropName}</span>
                    <span className="text-[11px] text-gray-500">
                      जात: {lot.variety || 'स्थानिक जात'} • AI प्रतवारी: {lot.qualityGrade || 'Grade A'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-gray-800">
                    {lot.quantity} {lot.unit || 'क्विंटल'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-gray-800">
                    ₹{winningRate.toLocaleString('en-IN')} प्रति {lot.unit || 'क्विंटल'}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-gray-950">
                    ₹{grossAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown Table */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>एकूण मूळ रक्कम (Gross Amount):</span>
              <span className="font-semibold text-gray-900">₹{grossAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>APMC बाजार सेस (Market Cess 1.05%):</span>
              <span className="font-semibold text-gray-900">₹{apmcCess.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>हमाली व तोलाई खर्च (Handling / Weighing 0.5%):</span>
              <span className="font-semibold text-gray-900">₹{handling.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-gray-300 flex justify-between text-sm font-extrabold text-indigo-950">
              <span>शेतकऱ्याला अंतिम देय रक्कम (Net Payable to Farmer):</span>
              <span className="text-base text-emerald-800">₹{netAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Official QR Gate Pass Verification Status */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 text-xs block">
                  QR गेट पास स्कॅन व पडताळणी:
                </span>
                <span className="text-[11px] text-emerald-800 font-medium">
                  सोलापूर APMC मुख्य यार्ड आवक नोंदणी मंजूर व अधिकृत.
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shrink-0">
              गेट पास अधिकृत ✓
            </span>
          </div>

          {/* Official Seals & Signature Simulation */}
          <div className="pt-4 grid grid-cols-2 gap-4 text-center border-t border-gray-200">
            <div>
              <div className="h-10 border-b border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                [डिजिटल स्वाक्षरी संलग्न]
              </div>
              <span className="text-[10px] text-gray-500 font-semibold block mt-1">खरेदीदार व्यापारी / अडतदार स्वाक्षरी</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-gray-300 flex items-center justify-center text-[10px] text-emerald-700 font-semibold">
                🏛️ APMC Solapur e-Seal
              </div>
              <span className="text-[10px] text-gray-500 font-semibold block mt-1">बाजार समिती अधिकृत डिजिटल मोहोर</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>पावती प्रिंट / सेव्ह करा (Print Bill)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Payment Release Confirmation Escrow Modal
 */
function PaymentReleaseModal({ lot, onClose, onPaymentSuccess }) {
  const quantity = Number(lot.quantity) || 1;
  const winningRate = Number(lot.winningPrice || lot.basePrice) || 0;
  const grossAmount = Math.round(quantity * winningRate);
  const apmcCess = Math.round(grossAmount * 0.0105);
  const handling = Math.round(grossAmount * 0.005);
  const netAmount = grossAmount - (apmcCess + handling);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmTransfer = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedUtr = `UTR20261003${Math.floor(100000 + Math.random() * 900000)}`;
      setIsProcessing(false);
      onPaymentSuccess(generatedUtr, netAmount);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden transition-all text-gray-900">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                शेतकऱ्याला पेमेंट रिलीज करा
              </h3>
              <p className="text-xs text-emerald-200">APMC थेट बँक हस्तांतरण (DBT / Escrow Transfer)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Produce & Deal Info */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-gray-500 block text-[10px]">शेतमाल व लॉट क्र.</span>
              <span className="font-bold text-gray-900 text-xs sm:text-sm">{lot.cropName} ({lot.quantity} {lot.unit || 'क्विंटल'})</span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block text-[10px]">देय निव्वळ रक्कम</span>
              <span className="font-extrabold text-emerald-700 text-sm sm:text-base">₹{netAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Farmer Bank Account Details */}
          <div className="space-y-2 bg-gradient-to-br from-emerald-50/70 to-teal-50/70 p-4 rounded-2xl border border-emerald-200">
            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <Landmark className="w-4 h-4 text-emerald-700" />
                <span>शेतकऱ्याचे अधिकृत बँक खाते</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                DBT प्रमाणित ✓
              </span>
            </div>

            <div className="space-y-1.5 pt-1 text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">खातेदार शेतकरी:</span>
                <span className="font-semibold text-gray-900">{lot.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">बँक नाव:</span>
                <span className="font-semibold text-gray-900">State Bank of India (SBI)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">खाते क्रमांक:</span>
                <span className="font-mono font-bold text-gray-900">****5678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IFSC कोड:</span>
                <span className="font-mono font-bold text-gray-900">SBIN0001234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">शाखा:</span>
                <span className="font-semibold text-gray-900">सोलापूर मुख्य शाखा (मंगळवार पेठ)</span>
              </div>
            </div>
          </div>

          {/* Escrow Trust Notice */}
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              बाजार समिती नियमावलीनुसार व्यापारी एस्क्रो खात्यातून थेट बँक ट्रान्सफर (DBT) द्वारे शेतकऱ्याच्या खात्यात रक्कम त्वरित जमा होईल व UTR नोंद तयार होईल.
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            रद्द करा (Cancel)
          </button>

          <button
            type="button"
            onClick={handleConfirmTransfer}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>हस्तांतरण प्रक्रिया सुरू...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>पेमेंट पुष्टी करा (Confirm & Transfer) • ₹{netAmount.toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
