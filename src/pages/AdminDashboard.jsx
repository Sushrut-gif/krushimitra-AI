import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  Landmark,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  UserCheck,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Printer,
  FileSpreadsheet,
  QrCode,
  Truck,
  Coins,
  Gavel,
  Users,
  Layers,
  ArrowRight,
  TrendingUp,
  Tag,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';

export default function AdminDashboard() {
  const { adminUser, logoutAdmin, merchants = [], updateMerchantStatus } = useAuth();
  const { listings = [], toggleListingFlag } = useListings();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('merchants'); // 'merchants' | 'auctions' | 'gate_passes' | 'cess'

  // Filter & Search states
  const [merchantSearch, setMerchantSearch] = useState('');
  const [merchantFilter, setMerchantFilter] = useState('ALL'); // 'ALL' | 'APPROVED' | 'PENDING' | 'SUSPENDED'

  const [auctionSearch, setAuctionSearch] = useState('');
  const [auctionCategory, setAuctionCategory] = useState('सर्व');

  const [inwardSearch, setInwardSearch] = useState('');
  const [cessSearch, setCessSearch] = useState('');

  // Flag reason dialog state
  const [flagModalLot, setFlagModalLot] = useState(null);
  const [flagReasonInput, setFlagReasonInput] = useState('');

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

  // --- 1. REAL STATS CALCULATION (ZERO-MOCK DATA) ---
  const activeAuctions = useMemo(() => {
    return listings.filter(
      (item) =>
        item.status !== 'विक्री पूर्ण (Sold)' &&
        item.status !== 'विक्री पूर्ण (Deal Finalized / Sold)'
    );
  }, [listings]);

  const verifiedGatePasses = useMemo(() => {
    return listings.filter(
      (item) =>
        item.gatePassVerified === true ||
        item.inwardStatus === 'यार्डात प्राप्त (Delivered at Yard)'
    );
  }, [listings]);

  const settledDeals = useMemo(() => {
    return listings.filter(
      (item) =>
        item.status === 'विक्री पूर्ण (Sold)' ||
        item.status === 'विक्री पूर्ण (Deal Finalized / Sold)' ||
        !!item.winningPrice
    );
  }, [listings]);

  // Gross turnover and APMC 1.05% Cess
  const grossTurnover = useMemo(() => {
    return settledDeals.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.winningPrice || item.basePrice) || 0;
      return sum + Math.round(qty * rate);
    }, 0);
  }, [settledDeals]);

  // APMC Solapur Mandi Cess is strictly 1.05%
  const totalCess = useMemo(() => {
    return Math.round(grossTurnover * 0.0105);
  }, [grossTurnover]);

  const netFarmerPayout = useMemo(() => {
    return Math.max(0, grossTurnover - totalCess);
  }, [grossTurnover, totalCess]);

  // Filtered Merchants
  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const q = merchantSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        (m.firmName && m.firmName.toLowerCase().includes(q)) ||
        (m.licenseNo && m.licenseNo.toLowerCase().includes(q)) ||
        (m.mobile && m.mobile.includes(q)) ||
        (m.gstPan && m.gstPan.toLowerCase().includes(q));

      const status = m.status || 'APPROVED';
      const matchFilter =
        merchantFilter === 'ALL' ||
        (merchantFilter === 'APPROVED' && status === 'APPROVED') ||
        (merchantFilter === 'PENDING' && status === 'PENDING') ||
        (merchantFilter === 'SUSPENDED' && status === 'SUSPENDED');

      return matchSearch && matchFilter;
    });
  }, [merchants, merchantSearch, merchantFilter]);

  // Filtered Auctions
  const filteredAuctions = useMemo(() => {
    return activeAuctions.filter((item) => {
      const q = auctionSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        (item.cropName && item.cropName.toLowerCase().includes(q)) ||
        (item.farmerName && item.farmerName.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q));

      const matchCat = auctionCategory === 'सर्व' || item.category === auctionCategory;
      return matchSearch && matchCat;
    });
  }, [activeAuctions, auctionSearch, auctionCategory]);

  // Filtered Inward Gate Passes
  const filteredInward = useMemo(() => {
    return verifiedGatePasses.filter((item) => {
      const q = inwardSearch.toLowerCase().trim();
      const gatePassId = item.gatePassId || `GP-SLP-${item.id}`;
      return (
        !q ||
        gatePassId.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        (item.cropName && item.cropName.toLowerCase().includes(q)) ||
        (item.farmerName && item.farmerName.toLowerCase().includes(q)) ||
        (item.farmerMobile && item.farmerMobile.includes(q)) ||
        (item.winningMerchant && item.winningMerchant.toLowerCase().includes(q))
      );
    });
  }, [verifiedGatePasses, inwardSearch]);

  // Filtered Settled Trades for Cess Ledger
  const filteredSettledDeals = useMemo(() => {
    return settledDeals.filter((item) => {
      const q = cessSearch.toLowerCase().trim();
      const receipt = item.receiptId || item.id;
      return (
        !q ||
        receipt.toLowerCase().includes(q) ||
        (item.cropName && item.cropName.toLowerCase().includes(q)) ||
        (item.farmerName && item.farmerName.toLowerCase().includes(q)) ||
        (item.winningMerchant && item.winningMerchant.toLowerCase().includes(q)) ||
        (item.merchantLicense && item.merchantLicense.toLowerCase().includes(q))
      );
    });
  }, [settledDeals, cessSearch]);

  // --- EXPORT AUDIT CSV FUNCTION ---
  const handleExportCessCSV = () => {
    if (settledDeals.length === 0) {
      alert('डाउनलोड करण्यासाठी कोणताही पूर्ण झालेला सौदा उपलब्ध नाही.');
      return;
    }

    const headers = [
      'अ.क्र.',
      'पावती / सौदा आयडी',
      'लॉट क्र.',
      'तारीख',
      'शेतकरी नाव',
      'मोबाईल',
      'गाव',
      'शेतमाल',
      'प्रतवारी',
      'परिमाण',
      'दर (रु.)',
      'एकूण उलाढाल (रु.)',
      'APMC १.०५% सेस (रु.)',
      'खरेदीदार व्यापारी',
      'परवाना क्र.',
      'देयक स्थिती',
    ];

    const rows = settledDeals.map((item, idx) => {
      const qty = Number(item.quantity) || 1;
      const rate = Number(item.winningPrice || item.basePrice) || 0;
      const gross = Math.round(qty * rate);
      const cess = Math.round(gross * 0.0105);
      const dateStr = item.dealFinalizedAt
        ? new Date(item.dealFinalizedAt).toLocaleDateString('mr-IN')
        : item.listingDate || '-';

      return [
        idx + 1,
        `"${item.receiptId || `APMC-SLP-${item.id}`}"`,
        `"${item.id}"`,
        `"${dateStr}"`,
        `"${item.farmerName || 'शेतकरी'}"`,
        `"${item.farmerMobile || '-'}"`,
        `"${item.location || '-'}"`,
        `"${item.cropName}"`,
        `"${item.qualityGrade || '-'}"`,
        `"${qty} ${item.unit || 'क्विंटल'}"`,
        rate,
        gross,
        cess,
        `"${item.winningMerchant || '-'}"`,
        `"${item.merchantLicense || '-'}"`,
        `"${item.paymentStatus || 'प्रलंबित'}"`,
      ];
    });

    // Summary line
    const summaryRow = [
      '',
      'एकूण संकलन',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      grossTurnover,
      totalCess,
      '',
      '',
      '',
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(',')), summaryRow.join(',')].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `apmc_solapur_cess_report_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open flag modal
  const handleOpenFlagModal = (lot) => {
    setFlagModalLot(lot);
    setFlagReasonInput(lot.adminFlagReason || 'हमीभाव (MSP) किंवा लिलाव संशय पडताळणी प्रलंबित');
  };

  // Confirm flag toggle
  const handleConfirmFlag = () => {
    if (!flagModalLot) return;
    toggleListingFlag(flagModalLot.id, flagReasonInput);
    setFlagModalLot(null);
    setFlagReasonInput('');
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* 1. ADMIN TOP-BAR / OFFICIAL APMC HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border-2 border-slate-800 shadow-xl relative overflow-hidden">
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
                  थेट ऑडिट: सक्रिय (Live Watchdog)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  सत्र वेळ: {formattedLoginTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                कृषी उत्पन्न बाजार समिती सोलापूर - प्रशासकीय डॅशबोर्ड
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                अधिकृत नियमन: परवानाधारक अडत व्यापारी मान्यता, थेट ई-लिलाव संनियंत्रण, आवक गेट पास पडताळणी आणि १.०५% बाजार सेस महसूल संकलन.
              </p>
            </div>

            {/* Officer Profile Badge & Prominent Logout */}
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
                  {adminUser?.officerTitle || 'मुख्य बाजार निरीक्षक (Chief Market Inspector)'}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                title="प्रशासक सत्र समाप्त करा"
              >
                <LogOut className="w-4 h-4" />
                <span>बाहेर पडा (Logout)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. REAL-TIME STATS ROW (100% PURE REAL-DATA COMPUTED) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Registered Merchants */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">नोंदणीकृत व्यापारी</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900 font-mono">
                {merchants.length}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                अधिकृत: {merchants.filter((m) => (m.status || 'APPROVED') === 'APPROVED').length} | निलंबित: {merchants.filter((m) => m.status === 'SUSPENDED').length}
              </div>
            </div>
          </div>

          {/* Card 2: Active Live Lots */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">सक्रिय ई-लिलाव लॉट्स</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Gavel className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-amber-700 font-mono">
                {activeAuctions.length}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                हस्तक्षेप/फ्लॅग केलेले: {activeAuctions.filter((a) => a.adminFlagged).length}
              </div>
            </div>
          </div>

          {/* Card 3: Gate Inward Passes */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">यार्डात आवक नोंद (Inward)</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-700 font-mono">
                {verifiedGatePasses.length}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                QR स्कॅन द्वारे गेटवर पडताळणी पूर्ण
              </div>
            </div>
          </div>

          {/* Card 4: APMC 1.05% Cess Revenue */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col justify-between bg-gradient-to-br from-amber-50/50 to-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">१.०५% सेस महसूल संकलन</span>
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900 font-mono">
                ₹{totalCess.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                उलाढाल: ₹{grossTurnover.toLocaleString('en-IN')} ({settledDeals.length} सौदे)
              </div>
            </div>
          </div>
        </div>

        {/* 3. REAL-TIME NAVIGATION TABS */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          {/* Navigation Bar */}
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none bg-slate-50/80 p-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('merchants')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'merchants'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>व्यापारी मान्यता (Merchants Ledger)</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'merchants'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {merchants.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('auctions')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'auctions'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <Gavel className="w-4 h-4" />
              <span>थेट लिलाव वॉचडॉग (Live Auctions)</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'auctions'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {activeAuctions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gate_passes')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'gate_passes'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>यार्ड आवक नोंद (Gate Passes)</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'gate_passes'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {verifiedGatePasses.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cess')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cess'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>सेस महसूल लेजर (१.०५% Mandi Cess)</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'cess'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {settledDeals.length}
              </span>
            </button>
          </div>

          <div className="p-5 sm:p-7">
            {/* ========================================================================= */}
            {/* TAB 1: MERCHANT VERIFICATION LEDGER */}
            {/* ========================================================================= */}
            {activeTab === 'merchants' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-slate-700" />
                      <span>व्यापारी परवाना पडताळणी व मान्यता नोंदवही</span>
                    </h2>
                    <p className="text-xs text-gray-500">
                      सोलापूर APMC अंतर्गत परवानाधारक अडतदार आणि थेट खरेदीदारांचे अधिकृत लेजर
                    </p>
                  </div>

                  {/* Search and Status Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={merchantSearch}
                        onChange={(e) => setMerchantSearch(e.target.value)}
                        placeholder="पेढीचे नाव, परवाना क्र., फोन..."
                        className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-800 w-48 sm:w-60"
                      />
                    </div>

                    <select
                      value={merchantFilter}
                      onChange={(e) => setMerchantFilter(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-800"
                    >
                      <option value="ALL">सर्व स्थिती ({merchants.length})</option>
                      <option value="APPROVED">परवाना अधिकृत</option>
                      <option value="PENDING">मंजुरी प्रलंबित</option>
                      <option value="SUSPENDED">निलंबित</option>
                    </select>
                  </div>
                </div>

                {filteredMerchants.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-gray-800 text-base">
                      कोणतीही प्रलंबित व्यापारी नोंदणी आढळली नाही
                    </h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      व्यापारी पोर्टलवरून नवीन परवाना नोंदणी झाल्यावर येथे आपोआप पडताळणीसाठी उपलब्ध होईल.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-slate-50 text-gray-700 font-black border-b border-gray-200 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">व्यापारी / पेढीचे नाव</th>
                          <th className="py-3 px-4">APMC परवाना क्र.</th>
                          <th className="py-3 px-4">मोबाईल व कर ID</th>
                          <th className="py-3 px-4">यार्ड व प्रकार</th>
                          <th className="py-3 px-4">स्थिती (Status)</th>
                          <th className="py-3 px-4 text-right">प्रशासकीय कारवाई</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredMerchants.map((merchant) => {
                          const status = merchant.status || 'APPROVED';
                          return (
                            <tr key={merchant.id || merchant.licenseNo} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-black text-gray-900 text-sm">
                                  {merchant.firmName}
                                </div>
                                <div className="text-[11px] text-gray-500 font-mono">
                                  आयडी: {merchant.id}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                                {merchant.licenseNo}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-gray-800 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span>{merchant.mobile}</span>
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono">
                                  GST/PAN: {merchant.gstPan || 'नोंदवलेले नाही'}
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-medium text-gray-800">
                                  {merchant.operatingYard}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  {merchant.merchantType}
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                {status === 'APPROVED' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    परवाना अधिकृत
                                  </span>
                                )}
                                {status === 'PENDING' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    मंजुरी प्रलंबित
                                  </span>
                                )}
                                {status === 'SUSPENDED' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                    <ShieldAlert className="w-3 h-3 text-rose-600" />
                                    निलंबित (Suspended)
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                {status !== 'APPROVED' ? (
                                  <button
                                    type="button"
                                    onClick={() => updateMerchantStatus(merchant.id, 'APPROVED')}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>मंजूर करा (Approve)</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => updateMerchantStatus(merchant.id, 'SUSPENDED')}
                                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                                  >
                                    <ShieldAlert className="w-3 h-3" />
                                    <span>निलंबित करा (Suspend)</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: LIVE AUCTIONS WATCHDOG */}
            {/* ========================================================================= */}
            {activeTab === 'auctions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Gavel className="w-5 h-5 text-amber-700" />
                      <span>थेट ई-लिलाव व बाजार संनियंत्रण (Live Auctions & MSP Watchdog)</span>
                    </h2>
                    <p className="text-xs text-gray-500">
                      सोलापूर मंडी आवारातील शेतमाल थेट बोली, कमाल बोलीदार व हमीभाव (MSP) सुरक्षा देखरेख
                    </p>
                  </div>

                  {/* Filter and Search */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={auctionSearch}
                        onChange={(e) => setAuctionSearch(e.target.value)}
                        placeholder="लॉट क्र., शेतकरी, पीक..."
                        className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-800 w-44 sm:w-56"
                      />
                    </div>

                    <select
                      value={auctionCategory}
                      onChange={(e) => setAuctionCategory(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-800"
                    >
                      <option value="सर्व">सर्व पिके ({activeAuctions.length})</option>
                      <option value="भाजीपाला">भाजीपाला</option>
                      <option value="फळे">फळे</option>
                      <option value="धान्य व कडधान्ये">धान्य व कडधान्ये</option>
                      <option value="तेलबिया">तेलबिया</option>
                    </select>
                  </div>
                </div>

                {filteredAuctions.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                      <Gavel className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-gray-800 text-base">
                      सध्या कोणताही सक्रिय शेतमाल लिलाव उपलब्ध नाही
                    </h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      शेतकऱ्यांनी माल सूचीबद्ध केल्यावर येथे रिअल-टाइम लिलाव व बोली दिसतील.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAuctions.map((lot) => {
                      const bids = Array.isArray(lot.bids) ? lot.bids : [];
                      const highestBid = bids.length > 0 ? Math.max(...bids.map((b) => b.amount)) : 0;
                      const highestBidObj = bids.find((b) => b.amount === highestBid);
                      const unit = lot.unit || 'क्विंटल';

                      return (
                        <div
                          key={lot.id}
                          className={`rounded-2xl border transition-all p-5 space-y-4 bg-white ${
                            lot.adminFlagged
                              ? 'border-amber-400 bg-amber-50/20 shadow-md ring-2 ring-amber-300'
                              : 'border-gray-200 shadow-xs hover:border-gray-300'
                          }`}
                        >
                          {/* Card Top: Lot ID & Badges */}
                          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 border border-slate-200">
                                {lot.id}
                              </span>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {lot.category || 'भाजीपाला'}
                              </span>
                            </div>

                            {lot.adminFlagged ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-sans">
                                <AlertTriangle className="w-3 h-3 text-slate-950" />
                                प्रशासक हस्तक्षेप (Flagged)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                लिलाव सुरू
                              </span>
                            )}
                          </div>

                          {/* Flag Alert Notice if active */}
                          {lot.adminFlagged && (
                            <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                              <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold">कारण: </span>
                                <span>{lot.adminFlagReason || 'हमीभाव पडताळणी प्रलंबित'}</span>
                                <div className="text-[10px] text-amber-800 mt-0.5">
                                  फ्लॅग वेळ: {lot.adminFlaggedAt ? new Date(lot.adminFlaggedAt).toLocaleTimeString('mr-IN') : 'सध्या'}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Crop Details */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-black text-gray-900 text-base">
                                {lot.cropName}
                              </h3>
                              <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                <span>प्रत: <strong className="text-gray-700">{lot.qualityGrade || 'मध्यम'}</strong></span>
                                <span>•</span>
                                <span className="font-bold text-slate-800">
                                  {lot.quantity} {unit}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] font-bold text-gray-400 block uppercase">
                                मूळ किंमत
                              </span>
                              <span className="text-sm font-black text-gray-800 font-mono">
                                ₹{lot.basePrice} / {unit}
                              </span>
                            </div>
                          </div>

                          {/* Farmer & Location Info */}
                          <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 text-gray-600">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-800">{lot.farmerName}</span>
                              <span className="font-mono text-gray-500">{lot.farmerMobile || '-'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{lot.location}</span>
                            </div>
                          </div>

                          {/* Current Highest Bid Section */}
                          <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-amber-400 block uppercase">
                                चालू सर्वोच्च बोली ({bids.length} बोली)
                              </span>
                              {highestBid > 0 ? (
                                <div className="text-lg font-black font-mono text-white">
                                  ₹{highestBid} <span className="text-xs text-slate-300">/ {unit}</span>
                                </div>
                              ) : (
                                <div className="text-xs text-slate-400 font-medium">
                                  अद्याप कोणतीही बोली नाही
                                </div>
                              )}
                            </div>

                            {highestBidObj && (
                              <div className="text-right text-xs">
                                <div className="font-bold text-slate-200">
                                  {highestBidObj.merchantName}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {highestBidObj.merchantLicense || highestBidObj.merchantLocation}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button: Admin Flag / Pause */}
                          <div className="pt-1 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenFlagModal(lot)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                lot.adminFlagged
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {lot.adminFlagged ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>हस्तक्षेप हटवा (Clear Flag)</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>लिलाव हस्तक्षेप (Admin Flag)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: GATE INWARD & LOGISTICS LEDGER */}
            {/* ========================================================================= */}
            {activeTab === 'gate_passes' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-emerald-700" />
                      <span>सोलापूर यार्ड माल आवक ऑडिट (Gate Inward & Logistics Ledger)</span>
                    </h2>
                    <p className="text-xs text-gray-500">
                      कुमठा नाका व मंगळवार पेठ यार्ड प्रवेशद्वारावर डिजिटल QR स्कॅनद्वारे आवक नोंदवलेल्या वाहनांची नोंद
                    </p>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inwardSearch}
                      onChange={(e) => setInwardSearch(e.target.value)}
                      placeholder="गेट पास क्र., शेतकरी, पीक..."
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-800 w-52 sm:w-64"
                    />
                  </div>
                </div>

                {filteredInward.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-gray-800 text-base">
                      आज कोणतीही आवक नोंदवलेली नाही (गेट पास स्कॅन प्रलंबित)
                    </h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      शेतकऱ्याचा माल यार्डात पोहोचल्यावर व व्यापाऱ्याने किंवा गेट निरीक्षकाने QR कोड स्कॅन केल्यावर येथे नोंद दिसेल.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-slate-50 text-gray-700 font-black border-b border-gray-200 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">गेट पास क्र. व तारीख</th>
                          <th className="py-3 px-4">शेतकरी व गाव</th>
                          <th className="py-3 px-4">शेतमाल व आवक परिमाण</th>
                          <th className="py-3 px-4">प्राप्तकर्ता व्यापारी</th>
                          <th className="py-3 px-4">पडताळणी यार्ड नाका</th>
                          <th className="py-3 px-4 text-right">स्थिती (Inward Status)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredInward.map((item) => {
                          const gatePassId = item.gatePassId || `GP-SLP-${item.id}`;
                          const arrivalTime = item.inwardVerifiedAt
                            ? new Date(item.inwardVerifiedAt).toLocaleString('mr-IN', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })
                            : 'आजच नोंदवले';

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-mono font-black text-slate-900 text-sm flex items-center gap-1.5">
                                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{gatePassId}</span>
                                </div>
                                <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span>{arrivalTime}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-bold text-gray-900">
                                  {item.farmerName}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {item.location} ({item.farmerMobile || '-'})
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-black text-gray-900 text-sm">
                                  {item.cropName}
                                </div>
                                <div className="text-xs font-bold text-emerald-700">
                                  {item.quantity} {item.unit || 'क्विंटल'} ({item.qualityGrade || 'मध्यम'})
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-bold text-gray-800">
                                  {item.winningMerchant || 'सोलापूर ॲग्रो ट्रेडर्स'}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono">
                                  {item.merchantLicense || 'अधिकृत व्यापारी'}
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-medium text-slate-800">
                                  {item.gatePassVerifiedBy || 'सोलापूर APMC इनवर्ड यार्ड'}
                                </div>
                                <div className="text-[10px] text-emerald-600 font-bold">
                                  डिजिटल QR गेट पडताळणी पूर्ण
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  यार्डात प्राप्त (Delivered)
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: APMC 1.05% CESS & REVENUE CALCULATOR */}
            {/* ========================================================================= */}
            {activeTab === 'cess' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Coins className="w-5 h-5 text-amber-700" />
                      <span>APMC १.०५% बाजार सेस व महसूल लेजर (Mandi Cess Calculator)</span>
                    </h2>
                    <p className="text-xs text-gray-500">
                      महाराष्ट्र कृषी उत्पन्न पणन नियमानुसार पूर्ण झालेल्या सौद्यांवर १.०५% सेस संकलन
                    </p>
                  </div>

                  {/* Actions: Export CSV & Print */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportCessCSV}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>दैनिक सेस अहवाल डाऊनलोड (CSV)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-500" />
                      <span>प्रिंट अहवाल (Print)</span>
                    </button>
                  </div>
                </div>

                {/* Cess Financial Breakdown Overview Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl text-white">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                      एकूण बाजार उलाढाल (Gross Turnover)
                    </span>
                    <div className="text-2xl font-black font-mono text-white">
                      ₹{grossTurnover.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      एकूण पूर्ण झालेले सौदे: {settledDeals.length}
                    </span>
                  </div>

                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-700 sm:pl-5 pt-3 sm:pt-0">
                    <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                      APMC १.०५% सेस संकलन (Cess Revenue)
                    </span>
                    <div className="text-2xl font-black font-mono text-amber-400">
                      ₹{totalCess.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-amber-300/80">
                      बाजार समिती विकास निधी जमा
                    </span>
                  </div>

                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-700 sm:pl-5 pt-3 sm:pt-0">
                    <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">
                      शेतकऱ्यांना देय रक्कम (Net Payout)
                    </span>
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      ₹{netFarmerPayout.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-emerald-300/80">
                      थेट बँक खात्यात सुरक्षित हस्तांतरण
                    </span>
                  </div>
                </div>

                {/* Search Bar for trades */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={cessSearch}
                      onChange={(e) => setCessSearch(e.target.value)}
                      placeholder="पावती क्र., शेतकरी, व्यापारी..."
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-800 w-52 sm:w-64"
                    />
                  </div>

                  <span className="text-xs font-bold text-gray-500">
                    दाखवत आहे: {filteredSettledDeals.length} व्यवहार
                  </span>
                </div>

                {filteredSettledDeals.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                      <Coins className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-gray-800 text-base">
                      अद्याप कोणताही सौदा पूर्ण झालेला नाही (सेस महसूल निरंक)
                    </h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      शेतकऱ्याने व्यापाऱ्याची बोली स्वीकारल्यावर आणि सौदा अंतिम झाल्यावर येथे सेस लेजर आपोआप तयार होईल.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-slate-50 text-gray-700 font-black border-b border-gray-200 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">पावती / सौदा क्र.</th>
                          <th className="py-3 px-4">शेतकरी तपशील</th>
                          <th className="py-3 px-4">शेतमाल व परिमाण</th>
                          <th className="py-3 px-4">खरेदीदार व्यापारी</th>
                          <th className="py-3 px-4 text-right">एकूण मूल्य (Gross)</th>
                          <th className="py-3 px-4 text-right">१.०५% सेस (Cess)</th>
                          <th className="py-3 px-4 text-right">देयक स्थिती</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredSettledDeals.map((item) => {
                          const qty = Number(item.quantity) || 1;
                          const rate = Number(item.winningPrice || item.basePrice) || 0;
                          const gross = Math.round(qty * rate);
                          const cess = Math.round(gross * 0.0105);
                          const receiptId = item.receiptId || `APMC-SLP-2026-${item.id.replace('KM-', '')}`;

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3.5 px-4 font-mono">
                                <div className="font-black text-slate-900 text-sm">
                                  {receiptId}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  लॉट: {item.id}
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-bold text-gray-900">
                                  {item.farmerName}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {item.location} ({item.farmerMobile || '-'})
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-black text-gray-900">
                                  {item.cropName}
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                  {qty} {item.unit || 'क्विंटल'} @ ₹{rate}/{item.unit || 'क्विंटल'}
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-bold text-gray-800">
                                  {item.winningMerchant || 'सोलापूर ॲग्रो ट्रेडर्स'}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono">
                                  {item.merchantLicense || 'परवानाधारक'}
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-sm">
                                ₹{gross.toLocaleString('en-IN')}
                              </td>

                              <td className="py-3.5 px-4 text-right font-mono font-black text-amber-700 text-sm">
                                ₹{cess.toLocaleString('en-IN')}
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  {item.paymentStatus || 'खात्यात जमा'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. ADMIN FLAG / PAUSE MODAL */}
        {flagModalLot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border-2 border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-amber-700 font-black text-base">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>
                    {flagModalLot.adminFlagged
                      ? 'लिलाव हस्तक्षेप रद्द करा (Unflag Lot)'
                      : 'लिलाव हस्तक्षेप व हमीभाव फ्लॅग (Flag Lot)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFlagModalLot(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="font-black text-slate-900">
                    लॉट क्र.: {flagModalLot.id} - {flagModalLot.cropName} ({flagModalLot.quantity} {flagModalLot.unit || 'क्विंटल'})
                  </div>
                  <div className="text-gray-500">
                    शेतकरी: {flagModalLot.farmerName} | मूळ किंमत: ₹{flagModalLot.basePrice}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5">
                    हस्तक्षेपाचे प्रशासकीय कारण (Reason / Administrative Note):
                  </label>
                  <textarea
                    rows={3}
                    value={flagReasonInput}
                    onChange={(e) => setFlagReasonInput(e.target.value)}
                    placeholder="उदा. हमीभावापेक्षा (MSP) अत्यंत कमी बोली, संशयास्पद आडत युती किंवा कागदपत्र अपूर्णता..."
                    className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFlagModalLot(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  रद्द करा
                </button>

                <button
                  type="button"
                  onClick={handleConfirmFlag}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-md cursor-pointer transition-all ${
                    flagModalLot.adminFlagged
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {flagModalLot.adminFlagged ? 'हस्तक्षेप मागे घ्या व लिलाव सुरू ठेवा' : 'लिलाव तात्काळ फ्लॅग करा'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
