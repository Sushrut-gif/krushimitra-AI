import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { DEFAULT_PRODUCE_PLACEHOLDER } from '../utils/imageCompressor';
import LiveBidsModal from './LiveBidsModal';
import DigitalAuctionReceiptModal from './DigitalAuctionReceiptModal';
import APMCGatePassModal from './APMCGatePassModal';
import {
  Scale,
  IndianRupee,
  MapPin,
  Calendar,
  Sparkles,
  Gavel,
  Trash2,
  Tag,
  CheckCircle2,
  Award,
  QrCode,
  FileText,
  Clock,
  ChevronRight,
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
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
  if (lower.includes('सामान्य') || lower.includes('कमी') || lower.includes('c') || lower.includes('चालू')) {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }
  return 'bg-blue-50 text-blue-800 border-blue-200';
};

/**
 * Professional Native Mobile Active Lot Card
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
    const grade = item?.grade || item?.qualityGrade || 'उत्तम प्रत';
    const quantity = item?.quantity ?? 0;
    const unit = item?.unit || 'क्विंटल';
    const basePrice = Number(item?.base_price ?? item?.basePrice ?? 0);
    const bids = Array.isArray(item?.bids) ? item.bids : [];
    const bidsCount = bids.length;

    const highestBidObj =
      bidsCount > 0
        ? bids.reduce((max, curr) => (Number(curr?.amount || 0) > Number(max?.amount || 0) ? curr : max), bids[0])
        : null;

    const status = item?.status || 'सक्रिय';
    const isSold = Boolean(
      (typeof status === 'string' &&
        (status.includes('विक्री पूर्ण') || status.includes('Sold') || status === 'विक्री पूर्ण')) ||
      item?.winningMerchant ||
      item?.winning_merchant_id
    );

    const winningPrice = Number(item?.winningPrice ?? item?.highest_bid ?? item?.highestBid ?? basePrice);
    const displayPrice = isSold ? winningPrice : basePrice;

    const imageUrl = item?.image_url || item?.image || DEFAULT_PRODUCE_PLACEHOLDER;
    const location = item?.location || 'सोलापूर APMC';
    const formattedDate = safeFormatDate(item?.created_at || item?.listingDate);

    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mx-4 my-2.5 space-y-3 transition-all hover:border-emerald-500/40">
        {/* Row 1: Crop Thumbnail (80x80px) on left + Crop details on right */}
        <div className="flex items-start gap-3.5">
          {/* 80x80px rounded-xl thumbnail */}
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 relative">
            <img
              src={imageUrl}
              alt={cropName}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_PRODUCE_PLACEHOLDER;
              }}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 left-1 text-[9px] font-mono font-bold bg-black/65 text-white px-1 py-0.5 rounded backdrop-blur-2xs">
              #{String(item?.id || '').slice(-4) || 'LOT'}
            </span>
          </div>

          {/* Right Column details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5">
              <h4 className="text-base font-bold text-slate-900 truncate tracking-tight">
                {cropName}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getGradeBadge(grade)}`}>
                {grade}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
              <Scale className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{quantity} {unit}</span>
            </div>

            <div className="mt-1 flex items-center gap-1 text-xs font-black text-emerald-800">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{safeFormatCurrency(displayPrice)} / {unit}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Location/date metadata in muted small text */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1 truncate max-w-[170px]" title={location}>
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{location}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{formattedDate}</span>
          </span>
        </div>

        {/* Row 3: Full-width live bidding status pill button with chevron */}
        <div>
          {isSold ? (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => onOpenGatePass(item)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-bold flex items-center justify-between transition-all shadow-xs cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5 text-emerald-200" />
                  <span>विक्री पूर्ण (Sold) • डिजिटल गेट पास</span>
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-200" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenReceipt(item)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <FileText className="w-3 h-3 text-indigo-600" />
                  <span>पावती पहा</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenBids(item)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>बोली इतिहास ({bidsCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item?.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="हटवा"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenBids(item)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 text-emerald-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>लिलाव बोली ट्रॅकर • {bidsCount} बोली</span>
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(item?.id)}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="हटवा"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Listing Card Render Error:', error, item);
    return (
      <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-amber-900 text-xs mx-4 my-2 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>शेतमाल माहिती लोड करताना त्रुटी</span>
        </div>
        <p className="text-[11px] text-slate-600">
          लॉट: #{item?.id || '—'} ({item?.crop_name || item?.cropName || 'शेतमाल'})
        </p>
      </div>
    );
  }
}

export default function FarmerActiveListings({ onOpenNewListing }) {
  const { farmerUser } = useAuth();
  const { getFarmerListings, removeListing } = useListings();

  // Modals state
  const [selectedListingForBids, setSelectedListingForBids] = useState(null);
  const [selectedListingForReceipt, setSelectedListingForReceipt] = useState(null);
  const [selectedListingForGatePass, setSelectedListingForGatePass] = useState(null);

  const myListings = useMemo(() => {
    try {
      const raw = getFarmerListings ? getFarmerListings(farmerUser?.mobile) || [] : [];
      return Array.isArray(raw) ? raw : [];
    } catch (err) {
      console.error('Listing Card Render Error in getFarmerListings:', err);
      return [];
    }
  }, [getFarmerListings, farmerUser?.mobile]);

  return (
    <div className="pt-2 pb-4">
      {/* Sleek Sub-header */}
      <div className="pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            माझे नोंदवलेले माल
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {myListings.length} लॉट
          </span>
        </div>

        {onOpenNewListing && (
          <button
            type="button"
            onClick={onOpenNewListing}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>+ नवीन माल</span>
          </button>
        )}
      </div>

      {/* Listings Body */}
      {myListings.length === 0 ? (
        <div className="my-2 p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2.5 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">कोणताही माल नोंदवलेला नाही</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              कॅमेऱ्याने फोटो काढा किंवा थेट फॉर्म भरून सोलापूर APMC ई-लिलावात माल नोंदवा.
            </p>
          </div>
          {onOpenNewListing && (
            <button
              type="button"
              onClick={onOpenNewListing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <span>+ थेट माल नोंदणी करा</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myListings.map((item, index) => (
            <SafeListingCard
              key={item?.id || index}
              item={item}
              onOpenGatePass={(lot) => setSelectedListingForGatePass(lot)}
              onOpenReceipt={(lot) => setSelectedListingForReceipt(lot)}
              onOpenBids={(lot) => setSelectedListingForBids(lot)}
              onRemove={(id) => id && removeListing(id)}
            />
          ))}
        </div>
      )}

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
