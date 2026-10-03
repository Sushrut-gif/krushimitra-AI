import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import CropQualityAssessment from '../components/CropQualityAssessment';
import ProduceListingModal from '../components/ProduceListingModal';
import FarmerActiveListings from '../components/FarmerActiveListings';
import SolapurMandiRatesBanner from '../components/SolapurMandiRatesBanner';
import SolapurMandiRatesModal from '../components/SolapurMandiRatesModal';
import { Clock, MapPin, Phone, Layers, BarChart3, CheckCircle2 } from 'lucide-react';

export default function FarmerDashboard() {
  const { farmerUser } = useAuth();

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
      <div className="space-y-7">
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMandiRatesOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-2xs cursor-pointer group"
              title="सोलापूर APMC थेट बाजारभाव पहा"
            >
              <BarChart3 className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span>सोलापूर APMC थेट दर पहा</span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            </button>
          </div>
        </div>

        {/* COMPREHENSIVE SOLAPUR MANDI RATES BANNER & QUICK TICKER */}
        <section aria-label="Solapur APMC Live Mandi Rates">
          <SolapurMandiRatesBanner onOpenMandiModal={() => setIsMandiRatesOpen(true)} />
        </section>

        {/* PROMINENT AI CROP QUALITY ASSESSMENT SECTION */}
        <section aria-label="AI Crop Quality Assessment">
          <CropQualityAssessment onListProduce={handleOpenListingModal} />
        </section>

        {/* ACTIVE PRODUCE LISTINGS SECTION */}
        <section id="active-listings-section" aria-label="Active Produce Listings">
          <FarmerActiveListings onOpenNewListing={() => handleOpenListingModal({})} />
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
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">सक्रिय</span>
              </div>
              <p className="text-[11px] text-gray-600">
                धान्य, भाजीपाला, फळे, तेलबिया व गुळाचे दैनिक अधिकृत आवक व दर.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span>⚖️ डिजिटल लिलाव पावती व QR</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">सक्रिय</span>
              </div>
              <p className="text-[11px] text-gray-500">बोली स्वीकारताच अधिकृत डिजिटल पावती व गेट पास निर्मिती.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span>🤖 AI गुणवत्ता तपासणी (Vision)</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">सक्रिय</span>
              </div>
              <p className="text-[11px] text-gray-500">कॅमेरा फोटोवरून AI द्वारे प्रतवारी, रोग लक्षणे व अपेक्षित दर अंदाज.</p>
            </div>
          </div>
        </div>

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
