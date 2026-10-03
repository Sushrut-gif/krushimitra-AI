import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Landmark,
  Lock,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  Building2,
  Sparkles,
} from 'lucide-react';

export default function AdminAuth() {
  const { loginAdmin, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect destination after successful login
  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated, redirect directly to /admin
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  // Handle Form Submit — async for Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!adminId.trim()) {
      setErrorMsg('कृपया प्रशासक मोबाईल किंवा अधिकारी आयडी प्रविष्ट करा.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('कृपया प्रशासकीय सुरक्षा पासवर्ड प्रविष्ट करा.');
      return;
    }

    setIsSubmitting(true);

    const res = await loginAdmin({
      identifier: adminId.trim(),
      password: password.trim(),
    });

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(
        res.error ||
          'अवैध प्रशासक आयडी किंवा पासवर्ड! केवळ अधिकृत बाजार समिती अधिकाऱ्यांना प्रवेश आहे.'
      );
      setIsSubmitting(false);
    }
  };

  // Quick fill helper for demonstration
  const handleQuickCredential = (id, pass) => {
    setAdminId(id);
    setPassword(pass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between selection:bg-slate-700 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मुख्य पोर्टलवर परत जा</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/80 shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>सोलापूर कृषी उत्पन्न बाजार समिती - प्रशासकीय नियंत्रण कक्ष (Authorized Personnel Only)</span>
          </div>
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 my-4">
        <div className="max-w-md w-full bg-slate-950/90 rounded-3xl border-2 border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-white backdrop-blur-md">
          {/* Header Title with Official Emblem Icon */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
              <Landmark className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>शासकीय सुरक्षा नियंत्रण</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                APMC प्रशासक प्रवेश
              </h1>
              <p className="text-xs text-slate-400">
                बाजार समिती आवक नोंद, गेट पास तपासणी व प्रशासकीय नियमन.
              </p>
            </div>
          </div>

          {/* Error Message Toast */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-600/80 text-rose-200 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in-50 duration-200 shadow-md">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin ID Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="adminId"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wide"
              >
                प्रशासक / अधिकारी आयडी (Admin / Inspector ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <UserCheck className="w-4 h-4" />
                </div>
                <input
                  id="adminId"
                  type="text"
                  value={adminId}
                  onChange={(e) => {
                    setAdminId(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="उदा. admin किंवा APMC-ADMIN"
                  className="block w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wide"
              >
                प्रशासकीय सुरक्षा पासवर्ड (Secure Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-slate-950 font-black text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <KeyRound className="w-4 h-4 text-slate-950" />
                <span>
                  {isSubmitting ? 'प्रमाणीकरण सुरू आहे...' : 'प्रशासक म्हणून लॉगिन करा'}
                </span>
              </button>
            </div>
          </form>

          {/* Pre-configured Demo Credentials Chips */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              अधिकृत प्रवेश क्रेडेन्शियल्स (Supabase):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickCredential('9999999999', 'admin123')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-all cursor-pointer group"
              >
                <span className="text-[10px] text-amber-400 font-bold block">प्रशासक (Supabase):</span>
                <span className="text-xs font-mono text-slate-200 font-semibold group-hover:text-white">
                  9999999999 / admin123
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickCredential('admin', 'admin')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-all cursor-pointer group"
              >
                <span className="text-[10px] text-amber-400 font-bold block">प्रशासक (Legacy):</span>
                <span className="text-xs font-mono text-slate-200 font-semibold group-hover:text-white">
                  admin / admin
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-slate-950/80 py-4 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>कृषी उत्पन्न बाजार समिती, सोलापूर • प्रशासकीय कक्ष</span>
          <span className="text-slate-600">महाराष्ट्र कृषी उत्पन्न पणन (विकास व विनियमन) अधिनियम अंतर्गत सुरक्षित</span>
        </div>
      </footer>
    </div>
  );
}
