import React, { useState } from 'react';
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  Landmark,
  ArrowRight,
  TrendingUp,
  FileText,
  Smartphone,
  RefreshCw,
  Building2,
  ShieldCheck,
  ChevronRight,
  Filter,
  QrCode,
} from 'lucide-react';
import { usePayments } from '../context/PaymentsContext';
import BankCreditReceiptModal from './BankCreditReceiptModal';
import APMCGatePassModal from './APMCGatePassModal';

export default function FarmerPaymentTracker() {
  const {
    settlements,
    totalReceived,
    totalPending,
    linkedAccount,
    updateSettlementStatus,
    advanceSettlementLifecycle,
  } = usePayments();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'in_process' | 'settled'
  const [selectedReceiptSettlement, setSelectedReceiptSettlement] = useState(null);
  const [selectedGatePassLot, setSelectedGatePassLot] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [justSettledId, setJustSettledId] = useState(null);

  // Filter settlements
  const filteredSettlements = settlements.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  // Handle advancing lifecycle
  const handleAdvanceStep = (settlementId) => {
    const updated = advanceSettlementLifecycle(settlementId);
    if (updated && updated.status === 'settled') {
      setJustSettledId(settlementId);
      // Auto-open bank receipt modal when completed!
      setSelectedReceiptSettlement(updated);
      setIsReceiptModalOpen(true);
      setTimeout(() => setJustSettledId(null), 5000);
    }
  };

  const handleOpenReceipt = (settlement) => {
    setSelectedReceiptSettlement(settlement);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP SUMMARY CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Received */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-5 shadow-sm border border-emerald-700/50 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              एकूण जमा रक्कम (Total Received)
            </span>
            <span className="bg-emerald-700/60 px-2 py-0.5 rounded-full text-[10px] text-emerald-100 font-bold">
              DBT जमा
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ₹{totalReceived.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-200/90 font-medium">
            सोलापूर APMC ई-लिलाव द्वारे थेट बँक खात्यात सुरक्षित हस्तांतरित
          </div>
        </div>

        {/* Card 2: Total Pending */}
        <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white rounded-2xl p-5 shadow-sm border border-amber-500/50 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-100">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-200" />
              प्रलंबित रक्कम (Pending / Escrow)
            </span>
            <span className="bg-amber-700/60 px-2 py-0.5 rounded-full text-[10px] text-amber-100 font-bold">
              प्रक्रिया सुरू
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-100/90 font-medium">
            व्यापारी देयक पडताळणी किंवा APMC एस्क्रो खात्यातून ट्रान्सफर मार्गावर
          </div>
        </div>

        {/* Card 3: Linked Bank Account */}
        <div className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span className="flex items-center gap-1.5 text-gray-700">
              <Landmark className="w-4 h-4 text-emerald-700" />
              नोंदणीकृत बँक खाते (Linked Account)
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              सत्यापित (KYC)
            </span>
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-base sm:text-lg">
              {linkedAccount.bankName}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-600 font-mono">
              <span className="bg-gray-100 px-2 py-0.5 rounded font-bold">A/C: {linkedAccount.accountMasked}</span>
              <span className="text-gray-400">•</span>
              <span>IFSC: {linkedAccount.ifsc}</span>
            </div>
          </div>
          <div className="text-[11px] text-gray-500 truncate">
            {linkedAccount.branch}
          </div>
        </div>
      </div>

      {/* 2. FILTER TABS & PIPELINE INFO */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span>शेतमाल व्यवहार व बँक सेटलमेंट पाईपलाईन</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {settlements.length} व्यवहार
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              ई-लिलावातील सौदे, व्यापारी पडताळणी आणि थेट DBT ट्रान्सफरचा रिअल-टाइम मागोवा
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              सर्व ({settlements.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              ⏳ पेंडिंग ({settlements.filter((s) => s.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveFilter('in_process')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'in_process'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              🔄 मार्गावर ({settlements.filter((s) => s.status === 'in_process').length})
            </button>
            <button
              onClick={() => setActiveFilter('settled')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'settled'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              ✅ जमा झालेले ({settlements.filter((s) => s.status === 'settled').length})
            </button>
          </div>
        </div>

        {/* 3. SETTLEMENT CARDS STREAM */}
        {filteredSettlements.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-gray-50/60 rounded-2xl border border-gray-200">
            <div className="w-14 h-14 bg-white rounded-2xl border border-gray-200 flex items-center justify-center mx-auto text-emerald-700 shadow-2xs">
              <IndianRupee className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-gray-900">
                {settlements.length === 0
                  ? 'सध्या कोणतेही व्यवहार किंवा पेमेंट्स उपलब्ध नाहीत.'
                  : 'या वर्गवारीत कोणताही व्यवहार नाही.'}
              </h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                {settlements.length === 0
                  ? 'शेतमाल लिलाव पूर्ण होऊन व्यापाऱ्याने बोली स्वीकारल्यानंतर थेट बँक सेटलमेंट येथे दिसेल.'
                  : "सर्व व्यवहार पाहण्यासाठी 'सर्व' टॅबवर क्लिक करा."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {filteredSettlements.map((item) => {
              const isSettled = item.status === 'settled';
              const isInProcess = item.status === 'in_process';
              const isPending = item.status === 'pending';

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-xs space-y-4 ${
                    isSettled
                      ? 'border-emerald-200 hover:border-emerald-300'
                      : isInProcess
                      ? 'border-indigo-200 hover:border-indigo-300'
                      : 'border-amber-200 hover:border-amber-300'
                  }`}
                >
                  {/* Card Top: Crop, Quantity, Net Amount & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-gray-950 text-base sm:text-lg">
                          {item.cropName}
                        </h4>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 font-medium mt-0.5">
                        खरेदीदार: <strong className="text-gray-900 font-bold">{item.winningMerchant}</strong> •{' '}
                        दर: ₹{item.winningPrice?.toLocaleString('en-IN')}/{item.unit}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1">
                      <div className="text-lg sm:text-xl font-black text-emerald-800">
                        ₹{item.netAmount?.toLocaleString('en-IN')}
                        <span className="text-[10px] text-gray-500 font-normal block sm:inline ml-1">
                          (निव्वळ जमा रक्कम)
                        </span>
                      </div>
                      
                      {/* Lifecycle Status Pill */}
                      <div>
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            {item.statusLabel}
                          </span>
                        )}
                        {isInProcess && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-300">
                            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                            {item.statusLabel}
                          </span>
                        )}
                        {isSettled && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {item.statusLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* VISUAL 3-STEP PIPELINE TRACKER */}
                  <div className="bg-gray-50/80 rounded-xl p-3 sm:p-4 border border-gray-200/80 space-y-2">
                    <div className="text-[11px] font-bold text-gray-700 flex items-center justify-between">
                      <span>सेटलमेंट प्रगती (Settlement Progress):</span>
                      <span className="text-emerald-800">{item.statusDescription}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      {/* Step 1 */}
                      <div
                        className={`p-2 rounded-lg border font-bold transition-all ${
                          item.statusStep >= 1
                            ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}
                      >
                        <div className="text-xs mb-0.5">१. ⏳ देयक पडताळणी</div>
                        <div className="text-[10px] text-gray-600 font-medium">व्यापारी आवक नोंद</div>
                      </div>

                      {/* Step 2 */}
                      <div
                        className={`p-2 rounded-lg border font-bold transition-all ${
                          item.statusStep >= 2
                            ? 'bg-indigo-100/70 border-indigo-300 text-indigo-950'
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}
                      >
                        <div className="text-xs mb-0.5">२. 🔄 APMC एस्क्रो</div>
                        <div className="text-[10px] text-gray-600 font-medium">बँक ट्रान्सफर मार्ग</div>
                      </div>

                      {/* Step 3 */}
                      <div
                        className={`p-2 rounded-lg border font-bold transition-all ${
                          item.statusStep >= 3
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-2xs'
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}
                      >
                        <div className="text-xs mb-0.5">३. ✅ खात्यात जमा</div>
                        <div className="text-[10px] text-gray-600 font-medium">थेट DBT / NEFT</div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Metadata Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 pt-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <span className="text-gray-400">UTR:</span>
                        <strong className="text-gray-800">{item.utr}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        पद्धत: <strong className="text-gray-800">{item.paymentMethod}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        खाते: <strong className="text-gray-800">{item.accountMasked}</strong> ({item.bankName})
                      </span>
                    </div>

                    {/* Action Controls for Demo / Hackathon testing */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                      {/* View APMC Gate Pass Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGatePassLot({
                            id: item.lotId || item.id,
                            cropName: item.cropName,
                            crop: item.cropName,
                            quantity: item.quantity,
                            unit: item.unit || 'क्विंटल',
                            farmerName: item.farmerName || 'नोंदणीकृत शेतकरी',
                            farmerMobile: item.farmerMobile || '९८XXXXXX१२',
                            location: item.location || 'सोलापूर दक्षिण',
                            winningMerchant: item.merchantName || 'सोलापूर ॲग्रो ट्रेडर्स',
                            merchantLicense: item.merchantLicense || 'APMC/SLP/TRD-8841',
                            yard: item.yard || 'कुमठा नाका मार्केट यार्ड',
                            inwardStatus: item.inwardStatus,
                            status: item.status,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-all shadow-2xs cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                        <span>डिजिटल गेट पास (Gate Pass)</span>
                      </button>

                      {/* Simulate Bank Credit Status Button */}
                      <button
                        type="button"
                        onClick={() => handleAdvanceStep(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 transition-all shadow-2xs cursor-pointer active:scale-95"
                        title="हॅकथॉन / डेमोसाठी पेमेंट स्टेटस बदलून पाहा"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                        <span>
                          {isPending && 'पुढील टप्पा: एस्क्रो (In-Process)'}
                          {isInProcess && 'रक्कम खात्यात जमा करा (Credit)'}
                          {isSettled && 'पुन्हा तपासा (Reset Demo)'}
                        </span>
                      </button>

                      {/* View Bank Credit Slip & SMS */}
                      <button
                        type="button"
                        onClick={() => handleOpenReceipt(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer ${
                          isSettled
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>बँक पावती व SMS पहा</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Bank Credit Receipt & SMS Modal */}
      <BankCreditReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        settlement={selectedReceiptSettlement}
      />

      {/* 5. APMC QR Gate Pass Modal */}
      {selectedGatePassLot && (
        <APMCGatePassModal
          isOpen={!!selectedGatePassLot}
          onClose={() => setSelectedGatePassLot(null)}
          lot={selectedGatePassLot}
        />
      )}
    </div>
  );
}
