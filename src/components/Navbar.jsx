import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Sprout, Store, Landmark, ShieldCheck } from 'lucide-react';

const roleConfig = {
  farmer: {
    label: 'शेतकरी',
    labelEn: 'Farmer',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 border-emerald-200',
    dotClass: 'bg-emerald-500',
    icon: Sprout,
  },
  merchant: {
    label: 'व्यापारी',
    labelEn: 'Merchant',
    badgeClass: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 border-indigo-200',
    dotClass: 'bg-indigo-500',
    icon: Store,
  },
  admin: {
    label: 'प्रशासक (APMC)',
    labelEn: 'Admin',
    badgeClass: 'bg-slate-100 text-slate-700 ring-slate-600/20 border-slate-300',
    dotClass: 'bg-slate-500',
    icon: Landmark,
  },
};

export default function Navbar({ role }) {
  const currentRole = roleConfig[role] || roleConfig.farmer;
  const RoleIcon = currentRole.icon;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Title */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-lg p-1 -m-1 transition-all">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-gray-950 font-sans">
                  KrushiMitra <span className="text-emerald-700">AI</span>
                </span>
                <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                  (कृषिमित्र AI)
                </span>
              </div>
              <span className="text-[11px] font-medium text-gray-500 leading-tight">
                बळीराजा व बाजार समिती डिजिटल महामार्ग
              </span>
            </div>
          </Link>

          {/* Active Role Badge & Switch Role Action */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Active Role Indicator */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ring-1 ring-inset ${currentRole.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${currentRole.dotClass} animate-pulse`} />
              <RoleIcon className="w-3.5 h-3.5" />
              <span>सक्रिय कक्ष: {currentRole.label}</span>
              <span className="text-gray-400 font-normal hidden md:inline">({currentRole.labelEn})</span>
            </div>

            {/* Switch Role Link */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              title="भूमिका निवड पृष्ठावर परत जा"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-gray-500" />
              <span>भूमिका बदला</span>
              <span className="text-gray-400 hidden sm:inline text-xs">(Switch Role)</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
