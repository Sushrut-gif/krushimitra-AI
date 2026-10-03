import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Layers,
  Wheat,
  Carrot,
  Apple,
  Droplets,
  Sparkles,
  Building2,
  Tag,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { COMMODITY_CATEGORIES, SOLAPUR_COMMODITIES } from '../data/solapurCommodities';

// Category icon mapper
const CATEGORY_ICONS = {
  all: Layers,
  cereals_pulses: Wheat,
  vegetables: Carrot,
  fruits: Apple,
  oilseeds: Droplets,
  spices_others: Sparkles,
};

export default function SolapurMandiRatesModal({ isOpen, onClose, onSelectCropForListing }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('max_high_low'); // 'max_high_low' | 'max_low_high' | 'avg_high_low' | 'arrivals_high_low' | 'name_asc'
  const [trendFilter, setTrendFilter] = useState('all'); // 'all' | 'up' | 'down' | 'stable'

  // Current formatted date in Marathi
  const formattedDate = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('mr-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-gray-900/70 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mandi-rates-title"
    >
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-emerald-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1.5 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-xs">
                <Building2 className="w-3 h-3 text-emerald-200" />
                सोलापूर कृषी उत्पन्न बाजार समिती (APMC Solapur)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/40 text-emerald-100">
                <Calendar className="w-3 h-3 text-emerald-200" />
                दि. {formattedDate}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-gray-900">
                अधिकृत दैनिक आवक व भाव
              </span>
            </div>

            <h2 id="mandi-rates-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
              सोलापूर APMC सर्व पिके दैनिक बाजारभाव निर्देशिका
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              धान्य, कडधान्ये, तेलबिया, भाजीपाला, फळे व गूळ यांचे अधिकृत किमान, कमाल व सरासरी बाजारभाव
            </p>
          </div>
        </div>

        {/* Filter Toolbar Section */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 sm:p-5 space-y-3 shrink-0">
          {/* Search bar + Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="पिकाचे नाव शोधा (उदा. ज्वारी, कांदा, डाळिंब, तूर, गहू, Jowar, Onion)..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-2xs font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Trend Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-600 font-medium hidden md:inline">क्रम:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-gray-800 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="max_high_low">कमाल दर: जास्त ते कमी</option>
                  <option value="max_low_high">कमाल दर: कमी ते जास्त</option>
                  <option value="avg_high_low">सरासरी दर: जास्त ते कमी</option>
                  <option value="arrivals_high_low">आवक: जास्त ते कमी</option>
                  <option value="name_asc">नाव: अ ते ज्ञ</option>
                </select>
              </div>

              {/* Trend Filter */}
              <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-xl px-2.5 py-2 text-xs shadow-2xs">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                <select
                  value={trendFilter}
                  onChange={(e) => setTrendFilter(e.target.value)}
                  className="bg-transparent text-gray-800 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">सर्व कल (Trends)</option>
                  <option value="up">📈 तेजी (Bullish)</option>
                  <option value="down">📉 मंदी (Bearish)</option>
                  <option value="stable">⚖️ स्थिर (Stable)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300">
            {COMMODITY_CATEGORIES.map((cat) => {
              const IconComponent = CATEGORY_ICONS[cat.id] || Layers;
              const isActive = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{cat.labelMr}</span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-gray-100 text-gray-600'
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
        <div className="px-5 py-2.5 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-950 font-medium shrink-0">
          <span>
            एकूण <strong className="font-bold text-emerald-800">{filteredCommodities.length}</strong> पिकांचे चालू बाजारभाव उपलब्ध
            {searchQuery && ` ("${searchQuery}" साठी शोध परिणाम)`}
          </span>
          <span className="text-[11px] text-gray-500">दर: प्रति क्विंटल / जुडी (INR)</span>
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
              <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                      <th className="py-3 px-4">पीक व जात (Commodity)</th>
                      <th className="py-3 px-3">बाजार यार्ड (Yard)</th>
                      <th className="py-3 px-3 text-right">आवक (Arrivals)</th>
                      <th className="py-3 px-3 text-right text-gray-800">किमान दर (Min)</th>
                      <th className="py-3 px-3 text-right text-emerald-800">कमाल दर (Max)</th>
                      <th className="py-3 px-3 text-right text-indigo-800 font-extrabold">सरासरी दर (Modal)</th>
                      <th className="py-3 px-3 text-center">बाजारातील कल (Trend)</th>
                      {onSelectCropForListing && <th className="py-3 px-3 text-center">कृती</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCommodities.map((item) => {
                      const isUp = item.trendType === 'up';
                      const isDown = item.trendType === 'down';

                      return (
                        <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-gray-900 text-sm">{item.nameMr}</div>
                            <div className="text-[11px] text-gray-500 font-medium">
                              {item.nameEn} • <span className="text-emerald-700">{item.variety}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-gray-600 font-medium">
                            <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                              {item.yard}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-gray-800">
                            {item.arrivals.toLocaleString('en-IN')} <span className="text-[10px] text-gray-500 font-normal">{item.unit}</span>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-gray-700">
                            ₹{item.minPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right font-black text-emerald-700 text-sm">
                            ₹{item.maxPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right font-black text-indigo-900 text-sm bg-indigo-50/40">
                            ₹{item.avgPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                isUp
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isDown
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {isUp && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                              {isDown && <TrendingDown className="w-3 h-3 text-rose-600" />}
                              {!isUp && !isDown && <Minus className="w-3 h-3 text-gray-500" />}
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
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
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
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-3"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm">{item.nameMr}</h4>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {item.nameEn} • <span className="text-emerald-700">{item.variety}</span>
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            isUp
                              ? 'bg-emerald-100 text-emerald-800'
                              : isDown
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isUp && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                          {isDown && <TrendingDown className="w-3 h-3 text-rose-600" />}
                          {!isUp && !isDown && <Minus className="w-3 h-3 text-gray-500" />}
                          {item.trend.split(' ')[0]} {item.changePercent}
                        </span>
                      </div>

                      {/* Details row */}
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium">
                          {item.yard}
                        </span>
                        <span>
                          आवक: <strong className="text-gray-900 font-bold">{item.arrivals.toLocaleString('en-IN')}</strong> {item.unit}
                        </span>
                      </div>

                      {/* Price Grid */}
                      <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-lg text-center border border-gray-200/70">
                        <div>
                          <div className="text-[10px] text-gray-500 font-medium">किमान दर</div>
                          <div className="text-xs font-bold text-gray-800 mt-0.5">
                            ₹{item.minPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="border-x border-gray-200">
                          <div className="text-[10px] text-emerald-700 font-bold">कमाल दर</div>
                          <div className="text-xs font-black text-emerald-700 mt-0.5">
                            ₹{item.maxPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="bg-indigo-50/70 rounded py-0.5">
                          <div className="text-[10px] text-indigo-700 font-bold">सरासरी दर</div>
                          <div className="text-xs font-black text-indigo-900 mt-0.5">
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
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
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
            📌 <strong className="font-semibold text-gray-800">टीप:</strong> सदरचे बाजारभाव सोलापूर कृषी उत्पन्न बाजार समितीच्या (APMC) अधिकृत ई-लिलाव नोंदीनुसार असून मालाच्या प्रत्यक्ष प्रतवारीनुसार दरामध्ये फरक असू शकतो.
          </p>
          <button
            onClick={onClose}
            className="self-end sm:self-auto px-4 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
