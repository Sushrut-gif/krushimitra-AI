import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Building2,
  Landmark,
  MapPin,
  PackageCheck,
  Clock,
  ArrowRight,
  Filter,
  Tag,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { COMMODITY_CATEGORIES, SOLAPUR_COMMODITIES } from '../data/solapurCommodities';
import { getFormattedMarathiDate, getMarketSessionInfo } from '../utils/dateUtils';

// Visual Category Config with high-contrast emojis & labels
const CATEGORY_CONFIG = {
  all: { emoji: '📋', shortLabel: 'सर्व पिके', countBadge: 'bg-emerald-100 text-emerald-900' },
  cereals_pulses: { emoji: '🌾', shortLabel: 'धान्य व कडधान्ये', countBadge: 'bg-amber-100 text-amber-900' },
  vegetables: { emoji: '🥬', shortLabel: 'भाजीपाला', countBadge: 'bg-green-100 text-green-900' },
  fruits: { emoji: '🍎', shortLabel: 'फळे', countBadge: 'bg-rose-100 text-rose-900' },
  oilseeds: { emoji: '🌻', shortLabel: 'तेलबिया', countBadge: 'bg-yellow-100 text-yellow-900' },
  spices_others: { emoji: '🍯', shortLabel: 'गूळ व मसाले', countBadge: 'bg-orange-100 text-orange-900' },
};

export default function SolapurMandiRatesModal({ isOpen, onClose, onSelectCropForListing }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('max_high_low'); // 'max_high_low' | 'max_low_high' | 'avg_high_low' | 'arrivals_high_low' | 'name_asc'
  const [trendFilter, setTrendFilter] = useState('all'); // 'all' | 'up' | 'down' | 'stable'

  // Dynamic Marathi date & market session based on current time
  const { formattedDate, marketSession } = useMemo(() => {
    const now = new Date();
    return {
      formattedDate: getFormattedMarathiDate(now),
      marketSession: getMarketSessionInfo(now),
    };
  }, [isOpen]);

  // Filtered & Sorted Commodities
  const filteredCommodities = useMemo(() => {
    let result = [...SOLAPUR_COMMODITIES];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Trend filter
    if (trendFilter !== 'all') {
      result = result.filter((item) => item.trendType === trendFilter);
    }

    // Search query filter (search across nameMr, nameEn, variety, yard, aliases)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const matchNameMr = item.nameMr.toLowerCase().includes(q);
        const matchNameEn = item.nameEn.toLowerCase().includes(q);
        const matchVariety = item.variety.toLowerCase().includes(q);
        const matchYard = item.yard.toLowerCase().includes(q);
        const matchAliases = item.aliases?.some((alias) => alias.toLowerCase().includes(q));
        return matchNameMr || matchNameEn || matchVariety || matchYard || matchAliases;
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'max_high_low':
          return b.maxPrice - a.maxPrice;
        case 'max_low_high':
          return a.maxPrice - b.maxPrice;
        case 'avg_high_low':
          return b.avgPrice - a.avgPrice;
        case 'arrivals_high_low':
          return b.arrivals - a.arrivals;
        case 'name_asc':
          return a.nameMr.localeCompare(b.nameMr, 'mr');
        default:
          return 0;
      }
    });

    return result;
  }, [selectedCategory, trendFilter, searchQuery, sortBy]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: SOLAPUR_COMMODITIES.length };
    SOLAPUR_COMMODITIES.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-gray-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mandi-rates-title"
    >
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[94vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* PREMIUM REDESIGNED HEADER BANNER */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-7 shrink-0 shadow-lg overflow-hidden">
          {/* Subtle decorative grid/glow pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* High-contrast Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-white/90 bg-black/25 hover:bg-black/45 border border-white/25 hover:border-white/50 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all shadow-md cursor-pointer z-20 group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Main Header Content */}
          <div className="relative z-10 space-y-4 pr-10 sm:pr-12">
            {/* Top Row: Official Emblem + Brand Titles + Live Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4">
              {/* APMC Style Emblem / Icon Badge with Gold/Emerald Border & Glow */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-0.5 shadow-xl shadow-black/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 flex flex-col items-center justify-center border border-amber-300/40 text-amber-300 shadow-inner group">
                  <Landmark className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 drop-shadow-md" />
                  <span className="text-[9px] font-black tracking-widest text-amber-300/90 uppercase -mt-0.5">APMC</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-amber-400 text-gray-950 shadow-xs">
                    महाराष्ट्र शासन मान्यताप्राप्त
                  </span>
                  
                  {/* Glowing Live Status Badge with Dynamic Date & Session */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 border border-emerald-400/50 text-emerald-200 shadow-inner backdrop-blur-xs">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span className="hidden sm:inline">🕒 {formattedDate} | {marketSession.sessionName}</span>
                    <span className="sm:hidden">🕒 {formattedDate} | {marketSession.shortSession}</span>
                  </div>
                </div>

                <h2 id="mandi-rates-title" className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white drop-shadow-sm">
                  सोलापूर कृषी उत्पन्न बाजार समिती (APMC Solapur)
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                  दैनिक अधिकृत शेतमाल आवक व थेट ई-लिलाव बाजारभाव पट्टी
                </p>
              </div>
            </div>

            {/* Solapur Yard Quick Stats Row */}
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="flex items-center gap-2.5 bg-emerald-950/50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 shadow-inner">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-emerald-300 block font-semibold uppercase tracking-wider">मुख्य बाजार यार्ड</span>
                    <span className="font-bold text-white text-[11px] sm:text-xs truncate block">
                      📍 मंगळवार पेठ & कुमठा नाका मार्केट
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-emerald-950/50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 shadow-inner">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center shrink-0">
                    <PackageCheck className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-emerald-300 block font-semibold uppercase tracking-wider">नोंदणीकृत आवक</span>
                    <span className="font-bold text-white text-[11px] sm:text-xs truncate block">
                      📦 एकूण पिके: {SOLAPUR_COMMODITIES.length}+ शेतमाल नोंद
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-emerald-950/50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 shadow-inner">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-emerald-300 block font-semibold uppercase tracking-wider">बाजार सत्र व तारीख</span>
                    <span className="font-bold text-white text-[11px] sm:text-xs truncate block" title={`${formattedDate} | ${marketSession.sessionName}`}>
                      🕒 {formattedDate} | {marketSession.sessionName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar Section with Visual Category Chips */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 sm:p-5 space-y-3.5 shrink-0">
          {/* Search bar + Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="पिकाचे नाव शोधा (उदा. ज्वारी, कांदा, डाळिंब, तूर, गहू, Jowar, Onion)..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-xs font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Trend Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs shadow-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-gray-600 font-semibold hidden md:inline">क्रम:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-gray-900 font-extrabold focus:outline-none cursor-pointer"
                >
                  <option value="max_high_low">कमाल दर: जास्त ते कमी</option>
                  <option value="max_low_high">कमाल दर: कमी ते जास्त</option>
                  <option value="avg_high_low">सरासरी दर: जास्त ते कमी</option>
                  <option value="arrivals_high_low">आवक: जास्त ते कमी</option>
                  <option value="name_asc">नाव: अ ते ज्ञ</option>
                </select>
              </div>

              {/* Trend Filter */}
              <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-xl px-2.5 py-2 text-xs shadow-xs">
                <Filter className="w-3.5 h-3.5 text-gray-600" />
                <select
                  value={trendFilter}
                  onChange={(e) => setTrendFilter(e.target.value)}
                  className="bg-transparent text-gray-900 font-extrabold focus:outline-none cursor-pointer"
                >
                  <option value="all">सर्व कल (Trends)</option>
                  <option value="up">📈 तेजी (Bullish)</option>
                  <option value="down">📉 मंदी (Bearish)</option>
                  <option value="stable">⚖️ स्थिर (Stable)</option>
                </select>
              </div>
            </div>
          </div>

          {/* VISUAL CATEGORY CHIPS WITH CRISP ICONS (🌾 धान्य, 🥬 भाजीपाला, 🍎 फळे, 🌻 तेलबिया, 🍯 गुळ-मसाले) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300">
            {COMMODITY_CATEGORIES.map((cat) => {
              const meta = CATEGORY_CONFIG[cat.id] || { emoji: '📦', shortLabel: cat.labelMr, countBadge: 'bg-gray-100 text-gray-800' };
              const isActive = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-emerald-800 text-white ring-2 ring-emerald-600 shadow-md scale-[1.02]'
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-950'
                  }`}
                >
                  <span className="text-sm shrink-0">{meta.emoji}</span>
                  <span>{cat.labelMr}</span>
                  <span
                    className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-emerald-950 text-emerald-200 border border-emerald-600/50' : meta.countBadge
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info Counter */}
        <div className="px-5 py-2.5 bg-emerald-50/70 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-950 font-semibold shrink-0">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>
              एकूण <strong className="font-extrabold text-emerald-900">{filteredCommodities.length}</strong> पिकांचे चालू बाजारभाव उपलब्ध
              {searchQuery && ` ("${searchQuery}" शोध परिणाम)`}
            </span>
          </span>
          <span className="text-[11px] text-gray-600 font-medium">दर प्रमाण: प्रति क्विंटल / जुडी (₹ INR)</span>
        </div>

        {/* Modal Body / Table / Cards List */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-5">
          {filteredCommodities.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-800">कोणतेही पीक सापडले नाही</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                तुम्ही शोधत असलेले पीक या वर्गवारीत सापडले नाही. कृपया वेगळा शब्द वापरून शोधा किंवा सर्व वर्गवारी निवडा.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setTrendFilter('all');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
              >
                फिल्टर्स पूर्ववत करा
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800 font-extrabold uppercase tracking-wider border-b border-gray-300">
                      <th className="py-3 px-4">पीक व जात (Commodity)</th>
                      <th className="py-3 px-3">बाजार यार्ड (Yard)</th>
                      <th className="py-3 px-3 text-right">आवक (Arrivals)</th>
                      <th className="py-3 px-3 text-right text-gray-900">किमान दर (Min)</th>
                      <th className="py-3 px-3 text-right text-emerald-800">कमाल दर (Max)</th>
                      <th className="py-3 px-3 text-right text-indigo-900 font-black">सरासरी दर (Modal)</th>
                      <th className="py-3 px-3 text-center">बाजारातील कल (Trend)</th>
                      {onSelectCropForListing && <th className="py-3 px-3 text-center">कृती</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCommodities.map((item) => {
                      const isUp = item.trendType === 'up';
                      const isDown = item.trendType === 'down';

                      return (
                        <tr key={item.id} className="hover:bg-emerald-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-gray-950 text-sm">{item.nameMr}</div>
                            <div className="text-[11px] text-gray-500 font-medium">
                              {item.nameEn} • <span className="text-emerald-700 font-semibold">{item.variety}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-gray-700 font-medium">
                            <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[11px] border border-gray-200">
                              {item.yard}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-black text-gray-900">
                            {item.arrivals.toLocaleString('en-IN')} <span className="text-[10px] text-gray-500 font-normal">{item.unit}</span>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-gray-800">
                            ₹{item.minPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right font-black text-emerald-700 text-sm">
                            ₹{item.maxPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right font-black text-indigo-950 text-sm bg-indigo-50/50">
                            ₹{item.avgPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                                isUp
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : isDown
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : 'bg-gray-100 text-gray-800 border border-gray-300'
                              }`}
                            >
                              {isUp && <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />}
                              {isDown && <TrendingDown className="w-3.5 h-3.5 text-rose-700" />}
                              {!isUp && !isDown && <Minus className="w-3.5 h-3.5 text-gray-600" />}
                              {item.trend.split(' ')[0]} {item.changePercent}
                            </span>
                          </td>
                          {onSelectCropForListing && (
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => {
                                  onSelectCropForListing({
                                    cropName: item.nameMr.split(' ')[0],
                                    variety: item.variety,
                                    expectedPrice: item.avgPrice,
                                    unit: item.unit,
                                  });
                                  onClose();
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-black bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
                                title="या पिकाचा लिलाव नोंदवा"
                              >
                                नोंदवा <ArrowRight className="w-3 h-3" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (Cards for mobile screens) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {filteredCommodities.map((item) => {
                  const isUp = item.trendType === 'up';
                  const isDown = item.trendType === 'down';

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                        <div>
                          <h4 className="font-extrabold text-gray-950 text-sm">{item.nameMr}</h4>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {item.nameEn} • <span className="text-emerald-700 font-semibold">{item.variety}</span>
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                            isUp
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : isDown
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : 'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}
                        >
                          {isUp && <TrendingUp className="w-3 h-3 text-emerald-700" />}
                          {isDown && <TrendingDown className="w-3 h-3 text-rose-700" />}
                          {!isUp && !isDown && <Minus className="w-3 h-3 text-gray-600" />}
                          {item.trend.split(' ')[0]} {item.changePercent}
                        </span>
                      </div>

                      {/* Details row */}
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-semibold text-gray-700 border border-gray-200">
                          {item.yard}
                        </span>
                        <span>
                          आवक: <strong className="text-gray-950 font-black">{item.arrivals.toLocaleString('en-IN')}</strong> {item.unit}
                        </span>
                      </div>

                      {/* Price Grid */}
                      <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-xl text-center border border-gray-200">
                        <div>
                          <div className="text-[10px] text-gray-500 font-bold">किमान दर</div>
                          <div className="text-xs font-black text-gray-900 mt-0.5">
                            ₹{item.minPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="border-x border-gray-200">
                          <div className="text-[10px] text-emerald-800 font-extrabold">कमाल दर</div>
                          <div className="text-xs font-black text-emerald-700 mt-0.5">
                            ₹{item.maxPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="bg-indigo-50/80 rounded-lg py-0.5">
                          <div className="text-[10px] text-indigo-800 font-extrabold">सरासरी दर</div>
                          <div className="text-xs font-black text-indigo-950 mt-0.5">
                            ₹{item.avgPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Action for listing */}
                      {onSelectCropForListing && (
                        <button
                          onClick={() => {
                            onSelectCropForListing({
                              cropName: item.nameMr.split(' ')[0],
                              variety: item.variety,
                              expectedPrice: item.avgPrice,
                              unit: item.unit,
                            });
                            onClose();
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-black bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          हा माल लिलावासाठी नोंदवा
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="bg-gray-50 border-t border-gray-200 p-3.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-gray-600 shrink-0">
          <p className="leading-tight">
            📌 <strong className="font-bold text-gray-800">टीप:</strong> सदरचे बाजारभाव सोलापूर कृषी उत्पन्न बाजार समितीच्या (APMC) अधिकृत ई-लिलाव नोंदीनुसार असून मालाच्या प्रत्यक्ष प्रतवारीनुसार दरामध्ये फरक असू शकतो.
          </p>
          <button
            onClick={onClose}
            className="self-end sm:self-auto px-4 py-2 text-xs font-bold text-gray-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer shadow-2xs"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
