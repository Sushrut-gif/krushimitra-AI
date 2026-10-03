import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Phone, User, MapPin, Building, Home, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

const MAHARASHTRA_DISTRICTS = [
  'अहमदनगर (अहिल्यानगर)',
  'अकोला',
  'अमरावती',
  'औरंगाबाद (छत्रपती संभाजीनगर)',
  'बीड',
  'भंडारा',
  'बुलढाणा',
  'चंद्रपूर',
  'धुळे',
  'गडचिरोली',
  'गोंदिया',
  'हिंगोली',
  'जळगाव',
  'जालना',
  'कोल्हापूर',
  'लातूर',
  'मुंबई उपनगर',
  'नागपूर',
  'नांदेड',
  'नंदुरबार',
  'नाशिक',
  'उस्मानाबाद (धाराशिव)',
  'पालघर',
  'परभणी',
  'पुणे',
  'रायगड',
  'रत्नागिरी',
  'सांगली',
  'सातारा',
  'सिंधुदुर्ग',
  'सोलापूर',
  'ठाणे',
  'वर्धा',
  'वाशिम',
  'यवतमाळ',
];

export default function FarmerAuth({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const { loginFarmer, registerFarmer, isFarmerAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after successful auth
  const from = location.state?.from?.pathname || '/farmer';

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isFarmerAuthenticated) {
      navigate('/farmer', { replace: true });
    }
  }, [isFarmerAuthenticated, navigate]);

  // Login form state
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regVillage, setRegVillage] = useState('');
  const [regTaluka, setRegTaluka] = useState('');
  const [regDistrict, setRegDistrict] = useState(MAHARASHTRA_DISTRICTS[24]); // Default: पुणे
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & error handling
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Tab Switch
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedMobile = loginMobile.trim();
    if (!/^\d{10}$/.test(trimmedMobile)) {
      setError('कृपया वैध १० अंकी मोबाईल नंबर टाका.');
      return;
    }

    if (!loginPassword) {
      setError('कृपया पासवर्ड टाका.');
      return;
    }

    setLoading(true);
    const result = loginFarmer({
      mobile: trimmedMobile,
      password: loginPassword,
    });
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!regName.trim()) {
      setError('कृपया पूर्ण नाव टाका.');
      return;
    }

    const trimmedMobile = regMobile.trim();
    if (!/^\d{10}$/.test(trimmedMobile)) {
      setError('कृपया वैध १० अंकी मोबाईल नंबर टाका.');
      return;
    }

    if (!regVillage.trim()) {
      setError('कृपया गावाचे नाव टाका.');
      return;
    }

    if (!regTaluka.trim()) {
      setError('कृपया तालुक्याचे नाव टाका.');
      return;
    }

    if (!regDistrict.trim()) {
      setError('कृपया जिल्हा निवडा.');
      return;
    }

    if (regPassword.length < 4) {
      setError('पासवर्ड किमान ४ अक्षरे किंवा अंकांचा असावा.');
      return;
    }

    setLoading(true);
    const result = registerFarmer({
      name: regName,
      mobile: trimmedMobile,
      village: regVillage,
      taluka: regTaluka,
      district: regDistrict,
      password: regPassword,
    });
    setLoading(false);

    if (result.success) {
      navigate('/farmer', { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top back navigation */}
      <div className="max-w-md w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य भूमिकेच्या पृष्ठावर परत जा (Back to Home)</span>
        </Link>
      </div>

      {/* Main Auth Container */}
      <div className="max-w-md w-full mx-auto my-auto pt-4 pb-8">
        {/* Card Header & Brand */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center mx-auto shadow-md ring-4 ring-emerald-50">
            <Sprout className="w-8 h-8 text-emerald-100" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            शेतकरी कक्ष
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            KrushiMitra AI • बळीराजा डिजिटल महामार्ग
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Top Emerald Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-700 w-full" />

          {/* Clean Segmented Tab Toggle */}
          <div className="p-2 border-b border-gray-100 bg-gray-50/60">
            <div className="grid grid-cols-2 gap-1 p-1 bg-gray-200/70 rounded-xl">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                शेतकरी लॉगिन (Login)
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                नवीन नोंदणी (Register)
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Inline Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    मोबाईल नंबर (Mobile Number)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span className="ml-1.5 text-xs font-medium text-gray-500 border-r border-gray-300 pr-2">
                        +91
                      </span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      inputMode="numeric"
                      value={loginMobile}
                      onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="उदा. 9822012345"
                      required
                      className="block w-full pl-20 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    पासवर्ड (Password)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="आपला पासवर्ड टाका"
                      required
                      className="block w-full pl-10 pr-10 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    {loading ? 'पडताळणी करत आहे...' : 'शेतकरी लॉगिन करा'}
                  </button>
                </div>

                {/* Switch link */}
                <div className="text-center pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors focus:outline-none"
                  >
                    नवीन शेतकरी? नोंदणी करा
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    पूर्ण नाव (Full Name)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="उदा. रामराव तुकाराम पाटील"
                      required
                      className="block w-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    मोबाईल नंबर (Mobile Number)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span className="ml-1.5 text-xs font-medium text-gray-500 border-r border-gray-300 pr-2">
                        +91
                      </span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      inputMode="numeric"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="उदा. 9822012345"
                      required
                      className="block w-full pl-20 pr-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      जिल्हा (District)
                    </label>
                    <div className="relative rounded-xl shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <select
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        required
                        className="block w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      >
                        {MAHARASHTRA_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      तालुका (Taluka)
                    </label>
                    <div className="relative rounded-xl shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Building className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={regTaluka}
                        onChange={(e) => setRegTaluka(e.target.value)}
                        placeholder="उदा. बारामती / हवेली"
                        required
                        className="block w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    गाव (Village)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      placeholder="उदा. माळेगाव बुद्रुक"
                      required
                      className="block w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    पासवर्ड (Set Password)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="सुरक्षित पासवर्ड तयार करा (किमान ४ अक्षरे)"
                      required
                      className="block w-full pl-10 pr-10 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    {loading ? 'नोंदणी करत आहे...' : 'नोंदणी करा'}
                  </button>
                </div>

                {/* Switch link */}
                <div className="text-center pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors focus:outline-none"
                  >
                    आधीच खाते आहे? लॉगिन करा
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-gray-500">
        KrushiMitra AI • सुरक्षित शेतकरी नोंदणी व डेटा गोपनीयता
      </div>
    </div>
  );
}
