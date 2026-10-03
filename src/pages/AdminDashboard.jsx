import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Landmark, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                APMC प्रशासकीय कक्ष • Market Committee Admin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              APMC प्रशासकीय नियंत्रण
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              कृषी उत्पन्न बाजार समिती आवक नियंत्रण, गेट पास पडताळणी व नियामक देखरेख.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              सिस्टम स्थिती: सामान्य (Online)
            </span>
          </div>
        </div>

        {/* Clean Placeholder Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          {/* Slate accent top border */}
          <div className="h-1.5 bg-gradient-to-r from-slate-600 to-slate-900 w-full" />
          
          <div className="p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 mx-auto flex items-center justify-center shadow-xs">
              <Landmark className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>मॉड्यूल लवकरच सुरू होत आहे</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                APMC प्रशासकीय केंद्र (Placeholder Shell)
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                पुढील टप्प्यात येथे गेट पास व्यवस्थापन (QR Gate Pass), वाहन आवक-जावक नोंद, बाजार समिती सेस वसुली व व्यापारी परवाना व्यवस्थापन उपलब्ध होईल.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                🛡️ QR गेट पास व आवक
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                📈 सेस संकलन व महसूल
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                🏢 आडतदार परवाना नियंत्रण
              </span>
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
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
