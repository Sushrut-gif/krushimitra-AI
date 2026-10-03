import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import {
  X,
  Gavel,
  Tag,
  Scale,
  IndianRupee,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const UNITS = ['क्विंटल (Quintal)', 'पोती (Bags / पोती)', 'क्रेट्स (Crates)', 'टन (Tons)', 'जुड्या (Bunches)'];

export default function ProduceListingModal({
  isOpen,
  onClose,
  initialData = {}, // { cropName, qualityGrade, image, estimatedPrice, notes }
  onListingSuccess,
}) {
  const { farmerUser } = useAuth();
  const { addListing } = useListings();

  // Pre-filled & editable form states
  const [cropName, setCropName] = useState('');
  const [qualityGrade, setQualityGrade] = useState('मध्यम');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('क्विंटल (Quintal)');
  const [basePrice, setBasePrice] = useState('');
  const [location, setLocation] = useState('');
  const [listingDate, setListingDate] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCropName(initialData.cropName || '');
      setQualityGrade(initialData.qualityGrade || 'मध्यम');
      setQuantity('');
      setUnit('क्विंटल (Quintal)');
      setBasePrice('');

      // Format default location from farmer's profile
      if (farmerUser) {
        const parts = [
          farmerUser.village ? `गाव: ${farmerUser.village}` : '',
          farmerUser.taluka ? `ता. ${farmerUser.taluka}` : '',
          farmerUser.district ? `जि. ${farmerUser.district}` : '',
        ].filter(Boolean);
        setLocation(parts.join(', '));
      } else {
        setLocation('सोलापूर APMC परिसर');
      }

      // Default date to today (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      setListingDate(today);

      setError('');
      setIsSuccess(false);
    }
  }, [isOpen, initialData, farmerUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!cropName.trim()) {
      setError('कृपया पिकाचे नाव टाका.');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError('कृपया मालाचे वैध वजन / प्रमाण टाका.');
      return;
    }

    if (!basePrice || Number(basePrice) <= 0) {
      setError('कृपया किमान अपेक्षित दर (₹) टाका.');
      return;
    }

    if (!location.trim()) {
      setError('कृपया मालाचे ठिकाण प्रविष्ट करा.');
      return;
    }

    if (!listingDate) {
      setError('कृपया विक्रीची तारीख निवडा.');
      return;
    }

    // Clean unit label
    const cleanUnit = unit.split(' ')[0];

    const newListing = addListing({
      farmerId: farmerUser?.id,
      farmerName: farmerUser?.name || 'शेतकरी मित्र',
      farmerMobile: farmerUser?.mobile || '',
      cropName: cropName.trim(),
      qualityGrade: qualityGrade.trim(),
      quantity: Number(quantity),
      unit: cleanUnit,
      basePrice: Number(basePrice),
      location: location.trim(),
      listingDate: listingDate,
      image: initialData.image || null,
      notes: initialData.notes || '',
      estimatedMarketPrice: initialData.estimatedPrice || '',
    });

    setIsSuccess(true);
    setTimeout(() => {
      if (onListingSuccess) {
        onListingSuccess(newListing);
      }
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-xl w-full overflow-hidden transition-all">
        {/* Top Emerald Header */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 w-full" />

        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950">
                माल विक्री / लिलाव नोंदणी
              </h2>
              <p className="text-xs text-gray-500">
                AI तपासणीनुसार माहिती पूर्वनोंदणी केली आहे
              </p>
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

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Success Banner */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                लिलाव नोंदणी यशस्वी झाली!
              </h3>
              <p className="text-xs text-gray-600">
                आपला माल "माझे नोंदवलेले माल" या कक्षामध्ये बोलीसाठी सक्रिय झाला आहे.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo & Pre-filled AI info banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-4">
                {initialData.image ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-emerald-200 shadow-2xs">
                    <img
                      src={initialData.image}
                      alt="पिकाचा फोटो"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Tag className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>AI व्हिजनद्वारे ओळखलेले पीक</span>
                  </div>
                  <div className="text-xs text-gray-700">
                    पिकाचे नाव व गुणवत्ता प्रत आपण खाली आवश्यकतेनुसार बदलू शकता.
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* Crop Name & Quality Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    पिकाचे नाव (Crop Name) <span className="text-emerald-700">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Tag className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={cropName}
                      onChange={(e) => setCropName(e.target.value)}
                      placeholder="उदा. सोलापुरी लाल कांदा / डाळिंब (भगवा)"
                      required
                      className="block w-full pl-10 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    गुणवत्ता प्रत (Quality Grade) <span className="text-emerald-700">*</span>
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    required
                    className="block w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                  >
                    <option value="उत्तम (Grade A)">उत्तम (Grade A - सुपर)</option>
                    <option value="मध्यम (Grade B)">मध्यम (Grade B - सरासरी)</option>
                    <option value="सामान्य (Grade C)">सामान्य (Grade C - चालू)</option>
                  </select>
                </div>
              </div>

              {/* Total Quantity & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    एकूण प्रमाण / वजन <span className="text-emerald-700">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Scale className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="उदा. 50"
                      required
                      className="block w-full pl-10 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    एकक (Unit) <span className="text-emerald-700">*</span>
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="block w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Base / Minimum Expected Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  किमान अपेक्षित दर (Base / Minimum Expected Price in ₹) <span className="text-emerald-700">*</span>
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <IndianRupee className="w-4 h-4 text-emerald-700" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="उदा. 2400 (प्रति क्विंटल)"
                    required
                    className="block w-full pl-10 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                {initialData.estimatedPrice && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    AI संदर्भ दर: <span className="font-semibold text-emerald-800">{initialData.estimatedPrice}</span>
                  </p>
                )}
              </div>

              {/* Location & Listing Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    मालाचे ठिकाण (Location) <span className="text-emerald-700">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="गाव, तालुका, जिल्हा"
                      required
                      className="block w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    विक्रीची तारीख (Listing Date) <span className="text-emerald-700">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="date"
                      value={listingDate}
                      onChange={(e) => setListingDate(e.target.value)}
                      required
                      className="block w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Gavel className="w-4 h-4 text-emerald-200" />
                  <span>लिलावात नोंदणी पूर्ण करा (Confirm Listing)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
