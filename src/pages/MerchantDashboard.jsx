import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Store, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MerchantDashboard() {
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
              व्यापारी डॅशबोर्ड
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              बाजार समिती लिलाव बोली, खरेदीदार सौदे आणि व्यापारी देयके व्यवस्थापन.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-200">
              <TrendingUp className="w-3.5 h-3.5" />
              लिलाव सत्र: पूर्वतयारी
            </span>
          </div>
        </div>

        {/* Clean Placeholder Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {/* Deep Indigo accent top border */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-800 w-full" />
          
          <div className="p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center shadow-xs">
              <Store className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>मॉड्यूल लवकरच सुरू होत आहे</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                व्यापारी नियंत्रण कक्ष (Placeholder Shell)
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                पुढील टप्प्यात येथे थेट लिलाव बोली (Live Bidding), सौदे पावती मंजुरी, डिजिटल पेमेंट व्यवहार आणि स्टॉक व्यवस्थापन समाविष्ट होईल.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                ⚖️ थेट लिलाव बोली (Bids)
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                📄 डिजिटल बिल व सौदे
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                💳 व्यापारी खाते वही
              </span>
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 hover:text-indigo-800 transition-colors"
              >
                <span>भूमिका बदला किंवा मुख्य पृष्ठावर जा</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
