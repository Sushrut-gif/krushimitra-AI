import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Store, Landmark, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const roles = [
  {
    id: 'farmer',
    path: '/farmer',
    badge: 'अन्नदाता व शेतकरी वर्ग',
    title: 'शेतकरी कक्ष',
    titleEn: 'Farmer Portal',
    description: 'पिकांची अचूक AI प्रतवारी, थेट बाजारभाव दर, आवक नोंदणी आणि पारदर्शक लिलाव प्रक्रिया.',
    icon: Sprout,
    accent: {
      borderHover: 'hover:border-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
      cardRing: 'group-hover:ring-2 group-hover:ring-emerald-500/20',
      glow: 'group-hover:shadow-emerald-500/10',
    },
    features: ['AI धान्य प्रतवारी', 'थेट बाजारभाव माहिती', 'डिजिटल सौदे पावती'],
  },
  {
    id: 'merchant',
    path: '/merchant',
    badge: 'खरेदीदार व परवानाधारक आडतदार',
    title: 'व्यापारी कक्ष',
    titleEn: 'Merchant Portal',
    description: 'सक्रिय लिलाव बोली (Auction Bidding), डिजिटल सौदे पावती, व्यापारी देयके व स्टॉक ट्रॅकिंग.',
    icon: Store,
    accent: {
      borderHover: 'hover:border-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
      cardRing: 'group-hover:ring-2 group-hover:ring-indigo-500/20',
      glow: 'group-hover:shadow-indigo-500/10',
    },
    features: ['थेट लिलाव बोली', 'त्वरित सौदे मान्यता', 'अधिकृत खरेदी नोंद'],
  },
  {
    id: 'admin',
    path: '/admin',
    badge: 'बाजार समिती नियंत्रण कक्ष',
    title: 'APMC प्रशासकीय कक्ष',
    titleEn: 'Market Committee Admin',
    description: 'आवक-जावक व्यवस्थापन, गेट पास पडताळणी, सेस कर संकलन आणि आवार नियमन देखरेख.',
    icon: Landmark,
    accent: {
      borderHover: 'hover:border-slate-600',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white',
      button: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-500',
      cardRing: 'group-hover:ring-2 group-hover:ring-slate-500/20',
      glow: 'group-hover:shadow-slate-500/10',
    },
    features: ['गेट पास व आवक नोंद', 'बाजार समिती सेस व्यवस्थापन', 'थेट डॅशबोर्ड अहवाल'],
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const { isFarmerAuthenticated, isMerchantAuthenticated, isAdminAuthenticated } = useAuth();

  const handleRoleClick = (roleId) => {
    if (roleId === 'farmer') {
      navigate(isFarmerAuthenticated ? '/farmer' : '/farmer/login');
    } else if (roleId === 'merchant') {
      navigate(isMerchantAuthenticated ? '/merchant' : '/merchant/login');
    } else {
      navigate(isAdminAuthenticated ? '/admin' : '/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Subtle Header */}
      <header className="w-full border-b border-gray-200/80 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-900 tracking-tight text-sm sm:text-base">
              KrushiMitra AI <span className="text-gray-400 font-normal">|</span> कृषिमित्र AI
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>अधिकृत APMC डिजिटल प्रणाली</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-6xl w-full mx-auto text-center space-y-10">
          
          {/* Hero Header */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              कृषी बाजार समिती एकात्मिक महामार्ग
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight sm:leading-tight">
              KrushiMitra AI (कृषिमित्र AI)
              <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-800 mt-2 font-sans">
                बळीराजा व बाजार समिती डिजिटल महामार्ग
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              शेतकरी, परवानाधारक व्यापारी आणि बाजार समिती प्रशासन यांना एकाच विश्वासार्ह, पारदर्शक व आधुनिक व्यासपीठावर जोडणारी प्रणाली. कृपया पुढे जाण्यासाठी आपली भूमिका निवडा.
            </p>
          </div>

          {/* 3 Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left max-w-5xl mx-auto pt-2">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => handleRoleClick(role.id)}
                  className={`group relative bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${role.accent.borderHover} ${role.accent.cardRing} ${role.accent.glow}`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Category Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <div className={`w-13 h-13 rounded-xl flex items-center justify-center p-3 transition-colors duration-200 ${role.accent.iconBg}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${role.accent.badgeBg}`}>
                        {role.badge}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="pt-2">
                      <h2 className="text-xl font-bold text-gray-950 group-hover:text-gray-900 transition-colors">
                        {role.title}
                      </h2>
                      <p className="text-xs font-medium text-gray-500 tracking-wide mt-0.5">
                        {role.titleEn}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed min-h-[4rem]">
                      {role.description}
                    </p>

                    {/* Key features bullet points */}
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      {role.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-6 mt-2">
                    <button
                      type="button"
                      className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-2 ${role.accent.button}`}
                    >
                      <span>प्रवेश करा (Enter Portal)</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 border-t border-gray-200/80 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              १००% पारदर्शक डिजिटल लिलाव
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              थेट व्यापारी-शेतकरी सौदे
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              APMC नियमावलीनुसार प्रमाणीकृत
            </span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60 py-4 text-center text-xs text-gray-500">
        <p>KrushiMitra AI © 2026 • कृषिमित्र AI - बळीराजा व बाजार समिती डिजिटल महामार्ग • सर्व हक्क राखीव</p>
      </footer>
    </div>
  );
}
