import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  BarChart3,
  Calendar,
  Building2,
  Scale,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { SOLAPUR_COMMODITIES } from '../data/solapurCommodities';
import { getFormattedMarathiDate, getMarketSessionInfo } from '../utils/dateUtils';
import { getSolapurPriceAdvisory } from '../services/geminiService';

// 5 Key Regional Staple Commodities for Solapur APMC
const REGIONAL_STAPLE_IDS = [
  'onion_red_solapur',
  'pomegranate_bhagwa',
  'jowar_maldandi',
  'tur_red',
  'soybean_yellow',
  'chana_desi',
];

export default function SolapurMarketIntelligence({ onSelectCropForListing, className = '' }) {
  const [selectedYard, setSelectedYard] = useState('all'); // 'all' | 'manglawar_peth' | 'kumtha_naka'
  const [activeAdvisoryCropId, setActiveAdvisoryCropId] = useState('onion_red_solapur');
  const [advisoryData, setAdvisoryData] = useState(null);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState(false);
  const [advisoryError, setAdvisoryError] = useState('');

  const now = new Date();
  const formattedDate = getFormattedMarathiDate(now);
  const marketSession = getMarketSessionInfo(now);

  // Filter 5 primary staple crops
  const stapleCrops = SOLAPUR_COMMODITIES.filter((item) =>
    REGIONAL_STAPLE_IDS.includes(item.id) ||
    item.nameMr.includes('कांदा') ||
    item.nameMr.includes('डाळिंब') ||
    item.nameMr.includes('मालदांडी') ||
    item.nameMr.includes('तूर') ||
    item.nameMr.includes('सोयाबीन') ||
    item.nameMr.includes('हरभरा')
  ).slice(0, 6);

  // Yard filtering for commodities
  const displayedCrops = stapleCrops.filter((crop) => {
    if (selectedYard === 'manglawar_peth') {
      return crop.yard.includes('कांदा') || crop.category === 'vegetables';
    }
    if (selectedYard === 'kumtha_naka') {
      return crop.yard.includes('फळ') || crop.category === 'fruits' || crop.category === 'cereals_pulses';
    }
    return true;
  });

  // Calculate overall arrival volume & sentiment
  const totalSolapurArrivals = stapleCrops.reduce((acc, c) => acc + (c.arrivals || 0), 0);

  // Yard Sentiment Status
  const getArrivalPressure = () => {
    if (selectedYard === 'manglawar_peth') {
      return {
        tag: 'कमी आवक - तेजीचा कल',
        sentimentType: 'low', // low arrival = bullish
        loadPercent: 42,
        colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        badgeBg: 'bg-emerald-500',
        description: 'कांदा व बटाटा आवक २०% ने घटली आहे. गोल्टी कांद्याला वाढीव मागणी.',
      };
    }
    if (selectedYard === 'kumtha_naka') {
      return {
        tag: 'मध्यम आवक - दर स्थिर',
        sentimentType: 'medium',
        loadPercent: 64,
        colorClass: 'bg-amber-100 text-amber-900 border-amber-300',
        badgeBg: 'bg-amber-500',
        description: 'डाळिंब व धान्य आवक सुरळीत. निर्यात दर्जाच्या डाळिंबास उच्चांकी भाव.',
      };
    }
    return {
      tag: 'मध्यम आवक - दर स्थिर',
      sentimentType: 'medium',
      loadPercent: 58,
      colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      badgeBg: 'bg-emerald-500',
      description: 'सोलापूर यार्डात सर्वसाधारण आवक. व्यापारी ई-लिलावात खरेदीसाठी सक्रिय.',
    };
  };

  const yardPressure = getArrivalPressure();

  // Fetch AI Advisory for selected crop
  const fetchAIAdvisory = async (cropId) => {
    setIsLoadingAdvisory(true);
    setAdvisoryError('');
    try {
      const result = await getSolapurPriceAdvisory(cropId);
      setAdvisoryData(result);
    } catch (err) {
      console.error('Failed to load AI advisory:', err);
      setAdvisoryError('AI सल्ला लोड करताना तांत्रिक अडचण आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsLoadingAdvisory(false);
    }
  };

  // Automatically fetch initial advisory on mount
  useEffect(() => {
    fetchAIAdvisory(activeAdvisoryCropId);
  }, [activeAdvisoryCropId]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. TOP APMC HEADER & MARKET SENTIMENT GAUGE */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-emerald-800/50 relative overflow-hidden">
        {/* Subtle radial emerald illumination */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-900/60 pb-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                  सोलापूर APMC अधिकृत इंटेलिजन्स
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/80 text-emerald-200 border border-emerald-700/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {marketSession.statusText}
                </span>
                <span className="text-xs text-emerald-200/80 font-medium">
                  {formattedDate} • {marketSession.shortSession}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mt-1">
                सोलापूर बाजार समिती थेट भाव व आवक विश्लेषण
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                मंगळवार पेठ व कुमठा नाका मार्केट यार्डातील शेतमालाचे थेट किमान, कमाल, सरासरी मोडल दर व AI विक्री सल्ला.
              </p>
            </div>

            {/* Yard Selector Tabs */}
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-emerald-800/80 flex flex-wrap gap-1 self-start lg:self-center">
              <button
                type="button"
                onClick={() => setSelectedYard('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedYard === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                सर्व यार्ड (All Yards)
              </button>
              <button
                type="button"
                onClick={() => setSelectedYard('manglawar_peth')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedYard === 'manglawar_peth'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                मंगळवार पेठ (कांदा यार्ड)
              </button>
              <button
                type="button"
                onClick={() => setSelectedYard('kumtha_naka')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedYard === 'kumtha_naka'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                कुमठा नाका (फळे व धान्य)
              </button>
            </div>
          </div>

          {/* 2. ARRIVAL PRESSURE & MARKET SENTIMENT GAUGE ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gauge Box 1: Real-time Pressure Tag */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-emerald-900/70 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                आवक दबाव व बाजार कल (Arrival Pressure)
              </span>
              <div className="flex items-center gap-2 pt-0.5">
                <span className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold border ${yardPressure.colorClass}`}>
                  {yardPressure.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pt-0.5">
                {yardPressure.description}
              </p>
            </div>

            {/* Gauge Box 2: Arrival Capacity Meter */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-emerald-900/70 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>यार्ड आवक भार (Yard Capacity)</span>
                <span className="text-emerald-400">{yardPressure.loadPercent}% मध्यम भार</span>
              </div>
              {/* Visual meter bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    yardPressure.sentimentType === 'low'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 w-[42%]'
                      : yardPressure.sentimentType === 'medium'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 w-[64%]'
                      : 'bg-gradient-to-r from-rose-500 to-red-400 w-[85%]'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>कमी (तेजी)</span>
                <span>संतुलित (स्थिर)</span>
                <span>भरमसाठ (नरमाई)</span>
              </div>
            </div>

            {/* Gauge Box 3: Total Recorded Inward Volume */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-emerald-900/70 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                आजची नोंदवलेली आवक (Today's Solapur Inflow)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight pt-1">
                {totalSolapurArrivals.toLocaleString('en-IN')}{' '}
                <span className="text-xs sm:text-sm font-semibold text-slate-300">क्विंटल</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>सोलापूर जिल्ह्यातील शेतकऱ्यांकडून नियमित आवक</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KEY REGIONAL COMMODITIES RATES CARDS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>सोलापूर मुख्य शेतमाल दैनंदिन बाजारभाव</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                अधिकृत दर
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              किमान भाव, कमाल भाव, सरासरी मोडल भाव आणि आजची सोलापूर आवक
            </p>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            दर प्रमाण: प्रति क्विंटल (₹ INR)
          </span>
        </div>

        {/* Commodity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedCrops.map((crop) => {
            const isUp = crop.trendType === 'up';
            const isDown = crop.trendType === 'down';
            const isSelected = activeAdvisoryCropId === crop.id;

            return (
              <div
                key={crop.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                    : 'border-gray-200/90 hover:border-emerald-400'
                }`}
              >
                {/* Card Top: Crop Name, Variety, Yard & Trend */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-gray-950 leading-snug">
                        {crop.nameMr}
                      </h4>
                      <span className="text-xs text-gray-500 font-medium block">
                        {crop.variety}
                      </span>
                    </div>

                    {/* Trend Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
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
                      <span>{crop.changePercent}</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50/70 border border-emerald-200/70 px-2.5 py-1 rounded-lg truncate">
                    📍 {crop.yard}
                  </div>
                </div>

                {/* Rates Breakdown Matrix */}
                <div className="grid grid-cols-3 gap-2 bg-gray-50/80 p-3 rounded-xl border border-gray-200/80 text-center">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block">किमान भाव</span>
                    <span className="text-xs sm:text-sm font-extrabold text-gray-800 block mt-0.5">
                      ₹{crop.minPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="border-x border-gray-200/80 px-1">
                    <span className="text-[10px] text-emerald-800 font-black block">सरासरी मोडल</span>
                    <span className="text-sm sm:text-base font-black text-emerald-900 block mt-0.5">
                      ₹{crop.avgPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-700 font-bold block">कमाल भाव</span>
                    <span className="text-xs sm:text-sm font-extrabold text-amber-900 block mt-0.5">
                      ₹{crop.maxPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Today's Arrival & AI Advice Trigger */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="text-xs text-gray-600">
                    <span className="text-gray-400 block text-[10px]">आजची सोलापूर आवक:</span>
                    <strong className="text-gray-900 font-bold">
                      {crop.arrivals?.toLocaleString('en-IN')} {crop.unit}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveAdvisoryCropId(crop.id);
                      const el = document.getElementById('ai-advisory-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>AI सल्ला</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. AI SMART CROP SELLING ADVISOR SECTION */}
      <div
        id="ai-advisory-section"
        className="bg-white rounded-3xl border-2 border-emerald-500/60 p-6 sm:p-7 shadow-lg space-y-6 relative overflow-hidden"
      >
        {/* Top Gold/Emerald decorative bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-700 w-full absolute top-0 left-0" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-emerald-700" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                कृषीमित्र AI भाव अंदाज व विक्री सल्ला (AI Price Forecast & Advisor)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
              आजच्या भावानुसार AI स्मार्ट विक्री सल्ला
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              सोलापूर APMC आवक दबाव, खरेदीदारांची मागणी व पुढील २-४ दिवसांतील अपेक्षित भाव कल.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchAIAdvisory(activeAdvisoryCropId)}
              disabled={isLoadingAdvisory}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingAdvisory ? 'animate-spin' : ''}`} />
              <span>आजच्या भावानुसार AI सल्ला मिळवा</span>
            </button>
          </div>
        </div>

        {/* Crop Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <span className="text-xs font-bold text-gray-500 shrink-0 mr-1">
            पीक निवडा:
          </span>
          {stapleCrops.map((crop) => {
            const isSelected = activeAdvisoryCropId === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => setActiveAdvisoryCropId(crop.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-950'
                }`}
              >
                {crop.nameMr.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Advisory Content Display */}
        {isLoadingAdvisory ? (
          <div className="p-10 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-emerald-950">
                सोलापूर APMC आवक व दरांचे AI विश्लेषण सुरू आहे...
              </h4>
              <p className="text-xs text-gray-500">
                Gemini AI द्वारे सोलापूर बाजारातील पुरवठा व मागणीचा सखोल अभ्यास केला जात आहे.
              </p>
            </div>
          </div>
        ) : advisoryData ? (
          <div className="space-y-5 animate-in fade-in-50 duration-300">
            {/* Top Forecast & Recommendation Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Forecast Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-sm space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                    २ ते ४ दिवसांत भाव अंदाज (Price Forecast)
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                    {advisoryData.forecastBadge || 'तेजीचा कल'}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black leading-snug pt-1 text-white">
                  {advisoryData.forecastTrend}
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed pt-1 border-t border-emerald-700/60">
                  {advisoryData.detailedAnalysis}
                </p>
              </div>

              {/* Action Recommendation Card */}
              <div className="p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-sm space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-700" />
                      शेतकऱ्यांसाठी कृती शिफारस (Action Recommendation)
                    </span>
                    <span className="bg-amber-200 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded border border-amber-300">
                      AI शिफारस
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-amber-950 mt-1.5">
                    {advisoryData.recommendation}
                  </div>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <span className="font-extrabold block text-emerald-800">
                    💡 प्रतवारी व विक्री टिप (Quality Tip):
                  </span>
                  <p className="text-gray-700 leading-relaxed">
                    {advisoryData.gradingTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Market Drivers */}
            {advisoryData.keyDrivers && advisoryData.keyDrivers.length > 0 && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  सोलापूर बाजारातील मुख्य प्रभावकारी घटक (Key Regional Drivers)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {advisoryData.keyDrivers.map((driver, index) => (
                    <div
                      key={index}
                      className="p-2.5 rounded-xl bg-white border border-gray-200/80 text-xs font-semibold text-gray-800 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{driver}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
