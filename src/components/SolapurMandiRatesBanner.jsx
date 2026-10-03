import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { SOLAPUR_COMMODITIES } from '../data/solapurCommodities';
import { getFormattedMarathiDate, getMarketSessionInfo } from '../utils/dateUtils';

export default function SolapurMandiRatesBanner({ onOpenMandiModal }) {
  // Highlight top 5 key staple Solapur commodities for quick glance
  const featuredIds = ['onion_red', 'pomegranate_bhagwa', 'jowar_maldandi', 'grapes_thomson', 'soybean_yellow'];
  const featuredItems = SOLAPUR_COMMODITIES.filter((item) => featuredIds.includes(item.id));

  const now = new Date();
  const formattedDate = getFormattedMarathiDate(now);
  const marketSession = getMarketSessionInfo(now);

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-emerald-700/50 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        {/* Left Side: Title & Info */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {marketSession.statusText}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-200/90">
              <Calendar className="w-3 h-3 text-emerald-300" />
              {formattedDate} • {marketSession.shortSession}
            </span>
            <span className="text-[11px] text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-md">
              सोलापूर मुख्य यार्ड
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            सोलापूर APMC दैनंदिन थेट बाजारभाव (Live Mandi Rates)
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            ज्वारी, कांदा, डाळिंब, तूर व इतर सर्व मुख्य पिकांचे अधिकृत किमान, कमाल व सरासरी बाजारभाव तपासा.
          </p>
        </div>

        {/* Right Side: CTA Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={onOpenMandiModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-sm hover:bg-emerald-50 active:scale-[0.98] transition-all shadow-lg hover:shadow-emerald-900/30 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <span>सर्व पिकांचे बाजारभाव पहा</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Quick Glance Ticker Strip */}
      <div className="mt-5 pt-4 border-t border-emerald-700/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {featuredItems.map((crop) => {
          const isUp = crop.trendType === 'up';
          return (
            <div
              key={crop.id}
              onClick={onOpenMandiModal}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-white truncate group-hover:text-emerald-200 transition-colors">
                  {crop.nameMr.split(' ')[0]}
                </span>
                <span
                  className={`text-[10px] font-bold flex items-center ${
                    isUp ? 'text-emerald-300' : 'text-amber-300'
                  }`}
                >
                  {isUp ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />
                  )}
                  {crop.changePercent}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-[10px] text-emerald-200">कमाल:</span>
                <span className="text-xs font-black text-amber-300">
                  ₹{crop.maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] text-emerald-300/80 truncate">
                आवक: {crop.arrivals.toLocaleString('en-IN')} {crop.unit}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
