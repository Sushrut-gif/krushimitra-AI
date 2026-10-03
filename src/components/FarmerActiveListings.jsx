import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import {
  PackageCheck,
  Scale,
  IndianRupee,
  MapPin,
  Calendar,
  Sparkles,
  Gavel,
  Trash2,
  AlertCircle,
  Tag,
} from 'lucide-react';

export default function FarmerActiveListings({ onOpenNewListing }) {
  const { farmerUser } = useAuth();
  const { getFarmerListings, removeListing } = useListings();

  const myListings = getFarmerListings(farmerUser?.mobile);

  // Grade color helper
  const getGradeBadge = (grade = '') => {
    const lower = grade.toLowerCase();
    if (lower.includes('उत्तम') || lower.includes('a') || lower.includes('सुपर')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (lower.includes('सामान्य') || lower.includes('कमी') || lower.includes('c') || lower.includes('चालू')) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

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
              <span className="text-xs text-gray-400 font-medium">({myListings.length} नोंदी)</span>
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
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>+ नवीन माल नोंदवा</span>
            </button>
          )}
        </div>
      </div>

      {/* Listings Body */}
      <div className="p-6 sm:p-8">
        {myListings.length === 0 ? (
          /* Empty state */
          <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Gavel className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-900">
                सध्या कोणताही माल लिलावासाठी नोंदवलेला नाही
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myListings.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Image & Status Tag */}
                <div className="relative aspect-video w-full bg-gray-100 overflow-hidden border-b border-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50/50 text-emerald-600">
                      <Tag className="w-10 h-10 opacity-40" />
                    </div>
                  )}

                  {/* Active Bidding Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-emerald-800 shadow-xs border border-emerald-200 backdrop-blur-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{item.status || 'बोली सुरू - Active Bidding'}</span>
                    </span>
                  </div>

                  {/* Listing ID Tag */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                      #{item.id}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-gray-950 group-hover:text-emerald-800 transition-colors">
                        {item.cropName}
                      </h3>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${getGradeBadge(
                          item.qualityGrade
                        )}`}
                      >
                        {item.qualityGrade}
                      </span>
                    </div>

                    {/* Quantity & Base Price metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
                        <span className="block text-[10px] font-semibold text-gray-500">
                          एकूण प्रमाण (Quantity)
                        </span>
                        <div className="flex items-center gap-1 text-sm font-extrabold text-gray-900 mt-0.5">
                          <Scale className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                        <span className="block text-[10px] font-semibold text-emerald-800">
                          किमान अपेक्षित दर (Base Price)
                        </span>
                        <div className="flex items-center gap-1 text-sm font-black text-emerald-900 mt-0.5">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                          <span>₹{item.basePrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location & Date */}
                    <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate" title={item.location}>
                          {item.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>नोंदणी दिनांक: {item.listingDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>व्यापारी बोलीसाठी उपलब्ध</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => removeListing(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="नोंदणी रद्द करा"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
