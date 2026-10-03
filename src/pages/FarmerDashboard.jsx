import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import CropQualityAssessment from '../components/CropQualityAssessment';
import ProduceListingModal from '../components/ProduceListingModal';
import FarmerActiveListings from '../components/FarmerActiveListings';
import { Clock, MapPin, Phone, Layers } from 'lucide-react';

export default function FarmerDashboard() {
  const { farmerUser } = useAuth();

  // Produce Listing Modal state
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [listingInitialData, setListingInitialData] = useState({});

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
      <div className="space-y-8">
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Clock className="w-3.5 h-3.5" />
              सोलापूर APMC बाजार: सक्रिय
            </span>
          </div>
        </div>

        {/* PROMINENT AI CROP QUALITY ASSESSMENT SECTION */}
        <section aria-label="AI Crop Quality Assessment">
          <CropQualityAssessment onListProduce={handleOpenListingModal} />
        </section>

        {/* ACTIVE PRODUCE LISTINGS SECTION */}
        <section id="active-listings-section" aria-label="Active Produce Listings">
          <FarmerActiveListings onOpenNewListing={() => handleOpenListingModal({})} />
        </section>

        {/* Future Modules Overview Shell */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
              <Layers className="w-4 h-4" />
            </div>
            <span>पुढील टप्प्यातील आगामी सुविधा (Upcoming Features)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="text-xs font-bold text-gray-800">📊 थेट APMC बाजारभाव</div>
              <p className="text-[11px] text-gray-500">सोलापूर व इतर मुख्य बाजार समित्यांचे दैनंदिन आवक व दर.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="text-xs font-bold text-gray-800">⚖️ डिजिटल लिलाव पावती</div>
              <p className="text-[11px] text-gray-500">व्यापारी सौदे व थेट बोली पावतीची त्वरित डिजिटल नोंद.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="text-xs font-bold text-gray-800">🚜 गेट पास व आवक नोंदणी</div>
              <p className="text-[11px] text-gray-500">बाजार समिती आवार प्रवेशासाठी थेट डिजिटल QR पास.</p>
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
      </div>
    </DashboardLayout>
  );
}
