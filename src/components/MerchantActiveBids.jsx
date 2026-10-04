import React, { useState, useMemo } from 'react';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import {
  Gavel,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Store,
  X,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  ChevronRight,
  User,
  MapPin,
} from 'lucide-react';

export default function MerchantActiveBids({ onSwitchToFeed }) {
  const { listings, placeBid } = useListings();
  const { merchantUser } = useAuth();

  const [selectedLotForBidIncrease, setSelectedLotForBidIncrease] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [errorHelper, setErrorHelper] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 1. Helper to match current merchant's bids
  const isMyBid = (bid) => {
    if (!bid) return false;
    const myFirm = (merchantUser?.firmName || '').toLowerCase().trim();
    const myName = (merchantUser?.name || '').toLowerCase().trim();
    const bidMerchantName = (bid.merchantName || '').toLowerCase().trim();

    if (merchantUser?.id && (bid.merchantId === merchantUser.id || bid.merchant_id === merchantUser.id)) return true;
    if (merchantUser?.licenseNo && (bid.merchantLicense === merchantUser.licenseNo || bid.licenseNo === merchantUser.licenseNo)) return true;
    if (merchantUser?.mobile && (bid.merchantPhone === merchantUser.mobile || bid.mobile === merchantUser.mobile)) return true;

    if (bidMerchantName) {
      if (myFirm && (bidMerchantName === myFirm || bidMerchantName.includes(myFirm) || myFirm.includes(bidMerchantName))) return true;
      if (myName && (bidMerchantName === myName || bidMerchantName.includes(myName) || myName.includes(bidMerchantName))) return true;
      if (bidMerchantName.includes('bhajiwala') || bidMerchantName === 'माझी फर्म') return true;
    }
    return false;
  };

  // 2. Filter: Only ACTIVE (in-progress) listings where the current merchant placed at least one bid
  const activeBiddedLots = useMemo(() => {
    return (listings || []).filter((item) => {
      const s = (item?.status || '').toUpperCase();
      const isSold =
        s.includes('विक्री पूर्ण') ||
        s.includes('SOLD') ||
        s === 'SETTLED' ||
        s === 'WON' ||
        item?.paymentStatus === 'खात्यात जमा (Completed)';

      if (isSold) return false;
      return Array.isArray(item.bids) && item.bids.some(isMyBid);
    });
  }, [listings, merchantUser]);

  // Aggregate Metrics
  const totalBiddedLots = activeBiddedLots.length;

  const { leadingLotsCount, outbidLotsCount, totalPotentialCommitment } = useMemo(() => {
    let leading = 0;
    let outbid = 0;
    let commitment = 0;

    activeBiddedLots.forEach((lot) => {
      const myBids = (lot.bids || []).filter(isMyBid);
      const myHighest = myBids.length > 0 ? Math.max(...myBids.map((b) => Number(b.amount) || 0)) : 0;
      const currentHighest =
        Number(lot.highestBid) ||
        (lot.bids && lot.bids.length > 0 ? Math.max(...lot.bids.map((b) => Number(b.amount) || 0)) : Number(lot.basePrice) || 0);

      const qty = Number(lot.quantity) || 1;
      commitment += Math.round(qty * myHighest);

      if (myHighest >= currentHighest) {
        leading += 1;
      } else {
        outbid += 1;
      }
    });

    return {
      leadingLotsCount: leading,
      outbidLotsCount: outbid,
      totalPotentialCommitment: commitment,
    };
  }, [activeBiddedLots]);

  // Open Increase Bid Modal
  const handleOpenIncreaseModal = (lot) => {
    const currentHighest =
      Number(lot.highestBid) ||
      (lot.bids && lot.bids.length > 0 ? Math.max(...lot.bids.map((b) => Number(b.amount) || 0)) : Number(lot.basePrice) || 0);

    setSelectedLotForBidIncrease(lot);
    setBidAmount(String(currentHighest + 50));
    setErrorHelper('');
  };

  // Quick increment buttons
  const handleQuickIncrement = (increment) => {
    setBidAmount((prev) => {
      const val = Number(prev) || 0;
      return String(val + increment);
    });
  };

  // Submit increased bid
  const handleSubmitIncreaseBid = (e) => {
    e.preventDefault();
    if (!selectedLotForBidIncrease) return;

    const currentHighest =
      Number(selectedLotForBidIncrease.highestBid) ||
      (selectedLotForBidIncrease.bids && selectedLotForBidIncrease.bids.length > 0
        ? Math.max(...selectedLotForBidIncrease.bids.map((b) => Number(b.amount) || 0))
        : Number(selectedLotForBidIncrease.basePrice) || 0);

    const amountNum = Number(bidAmount);
    if (!amountNum || isNaN(amountNum)) {
      setErrorHelper('कृपया वैध बोली रक्कम प्रविष्ट करा.');
      return;
    }

    if (amountNum <= currentHighest) {
      setErrorHelper(`बोली चालू सर्वोच्च बोलीपेक्षा (₹${currentHighest.toLocaleString('en-IN')}) जास्त असणे आवश्यक आहे.`);
      return;
    }

    const newBidObj = {
      id: 'BID_' + Date.now().toString().slice(-6),
      merchantName: merchantUser?.firmName || 'Bhajiwala',
      merchantPhone: merchantUser?.mobile || '',
      merchantLocation: merchantUser?.operatingYard || 'सोलापूर APMC मार्केट यार्ड',
      merchantLicense: merchantUser?.licenseNo || 'APMC-SLP-TR-8841',
      amount: amountNum,
      timeFormatted: 'आत्ताच',
      timestamp: new Date().toISOString(),
    };

    placeBid(selectedLotForBidIncrease.id, newBidObj);

    setToastMessage(
      `लॉट #${selectedLotForBidIncrease.id} (${selectedLotForBidIncrease.cropName}) साठी ₹${amountNum.toLocaleString('en-IN')} ची वाढीव बोली यशस्वीरित्या नोंदवली गेली!`
    );
    setSelectedLotForBidIncrease(null);

    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-900/90 text-white border border-emerald-500 shadow-xl flex items-center justify-between gap-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">बोली यशस्वीरित्या वाढवली!</h4>
              <p className="text-xs text-emerald-200">{toastMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage('')}
            className="text-emerald-300 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Active Bids Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-900/50 p-4 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                  थेट लिलाव सत्र • चालू बोली
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white tracking-tight mt-0.5">
                माझ्या चालू बोली (Active Bids)
              </h2>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-indigo-900/80 border border-indigo-700/80 shrink-0 text-right">
              <span className="text-[10px] text-slate-300 block">सक्रिय लॉट्स</span>
              <span className="text-amber-400 text-sm font-extrabold">{totalBiddedLots}</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-indigo-900/60 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-indigo-950/80 min-w-0">
              <span className="text-[10px] text-slate-400 font-medium block">एकूण चालू लॉट्स</span>
              <span className="text-sm font-extrabold text-white truncate block">
                {totalBiddedLots} लॉट्स
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-indigo-950/80 min-w-0">
              <span className="text-[10px] text-emerald-400 font-medium block">आघाडीवर (Leading) 👑</span>
              <span className="text-sm font-extrabold text-emerald-400 truncate block">
                {leadingLotsCount} लॉट्स
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-indigo-950/80 min-w-0">
              <span className="text-[10px] text-amber-400 font-medium block">मागे पडले (Outbid) ⚠️</span>
              <span className="text-sm font-extrabold text-amber-400 truncate block">
                {outbidLotsCount} लॉट्स
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-indigo-950/80 min-w-0">
              <span className="text-[10px] text-slate-400 font-medium block">संभाव्य खरेदी मूल्य</span>
              <span className="text-sm font-extrabold text-indigo-300 truncate block">
                ₹{totalPotentialCommitment.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Lots Feed or Empty State */}
      {totalBiddedLots === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
            <Gavel className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">
              सध्या तुमच्या चालू बोली नाहीत.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              सध्या तुमच्या चालू बोली नाहीत. यार्डमधून नवीन लिलावात सहभागी व्हा.
            </p>
          </div>
          {onSwitchToFeed && (
            <button
              type="button"
              onClick={onSwitchToFeed}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm transition-all cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>यार्ड लिलावात सहभागी व्हा (Go to Live Yard)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {activeBiddedLots.map((lot) => {
            const myBids = (lot.bids || []).filter(isMyBid);
            const myHighestBid = myBids.length > 0 ? Math.max(...myBids.map((b) => Number(b.amount) || 0)) : 0;
            const currentHighestBid =
              Number(lot.highestBid) ||
              (lot.bids && lot.bids.length > 0 ? Math.max(...lot.bids.map((b) => Number(b.amount) || 0)) : Number(lot.basePrice) || 0);

            const isLeading = myHighestBid >= currentHighestBid;
            const quantity = Number(lot.quantity) || 1;
            const totalMyValue = Math.round(quantity * myHighestBid);

            return (
              <div
                key={lot.id}
                className={`w-full bg-white rounded-2xl p-4 shadow-sm border transition-all flex flex-col justify-between ${
                  isLeading
                    ? 'border-emerald-200/90 hover:border-emerald-300'
                    : 'border-amber-200/90 hover:border-amber-300'
                }`}
              >
                <div className="space-y-3.5">
                  {/* 1. Header: Crop Name, Lot ID, Grade, and Status Badges */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight truncate">
                          {lot.cropName || 'शेतमाल'}
                        </h3>
                        <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shrink-0">
                          {lot.qualityGrade || 'Grade A'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                        लॉट क्र.: {lot.id}
                      </div>
                    </div>

                    {/* Leading vs Outbid Chip */}
                    <div className="shrink-0">
                      {isLeading ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">तुमची बोली आघाडीवर आहे 👑</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">बोली मागे पडली (Outbid) ⚠️</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2. Farmer & Produce Details */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={lot.image || lot.imageUrl || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&auto=format&fit=crop&q=80'}
                        alt={lot.cropName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-xs space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-800 font-semibold truncate">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{lot.farmerName || 'शेतकरी'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-[11px] truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{lot.location || 'सोलापूर APMC'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-[11px] pt-0.5">
                        <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded">
                          {lot.quantity} {lot.unit || 'क्विंटल'}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span>मूळ दर: ₹{Number(lot.basePrice || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Bidding Comparison Box (Current Highest vs Merchant's Bid) */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/90 p-3 rounded-xl border border-slate-100 text-xs">
                    {/* Current Highest Bid */}
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 font-medium block">
                        चालू सर्वोच्च बोली
                      </span>
                      <span className="text-sm font-black text-slate-900 mt-0.5 block truncate">
                        ₹{currentHighestBid.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-slate-500"> /{lot.unit || 'क्विंटल'}</span>
                      </span>
                      <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">
                        {lot.bids?.length || 0} बोलीदार
                      </span>
                    </div>

                    {/* Merchant's Bid */}
                    <div className="min-w-0 border-l border-slate-200/80 pl-2.5">
                      <span className="text-[10px] text-slate-500 font-medium block">
                        आपली नोंदवलेली बोली
                      </span>
                      <span
                        className={`text-sm font-black mt-0.5 block truncate ${
                          isLeading ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        ₹{myHighestBid.toLocaleString('en-IN')}
                        <span className="text-[10px] font-normal text-slate-500"> /{lot.unit || 'क्विंटल'}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                        एकूण: ₹{totalMyValue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* 4. Session Status & Time Left */}
                  <div className="flex items-center justify-between text-[11px] px-1 text-slate-500">
                    <span className="inline-flex items-center gap-1 font-medium text-indigo-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>लिलाव चालू (Bidding In Progress)</span>
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      वेळ शिल्लक: ~२५ मिनिटे
                    </span>
                  </div>
                </div>

                {/* 5. Quick Action Button: बोली वाढवा (Increase Bid) */}
                <div className="pt-3 mt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleOpenIncreaseModal(lot)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                      isLeading
                        ? 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:from-amber-700 shadow-amber-500/20'
                    }`}
                  >
                    <Gavel className="w-4 h-4 shrink-0" />
                    <span>बोली वाढवा (Increase Bid)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK INCREASE BID MODAL */}
      {selectedLotForBidIncrease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 border border-slate-300 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-base">
                <Gavel className="w-5 h-5 text-indigo-600" />
                <span>बोली वाढवा • {selectedLotForBidIncrease.cropName}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLotForBidIncrease(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Lot Info & Price Comparison */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 block">
                    लॉट क्र.: {selectedLotForBidIncrease.id} • {selectedLotForBidIncrease.cropName}
                  </span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    प्रमाण: {selectedLotForBidIncrease.quantity} {selectedLotForBidIncrease.unit || 'क्विंटल'} | शेतकरी: {selectedLotForBidIncrease.farmerName || 'शेतकरी'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">चालू सर्वोच्च</span>
                  <span className="text-sm font-black text-indigo-950 block">
                    ₹
                    {(
                      Number(selectedLotForBidIncrease.highestBid) ||
                      (selectedLotForBidIncrease.bids && selectedLotForBidIncrease.bids.length > 0
                        ? Math.max(...selectedLotForBidIncrease.bids.map((b) => Number(b.amount) || 0))
                        : Number(selectedLotForBidIncrease.basePrice) || 0)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Increase Bid Form */}
              <form onSubmit={handleSubmitIncreaseBid} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    आपली नवीन वाढीव बोली (प्रति {selectedLotForBidIncrease.unit || 'क्विंटल'}):
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-slate-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => {
                        setBidAmount(e.target.value);
                        setErrorHelper('');
                      }}
                      className="w-full pl-8 pr-20 py-2.5 text-base font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      placeholder="उदा. २५५०"
                      autoFocus
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400">
                      /{selectedLotForBidIncrease.unit || 'क्विंटल'}
                    </span>
                  </div>
                </div>

                {/* Quick Increments */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                    त्वरित वाढवा (Quick Stepper):
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 250, 500].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => handleQuickIncrement(inc)}
                        className="py-1.5 px-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-all text-center cursor-pointer"
                      >
                        + ₹{inc}
                      </button>
                    ))}
                  </div>
                </div>

                {errorHelper && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorHelper}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedLotForBidIncrease(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    रद्द करा
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>बोली नोंदवा (Submit Bid)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
