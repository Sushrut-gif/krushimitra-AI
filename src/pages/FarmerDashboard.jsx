import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import CropQualityAssessment from '../components/CropQualityAssessment';
import ProduceListingModal from '../components/ProduceListingModal';
import FarmerActiveListings from '../components/FarmerActiveListings';
import SolapurMandiRatesBanner from '../components/SolapurMandiRatesBanner';
import SolapurMandiRatesModal from '../components/SolapurMandiRatesModal';
import FarmerPaymentTracker from '../components/FarmerPaymentTracker';
import SolapurMarketIntelligence from '../components/SolapurMarketIntelligence';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  Clock,
  MapPin,
  Phone,
  Layers,
  BarChart3,
  CheckCircle2,
  Landmark,
  CreditCard,
  FileCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { farmerUser } = useAuth();

  // Primary active dashboard view: 'produce' (listings & bidding) | 'intelligence' (APMC rates & AI advice) | 'payments' (settlements & banking)
  const [activeDashboardTab, setActiveDashboardTab] = useState('produce');

  // Produce Listing Modal state
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [listingInitialData, setListingInitialData] = useState({});

  // Solapur APMC Mandi Rates Modal state
  const [isMandiRatesOpen, setIsMandiRatesOpen] = useState(false);

  const handleOpenListingModal = (data = {}) => {
    setListingInitialData(data);
    setIsListingModalOpen(true);
  };

  const handleListingSuccess = () => {
    // Optionally scroll down to active listings
    const element = document.getElementById('active-listings-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        {/* Header section with Farmer info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                शेतकरी पोर्टल • Farmer Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              {farmerUser?.name ? `नमस्कार, ${farmerUser.name}!` : 'शेतकरी डॅशबोर्ड'}
            </h1>

            {/* Farmer registered details chips */}
            {farmerUser && (
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-gray-200 font-medium">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {farmerUser.village}, ता. {farmerUser.taluka}, जि. {farmerUser.district}
                </span>
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-gray-200 font-medium">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  +91 {farmerUser.mobile}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveDashboardTab(activeDashboardTab === 'payments' ? 'produce' : 'payments')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                activeDashboardTab === 'payments'
                  ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600'
                  : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Landmark className="w-4 h-4 text-emerald-700" />
              <span>माझे पेमेंट्स व DBT</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveDashboardTab(activeDashboardTab === 'intelligence' ? 'produce' : 'intelligence')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer group ${
                activeDashboardTab === 'intelligence'
                  ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400'
              }`}
              title="सोलापूर APMC थेट बाजारभाव व AI सल्ला"
            >
              <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>थेट दर व AI सल्ला</span>
            </button>
          </div>
        </div>

        {/* PRIMARY NAVIGATION TABS (PRODUCE vs INTELLIGENCE vs PAYMENTS) */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveDashboardTab('produce')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeDashboardTab === 'produce'
                ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600/30'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>🌾 शेतमाल लिलाव व गुणवत्ता (Produce & Bidding)</span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('intelligence')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeDashboardTab === 'intelligence'
                ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600/30'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>📊 APMC थेट दर व AI विक्री सल्ला (Market Intelligence)</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveDashboardTab('payments')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeDashboardTab === 'payments'
                ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600/30'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>💳 माझे पेमेंट्स व बँक खाती (Payment Tracker)</span>
          </button>
        </div>

        {/* VIEW 1: PAYMENTS & SETTLEMENTS VIEW */}
        {activeDashboardTab === 'payments' && (
          <section aria-label="Farmer Payment & Bank Settlements">
            <ErrorBoundary>
              <FarmerPaymentTracker />
            </ErrorBoundary>
          </section>
        )}

        {/* VIEW 2: APMC LIVE MARKET INTELLIGENCE & AI SELLING ADVISORY */}
        {activeDashboardTab === 'intelligence' && (
          <section aria-label="Solapur APMC Market Intelligence and AI Advisor">
            <ErrorBoundary>
              <SolapurMarketIntelligence onSelectCropForListing={handleOpenListingModal} />
            </ErrorBoundary>
          </section>
        )}

        {/* VIEW 3: PRODUCE, MANDI RATES & ACTIVE LISTINGS VIEW */}
        {activeDashboardTab === 'produce' && (
          <>
            {/* COMPREHENSIVE SOLAPUR MANDI RATES BANNER & QUICK TICKER */}
            <section aria-label="Solapur APMC Live Mandi Rates">
              <ErrorBoundary>
                <SolapurMandiRatesBanner
                  onOpenMandiModal={() => setIsMandiRatesOpen(true)}
                  onOpenIntelligence={() => setActiveDashboardTab('intelligence')}
                />
              </ErrorBoundary>
            </section>

            {/* PROMINENT AI CROP QUALITY ASSESSMENT SECTION */}
            <section aria-label="AI Crop Quality Assessment">
              <ErrorBoundary>
                <CropQualityAssessment onListProduce={handleOpenListingModal} />
              </ErrorBoundary>
            </section>

            {/* ACTIVE PRODUCE LISTINGS SECTION */}
            <section id="active-listings-section" aria-label="Active Produce Listings">
              <ErrorBoundary>
                <FarmerActiveListings onOpenNewListing={() => handleOpenListingModal({})} />
              </ErrorBoundary>
            </section>

            {/* PAYMENTS PREVIEW STRIP IN PRODUCE VIEW */}
            <section id="payments-section" aria-label="Farmer Payments Overview">
              <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-950 uppercase tracking-wider">
                    <Landmark className="w-4 h-4 text-emerald-700" />
                    <span>थेट बँक खाती व पेमेंट ट्रॅकर (DBT Settlements)</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    ई-लिलावातील सौद्यांची रक्कम थेट तुमच्या स्टेट बँक खात्यात जमा होते.
                  </p>
                </div>
                <button
                  onClick={() => setActiveDashboardTab('payments')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer shrink-0"
                >
                  <span>संपूर्ण पेमेंट ट्रॅकर उघडा</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* System Overview / Modules Shell */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>डिजिटल कृषिमित्र प्रणाली स्थिती (System Features)</span>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> सोलापूर APMC लाइव्ह
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div
                  onClick={() => setIsMandiRatesOpen(true)}
                  className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-300 transition-all cursor-pointer space-y-1 group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                    <span>📊 थेट APMC बाजारभाव</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                      सक्रिय
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    धान्य, भाजीपाला, फळे, तेलबिया व गुळाचे दैनिक अधिकृत आवक व दर.
                  </p>
                </div>
                <div
                  onClick={() => setActiveDashboardTab('payments')}
                  className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-300 transition-all cursor-pointer space-y-1 group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                    <span>💳 बँक सेटलमेंट व DBT</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                      सक्रिय
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    थेट एस्क्रो व DBT ट्रान्सफरचा रिअल-टाइम मागोवा व बँक पावती.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                    <span>🤖 AI गुणवत्ता तपासणी (Vision)</span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                      सक्रिय
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    कॅमेरा फोटोवरून AI द्वारे प्रतवारी, रोग लक्षणे व अपेक्षित दर अंदाज.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

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
    </DashboardLayout>
  );
}
