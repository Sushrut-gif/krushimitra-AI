import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  Lock,
  Phone,
  Building2,
  FileText,
  MapPin,
  Briefcase,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const OPERATING_YARDS = [
  'मंगळवार पेठ (मुख्य मार्केट यार्ड, सोलापूर)',
  'कुमठा नाका यार्ड (सोलापूर)',
  'कांदा-बटाटा मार्केट यार्ड (बाळे, सोलापूर)',
  'सिद्धेश्वर कृषी आवार (सोलापूर)',
  'मोहोळ उपबाजार आवार',
];

const MERCHANT_TYPES = [
  'अडत व्यापारी (Commission Agent / Adatya)',
  'थेट खरेदीदार (Direct Buyer / Trader)',
  'कृषी माल निर्यातक (Agri Exporter)',
  'प्रक्रियादार व मिलर्स (Processor / Miller)',
  'सहकारी संस्था प्रतिनिधी (Co-op Society Buyer)',
];

export default function MerchantAuth({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const { loginMerchant, registerMerchant, isMerchantAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after successful auth
  const from = location.state?.from?.pathname || '/merchant';

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isMerchantAuthenticated) {
      navigate('/merchant', { replace: true });
    }
  }, [isMerchantAuthenticated, navigate]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [firmName, setFirmName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [gstPan, setGstPan] = useState('');
  const [operatingYard, setOperatingYard] = useState(OPERATING_YARDS[0]);
  const [merchantType, setMerchantType] = useState(MERCHANT_TYPES[0]);
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & error handling
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Switch mode
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  // Handle Login Submit — async for Supabase
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedId = loginIdentifier.trim();
    if (!trimmedId) {
      setError('कृपया नोंदणीकृत मोबाईल नंबर किंवा APMC परवाना क्रमांक टाका.');
      return;
    }

    if (!loginPassword) {
      setError('कृपया पासवर्ड टाका.');
      return;
    }

    setLoading(true);
    const result = await loginMerchant({
      identifier: trimmedId,
      password: loginPassword,
    });
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  // Handle Register Submit — async for Supabase
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firmName.trim()) {
      setError('कृपया व्यापारी / फर्मचे नाव टाका.');
      return;
    }

    const trimmedLicense = licenseNo.trim();
    if (!trimmedLicense) {
      setError('कृपया APMC परवाना क्रमांक टाका (उदा. APMC/SLP/TRD-8841).');
      return;
    }

    const trimmedMobile = regMobile.trim();
    if (!/^\d{10}$/.test(trimmedMobile)) {
      setError('कृपया वैध १० अंकी मोबाईल नंबर टाका.');
      return;
    }

    if (!gstPan.trim()) {
      setError('कृपया GSTIN किंवा PAN क्रमांक टाका.');
      return;
    }

    if (regPassword.length < 4) {
      setError('पासवर्ड किमान ४ अक्षरे किंवा अंकांचा असावा.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setError('पासवर्ड आणि पासवर्ड पुष्टी जुळत नाहीत. कृपया पुन्हा तपासा.');
      return;
    }

    setLoading(true);
    const result = await registerMerchant({
      firmName,
      licenseNo: trimmedLicense,
      mobile: trimmedMobile,
      gstPan,
      operatingYard,
      merchantType,
      password: regPassword,
    });
    setLoading(false);

    if (result.success) {
      // If PENDING, stay on login page with advisory message
      if (result.user?.status === 'PENDING') {
        switchMode('login');
        setError('नोंदणी यशस्वी! आपला परवाना ॲडमिन पडताळणीसाठी प्रलंबित आहे. मंजुरीनंतर लॉगिन करता येईल.');
        return;
      }
      navigate('/merchant', { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white relative">
      {/* Background subtle decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-900 to-slate-950 pointer-events-none" />

      {/* Top back navigation */}
      <div className="max-w-xl w-full mx-auto relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य भूमिकेच्या पृष्ठावर परत जा (Back to Home)</span>
        </Link>
      </div>

      {/* Main Auth Container */}
      <div className="max-w-xl w-full mx-auto my-auto pt-3 pb-8 relative z-10">
        {/* Card Header & Brand */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-800 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-indigo-500/20 border border-indigo-400/30">
            <Store className="w-7 h-7 text-indigo-200" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              व्यापारी व आडतदार कक्ष
            </h1>
            <p className="text-xs sm:text-sm text-indigo-300 font-medium mt-1">
              APMC Solapur • अधिकृत परवानाधारक व्यापारी ई-लिलाव पोर्टल
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-950/80 border border-indigo-800/80 text-indigo-300">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>सोलापूर बाजार समिती प्रमाणित परवाना प्रणाली</span>
          </div>
        </div>

        {/* Auth Box */}
        <div className="bg-slate-850/90 bg-slate-800 rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Top Indigo Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-500 w-full" />

          {/* Segmented Tab Toggle */}
          <div className="p-2 border-b border-slate-700/70 bg-slate-900/60">
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                व्यापारी लॉगिन (Login)
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                नवीन नोंदणी (Register)
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {/* Inline Error Message */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    नोंदणीकृत मोबाईल नंबर किंवा परवाना क्रमांक (Mobile or License No.)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="उदा. 9822154321 किंवा APMC/SLP/TRD-8841"
                      required
                      className="block w-full pl-10 pr-4 py-2.5 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    आपला १०-अंकी मोबाईल नंबर अथवा बाजार समिती परवाना क्रमांक प्रविष्ट करा.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    पासवर्ड (Password)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="आपला पासवर्ड टाका"
                      required
                      className="block w-full pl-10 pr-10 py-2.5 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
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
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'पडताळणी करत आहे...' : 'व्यापारी कक्ष लॉगिन करा'}
                  </button>
                </div>

                {/* Switch link */}
                <div className="text-center pt-3 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
                  >
                    नवीन APMC व्यापारी? परवाना नोंदणी करा
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Firm Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    व्यापारी / फर्मचे नाव (Firm / Trader Name) <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      placeholder="उदा. सोलापूर ॲग्रो ट्रेडर्स / सिद्धेश्वर मर्चंट्स"
                      required
                      className="block w-full pl-10 pr-4 py-2 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* APMC License No & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      APMC परवाना क्रमांक (License No.) <span className="text-indigo-400">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={licenseNo}
                        onChange={(e) => setLicenseNo(e.target.value)}
                        placeholder="उदा. APMC/SLP/TRD-8841"
                        required
                        className="block w-full pl-10 pr-4 py-2 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors uppercase placeholder:normal-case placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      मोबाईल नंबर (10-Digit Mobile) <span className="text-indigo-400">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                        <span className="ml-1.5 text-xs font-medium text-slate-400 border-r border-slate-700 pr-2">
                          +91
                        </span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="उदा. 9822154321"
                        required
                        className="block w-full pl-20 pr-4 py-2 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* GSTIN / PAN & Merchant Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      GSTIN / PAN क्रमांक (Tax ID) <span className="text-indigo-400">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={gstPan}
                        onChange={(e) => setGstPan(e.target.value)}
                        placeholder="उदा. 27AABCS1429B1Z8"
                        required
                        className="block w-full pl-10 pr-4 py-2 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors uppercase placeholder:normal-case placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      व्यापारी प्रकार (Merchant Type) <span className="text-indigo-400">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <select
                        value={merchantType}
                        onChange={(e) => setMerchantType(e.target.value)}
                        className="block w-full px-3 py-2 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        {MERCHANT_TYPES.map((type) => (
                          <option key={type} value={type} className="bg-slate-900 text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Operating Yard Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    कार्यक्षेत्र यार्ड (Operating Yard in Solapur APMC) <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <select
                      value={operatingYard}
                      onChange={(e) => setOperatingYard(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      {OPERATING_YARDS.map((yard) => (
                        <option key={yard} value={yard} className="bg-slate-900 text-white">
                          {yard}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password and Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      पासवर्ड (Set Password) <span className="text-indigo-400">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="किमान ४ अक्षरे / अंक"
                        required
                        className="block w-full pl-10 pr-9 py-2 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      पासवर्ड पुष्टी (Confirm Password) <span className="text-indigo-400">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="पासवर्ड पुन्हा प्रविष्ट करा"
                        required
                        className="block w-full pl-10 pr-9 py-2 text-sm text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'नोंदणी करत आहे...' : 'अधिकृत व्यापारी नोंदणी पूर्ण करा'}
                  </button>
                </div>

                {/* Switch link */}
                <div className="text-center pt-3 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
                  >
                    आधीच परवानाधारक खाते आहे? लॉगिन करा
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-xl w-full mx-auto text-center text-xs text-slate-500 relative z-10">
        KrushiMitra AI • सोलापूर कृषी उत्पन्न बाजार समिती (APMC Solapur) अधिकृत व्यापारी महामार्ग
      </div>
    </div>
  );
}
