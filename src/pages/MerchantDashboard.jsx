import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Store, TrendingUp, ShieldCheck, MapPin, FileText, Radio, CheckCircle2, BarChart3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import MerchantMarketplaceFeed from '../components/MerchantMarketplaceFeed';
import MerchantWonDeals from '../components/MerchantWonDeals';
import SolapurMarketIntelligence from '../components/SolapurMarketIntelligence';
import ErrorBoundary from '../components/ErrorBoundary';

export default function MerchantDashboard() {
  const { merchantUser } = useAuth();
  const { listings } = useListings();
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'won_deals' | 'intelligence'

  // Count won deals
  const wonCount = (listings || []).filter((item) => item?.status && item.status.includes('विक्री पूर्ण')).length;

  return (
    <DashboardLayout role="merchant">
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                व्यापारी कक्ष • Merchant Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              {merchantUser?.firmName || 'व्यापारी डॅशबोर्ड'}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
              {merchantUser?.licenseNo && (
                <span className="inline-flex items-center gap-1 font-medium text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  <FileText className="w-3 h-3 text-indigo-600" />
                  परवाना: {merchantUser.licenseNo}
                </span>
              )}
              {merchantUser?.operatingYard && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  {merchantUser.operatingYard}
                </span>
              )}
              {merchantUser?.merchantType && (
                <span className="inline-flex items-center gap-1 text-gray-600">
                  • {merchantUser.merchantType}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              परवाना प्रमाणित
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>थेट लिलाव सत्र चालू</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation: Live Auction Feed vs Won Deals vs Market Intelligence */}
        <div className="bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/90 max-w-2xl flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-white text-indigo-950 shadow-sm ring-1 ring-black/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeTab === 'feed' ? 'text-indigo-600' : 'text-gray-400'}`} />
            <span>ई-लिलाव फीड (Live Feed)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('won_deals')}
            className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'won_deals'
                ? 'bg-white text-indigo-950 shadow-sm ring-1 ring-black/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'won_deals' ? 'text-indigo-600' : 'text-gray-400'}`} />
            <span>जिंकलेले सौदे</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
              activeTab === 'won_deals'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}>
              {wonCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('intelligence')}
            className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'intelligence'
                ? 'bg-white text-indigo-950 shadow-sm ring-1 ring-black/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <BarChart3 className={`w-4 h-4 ${activeTab === 'intelligence' ? 'text-emerald-700' : 'text-gray-400'}`} />
            <span>APMC दर व आवक इंटेलिजन्स</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'feed' && (
          <ErrorBoundary>
            <MerchantMarketplaceFeed onSwitchToWonDeals={() => setActiveTab('won_deals')} />
          </ErrorBoundary>
        )}
        {activeTab === 'won_deals' && (
          <ErrorBoundary>
            <MerchantWonDeals onSwitchToFeed={() => setActiveTab('feed')} />
          </ErrorBoundary>
        )}
        {activeTab === 'intelligence' && (
          <ErrorBoundary>
            <SolapurMarketIntelligence />
          </ErrorBoundary>
        )}
      </div>
    </DashboardLayout>
  );
}
