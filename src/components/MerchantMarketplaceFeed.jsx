import React, { useState, useMemo, useEffect } from 'react';
import { useListings, getCropCategory } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  User,
  MapPin,
  Calendar,
  ArrowUpDown,
  TrendingUp,
  Eye,
  Gavel,
  CheckCircle2,
  AlertCircle,
  X,
  Store,
  RefreshCw,
  Award,
  Scale,
  Flame,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', labelMr: 'सर्व (All)', value: 'सर्व' },
  { id: 'veg', labelMr: 'भाजीपाला (Vegetables)', value: 'भाजीपाला' },
  { id: 'fruits', labelMr: 'फळे (Fruits)', value: 'फळे' },
  { id: 'grains', labelMr: 'धान्य व कडधान्ये (Cereals)', value: 'धान्य व कडधान्ये' },
  { id: 'oilseeds', labelMr: 'तेलबिया (Oilseeds)', value: 'तेलबिया' },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'नवीनतम लॉट (Newest)' },
  { id: 'quantity_desc', label: 'कमाल आवक (Highest Quantity)' },
  { id: 'price_asc', label: 'किमान दर (Lowest Base Price)' },
  { id: 'bid_desc', label: 'सर्वोच्च बोली (Highest Bid)' },
];

export default function MerchantMarketplaceFeed() {
  const { listings } = useListings();
  const [selectedCategory, setSelectedCategory] = useState('सर्व');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedLotForInspection, setSelectedLotForInspection] = useState(null);

  // 1. Filter items to show active lots available for auction
  const activeLots = useMemo(() => {
    return listings.filter((item) => {
      // Must not be already sold
      const isSold = item.status && item.status.includes('विक्री पूर्ण');
      return !isSold;
    });
  }, [listings]);

  // 2. Filter by category & search query
  const filteredLots = useMemo(() => {
    return activeLots.filter((item) => {
      // Category match
      const itemCategory = item.category || getCropCategory(item.cropName);
      if (selectedCategory !== 'सर्व' && itemCategory !== selectedCategory) {
        return false;
      }

      // Search match (crop name, variety, farmer name, location)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const cropMatch = (item.cropName || '').toLowerCase().includes(query);
        const varietyMatch = (item.variety || '').toLowerCase().includes(query);
        const farmerMatch = (item.farmerName || '').toLowerCase().includes(query);
        const locationMatch = (item.location || '').toLowerCase().includes(query);
        if (!cropMatch && !varietyMatch && !farmerMatch && !locationMatch) {
          return false;
        }
      }

      return true;
    });
  }, [activeLots, selectedCategory, searchQuery]);

  // 3. Sort lots
  const sortedLots = useMemo(() => {
    const list = [...filteredLots];
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt || b.listingDate || 0) - new Date(a.createdAt || a.listingDate || 0));
    }
    if (sortBy === 'quantity_desc') {
      return list.sort((a, b) => (Number(b.quantity) || 0) - (Number(a.quantity) || 0));
    }
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => (Number(a.basePrice) || 0) - (Number(b.basePrice) || 0));
    }
    if (sortBy === 'bid_desc') {
      const getHighest = (item) => {
        if (!item.bids || item.bids.length === 0) return Number(item.basePrice) || 0;
        return Math.max(...item.bids.map((b) => Number(b.amount) || 0));
      };
      return list.sort((a, b) => getHighest(b) - getHighest(a));
    }
    return list;
  }, [filteredLots, sortBy]);

  // Compute feed summary statistics strictly from real active farmer listings
  const totalActiveLots = activeLots.length;

  // Dynamic Quantity and Unit Aggregator for Active Lots
  const formattedTotalInward = useMemo(() => {
    if (activeLots.length === 0) return '० आवक';

    // Group quantities by unit
    const unitTotals = {};
    activeLots.forEach((item) => {
      const u = item.unit || 'क्विंटल';
      const q = Number(item.quantity) || 0;
      unitTotals[u] = (unitTotals[u] || 0) + q;
    });

    const entries = Object.entries(unitTotals);
    if (entries.length === 0) return '० आवक';

    // If single unit, e.g. "८५ क्विंटल" or "१२० पोती"
    if (entries.length === 1) {
      return `${entries[0][1]} ${entries[0][0]}`;
    }

    // If multiple units, format cleanly: "५० पोती + २० क्रेट्स"
    return entries.map(([unitName, sum]) => `${sum} ${unitName}`).join(' + ');
  }, [activeLots]);

  const avgBidHike = useMemo(() => {
    if (activeLots.length === 0) return '०%';
    let hikes = [];
    activeLots.forEach((item) => {
      if (item.bids && item.bids.length > 0 && item.basePrice > 0) {
        const high = Math.max(...item.bids.map((b) => b.amount));
        const diff = ((high - item.basePrice) / item.basePrice) * 100;
        hikes.push(diff);
      }
    });
    if (hikes.length === 0) return '-';
    const avg = hikes.reduce((a, b) => a + b, 0) / hikes.length;
    return `+${avg.toFixed(1)}%`;
  }, [activeLots]);

  return (
    <div className="space-y-6">
      {/* Top Header & Feed Summary Row */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-900/50 p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                  थेट आवक ई-लिलाव फीड • Live APMC Solapur
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                <span>शेतीमाल थेट बाजारपेठ (Marketplace Feed)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                सोलापूर बाजार समिती आवारातील शेतकरी प्रमाणित माल, AI गुणवत्ता प्रतवारी व थेट व्यापारी लिलाव बोली.
              </p>
            </div>

            {/* Dynamic Counter Pill */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="px-4 py-2 rounded-xl bg-indigo-900/80 border border-indigo-700/80 backdrop-blur-sm shadow-inner flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  सध्या लिलावात उपलब्ध लॉट्स: <span className="text-emerald-400 text-base font-extrabold">{totalActiveLots}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-indigo-900/60">
            <div className="bg-slate-900/70 p-3 rounded-xl border border-indigo-950">
              <span className="text-[11px] text-slate-400 font-medium block">सक्रिय लॉट्स</span>
              <span className="text-lg font-bold text-white">{totalActiveLots} लॉट्स</span>
            </div>
            <div className="bg-slate-900/70 p-3 rounded-xl border border-indigo-950">
              <span className="text-[11px] text-slate-400 font-medium block">एकूण आवक प्रमाण</span>
              <span className="text-lg font-bold text-emerald-400 truncate block" title={formattedTotalInward}>
                {formattedTotalInward}
              </span>
            </div>
            <div className="bg-slate-900/70 p-3 rounded-xl border border-indigo-950">
              <span className="text-[11px] text-slate-400 font-medium block">सरासरी बोली प्रीमियम</span>
              <span className="text-lg font-bold text-amber-400">{avgBidHike}</span>
            </div>
            <div className="bg-slate-900/70 p-3 rounded-xl border border-indigo-950">
              <span className="text-[11px] text-slate-400 font-medium block">बाजार यार्ड</span>
              <span className="text-lg font-bold text-indigo-300">सोलापूर मुख्य यार्ड</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter Pills & Sort Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top line: Search box + Sort By */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="पिकाचे नाव, जात किंवा शेतकऱ्याचे गाव शोधा (उदा. कांदा, डाळिंब, माढा, बार्शी)..."
              className="block w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm text-gray-900 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <span>क्रमवारी:</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-2xs"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>वर्ग:</span>
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {cat.labelMr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter result feedback */}
      {(searchQuery || selectedCategory !== 'सर्व') && (
        <div className="flex items-center justify-between text-xs text-gray-600 px-1">
          <span>
            फिल्टरनुसार निकाल: <strong className="text-indigo-800 font-bold">{sortedLots.length}</strong> लॉट्स उपलब्ध
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('सर्व');
              setSearchQuery('');
            }}
            className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold underline"
          >
            सर्व फिल्टर हटवा (Reset)
          </button>
        </div>
      )}

      {/* Produce Cards Grid */}
      {sortedLots.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
            <Store className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              {activeLots.length === 0
                ? 'सध्या बाजारात लिलावासाठी माल उपलब्ध नाही.'
                : 'निवडलेल्या फिल्टरनुसार कोणताही माल उपलब्ध नाही.'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {activeLots.length === 0
                ? 'शेतकऱ्यांनी सोलापूर APMC मध्ये माल नोंदवताच येथे थेट ई-लिलावासाठी दिसेल.'
                : 'कृपया शोध शब्द बदला किंवा इतर वर्ग निवडून तपासा.'}
            </p>
          </div>
          {activeLots.length > 0 && (searchQuery || selectedCategory !== 'सर्व') && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('सर्व');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              सर्व पिके पहा (Reset Filters)
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {sortedLots.map((lot) => {
            const bids = lot.bids || [];
            const highestBid = bids.length > 0 ? Math.max(...bids.map((b) => b.amount)) : lot.basePrice;
            const bidDifference = highestBid > lot.basePrice ? highestBid - lot.basePrice : 0;
            const bidPercentIncrease = lot.basePrice > 0 ? ((bidDifference / lot.basePrice) * 100).toFixed(1) : 0;

            // Crop image fallback
            const defaultImage =
              'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80';
            const displayImage = lot.image || defaultImage;

            return (
              <div
                key={lot.id}
                className="group bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
              >
                {/* Top Media & Floating Badges */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={lot.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Subtle gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Left: AI Grade Glow Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 shadow-lg backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{lot.qualityGrade || 'Grade A'}</span>
                      {lot.aiScore && (
                        <span className="text-[10px] text-emerald-200 border-l border-emerald-600/60 pl-1.5 font-normal">
                          {lot.aiScore}%
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Top Right: Live Auction Badge with pulsing green indicator */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/95 text-slate-950 shadow-md backdrop-blur-md">
                      <Flame className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                      <span>लिलाव सुरू</span>
                    </span>
                  </div>

                  {/* Bottom Image Overlay: Crop Name & Variety */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded backdrop-blur-xs">
                      {lot.category || getCropCategory(lot.cropName)}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug mt-1 drop-shadow-xs">
                      {lot.cropName}
                    </h3>
                    <p className="text-xs text-gray-200 line-clamp-1 drop-shadow-xs">
                      {lot.variety || 'सोलापूर स्थानिक जात'}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  {/* Farmer identity & location */}
                  <div className="space-y-1.5 text-xs text-gray-600 border-b border-gray-100 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-900 truncate">
                        <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">{lot.farmerName}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">
                        लॉट: {lot.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{lot.location}</span>
                    </div>
                  </div>

                  {/* Quantity & Moisture Row */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-[10px] text-gray-500 font-medium block">
                        एकूण प्रमाण (Quantity)
                      </span>
                      <span className="text-sm font-extrabold text-gray-900">
                        {lot.quantity} {lot.unit || 'क्विंटल'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-medium block">
                        गुणवत्ता निकष (Quality)
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        {lot.moisture ? `ओलावा: ${lot.moisture}` : 'उत्कृष्ट प्रत'}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Comparison: Base vs Current Highest Bid */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-gray-500 font-medium">शेतकरी मूळ दर:</span>
                      <span className="font-semibold text-gray-700 line-through">
                        ₹{lot.basePrice?.toLocaleString('en-IN')} / {lot.unit || 'क्विंटल'}
                      </span>
                    </div>

                    {/* Current Highest Bid Highlight */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/80">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-tight">
                            चालू सर्वोच्च बोली:
                          </span>
                        </div>
                        <div className="text-base sm:text-lg font-black text-indigo-950 mt-0.5">
                          ₹{highestBid.toLocaleString('en-IN')}{' '}
                          <span className="text-xs font-normal text-gray-600">/ {lot.unit || 'क्विंटल'}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          +{bidPercentIncrease}% वाढ
                        </span>
                        <span className="block text-[10px] text-indigo-700 font-medium mt-0.5">
                          {bids.length} व्यापारी बोली
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLotForInspection(lot)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 active:from-indigo-800 active:to-indigo-900 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:ring-2 group-hover:ring-indigo-500/20"
                    >
                      <Eye className="w-4 h-4 text-indigo-200" />
                      <span>मालाची गुणवत्ता पहा व बोली लावा</span>
                      <ChevronRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lot Inspection & Bidding Modal */}
      {selectedLotForInspection && (
        <LotInspectionModal
          lotId={selectedLotForInspection.id}
          initialLot={selectedLotForInspection}
          onClose={() => setSelectedLotForInspection(null)}
        />
      )}
    </div>
  );
}

/**
 * Detailed Lot Inspection & Interactive Live Bidding Modal
 */
function LotInspectionModal({ lotId, initialLot, onClose }) {
  const { listings, placeBid } = useListings();
  const { merchantUser } = useAuth();

  // Dynamically synchronize with the reactive lot from ListingsContext
  const lot = listings.find((item) => item.id === (lotId || initialLot?.id)) || initialLot;
  const bids = lot?.bids || [];
  const basePrice = Number(lot?.basePrice) || 0;
  const highestBid = bids.length > 0 ? Math.max(...bids.map((b) => Number(b.amount) || 0)) : basePrice;

  // Bidding form state
  const [bidAmount, setBidAmount] = useState(() => highestBid + 50);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorHelper, setErrorHelper] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically keep bidAmount ahead of highestBid if highestBid increases
  useEffect(() => {
    if (Number(bidAmount) <= highestBid) {
      setBidAmount(highestBid + 50);
    }
  }, [highestBid]);

  // Stepper handlers
  const handleIncrement = (increment) => {
    setErrorHelper('');
    setBidAmount((prev) => {
      const current = Number(prev) || highestBid;
      const base = Math.max(current, highestBid);
      return base + increment;
    });
  };

  // Submit Bid handler
  const handlePlaceBid = (e) => {
    e.preventDefault();
    const amountNum = Number(bidAmount);

    if (!amountNum || isNaN(amountNum)) {
      setErrorHelper('कृपया वैध बोली रक्कम प्रविष्ट करा.');
      return;
    }

    if (amountNum <= highestBid) {
      setErrorHelper(`बोली चालू सर्वोच्च बोलीपेक्षा (₹${highestBid.toLocaleString('en-IN')}) जास्त असणे आवश्यक आहे.`);
      return;
    }

    setIsSubmitting(true);
    setErrorHelper('');

    const newBidObj = {
      id: 'BID_' + Date.now().toString().slice(-6),
      merchantName: merchantUser?.firmName || 'माझी फर्म',
      merchantPhone: merchantUser?.mobile || '',
      merchantLocation: merchantUser?.operatingYard || 'सोलापूर APMC मार्केट यार्ड',
      merchantLicense: merchantUser?.licenseNo || 'APMC/SLP/TRD-8841',
      amount: amountNum,
      timeFormatted: 'आत्ताच',
      timestamp: new Date().toISOString(),
    };

    // Save bid in ListingsContext and localStorage
    placeBid(lot.id, newBidObj);

    // Provide user feedback
    setSuccessMessage(`आपली ₹${amountNum.toLocaleString('en-IN')} ची बोली यशस्वीरित्या नोंदवली गेली!`);
    setBidAmount(amountNum + 50);
    setIsSubmitting(false);

    // Auto-dismiss success notification
    setTimeout(() => {
      setSuccessMessage('');
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden transition-all">
        {/* Top Indigo Header Banner */}
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 w-full" />

        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  लॉट क्र: {lot.id}
                </span>
                <span className="text-xs text-gray-500">APMC Solapur Yard</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mt-0.5">
                {lot.cropName} • गुणवत्ता व थेट ई-लिलाव
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Visual & Farmer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden h-44 bg-gray-100 border border-gray-200">
              <img
                src={
                  lot.image ||
                  'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
                }
                alt={lot.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl text-xs">
                <span className="font-semibold block">{lot.variety || 'स्थानिक जात'}</span>
                <span className="text-[11px] text-gray-300">एकूण प्रमाण: {lot.quantity} {lot.unit || 'क्विंटल'}</span>
              </div>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>शेतकरी माहिती</span>
              </h4>
              <div>
                <span className="text-gray-500 block">नाव:</span>
                <span className="font-semibold text-gray-900 text-sm">{lot.farmerName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">गाव / तालुका:</span>
                <span className="font-medium text-gray-800">{lot.location}</span>
              </div>
              <div>
                <span className="text-gray-500 block">आवक तारीख:</span>
                <span className="font-medium text-gray-800">{lot.listingDate || 'आज'}</span>
              </div>
            </div>
          </div>

          {/* AI Quality Inspection Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/80 rounded-2xl border border-emerald-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h4 className="text-sm font-bold text-emerald-950">
                  AI कॉम्प्युटर व्हिजन गुणवत्ता अहवाल
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                {lot.qualityGrade || 'Grade A'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-gray-500 block text-[10px]">गुणवत्ता अचूकता</span>
                <span className="font-bold text-emerald-700 text-sm">{lot.aiScore || 95}%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-gray-500 block text-[10px]">ओलावा / निकष</span>
                <span className="font-bold text-gray-900 text-xs">{lot.moisture || '११.२%'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-gray-500 block text-[10px]">आकार / ग्रेडिंग</span>
                <span className="font-bold text-gray-900 text-xs">एकसारखा (Uniform)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-gray-500 block text-[10px]">सड / डाग प्रमाण</span>
                <span className="font-bold text-emerald-700 text-xs">०.५% पेक्षा कमी</span>
              </div>
            </div>

            {lot.notes && (
              <p className="text-xs text-emerald-900 bg-white/70 p-2.5 rounded-xl border border-emerald-100 leading-relaxed">
                <strong>तपासणी टीप:</strong> {lot.notes}
              </p>
            )}
          </div>

          {/* Existing Live Bids Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Gavel className="w-4 h-4 text-indigo-600" />
                <span>सक्रिय व्यापारी लिलाव बोली ({bids.length})</span>
              </h4>
              <span className="text-xs font-bold text-indigo-700">
                चालू सर्वोच्च: ₹{highestBid.toLocaleString('en-IN')}
              </span>
            </div>

            {bids.length === 0 ? (
              <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-xl text-center">
                अद्याप कोणतीही बोली नाही. आपण पहिली बोली नोंदवू शकता.
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-40 overflow-y-auto">
                {bids.map((b, idx) => (
                  <div
                    key={b.id || idx}
                    className={`p-3 flex items-center justify-between text-xs ${
                      b.amount === highestBid ? 'bg-amber-50/70 font-semibold' : 'bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-gray-900 block font-medium">
                        {b.merchantName}
                      </span>
                      <span className="text-[11px] text-gray-400">{b.timeFormatted || 'काही वेळापूर्वी'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-indigo-950 block">
                        ₹{b.amount?.toLocaleString('en-IN')}
                      </span>
                      {b.amount === highestBid && (
                        <span className="text-[10px] text-amber-700 font-bold">सर्वोच्च बोली 👑</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Live Bidding Engine Console */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl border border-indigo-700/60 p-4 sm:p-5 text-white shadow-xl space-y-4">
            {/* Console Header */}
            <div className="flex items-center justify-between pb-3 border-b border-indigo-800/70">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-emerald-400" />
                  <span>थेट लिलाव ई-बोली कन्सोल (Live Bidding Engine)</span>
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                सक्रिय सत्र
              </span>
            </div>

            {/* Price Comparison Row: Base Price vs Current Highest Bid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-indigo-900/80">
                <span className="text-[11px] text-slate-400 block font-medium">
                  मूळ किंमत (Base Price)
                </span>
                <span className="text-base font-bold text-slate-200 mt-0.5 block">
                  ₹{basePrice.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal"> प्रति {lot.unit || 'क्विंटल'}</span>
                </span>
              </div>

              <div className="bg-gradient-to-r from-emerald-950/90 to-teal-950/90 p-3 rounded-xl border border-emerald-500/50 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    चालू सर्वोच्च बोली (Current Highest Bid)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-900/60 px-1.5 py-0.5 rounded">
                    {bids.length} बोलीदार
                  </span>
                </div>
                <span className="text-lg font-black text-emerald-300 mt-0.5 block">
                  ₹{highestBid.toLocaleString('en-IN')} <span className="text-xs text-emerald-400/80 font-normal"> प्रति {lot.unit || 'क्विंटल'}</span>
                </span>
              </div>
            </div>

            {/* Bidding Form */}
            <form onSubmit={handlePlaceBid} className="space-y-3.5">
              {/* Custom Bid Input Field with Helper */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    आपली नवीन बोली रक्कम प्रविष्ट करा:
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60 self-start sm:self-auto">
                    चालू सर्वोच्च बोली: ₹{highestBid.toLocaleString('en-IN')} प्रति {lot.unit || 'क्विंटल'}
                  </span>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="text-base font-bold text-emerald-400">₹</span>
                  </div>
                  <input
                    type="number"
                    min={highestBid + 1}
                    step="10"
                    value={bidAmount}
                    onChange={(e) => {
                      setBidAmount(e.target.value);
                      setErrorHelper('');
                    }}
                    required
                    className="block w-full pl-9 pr-24 py-2.5 text-base font-bold text-white bg-slate-800 border border-indigo-700/80 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                    placeholder={`उदा. ${highestBid + 50}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-slate-400 font-medium">
                    प्रति {lot.unit || 'क्विंटल'}
                  </div>
                </div>
              </div>

              {/* Quick Increment Stepper Buttons */}
              <div>
                <span className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  त्वरित वाढीव रक्कम निवडा (Quick Stepper Increments):
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 250, 500].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => handleIncrement(inc)}
                      className="py-1.5 px-2 bg-indigo-950/80 hover:bg-indigo-800/90 active:bg-indigo-700 border border-indigo-700/70 hover:border-emerald-400/60 rounded-lg text-xs font-bold text-indigo-200 hover:text-white transition-all text-center"
                    >
                      + ₹{inc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Validation Helper Message */}
              {errorHelper && (
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorHelper}</span>
                </div>
              )}

              {/* Live Success Toast Message */}
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs flex items-center gap-2.5 shadow-md animate-in fade-in-50 duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{successMessage}</span>
                </div>
              )}

              {/* Submit Bid Button */}
              <button
                type="submit"
                disabled={isSubmitting || Number(bidAmount) <= highestBid}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:from-emerald-700 active:to-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Gavel className="w-4 h-4" />
                <span>ई-बोली नोंदवा (Submit Live Bid) • ₹{Number(bidAmount || 0).toLocaleString('en-IN')} प्रति {lot.unit || 'क्विंटल'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
