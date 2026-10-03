import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Scale,
  Building2,
  User,
  QrCode,
  Tag,
  Landmark,
} from 'lucide-react';

export default function DigitalAuctionReceiptModal({ isOpen, onClose, listing }) {
  const receiptRef = useRef(null);

  if (!isOpen || !listing) return null;

  // Extract / calculate pricing
  const quantity = Number(listing.quantity) || 1;
  const unit = listing.unit || 'क्विंटल';
  const finalRate = Number(listing.winningPrice || listing.basePrice) || 0;
  const grossAmount = Math.round(quantity * finalRate);

  // Standard deductions: 1.0% APMC Cess + 0.5% Weighing/Handling
  const apmcCess = Math.round(grossAmount * 0.01);
  const handlingFee = Math.round(grossAmount * 0.005);
  const totalDeductions = apmcCess + handlingFee;
  const netPayable = grossAmount - totalDeductions;

  // Receipt ID and date
  const receiptId = listing.receiptId || `APMC-SLP-2026-${listing.id.replace('KM-', '')}`;
  const merchantLicense = listing.merchantLicense || 'APMC-SLP-TR-4182';

  const rawDate = listing.dealFinalizedAt || listing.createdAt || new Date().toISOString();
  const formattedDateTime = new Date(rawDate).toLocaleString('mr-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // QR Code payload (verifiable at gate pass entry)
  const qrPayload = JSON.stringify({
    receiptNo: receiptId,
    farmer: listing.farmerName,
    mobile: listing.farmerMobile,
    crop: listing.cropName,
    qty: `${quantity} ${unit}`,
    rate: `₹${finalRate}`,
    netAmount: `₹${netPayable}`,
    buyer: listing.winningMerchant || 'सोलापूर ॲग्रो ट्रेडर्स',
    gateStatus: 'प्रवेश मंजूर (AUTHORIZED)',
    verifiedBy: 'APMC Solapur Digital Highway',
  });

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in-50 duration-200 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden transition-all print:shadow-none print:border-none print:max-w-none print:rounded-none">
        
        {/* Top Actions Bar (Hidden when printing) */}
        <div className="print:hidden p-4 sm:p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              अधिकृत APMC ई-लिलाव पावती
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>पावती प्रिंट / सेव्ह करा (Print)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div
          ref={receiptRef}
          className="p-6 sm:p-8 space-y-6 text-gray-900 bg-white max-h-[82vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-8"
        >
          {/* Official APMC Header */}
          <div className="text-center pb-5 border-b-2 border-dashed border-gray-300 space-y-2">
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h1 className="text-lg sm:text-xl font-black text-gray-950 tracking-tight leading-tight">
                  सोलापूर कृषी उत्पन्न बाजार समिती
                </h1>
                <p className="text-[11px] font-semibold text-emerald-800">
                  APMC Solapur • अधिकृत ई-लिलाव सौदे पावती व गेट पास
                </p>
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              मार्केट यार्ड, सोलापूर - ४१३००५ • महाराष्ट्र राज्य कृषी पणन मंडळ नोंदणीकृत
            </p>

            {/* Receipt No & Timestamp Banner */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
              <div className="flex items-center gap-1 font-mono font-bold text-gray-900">
                <span className="text-gray-500 font-sans font-medium">पावती क्र:</span> {receiptId}
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>तारीख व वेळ: <strong>{formattedDateTime}</strong></span>
              </div>
            </div>
          </div>

          {/* Parties: Farmer & Buyer Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Farmer Info */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 pb-1 border-b border-emerald-200/60">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>शेतकरी तपशील (Farmer)</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">पूर्ण नाव:</span>
                <span className="font-bold text-sm text-gray-950">{listing.farmerName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">मोबाईल नंबर:</span>
                <span className="font-medium text-gray-900 font-mono">+91 {listing.farmerMobile || '9822XXXXXX'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">पत्ता / गाव:</span>
                <span className="font-medium text-gray-800">{listing.location}</span>
              </div>
            </div>

            {/* Buyer/Merchant Info */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900 pb-1 border-b border-indigo-200/60">
                <Building2 className="w-3.5 h-3.5 text-indigo-700" />
                <span>खरेदीदार व्यापारी (Buyer/Merchant)</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">व्यापारी / फर्म:</span>
                <span className="font-bold text-sm text-gray-950">
                  {listing.winningMerchant || 'सोलापूर ॲग्रो ट्रेडर्स'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">APMC परवाना क्रमांक:</span>
                <span className="font-mono font-bold text-indigo-900">{merchantLicense}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">विभाग:</span>
                <span className="font-medium text-gray-800">सोलापूर मुख्य मार्केट यार्ड, गाळा क्र. १२</span>
              </div>
            </div>
          </div>

          {/* Deal Details & Calculation Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100/80 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-3.5">तपशील (Item Description)</th>
                  <th className="py-2.5 px-3 text-center">प्रतवारी</th>
                  <th className="py-2.5 px-3 text-right">वजन / प्रमाण</th>
                  <th className="py-2.5 px-3 text-right">अंतिम दर</th>
                  <th className="py-2.5 px-3.5 text-right">एकूण रक्कम</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-3.5 font-bold text-gray-950">
                    {listing.cropName}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {listing.qualityGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium">
                    {quantity} {unit}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    ₹{finalRate.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-gray-950">
                    ₹{grossAmount.toLocaleString('en-IN')}
                  </td>
                </tr>

                {/* Deductions sub-rows */}
                <tr className="bg-gray-50/60 text-gray-600">
                  <td colSpan={4} className="py-2 px-3.5 text-right">
                    एकूण ढोबळ रक्कम (Gross Total Amount):
                  </td>
                  <td className="py-2 px-3.5 text-right font-mono font-semibold text-gray-900">
                    ₹{grossAmount.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr className="bg-gray-50/60 text-gray-600">
                  <td colSpan={4} className="py-1.5 px-3.5 text-right text-[11px]">
                    वजा: APMC बाजार सेस शुल्क (१.०%):
                  </td>
                  <td className="py-1.5 px-3.5 text-right font-mono text-[11px] text-red-600">
                    - ₹{apmcCess.toLocaleString('en-IN')}
                  </td>
                </tr>

                <tr className="bg-gray-50/60 text-gray-600">
                  <td colSpan={4} className="py-1.5 px-3.5 text-right text-[11px]">
                    वजा: तोलाई व हमाली व्यवस्थापन शुल्क (०.५%):
                  </td>
                  <td className="py-1.5 px-3.5 text-right font-mono text-[11px] text-red-600">
                    - ₹{handlingFee.toLocaleString('en-IN')}
                  </td>
                </tr>

                {/* Net Payable Highlight */}
                <tr className="bg-emerald-50 text-emerald-950 font-black text-sm border-t-2 border-emerald-300">
                  <td colSpan={4} className="py-3.5 px-3.5 text-right text-emerald-900">
                    शेतकऱ्याला मिळणारी निव्वळ देय रक्कम (Net Payable Amount):
                  </td>
                  <td className="py-3.5 px-3.5 text-right text-base text-emerald-800 font-mono">
                    ₹{netPayable.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Official APMC Digital Gate Pass Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 border-2 border-emerald-300 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* QR Code Container */}
              <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-xs flex flex-col items-center gap-1.5 shrink-0">
                <QRCodeSVG
                  value={qrPayload}
                  size={120}
                  level="M"
                  includeMargin={false}
                />
                <span className="text-[10px] font-mono font-bold text-gray-500">
                  APMC-DIGITAL-PASS
                </span>
              </div>

              {/* Gate Pass Instructions & Badge */}
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>प्रवेश मंजूर (Gate Entry Authorized)</span>
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    सोलापूर APMC मुख्य प्रवेशद्वार
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-gray-900">
                  डिजिटल वाहन गेट पास (QR Gate Pass)
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>महत्त्वाची सूचना:</strong> माल बाजार समितीत घेऊन येताना अथवा वजन काट्यावर जाताना सुरक्षा रक्षकास किंवा मुख्य प्रवेशद्वारावर हा QR कोड स्कॅन करण्यासाठी दाखवा.
                </p>

                <div className="text-[11px] text-emerald-800 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ई-लिलाव मान्यताप्राप्त वाहन प्रवेश अधिकृत</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Signatures & Seal */}
          <div className="pt-6 border-t border-dashed border-gray-300 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-500">
            <div className="space-y-1">
              <div className="h-10 flex items-end justify-center font-serif text-gray-800 font-bold italic">
                {listing.farmerName}
              </div>
              <div className="border-t border-gray-300 pt-1 font-semibold text-gray-700">
                शेतकरी स्वाक्षरी
              </div>
            </div>

            <div className="space-y-1">
              <div className="h-10 flex items-end justify-center font-serif text-gray-800 font-bold italic">
                {listing.winningMerchant || 'सोलापूर ॲग्रो'}
              </div>
              <div className="border-t border-gray-300 pt-1 font-semibold text-gray-700">
                खरेदीदार व्यापारी स्वाक्षरी
              </div>
            </div>

            <div className="space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-emerald-800 border-2 border-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-2xs rotate-[-3deg]">
                  ✓ APMC प्रमाणित
                </span>
              </div>
              <div className="border-t border-gray-300 pt-1 font-semibold text-gray-700">
                सचिव / प्रशासक, APMC सोलापूर
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden on print) */}
        <div className="print:hidden p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>* ही संगणकीय पावती असून महाराष्ट्र राज्य APMC कायद्यानुसार वैध आहे.</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>पावती प्रिंट करा</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-gray-700 hover:bg-gray-100"
            >
              बंद करा
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
