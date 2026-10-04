import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Scale,
  Building2,
  User,
  QrCode,
  Tag,
  MapPin,
  Phone,
  Clock,
  Check,
  ArrowRight,
} from 'lucide-react';

/**
 * Official APMC Solapur Digital QR Gate Pass Modal
 * Dynamic Gate Pass for Farmers with high-contrast scannable QR code:
 * Payload: { passId: lot.id, status: 'VERIFIED' }
 */
export default function APMCGatePassModal({ isOpen, onClose, lot }) {
  const printRef = useRef(null);

  if (!isOpen || !lot) return null;

  const gatePassId = `GP-SLP-${lot.id}`;
  const quantity = lot.quantity || 1;
  const unit = lot.unit || 'क्विंटल';
  const cropName = lot.cropName || lot.crop_name || lot.crop || 'शेतमाल';
  const qualityGrade = lot.qualityGrade || lot.grade || 'Grade A';

  const farmerName = lot.farmerName || lot.farmer_name || 'नोंदणीकृत शेतकरी';
  const farmerMobile = lot.farmerMobile || lot.farmer_mobile || '९८XXXXXX१२';
  const village = lot.location || 'सोलापूर दक्षिण';

  const winningMerchant = lot.winningMerchant || lot.winning_merchant_id || lot.merchantName || 'सोलापूर ॲग्रो ट्रेडर्स';
  const merchantLicense = lot.merchantLicense || 'APMC/SLP/TRD-8841';

  // Determine actual Solapur yard based on crop
  const yardName =
    lot.yard ||
    (cropName.includes('भाजी') || cropName.includes('टोमॅटो') || cropName.includes('वांगी') || cropName.includes('मिरची')
      ? 'मंगळवार पेठ भाजीपाला मार्केट यार्ड'
      : 'कुमठा नाका मार्केट यार्ड (कांदा, डाळिंब व धान्य)');

  const isDelivered =
    lot.inwardStatus === 'यार्डात प्राप्त (Delivered at Yard)' ||
    lot.status === 'यार्डात प्राप्त (Delivered at Yard)' ||
    lot.gatePassVerified;

  const rawDate = lot.dealFinalizedAt || lot.listingDate || lot.created_at || new Date().toISOString();
  let formattedDateTime = 'आज';
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      formattedDateTime = d.toLocaleString('mr-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
  } catch {
    formattedDateTime = String(rawDate);
  }

  // Strict high-contrast scannable QR code payload matching requirements:
  // Must contain { passId: lot.id, status: 'VERIFIED' }
  const qrPayload = JSON.stringify({
    passId: lot.id,
    status: 'VERIFIED',
    gatePassId: gatePassId,
    crop: cropName,
    qty: `${quantity} ${unit}`,
    farmer: farmerName,
    merchant: winningMerchant,
    yard: yardName,
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-300 relative my-6 animate-in fade-in-50 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        ref={printRef}
      >
        {/* Top Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 relative overflow-hidden border-b-2 border-emerald-500">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-400 text-slate-950 shadow-xs">
                  अधिकृत ई-प्रवेश पत्र
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  APMC सोलापूर पडताळणीकृत
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                डिजिटल गेट पास (APMC Gate Pass)
              </h2>
              <p className="text-xs text-slate-300">
                मार्केट यार्डात माल प्रवेश व वजन तपासणीसाठी अधिकृत बारकोड पास
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="बंद करा"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gate Pass Body */}
        <div className="p-5 sm:p-6 space-y-5 bg-gradient-to-b from-emerald-50/20 via-white to-white">
          {/* Gate Pass ID & Inward Status Badge Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900 text-white rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block uppercase">गेट पास क्रमांक:</span>
              <span className="text-sm sm:text-base font-mono font-black text-amber-300 tracking-wider">
                {gatePassId}
              </span>
            </div>

            <div>
              {isDelivered ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>यार्डात प्राप्त (Delivered)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-950" />
                  <span>प्रवेश मंजूर (Authorized Entry)</span>
                </span>
              )}
            </div>
          </div>

          {/* High-Contrast Scannable QR Code Section */}
          <div className="p-5 bg-white rounded-2xl border-2 border-dashed border-emerald-400 text-center space-y-3 shadow-2xs">
            <div className="inline-block p-3.5 bg-white rounded-2xl shadow-md border-2 border-emerald-600">
              <QRCodeSVG
                value={qrPayload}
                size={180}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-950">
                <QrCode className="w-4 h-4 text-emerald-700" />
                <span>यार्ड गेटवर किंवा व्यापाऱ्याकडे हा QR कोड स्कॅन करा</span>
              </div>
              <p className="text-[11px] text-gray-500 font-mono">
                Payload: {`{ passId: "${lot.id}", status: "VERIFIED" }`}
              </p>
            </div>
          </div>

          {/* Commodity & Lot Summary */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-xs">
            <div>
              <span className="text-[10px] text-gray-500 block font-medium">नोंदवलेला शेतमाल:</span>
              <strong className="text-gray-950 text-sm font-black block mt-0.5">{cropName}</strong>
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded inline-block mt-1">
                प्रतवारी: {qualityGrade}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 block font-medium">एकूण वजन / प्रमाण:</span>
              <strong className="text-emerald-900 text-base font-black block mt-0.5">
                {quantity} {unit}
              </strong>
              <span className="text-[10px] text-gray-500 block mt-1">
                लॉट आयडी: <span className="font-mono font-bold text-gray-800">#{lot.id}</span>
              </span>
            </div>
          </div>

          {/* Farmer & Winning Merchant Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Farmer Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>शेतकरी तपशील</span>
              </div>
              <div className="font-bold text-gray-900 text-xs sm:text-sm">{farmerName}</div>
              <div className="text-[11px] text-gray-600 flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>{farmerMobile}</span>
              </div>
              <div className="text-[11px] text-gray-600 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{village}</span>
              </div>
            </div>

            {/* Merchant Card */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-950">
                <Building2 className="w-3.5 h-3.5 text-indigo-700" />
                <span>खरेदीदार व्यापारी व यार्ड</span>
              </div>
              <div className="font-bold text-gray-900 text-xs sm:text-sm">{winningMerchant}</div>
              <div className="text-[11px] text-indigo-900 font-mono font-semibold">
                परवाना: {merchantLicense}
              </div>
              <div className="text-[11px] text-gray-700 font-medium">
                📍 {yardName}
              </div>
            </div>
          </div>

          {/* Official Yard Instructions & Security Note */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
            <span className="font-bold block text-amber-900">
              ⚠️ यार्ड प्रवेश सूचना:
            </span>
            <p className="leading-relaxed">
              वाहन यार्डात नेताना सुरक्षा रक्षकास हा डिजिटल पास दाखवावा. व्यापारी किंवा आडत्याने गेट पास स्कॅन करताच तुमच्या बँक खात्यात पेमेंट प्रक्रिया अनलॉक होईल.
            </p>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-2.5 justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
          >
            बंद करा
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>गेट पास प्रिंट / सेव्ह करा</span>
          </button>
        </div>
      </div>
    </div>
  );
}
