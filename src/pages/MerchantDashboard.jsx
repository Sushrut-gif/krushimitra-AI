import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Store, TrendingUp, ShieldCheck, MapPin, FileText, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MerchantMarketplaceFeed from '../components/MerchantMarketplaceFeed';

export default function MerchantDashboard() {
  const { merchantUser } = useAuth();

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

        {/* Primary Marketplace Feed (Live Lots, Search, Category Pills, Inspection & Bidding Cards) */}
        <MerchantMarketplaceFeed />
      </div>
    </DashboardLayout>
  );
}
