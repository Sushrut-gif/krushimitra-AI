import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MAHARASHTRA_LOCATIONS } from '../data/maharashtraLocations';
import SearchableSelect from '../components/SearchableSelect';
import {
  Sprout,
  Lock,
  Phone,
  User,
  MapPin,
  Building,
  Home,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  RotateCcw,
  Edit3,
} from 'lucide-react';

export default function FarmerAuth({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const { loginFarmer, registerFarmer, isFarmerAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after successful auth
  const from = location.state?.from?.pathname || '/farmer';

  // If already authenticated, redirect immediately
  useEffect(() => {
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
  
  // Cascading Location state: District -> Taluka -> Village
  const [regDistrict, setRegDistrict] = useState('');
  const [regTaluka, setRegTaluka] = useState('');
  const [regVillage, setRegVillage] = useState('');
  const [isCustomVillage, setIsCustomVillage] = useState(false);
  const [customVillageText, setCustomVillageText] = useState('');

  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & error handling
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Derive available talukas based on selected district
  const selectedDistrictObj = MAHARASHTRA_LOCATIONS.find(
    (d) => d.nameMr === regDistrict || d.nameEn === regDistrict || d.id === regDistrict
  );
  const availableTalukas = selectedDistrictObj ? selectedDistrictObj.talukas : [];

  // Derive available villages based on selected taluka
  const selectedTalukaObj = availableTalukas.find(
    (t) => t.nameMr === regTaluka || t.nameEn === regTaluka || t.id === regTaluka
  );
  const availableVillages = selectedTalukaObj ? selectedTalukaObj.villages : [];

  // Handle District change
  const handleDistrictChange = (selectedDistrictName) => {
    setRegDistrict(selectedDistrictName);
    setRegTaluka('');
    setRegVillage('');
    setIsCustomVillage(false);
    setCustomVillageText('');
    setError('');
  };

  // Handle Taluka change
  const handleTalukaChange = (selectedTalukaName) => {
    setRegTaluka(selectedTalukaName);
    setRegVillage('');
    setIsCustomVillage(false);
    setCustomVillageText('');
    setError('');
  };

  // Handle Village change from dropdown
  const handleVillageChange = (selectedVillageName) => {
    setRegVillage(selectedVillageName);
    setIsCustomVillage(false);
    setError('');
  };

  // Handle choosing custom village
  const handleCustomVillageSelect = () => {
    setIsCustomVillage(true);
    setRegVillage('');
    setError('');
  };

  // Switch back to village dropdown list
  const handleBackToVillageList = () => {
    setIsCustomVillage(false);
    setCustomVillageText('');
    setRegVillage('');
  };

  // Handle Tab Switch
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  // Handle Login Submit — async for Supabase
  const handleLoginSubmit = async (e) => {
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
    const result = await loginFarmer({
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

  // Handle Register Submit — async for Supabase
  const handleRegisterSubmit = async (e) => {
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

    if (!regDistrict.trim()) {
      setError('कृपया जिल्हा निवडा.');
      return;
    }

    if (!regTaluka.trim()) {
      setError('कृपया तालुका निवडा.');
      return;
    }

    const finalVillage = isCustomVillage ? customVillageText.trim() : regVillage.trim();
    if (!finalVillage) {
      setError('कृपया गाव निवडा किंवा स्वतः गावाचे नाव टाईप करा.');
      return;
    }

    if (regPassword.length < 4) {
      setError('पासवर्ड किमान ४ अक्षरे किंवा अंकांचा असावा.');
      return;
    }

    setLoading(true);
    const result = await registerFarmer({
      name: regName,
      mobile: trimmedMobile,
      village: finalVillage,
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top back navigation */}
      <div className="max-w-lg w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य भूमिकेच्या पृष्ठावर परत जा (Back to Home)</span>
        </Link>
      </div>

      {/* Main Auth Container */}
      <div className="max-w-lg w-full mx-auto my-auto pt-3 pb-8">
        {/* Card Header & Brand */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center mx-auto shadow-md ring-4 ring-emerald-50">
            <Sprout className="w-7 h-7 text-emerald-100" />
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

          <div className="p-5 sm:p-7">
            {/* Inline Error Message */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
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

                {/* Cascading Location Section: District -> Taluka */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* District Dropdown */}
                  <div>
                    <SearchableSelect
                      label="जिल्हा (District)"
                      options={MAHARASHTRA_LOCATIONS}
                      value={regDistrict}
                      onChange={handleDistrictChange}
                      placeholder="जिल्हा निवडा..."
                      icon={MapPin}
                      required={true}
                    />
                  </div>

                  {/* Taluka Dropdown */}
                  <div>
                    <SearchableSelect
                      label="तालुका (Taluka)"
                      options={availableTalukas}
                      value={regTaluka}
                      onChange={handleTalukaChange}
                      placeholder={regDistrict ? 'तालुका निवडा...' : 'आधी जिल्हा निवडा'}
                      disabled={!regDistrict}
                      disabledMessage="आधी जिल्हा निवडा"
                      icon={Building}
                      required={true}
                    />
                  </div>
                </div>

                {/* Village Section: Searchable Dropdown or Custom Free Input */}
                <div>
                  {!isCustomVillage ? (
                    <div>
                      <SearchableSelect
                        label="गाव (Village)"
                        options={availableVillages}
                        value={regVillage}
                        onChange={handleVillageChange}
                        placeholder={regTaluka ? 'गाव निवडा...' : 'आधी तालुका निवडा'}
                        disabled={!regTaluka}
                        disabledMessage="आधी तालुका निवडा"
                        icon={Home}
                        required={true}
                        allowCustomOption={!!regTaluka}
                        customOptionLabel="इतर गाव (स्वतः टाईप करा)"
                        onCustomSelected={handleCustomVillageSelect}
                      />
                      {regTaluka && (
                        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 px-1">
                          <span>सूचीमध्ये नाव नाही?</span>
                          <button
                            type="button"
                            onClick={handleCustomVillageSelect}
                            className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 focus:outline-none hover:underline"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>इतर गाव स्वतः टाईप करा</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Free text input for custom village */
                    <div className="space-y-1.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/70">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-emerald-900">
                          गावाचे नाव (Village Name) <span className="text-emerald-700">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleBackToVillageList}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 focus:outline-none hover:underline"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>सूचीमधून निवडा</span>
                        </button>
                      </div>
                      <div className="relative rounded-xl shadow-2xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                          <Home className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={customVillageText}
                          onChange={(e) => {
                            setCustomVillageText(e.target.value);
                            setRegVillage(e.target.value);
                          }}
                          placeholder="आपल्या गावाचे नाव टाईप करा (उदा. केडगाव)"
                          required
                          autoFocus
                          className="block w-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-gray-400"
                        />
                      </div>
                      <p className="text-[10px] text-emerald-700 font-medium">
                        कोणतेही बंधन नाही; आपण आपल्या कोणत्याही वाडी, वस्ती किंवा गावाचे नाव प्रविष्ट करू शकता.
                      </p>
                    </div>
                  )}
                </div>

                {/* Password field */}
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
      <div className="max-w-lg w-full mx-auto text-center text-xs text-gray-500">
        KrushiMitra AI • सुरक्षित शेतकरी नोंदणी व डेटा गोपनीयता
      </div>
    </div>
  );
}
