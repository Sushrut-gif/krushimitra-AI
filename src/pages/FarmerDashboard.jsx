import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Sprout, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FarmerDashboard() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                शेतकरी पोर्टल • Farmer Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              शेतकरी डॅशबोर्ड
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              आपल्या पिकांची नोंद, अचूक प्रतवारी आणि APMC बाजारभाव एकाच ठिकाणी.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Clock className="w-3.5 h-3.5" />
              आजचा बाजार: सक्रिय
            </span>
          </div>
        </div>

        {/* Clean Placeholder Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {/* Emerald accent top border */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-700 w-full" />
          
          <div className="p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <Sprout className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>मॉड्यूल लवकरच सुरू होत आहे</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                शेतकरी सेवा केंद्र (Placeholder Shell)
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                पुढील टप्प्यात येथे AI पीक प्रतवारी (Quality Assessment), दैनंदिन APMC बाजारभाव, थेट लिलाव पावती आणि मालाची आवक नोंदणी सुरू होईल.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                🌱 AI प्रतवारी कॅमेरा
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                📊 थेट बाजार दर
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                📑 डिजिटल सौदे पावती
              </span>
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
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
