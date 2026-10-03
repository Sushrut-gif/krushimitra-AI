import React, { useState } from 'react';
import { useListings, generateSampleBids } from '../context/ListingsContext';
import {
  X,
  Gavel,
  TrendingUp,
  Scale,
  IndianRupee,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export default function LiveBidsModal({ isOpen, onClose, listing }) {
  const { acceptBid } = useListings();

  // Confirmation dialog state: null | bidObject
  const [confirmingBid, setConfirmingBid] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen || !listing) return null;

  // Retrieve bids or generate realistic sample fallback
  const bids = listing.bids && listing.bids.length > 0 ? listing.bids : generateSampleBids(listing.basePrice);

  // Calculate highest bid
  const highestBid = bids.reduce((max, curr) => (curr.amount > max.amount ? curr : max), bids[0]);

  // Is deal already finalized?
  const isFinalized =
    listing.status &&
    (listing.status.includes('विक्री पूर्ण') || listing.status.includes('Sold') || !!listing.winningMerchant);

  // Handle click on "बोली स्वीकारा"
  const handleOpenConfirm = (bid) => {
    setConfirmingBid(bid);
  };

  // Confirm accepting the bid
  const handleConfirmAccept = () => {
    if (!confirmingBid) return;

    acceptBid(listing.id, confirmingBid);
    setConfirmingBid(null);
    setSuccessMessage('बोली स्वीकारली! डिजिटल पावती तयार केली जात आहे.');

    setTimeout(() => {
      setSuccessMessage('');
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden transition-all">
        {/* Emerald Top Accent */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 w-full" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  थेट बाजार लिलाव
                </span>
                <span className="text-xs text-gray-400 font-mono">#{listing.id}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-950 tracking-tight mt-0.5">
                लाईव्ह व्यापारी बोली (Live Bidding Tracking)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-4 bg-emerald-600 text-white flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <div className="text-xs sm:text-sm font-semibold">{successMessage}</div>
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Produce Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {listing.image ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                  <img
                    src={listing.image}
                    alt={listing.cropName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Tag className="w-7 h-7" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-gray-950">
                    {listing.cropName}
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {listing.qualityGrade}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    {listing.quantity} {listing.unit}
                  </span>
                  <span>•</span>
                  <span>
                    मूळ किमान दर: <strong className="text-gray-900">₹{listing.basePrice.toLocaleString('en-IN')}</strong> / {listing.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div className="shrink-0 self-end sm:self-center">
              {isFinalized ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>विक्री पूर्ण (Sold)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>बोली सुरू (Active Bidding)</span>
                </span>
              )}
            </div>
          </div>

          {/* Deal Finalized Banner (if sold) */}
          {isFinalized && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-400 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm sm:text-base">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>हा लिलाव सौदा निश्चित झाला आहे!</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-950 pt-1">
                <div>
                  <span className="text-gray-500 block">खरेदीदार व्यापारी:</span>
                  <span className="font-bold text-sm text-gray-900">
                    {listing.winningMerchant || highestBid?.merchantName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">अंतिम मान्य दर:</span>
                  <span className="font-extrabold text-sm text-emerald-800">
                    ₹{(listing.winningPrice || highestBid?.amount)?.toLocaleString('en-IN')} / {listing.unit}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Top Metrics: Highest Bid & Total Bids Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Highest Current Bid */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-md space-y-1">
              <div className="flex items-center justify-between text-emerald-100 text-xs font-semibold">
                <span>सर्वोच्च चालू बोली (Highest Current Bid)</span>
                <TrendingUp className="w-4 h-4 text-emerald-200" />
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight pt-1">
                ₹{highestBid ? highestBid.amount.toLocaleString('en-IN') : listing.basePrice.toLocaleString('en-IN')}{' '}
                <span className="text-xs sm:text-sm font-normal text-emerald-100">
                  / {listing.unit}
                </span>
              </div>
              <div className="text-[11px] text-emerald-100 pt-1">
                व्यापारी: <strong>{highestBid?.merchantName}</strong>
              </div>
            </div>

            {/* Total Bids Count */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 shadow-2xs space-y-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>एकूण प्राप्त बोली (Total Bids Received)</span>
                <Gavel className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                {bids.length} <span className="text-xs font-medium text-gray-600">व्यापारी बोली</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                सर्व व्यापारी सोलापूर APMC अधिकृत परवानाधारक आहेत
              </div>
            </div>
          </div>

          {/* Confirmation Prompt Popup inside modal */}
          {confirmingBid && (
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3 animate-in fade-in-50 duration-150">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-950">
                    बोली स्वीकारण्याची खात्री करा (Confirm Deal)
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    तुम्ही <strong>"{confirmingBid.merchantName}"</strong> यांची{' '}
                    <strong>₹{confirmingBid.amount.toLocaleString('en-IN')} / {listing.unit}</strong> रुपयांची बोली स्वीकारत आहात का?
                    सौदा पक्का झाल्यानंतर हा माल विक्री पूर्ण म्हणून नोंदवला जाईल.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmingBid(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50"
                >
                  रद्द करा
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAccept}
                  className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                >
                  होय, बोली स्वीकारा (Confirm)
                </button>
              </div>
            </div>
          )}

          {/* List of Merchant Bids */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                सर्व व्यापारी बोलींची यादी (Live Merchant Bids)
              </h4>
              <span className="text-[11px] text-gray-500">
                चढत्या / सर्वोच्च क्रमाने
              </span>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
              {bids
                .slice()
                .sort((a, b) => b.amount - a.amount)
                .map((bid, index) => {
                  const isTopBid = index === 0;
                  const isWinningBid =
                    isFinalized &&
                    (listing.winningBidId === bid.id || listing.winningMerchant === bid.merchantName);

                  return (
                    <div
                      key={bid.id}
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isWinningBid
                          ? 'bg-emerald-50/80 border-l-4 border-l-emerald-600'
                          : isTopBid
                          ? 'bg-emerald-50/30'
                          : 'hover:bg-gray-50/60'
                      }`}
                    >
                      {/* Merchant details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-950">
                            {bid.merchantName}
                          </span>
                          {isTopBid && !isFinalized && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              सर्वोच्च बोली
                            </span>
                          )}
                          {isWinningBid && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                              स्वीकृत सौदा ✓
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            {bid.merchantLocation}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {bid.timeFormatted || 'काही वेळापूर्वी'}
                          </span>
                        </div>
                      </div>

                      {/* Bid Amount & Action Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="text-left sm:text-right">
                          <span className="block text-[10px] text-gray-500 font-medium">
                            बोली दर प्रति {listing.unit}
                          </span>
                          <span className="text-base sm:text-lg font-black text-gray-900">
                            ₹{bid.amount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Accept Button */}
                        {!isFinalized ? (
                          <button
                            type="button"
                            onClick={() => handleOpenConfirm(bid)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                            <span>बोली स्वीकारा</span>
                          </button>
                        ) : isWinningBid ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>सौदा पक्का</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">लिलाव बंद</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>APMC सुरक्षित लिलाव प्रणाली • दर पारदर्शकता हमी</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100"
          >
            बंद करा
          </button>
        </div>
      </div>
    </div>
  );
}
