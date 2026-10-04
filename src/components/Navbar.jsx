import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Sprout, Store, Landmark, User, LogOut, ShieldCheck, Download, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePWA } from '../context/PWAContext';

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
  const {
    farmerUser,
    isFarmerAuthenticated,
    logoutFarmer,
    merchantUser,
    isMerchantAuthenticated,
    logoutMerchant,
    adminUser,
    isAdminAuthenticated,
    logoutAdmin,
  } = useAuth();
  const {
    isOnline,
    isInstallable,
    isInstalled,
    isIOS,
    openInstallDialog,
  } = usePWA();
  const navigate = useNavigate();

  const handleFarmerLogout = () => {
    logoutFarmer();
    navigate('/');
  };

  const handleMerchantLogout = () => {
    logoutMerchant();
    navigate('/');
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

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

          {/* Right Section: Active Role Badge, Logged In User & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Role Indicator */}
            <div className={`hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ring-1 ring-inset ${currentRole.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${currentRole.dotClass} animate-pulse`} />
              <RoleIcon className="w-3.5 h-3.5" />
              <span>सक्रिय कक्ष: {currentRole.label}</span>
              <span className="text-gray-400 font-normal hidden lg:inline">({currentRole.labelEn})</span>
            </div>

            {/* If Farmer is Logged In: Show Name */}
            {role === 'farmer' && isFarmerAuthenticated && farmerUser && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 bg-emerald-50/80 border border-emerald-200/80 px-3 py-1.5 rounded-lg">
                <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="max-w-[120px] sm:max-w-[160px] truncate" title={farmerUser.name}>
                  {farmerUser.name}
                </span>
              </div>
            )}

            {/* If Merchant is Logged In: Show Firm Name */}
            {role === 'merchant' && isMerchantAuthenticated && merchantUser && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-3 py-1.5 rounded-lg">
                <Store className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate" title={merchantUser.firmName}>
                  {merchantUser.firmName}
                </span>
              </div>
            )}

            {/* If Admin is Logged In: Show Admin Officer Badge */}
            {role === 'admin' && isAdminAuthenticated && adminUser && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate" title={adminUser.name}>
                  {adminUser.officerTitle || 'प्रशासक'}
                </span>
              </div>
            )}

            {/* Offline Mode Badge */}
            {!isOnline && (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300"
                title="इंटरनेट कनेक्शन खंडित आहे - ऑफलाइन मोड"
              >
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">ऑफलाइन</span>
              </div>
            )}

            {/* Install PWA Button (when installable or on iOS Safari) */}
            {!isInstalled && (isInstallable || isIOS) && (
              <button
                type="button"
                onClick={openInstallDialog}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 sm:px-3 py-1.5 rounded-lg shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="कृषिमित्र ॲप फोनवर इन्स्टॉल करा"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">ॲप इन्स्टॉल करा</span>
                <span className="sm:hidden">ॲप</span>
              </button>
            )}

            {/* Switch Role Link */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              title="भूमिका निवड पृष्ठावर परत जा"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-gray-500" />
              <span>भूमिका बदला</span>
              <span className="text-gray-400 hidden sm:inline text-xs">(Switch)</span>
            </Link>

            {/* Logout Button (for logged-in farmer) */}
            {role === 'farmer' && isFarmerAuthenticated && (
              <button
                type="button"
                onClick={handleFarmerLogout}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                title="खाते लॉगआउट करा"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉगआउट</span>
                <span className="text-red-400 hidden sm:inline text-xs">(Logout)</span>
              </button>
            )}

            {/* Logout Button (for logged-in merchant) */}
            {role === 'merchant' && isMerchantAuthenticated && (
              <button
                type="button"
                onClick={handleMerchantLogout}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                title="व्यापारी खाते लॉगआउट करा"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉगआउट</span>
                <span className="text-red-400 hidden sm:inline text-xs">(Logout)</span>
              </button>
            )}

            {/* Logout Button (for logged-in admin) */}
            {role === 'admin' && isAdminAuthenticated && (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 cursor-pointer"
                title="प्रशासक खाते लॉगआउट करा"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>बाहेर पडा (Admin Logout)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
