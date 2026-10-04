import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { DEFAULT_PRODUCE_PLACEHOLDER } from '../utils/imageCompressor';
import LiveBidsModal from './LiveBidsModal';
import DigitalAuctionReceiptModal from './DigitalAuctionReceiptModal';
import APMCGatePassModal from './APMCGatePassModal';
import {
  PackageCheck,
  Scale,
  IndianRupee,
  MapPin,
  Calendar,
  Sparkles,
  Gavel,
  Trash2,
  Tag,
  TrendingUp,
  CheckCircle2,
  Award,
  Printer,
  QrCode,
  FileText,
  Clock,
  AlertCircle,
} from 'lucide-react';

/**
 * Safe date formatting helper to prevent any Date constructor crashes
 */
function safeFormatDate(dateVal) {
  if (!dateVal) return 'आज (चालू दिवस)';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('mr-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateVal || 'आज');
  }
}

/**
 * Safe currency formatter
 */
function safeFormatCurrency(val) {
  const num = Number(val);
  if (isNaN(num)) return '—';
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Grade color helper
 */
const getGradeBadge = (grade = '') => {
  const lower = String(grade || '').toLowerCase();
  if (lower.includes('उत्तम') || lower.includes('a') || lower.includes('सुपर')) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  }
  if (lower.includes('सामान्य') || lower.includes('कमी') || lower.includes('c') || lower.includes('चालू')) {
    return 'bg-amber-100 text-amber-800 border-amber-300';
  }
  return 'bg-blue-50 text-blue-800 border-blue-200';
};

/**
 * Individual Safe Listing Card with isolation boundary
 */
function SafeListingCard({
  item,
  onOpenGatePass,
  onOpenReceipt,
  onOpenBids,
  onRemove,
}) {
  try {
    const cropName = item?.crop_name || item?.cropName || 'शेतमाल';
    const grade = item?.grade || item?.qualityGrade || 'सामान्य';
    const quantity = item?.quantity ?? 0;
    const unit = item?.unit || 'क्विंटल';
    const basePrice = Number(item?.base_price ?? item?.basePrice ?? 0);
    const bids = Array.isArray(item?.bids) ? item.bids : [];
    const bidsCount = bids.length;

    // Highest bid object from bids array or database column
    const highestBidObj =
      bidsCount > 0
        ? bids.reduce((max, curr) => (Number(curr?.amount || 0) > Number(max?.amount || 0) ? curr : max), bids[0])
        : null;

    const highestBidVal =
      highestBidObj?.amount ??
      item?.highest_bid ??
      item?.highestBid ??
      item?.current_bid ??
      item?.base_price ??
      item?.basePrice ??
      '—';

    const status = item?.status || 'सक्रिय';
    const isSold = Boolean(
      (typeof status === 'string' && (status.includes('विक्री पूर्ण') || status.includes('Sold') || status === 'विक्री पूर्ण')) ||
      item?.winningMerchant ||
      item?.winning_merchant_id
    );

    const winningPrice = Number(item?.winningPrice ?? item?.highest_bid ?? item?.highestBid ?? basePrice);
    const displayPrice = isSold ? winningPrice : basePrice;

    const imageUrl = item?.image_url || item?.image || DEFAULT_PRODUCE_PLACEHOLDER;
    const location = item?.location || 'सोलापूर APMC परिसर';
    const formattedDate = safeFormatDate(item?.created_at || item?.listingDate);
    const winningMerchant = item?.winningMerchant || item?.winning_merchant_id || 'अधिकृत व्यापारी';

    return (
      <div
        className={`group bg-white rounded-3xl border shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden ${
          isSold ? 'border-emerald-300 ring-1 ring-emerald-500/20' : 'border-gray-200/90 hover:border-emerald-500/50'
        }`}
      >
        {/* Top Image & Status Tag */}
        <div className="relative aspect-video w-full bg-gray-100 overflow-hidden border-b border-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={cropName}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_PRODUCE_PLACEHOLDER;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-50/50 text-emerald-600">
              <Tag className="w-10 h-10 opacity-40" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2.5 left-2.5">
            {isSold ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-700 text-white shadow-xs backdrop-blur-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>विक्री पूर्ण (Sold)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-emerald-800 shadow-xs border border-emerald-200 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{status}</span>
              </span>
            )}
          </div>

          {/* Listing ID Tag */}
          <div className="absolute top-2.5 right-2.5">
            <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-xs">
              #{item?.id || 'KM-LOT'}
            </span>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-gray-950 group-hover:text-emerald-800 transition-colors">
                {cropName}
              </h3>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${getGradeBadge(
                  grade
                )}`}
              >
                {grade}
              </span>
            </div>

            {/* Quantity & Base Price metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80">
                <span className="block text-[10px] font-semibold text-gray-500">
                  एकूण प्रमाण (Quantity)
                </span>
                <div className="flex items-center gap-1 text-sm font-extrabold text-gray-900 mt-0.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {quantity} {unit}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <span className="block text-[10px] font-semibold text-emerald-800">
                  {isSold ? 'मान्य अंतिम दर' : 'किमान अपेक्षित दर'}
                </span>
                <div className="flex items-center gap-1 text-sm font-black text-emerald-900 mt-0.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    {safeFormatCurrency(displayPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Highlight Highest Bid on Card (when active) */}
            {!isSold && highestBidObj && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/60 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>सर्वोच्च चालू बोली:</span>
                </span>
                <span className="font-black text-emerald-900">
                  {safeFormatCurrency(highestBidObj.amount)} / {unit}
                </span>
              </div>
            )}

            {!isSold && !highestBidObj && (
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>बोली स्थिती:</span>
                </span>
                <span className="font-semibold text-gray-600">
                  {highestBidVal && highestBidVal !== '—' && Number(highestBidVal) > 0
                    ? `चालू बोली: ${safeFormatCurrency(highestBidVal)}`
                    : 'अद्याप बोली प्राप्त नाही'}
                </span>
              </div>
            )}

            {/* Sold Banner on Card (when sold) */}
            {isSold && (
              <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 flex items-center justify-between text-xs">
                <span className="text-emerald-900 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span>खरेदीदार:</span>
                </span>
                <span className="font-extrabold text-emerald-950 truncate max-w-[140px]" title={winningMerchant}>
                  {winningMerchant}
                </span>
              </div>
            )}

            {/* Location & Date */}
            <div className="pt-2 border-t border-gray-100 space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate" title={location}>
                  {location}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>नोंदणी दिनांक: {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Action Button: Live Bids or Digital Bill & Gate Pass */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {isSold ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onOpenGatePass(item)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
                >
                  <QrCode className="w-4 h-4 text-emerald-200" />
                  <span>डिजिटल गेट पास पहा (View APMC Gate Pass)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenReceipt(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>अधिकृत पावती</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenBids(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 transition-colors cursor-pointer"
                  >
                    <span>बोली इतिहास ({bidsCount})</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenBids(item)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
              >
                <Gavel className="w-4 h-4 text-emerald-200" />
                <span>
                  {bidsCount > 0
                    ? `लाईव्ह बोली पहा (View Live Bids - ${bidsCount})`
                    : 'लिलाव बोली ट्रॅकर (0 बोली)'}
                </span>
              </button>
            )}

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>सोलापूर APMC मान्यताप्राप्त</span>
              </span>
              <button
                type="button"
                onClick={() => onRemove(item?.id)}
                className="hover:text-red-600 transition-colors p-1 cursor-pointer"
                title="नोंदणी हटवा"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Listing Card Render Error:", error, item);
    return (
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>शेतमाल माहिती लोड करताना त्रुटी</span>
        </div>
        <p className="text-[11px] text-gray-600">
          लॉट आयडी: #{item?.id || '—'} ({item?.crop_name || item?.cropName || 'शेतमाल'})
        </p>
      </div>
    );
  }
}

export default function FarmerActiveListings({ onOpenNewListing }) {
  const { farmerUser } = useAuth();
  const { getFarmerListings, removeListing } = useListings();

  // Selected listing for live bids modal, digital receipt modal, and gate pass modal
  const [selectedListingForBids, setSelectedListingForBids] = useState(null);
  const [selectedListingForReceipt, setSelectedListingForReceipt] = useState(null);
  const [selectedListingForGatePass, setSelectedListingForGatePass] = useState(null);

  const myListings = useMemo(() => {
    try {
      const raw = getFarmerListings ? (getFarmerListings(farmerUser?.mobile) || []) : [];
      return Array.isArray(raw) ? raw : [];
    } catch (err) {
      console.error("Listing Card Render Error in getFarmerListings:", err);
      return [];
    }
  }, [getFarmerListings, farmerUser?.mobile]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all">
      {/* Emerald accent top border */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 w-full" />

      {/* Header section */}
      <div className="p-6 sm:p-7 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                सक्रिय लिलाव बाजार
              </span>
              <span className="text-xs text-gray-400 font-medium">({myListings?.length || 0} नोंदी)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight mt-0.5">
              माझे नोंदवलेले माल (My Active Listings)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenNewListing && (
            <button
              type="button"
              onClick={onOpenNewListing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>+ नवीन माल नोंदवा</span>
            </button>
          )}
        </div>
      </div>

      {/* Listings Body */}
      <div className="p-6 sm:p-8">
        {(myListings || []).length === 0 ? (
          /* Empty state */
          <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Gavel className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-900">
                आपण अद्याप कोणताही शेतमाल विक्रीसाठी नोंदवला नाही.
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                वर दिलेल्या AI कॅमेरा तपासणीद्वारे आपल्या शेतमालाची गुणवत्ता तपासा आणि एका क्लिकवर थेट सोलापूर APMC लिलावात माल नोंदवा.
              </p>
            </div>
            {onOpenNewListing && (
              <button
                type="button"
                onClick={onOpenNewListing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>थेट माल नोंदणी करा</span>
              </button>
            )}
          </div>
        ) : (
          /* Grid of Listings Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(myListings || []).map((item, index) => {
              try {
                return (
                  <SafeListingCard
                    key={item?.id || index}
                    item={item}
                    onOpenGatePass={(lot) => setSelectedListingForGatePass(lot)}
                    onOpenReceipt={(lot) => setSelectedListingForReceipt(lot)}
                    onOpenBids={(lot) => setSelectedListingForBids(lot)}
                    onRemove={(id) => id && removeListing(id)}
                  />
                );
              } catch (cardErr) {
                console.error("Listing Card Render Error:", cardErr, item);
                return (
                  <div
                    key={item?.id || index}
                    className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs"
                  >
                    <p className="font-bold">शेतमाल माहिती लोड करताना त्रुटी आली.</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">आयडी: #{item?.id || '—'}</p>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      {/* Live Bids Modal */}
      {selectedListingForBids && (
        <LiveBidsModal
          isOpen={!!selectedListingForBids}
          onClose={() => setSelectedListingForBids(null)}
          listing={myListings.find((l) => l.id === selectedListingForBids.id) || selectedListingForBids}
          onOpenReceipt={(item) => setSelectedListingForReceipt(item)}
        />
      )}

      {/* Digital Auction Bill Modal */}
      {selectedListingForReceipt && (
        <DigitalAuctionReceiptModal
          isOpen={!!selectedListingForReceipt}
          onClose={() => setSelectedListingForReceipt(null)}
          listing={myListings.find((l) => l.id === selectedListingForReceipt.id) || selectedListingForReceipt}
        />
      )}

      {/* APMC QR Gate Pass Modal */}
      {selectedListingForGatePass && (
        <APMCGatePassModal
          isOpen={!!selectedListingForGatePass}
          onClose={() => setSelectedListingForGatePass(null)}
          lot={myListings.find((l) => l.id === selectedListingForGatePass.id) || selectedListingForGatePass}
        />
      )}
    </div>
  );
}
