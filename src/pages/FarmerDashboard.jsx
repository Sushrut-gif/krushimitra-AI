import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CropQualityAssessment from '../components/CropQualityAssessment';
import ProduceListingModal from '../components/ProduceListingModal';
import FarmerActiveListings from '../components/FarmerActiveListings';
import SolapurMandiRatesModal from '../components/SolapurMandiRatesModal';
import FarmerPaymentTracker from '../components/FarmerPaymentTracker';
import SolapurMarketIntelligence from '../components/SolapurMarketIntelligence';
import ErrorBoundary from '../components/ErrorBoundary';
import { SOLAPUR_COMMODITIES } from '../data/solapurCommodities';
import {
  Home,
  Gavel,
  Plus,
  CreditCard,
  LogOut,
  TrendingUp,
  MapPin,
  Sparkles,
  BarChart3,
  Layers,
  ChevronRight,
} from 'lucide-react';

// Selected top commodities for the live Mandi ticker strip
const TOP_TICKER_IDS = [
  'onion_red',
  'pomegranate_bhagwa',
  'jowar_maldandi',
  'grapes_tas_a_ganesh',
  'soybean_yellow',
  'chana_vijay',
  'tomato_hybrid',
];

export default function FarmerDashboard() {
  const { farmerUser, logoutFarmer } = useAuth();

  // Active tab state: 'home' (produce & scan & active lots) | 'bids' (scroll/focus active lots) | 'payments' (passbook & DBT) | 'intelligence'
  const [activeTab, setActiveTab] = useState('home');

  // Produce Listing Modal state
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [listingInitialData, setListingInitialData] = useState({});

  // Reset key to restore CropQualityAssessment upload card to initial state after listing
  const [assessmentResetKey, setAssessmentResetKey] = useState(0);

  // Solapur APMC Mandi Rates Modal state
  const [isMandiRatesOpen, setIsMandiRatesOpen] = useState(false);

  // Filter ticker commodities
  const tickerItems = SOLAPUR_COMMODITIES.filter((c) =>
    TOP_TICKER_IDS.includes(c.id)
  );

  const handleOpenListingModal = (data = {}) => {
    setListingInitialData(data);
    setIsListingModalOpen(true);
  };

  const handleListingSuccess = () => {
    setAssessmentResetKey((k) => k + 1);
    setListingInitialData({});
    setActiveTab('home');

    setTimeout(() => {
      const element = document.getElementById('active-listings-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleBidsTabClick = () => {
    setActiveTab('home');
    setTimeout(() => {
      const element = document.getElementById('active-listings-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Farmer display name and location
  const farmerName = farmerUser?.name || 'सौरभ चोपाडे';
  const farmerVillage = farmerUser?.village || 'सोलापूर';

  return (
    <div className="min-h-screen bg-slate-150 sm:bg-slate-200 flex justify-center items-start selection:bg-emerald-100 font-sans">
      {/* INNER ADAPTIVE PHONE SHELL */}
      <div className="w-full min-h-screen bg-slate-50 border-0 shadow-none pb-20 sm:max-w-md sm:my-6 sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-300 sm:overflow-hidden relative flex flex-col">
        
        {/* 1. NATIVE APP STICKY HEADER */}
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
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
                  सोलापूर APMC • शेतकरी कक्ष
                </p>
              </div>
            </div>

            {/* Right: Farmer Chip & Logout */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100/90 py-1 px-2.5 rounded-full border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                  {farmerName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800 max-w-[85px] truncate">
                  {farmerName}
                </span>
              </div>
              <button
                onClick={logoutFarmer}
                title="बाहेर पडा (Logout)"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* 2. SLEEK LIVE MANDI TICKER (Horizontal swipeable strip) */}
        <div className="bg-white border-b border-slate-100 py-2.5">
          <div className="px-4 flex items-center justify-between pb-1.5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>थेट बाजारभाव (Live Mandi)</span>
            </div>
            <button
              onClick={() => setIsMandiRatesOpen(true)}
              className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>सर्व दर</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2.5 px-4 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tickerItems.map((c) => (
              <div
                key={c.id}
                onClick={() => setIsMandiRatesOpen(true)}
                className="shrink-0 bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 rounded-xl px-3 py-2 min-w-[130px] transition-colors cursor-pointer shadow-2xs"
              >
                <div className="text-[11px] font-bold text-slate-800 truncate">
                  {c.nameMr.split(' ')[0]}
                </div>
                <div className="flex items-baseline justify-between gap-1 mt-0.5">
                  <span className="text-xs font-black text-slate-900">
                    ₹{c.avgPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">
                    {c.changePercent || '+2%'}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                  दर/क्विंटल
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. MAIN SCROLLABLE CONTENT AREA */}
        <main className="flex-1 flex flex-col space-y-3 pb-6">
          {/* VIEW: HOME / ACTIVE PRODUCE LISTINGS */}
          {activeTab === 'home' && (
            <>
              {/* Scan / Upload Produce Actionable Card */}
              <div className="pt-2">
                <ErrorBoundary>
                  <CropQualityAssessment
                    key={assessmentResetKey}
                    onListProduce={handleOpenListingModal}
                  />
                </ErrorBoundary>
              </div>

              {/* Active Lots Section */}
              <div id="active-listings-section" className="space-y-2">
                <ErrorBoundary>
                  <FarmerActiveListings
                    onOpenNewListing={() => handleOpenListingModal({})}
                  />
                </ErrorBoundary>
              </div>

              {/* Quick intelligence / AI Advisor Banner */}
              <div className="mx-4 mt-2 p-3 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl text-white shadow-sm flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI सोलापूर बाजार सल्लागार</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-tight">
                    आज कांदा व डाळिंबाची विक्रमी आवक. योग्य विक्री वेळ पहा.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('intelligence')}
                  className="px-3 py-1.5 bg-white text-emerald-900 rounded-xl text-xs font-bold shrink-0 hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                >
                  तपासा &rarr;
                </button>
              </div>
            </>
          )}

          {/* VIEW: PAYMENTS & DBT TRACKER */}
          {activeTab === 'payments' && (
            <div className="p-3">
              <div className="mb-3 px-1">
                <h2 className="text-base font-extrabold text-slate-900">
                  💳 खातावही व DBT बँक पेमेंट्स
                </h2>
                <p className="text-xs text-slate-500">
                  सोलापूर APMC द्वारे थेट बँक खात्यात वर्ग झालेली रक्कम
                </p>
              </div>
              <ErrorBoundary>
                <FarmerPaymentTracker />
              </ErrorBoundary>
            </div>
          )}

          {/* VIEW: MARKET INTELLIGENCE & ADVISORY */}
          {activeTab === 'intelligence' && (
            <div className="p-3">
              <div className="mb-3 px-1 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    📊 APMC बाजारभाव व AI सल्ला
                  </h2>
                  <p className="text-xs text-slate-500">
                    दैनिक आवक, दर अंदाज आणि विक्री विश्लेषण
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('home')}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100"
                >
                  मागे
                </button>
              </div>
              <ErrorBoundary>
                <SolapurMarketIntelligence
                  onSelectCropForListing={handleOpenListingModal}
                />
              </ErrorBoundary>
            </div>
          )}
        </main>

        {/* 4. FIXED BOTTOM NAVIGATION BAR (Adaptive edge-to-edge on mobile, centered within sm shell on desktop) */}
        <nav className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-auto sm:max-w-md w-full bg-white border-t border-slate-200 py-2 px-3 pb-safe sm:pb-2 flex justify-around items-center z-50 shadow-lg">
          {/* Nav Item: Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
              activeTab === 'home'
                ? 'text-emerald-700 font-extrabold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">मुख्य</span>
          </button>

          {/* Nav Item: Bids / Auction Tracker */}
          <button
            onClick={handleBidsTabClick}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
              activeTab === 'home' && false
                ? 'text-emerald-700 font-extrabold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Gavel className="w-5 h-5" />
            <span className="text-[10px]">लिलाव</span>
          </button>

          {/* Center Elevated Action Button: New Listing */}
          <button
            onClick={() => handleOpenListingModal({})}
            className="w-12 h-12 -mt-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer border-4 border-white"
            title="नवीन माल नोंदवा (New Listing)"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Nav Item: Payments / DBT */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
              activeTab === 'payments'
                ? 'text-emerald-700 font-extrabold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px]">खातावही</span>
          </button>

          {/* Nav Item: Market Intelligence */}
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
              activeTab === 'intelligence'
                ? 'text-emerald-700 font-extrabold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px]">बाजारभाव</span>
          </button>
        </nav>

        {/* Produce Listing Modal */}
        <ProduceListingModal
          isOpen={isListingModalOpen}
          onClose={() => setIsListingModalOpen(false)}
          initialData={listingInitialData}
          onListingSuccess={handleListingSuccess}
        />

        {/* Solapur APMC Mandi Rates Modal */}
        <SolapurMandiRatesModal
          isOpen={isMandiRatesOpen}
          onClose={() => setIsMandiRatesOpen(false)}
          onSelectCropForListing={handleOpenListingModal}
        />
      </div>
    </div>
  );
}

