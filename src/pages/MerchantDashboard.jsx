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
import MerchantWonDeals from '../components/MerchantWonDeals';
import MerchantInwardScannerModal from '../components/MerchantInwardScannerModal';
import SolapurMarketIntelligence from '../components/SolapurMarketIntelligence';
import ErrorBoundary from '../components/ErrorBoundary';

export default function MerchantDashboard() {
  const { merchantUser, logoutMerchant } = useAuth();
  const { listings, markLotInwardDelivered } = useListings();

  // Active bottom navigation tab: 'yard' (Live Yard feed) | 'bids' (My won deals/bids) | 'scanner' (QR Inward scan) | 'settlements' (Settlement invoices)
  const [activeTab, setActiveTab] = useState('yard');

  // Scanner modal state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerSelectedLot, setScannerSelectedLot] = useState(null);

  // Won deals count
  const wonLots = (listings || []).filter((item) => item?.status && item.status.includes('विक्री पूर्ण'));
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
    <div className="min-h-screen bg-slate-150 sm:bg-slate-200 flex justify-center items-start selection:bg-indigo-100 font-sans">
      {/* INNER ADAPTIVE PHONE SHELL */}
      <div className="w-full min-h-screen bg-slate-50 border-0 shadow-none pb-20 sm:max-w-md sm:my-6 sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-300 sm:overflow-hidden relative flex flex-col">
        
        {/* 1. TOP NATIVE HEADER */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 shadow-xs">
          <div className="flex items-center justify-between">
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
                {/* Sub-bar: Clean summary pill */}
                <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                  सोलापूर APMC • {yardName}
                </p>
              </div>
            </div>

            {/* Right: Firm Badge with verified checkmark + logout icon */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100/90 py-1 px-2.5 rounded-full border border-slate-200">
                <span className="text-xs font-bold text-slate-800 max-w-[85px] truncate">
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

        {/* 2. MAIN SCROLLABLE CONTENT AREA */}
        <main className="flex-1 flex flex-col space-y-2 pb-4">
          {/* TAB 1: LIVE YARD (Feed, Search, 3-Col Stats, Cards) */}
          {activeTab === 'yard' && (
            <ErrorBoundary>
              <MerchantMarketplaceFeed onSwitchToWonDeals={() => setActiveTab('bids')} />
            </ErrorBoundary>
          )}

          {/* TAB 2: MY BIDS / WON DEALS */}
          {activeTab === 'bids' && (
            <div className="pt-2 px-1">
              <ErrorBoundary>
                <MerchantWonDeals onSwitchToFeed={() => setActiveTab('yard')} />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 3: HISHOB / SETTLEMENTS */}
          {activeTab === 'settlements' && (
            <div className="pt-2 px-1">
              <ErrorBoundary>
                <MerchantWonDeals onSwitchToFeed={() => setActiveTab('yard')} />
              </ErrorBoundary>
            </div>
          )}
        </main>

        {/* 3. PERSISTENT BOTTOM NAVIGATION BAR (Adaptive edge-to-edge on mobile, centered within sm shell on desktop) */}
        <nav className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-auto sm:max-w-md w-full bg-white border-t border-slate-200 py-2 px-3 pb-safe sm:pb-2 flex justify-around items-center z-50 shadow-lg">
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

          {/* Item 2: My Bids */}
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
              {wonCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-600 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wonCount}
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
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
              activeTab === 'settlements'
                ? 'text-indigo-700 font-extrabold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Briefcase className="w-5 h-5" />
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
    </div>
  );
}

