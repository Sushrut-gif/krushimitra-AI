import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  Landmark,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  LogOut,
  UserCheck,
  Building2,
  Clock,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { adminUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const formattedLoginTime = adminUser?.loginAt
    ? new Date(adminUser.loginAt).toLocaleTimeString('mr-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'सध्या सक्रिय';

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* 1. ADMIN TOP-BAR / HEADER SECTION */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border-2 border-slate-800 shadow-xl relative overflow-hidden">
          {/* Subtle amber ambient illumination */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                  सोलापूर APMC प्रशासकीय नियंत्रण कक्ष
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  नियंत्रण कक्ष: सक्रिय (Live Online)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  सत्र वेळ: {formattedLoginTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                सोलापूर कृषी उत्पन्न बाजार समिती प्रशासकीय नियंत्रण
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                मुख्य प्रशासकीय नियंत्रण कक्ष: शेतमाल आवक नियमन, डिजिटल QR गेट पास तपासणी, आडतदार देखरेख आणि सेस महसूल संकलन.
              </p>
            </div>

            {/* Officer Profile Badge & Prominent Logout Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="bg-slate-800/90 border border-slate-700 p-2.5 px-3.5 rounded-2xl space-y-0.5">
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-amber-400" />
                  <span>अधिकृत प्रशासक</span>
                </div>
                <div className="text-xs font-black text-white font-mono">
                  {adminUser?.id || 'APMC-SLP-ADMIN'}
                </div>
                <div className="text-[11px] text-slate-300">
                  {adminUser?.officerTitle || 'मुख्य बाजार निरीक्षक'}
                </div>
              </div>

              {/* Prominent Admin Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                title="प्रशासक सत्र समाप्त करा"
              >
                <LogOut className="w-4 h-4" />
                <span>बाहेर पडा (Admin Logout)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. ADMIN MODULES OVERVIEW */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-slate-700 via-amber-500 to-slate-900 w-full" />

          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-700" />
                  <span>प्रशासकीय कार्यप्रणाली व नियमन मॉड्यूल्स</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  सोलापूर APMC अंतर्गत कुमठा नाका व मंगळवार पेठ यार्ड नियंत्रण प्रणाली
                </p>
              </div>

              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-center">
                अधिकृत शासकीय पॅनेल
              </span>
            </div>

            {/* Quick Modules Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-slate-800 text-white font-bold text-xs">
                    🛡️ गेट पास
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    सक्रिय
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900">QR गेट पास व इनवर्ड तपासणी</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  शेतकऱ्यांनी आणलेल्या वाहनांची आणि शेतमालाची गेटवर स्कॅन पडताळणी.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-slate-800 text-white font-bold text-xs">
                    📊 थेट दर
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    सक्रिय
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900">दैनिक आवक व भाव बुलेटिन</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  सोलापूर बाजार समिती अधिकृत किमान, कमाल व मोडल दर प्रकाशन.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-slate-800 text-white font-bold text-xs">
                    ⚖️ नियामक
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    सक्रिय
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900">व्यापारी परवाना व सेस नियंत्रण</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  परवानाधारक आडतदार, थेट खरेदीदार आणि ई-लिलाव व्यवहार देखरेख.
                </p>
              </div>
            </div>

            {/* Quick Navigation Footer */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>प्रशासक सत्र सुरक्षित एन्क्रिप्टेड आहे (Session Protected)</span>
              </span>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
              >
                <span>मुख्य निवड पृष्ठावर जा</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
