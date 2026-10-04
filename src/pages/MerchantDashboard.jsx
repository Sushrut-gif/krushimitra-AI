import React, { useState } from 'react';
import {
  Store,
  Tag,
  QrCode,
  Briefcase,
  CheckCircle2,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import MerchantMarketplaceFeed from '../components/MerchantMarketplaceFeed';
import MerchantActiveBids from '../components/MerchantActiveBids';
import MerchantWonDeals from '../components/MerchantWonDeals';
import MerchantInwardScannerModal from '../components/MerchantInwardScannerModal';
import SolapurMarketIntelligence from '../components/SolapurMarketIntelligence';
import ErrorBoundary from '../components/ErrorBoundary';

export default function MerchantDashboard() {
  const { merchantUser, logoutMerchant } = useAuth();
  const { listings, markLotInwardDelivered } = useListings();

  // Active bottom navigation tab: 'yard' (Live Yard feed) | 'bids' (Active in-progress bids) | 'scanner' (QR Inward scan) | 'settlements' (Settlement invoices & won deals)
  const [activeTab, setActiveTab] = useState('yard');

  // Scanner modal state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerSelectedLot, setScannerSelectedLot] = useState(null);

  // Helper to identify current merchant bids
  const isMyBid = (bid) => {
    if (!bid) return false;
    const myFirm = (merchantUser?.firmName || '').toLowerCase().trim();
    const myName = (merchantUser?.name || '').toLowerCase().trim();
    const bidMerchantName = (bid.merchantName || '').toLowerCase().trim();

    if (merchantUser?.id && (bid.merchantId === merchantUser.id || bid.merchant_id === merchantUser.id)) return true;
    if (merchantUser?.licenseNo && (bid.merchantLicense === merchantUser.licenseNo || bid.licenseNo === merchantUser.licenseNo)) return true;
    if (merchantUser?.mobile && (bid.merchantPhone === merchantUser.mobile || bid.mobile === merchantUser.mobile)) return true;

    if (bidMerchantName) {
      if (myFirm && (bidMerchantName === myFirm || bidMerchantName.includes(myFirm) || myFirm.includes(bidMerchantName))) return true;
      if (myName && (bidMerchantName === myName || bidMerchantName.includes(myName) || myName.includes(bidMerchantName))) return true;
      if (bidMerchantName.includes('bhajiwala') || bidMerchantName === 'माझी फर्म') return true;
    }
    return false;
  };

  // 1. Active In-Progress Bids (Where merchant placed a bid and auction is still ongoing)
  const activeBiddedLots = (listings || []).filter((item) => {
    const s = (item?.status || '').toUpperCase();
    const isSold =
      s.includes('विक्री पूर्ण') ||
      s.includes('SOLD') ||
      s === 'SETTLED' ||
      s === 'WON' ||
      item?.paymentStatus === 'खात्यात जमा (Completed)';
    if (isSold) return false;
    return Array.isArray(item.bids) && item.bids.some(isMyBid);
  });
  const activeBidsCount = activeBiddedLots.length;

  // 2. Finalized Won Deals / Settlements count
  const wonLots = (listings || []).filter((item) => {
    const s = (item?.status || '').toUpperCase();
    return (
      s.includes('विक्री पूर्ण') ||
      s.includes('SOLD') ||
      s === 'SETTLED' ||
      s === 'WON' ||
      item?.paymentStatus === 'खात्यात जमा (Completed)'
    );
  });
  const wonCount = wonLots.length;

  const firmName = merchantUser?.firmName || merchantUser?.name || 'Bhajiwala';
  const yardName = merchantUser?.operatingYard || 'मंगळवार पेठ यार्ड';

  const handleOpenScanner = (lot = null) => {
    // If no specific lot selected, pick first pending delivery lot or general lot
    const targetLot = lot || wonLots.find((l) => !l.deliveredAtYard) || wonLots[0] || null;
    setScannerSelectedLot(targetLot);
    setIsScannerOpen(true);
  };

  const handleVerificationSuccess = (verifiedLot) => {
    if (verifiedLot?.id) {
      markLotInwardDelivered(verifiedLot.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col selection:bg-indigo-100 font-sans pb-20 md:pb-8">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Left: Brand Badge + live green dot */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🌾</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  कृषी मित्र
                </h1>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                  व्यापारी
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                सोलापूर APMC • {yardName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('yard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'yard'
                  ? 'bg-white text-indigo-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>यार्ड (Live Yard)</span>
            </button>
            <button
              onClick={() => setActiveTab('bids')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'bids'
                  ? 'bg-white text-indigo-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>माझ्या बोली</span>
              {activeBidsCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.2 rounded-full">
                  {activeBidsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleOpenScanner()}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-indigo-700 hover:bg-slate-200/60"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>आवक स्कॅन</span>
            </button>
            <button
              onClick={() => setActiveTab('settlements')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'settlements'
                  ? 'bg-white text-indigo-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>हिशोब</span>
              {wonCount > 0 && (
                <span className="bg-emerald-600 text-white font-extrabold text-[9px] px-1.5 py-0.2 rounded-full">
                  {wonCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right: Firm Badge with verified checkmark + logout icon */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100/90 py-1 px-2.5 rounded-full border border-slate-200">
              <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                {firmName}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>

            <button
              onClick={logoutMerchant}
              title="बाहेर पडा (Logout)"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN RESPONSIVE CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1 flex flex-col space-y-4">
        {/* TAB 1: LIVE YARD (Feed, Search, 3-Col Stats, Cards) */}
        {activeTab === 'yard' && (
          <ErrorBoundary>
            <MerchantMarketplaceFeed
              onSwitchToWonDeals={() => setActiveTab('settlements')}
              onSwitchToBids={() => setActiveTab('bids')}
            />
          </ErrorBoundary>
        )}

        {/* TAB 2: MY ACTIVE BIDS (Ongoing auctions where merchant placed a bid) */}
        {activeTab === 'bids' && (
          <div className="w-full">
            <ErrorBoundary>
              <MerchantActiveBids onSwitchToFeed={() => setActiveTab('yard')} />
            </ErrorBoundary>
          </div>
        )}

        {/* TAB 3: HISHOB / SETTLEMENTS (Finalized / won deals and payment invoices) */}
        {activeTab === 'settlements' && (
          <div className="w-full">
            <ErrorBoundary>
              <MerchantWonDeals onSwitchToFeed={() => setActiveTab('yard')} />
            </ErrorBoundary>
          </div>
        )}
      </main>

      {/* 3. FIXED BOTTOM NAVIGATION BAR (Shown ONLY on Mobile screens < 768px) */}
      <nav className="block md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 py-2 px-3 pb-safe flex justify-around items-center z-50 shadow-lg">
        {/* Item 1: Live Yard */}
        <button
          onClick={() => setActiveTab('yard')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            activeTab === 'yard'
              ? 'text-indigo-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px]">यार्ड</span>
        </button>

        {/* Item 2: My Bids (Active In-Progress Bids) */}
        <button
          onClick={() => setActiveTab('bids')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors relative ${
            activeTab === 'bids'
              ? 'text-indigo-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <Tag className="w-5 h-5" />
            {activeBidsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeBidsCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">माझ्या बोली</span>
        </button>

        {/* Item 3: Inward QR Scan */}
        <button
          onClick={() => handleOpenScanner()}
          className="flex flex-col items-center gap-0.5 cursor-pointer transition-colors text-slate-400 hover:text-indigo-700 font-medium"
        >
          <QrCode className="w-5 h-5 text-indigo-600" />
          <span className="text-[10px] text-slate-700 font-bold">आवक स्कॅन</span>
        </button>

        {/* Item 4: Settlements / Hishob */}
        <button
          onClick={() => setActiveTab('settlements')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors relative ${
            activeTab === 'settlements'
              ? 'text-indigo-700 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <Briefcase className="w-5 h-5" />
            {wonCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {wonCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">हिशोब</span>
        </button>
      </nav>

      {/* Inward QR Scanner Modal */}
      <MerchantInwardScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        lot={scannerSelectedLot}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </div>
  );
}

