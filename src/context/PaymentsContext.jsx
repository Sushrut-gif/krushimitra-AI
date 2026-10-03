import React, { createContext, useContext, useState, useEffect } from 'react';

const PaymentsContext = createContext(null);

const SETTLEMENTS_STORAGE_KEY = 'krushimitra_settlements';

export function PaymentsProvider({ children }) {
  const [settlements, setSettlements] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTLEMENTS_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];

      // Purge any previously seeded dummy/sample settlements
      const cleanList = (parsed || []).filter((item) => {
        const isMockId =
          typeof item.id === 'string' &&
          (item.id === 'SETTL_88912' || item.id === 'SETTL_44589' || item.id === 'SETTL_11204');
        const isMockListing =
          typeof item.listingId === 'string' &&
          (item.listingId.startsWith('KM-INIT') || item.listingId.startsWith('KM-8840'));
        return !isMockId && !isMockListing;
      });

      // Synchronize back to localStorage if mock items were purged
      if (cleanList.length !== parsed.length) {
        localStorage.setItem(SETTLEMENTS_STORAGE_KEY, JSON.stringify(cleanList));
      }

      return cleanList;
    } catch (e) {
      console.error('Failed to load settlements from localStorage:', e);
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTLEMENTS_STORAGE_KEY, JSON.stringify(settlements));
    } catch (e) {
      console.error('Failed to save settlements to localStorage:', e);
    }
  }, [settlements]);

  /**
   * Sync a newly sold produce listing into settlements if not already present
   */
  const createSettlementForListing = (listing) => {
    if (!listing || !listing.id) return;

    setSettlements((prev) => {
      // Check if settlement already exists for this listing
      const existing = prev.find((s) => s.listingId === listing.id);
      if (existing) return prev;

      const quantity = Number(listing.quantity) || 1;
      const rate = Number(listing.winningPrice || listing.basePrice) || 0;
      const gross = Math.round(quantity * rate);
      const apmcCess = Math.round(gross * 0.01);
      const handlingFee = Math.round(gross * 0.005);
      const net = gross - (apmcCess + handlingFee);

      const uniqueSuffix = listing.id.replace('KM-', '') || Date.now().toString().slice(-5);
      const utrNo = `UTR20261003${uniqueSuffix}`;
      const receiptNo = listing.receiptId || `APMC-SLP-2026-${uniqueSuffix}`;

      const newSettlement = {
        id: `SETTL_${uniqueSuffix}`,
        listingId: listing.id,
        receiptId: receiptNo,
        utr: utrNo,
        cropName: listing.cropName,
        variety: listing.qualityGrade ? `${listing.qualityGrade} ग्रेड` : 'स्थानिक प्रत',
        quantity: quantity,
        unit: listing.unit || 'क्विंटल',
        winningMerchant: listing.winningMerchant || 'सोलापूर ॲग्रो ट्रेडर्स',
        merchantLicense: listing.merchantLicense || 'APMC-SLP-TR-4182',
        winningPrice: rate,
        grossAmount: gross,
        apmcCess: apmcCess,
        handlingFee: handlingFee,
        netAmount: net,
        status: 'pending',
        statusStep: 1,
        statusLabel: 'पेंडिंग (Pending Verification)',
        statusDescription: 'व्यापारी देयक व मालाची प्रत्यक्ष आवक पडताळणी सुरू आहे.',
        paymentMethod: 'Direct Bank Transfer (DBT / APMC e-Payment)',
        bankName: 'State Bank of India',
        accountMasked: '****5678',
        ifsc: 'SBIN0001234',
        branch: 'सोलापूर मुख्य शाखा (मंगळवार पेठ)',
        createdAt: listing.dealFinalizedAt || new Date().toISOString(),
        settledAt: null,
        smsAlert: null,
      };

      return [newSettlement, ...prev];
    });
  };

  /**
   * Update settlement lifecycle status:
   * 'pending' (step 1) -> 'in_process' (step 2) -> 'settled' (step 3)
   */
  const updateSettlementStatus = (settlementId, newStatus) => {
    let updatedRecord = null;

    setSettlements((prev) =>
      prev.map((item) => {
        if (item.id === settlementId) {
          const nowStr = new Date().toISOString();
          let step = 1;
          let label = 'पेंडिंग (Pending Verification)';
          let desc = 'व्यापारी देयक व मालाची प्रत्यक्ष आवक पडताळणी सुरू आहे.';
          let settledAtTime = item.settledAt;
          let smsText = item.smsAlert;

          if (newStatus === 'in_process') {
            step = 2;
            label = 'मार्गावर (In-Process / Escrow)';
            desc = 'बाजार समिती एस्क्रो खात्यातून थेट बँक ट्रान्सफर प्रक्रिया सुरू आहे.';
          } else if (newStatus === 'settled') {
            step = 3;
            label = 'खात्यात जमा (Completed / Settled)';
            desc = 'थेट DBT / NEFT द्वारे रक्कम बँक खात्यात जमा झाली.';
            settledAtTime = nowStr;
            smsText = `Dear SBI Customer, your A/C ${item.accountMasked} is credited by INR ${item.netAmount.toLocaleString('en-IN')}.00 on 03-Oct-26 by APMC Solapur e-Payment. Ref: ${item.utr}. Avail Bal: INR ${(item.netAmount + 165000).toLocaleString('en-IN')}.00 - SBI`;
          }

          updatedRecord = {
            ...item,
            status: newStatus,
            statusStep: step,
            statusLabel: label,
            statusDescription: desc,
            settledAt: settledAtTime,
            smsAlert: smsText,
          };

          return updatedRecord;
        }
        return item;
      })
    );

    return updatedRecord;
  };

  /**
   * Advance settlement to next step in lifecycle
   */
  const advanceSettlementLifecycle = (settlementId) => {
    const item = settlements.find((s) => s.id === settlementId);
    if (!item) return null;

    if (item.status === 'pending') {
      return updateSettlementStatus(settlementId, 'in_process');
    } else if (item.status === 'in_process') {
      return updateSettlementStatus(settlementId, 'settled');
    } else {
      // Loop back to pending for continuous demo re-testing
      return updateSettlementStatus(settlementId, 'pending');
    }
  };

  /**
   * Mark a settlement as settled by merchant releasing payment
   */
  const markSettlementSettled = (listingId, utrNo, listingObj) => {
    const nowStr = new Date().toISOString();
    setSettlements((prev) => {
      const existingIdx = prev.findIndex((s) => s.listingId === listingId);
      if (existingIdx !== -1) {
        return prev.map((item) => {
          if (item.listingId === listingId) {
            const finalUtr = utrNo || item.utr;
            return {
              ...item,
              utr: finalUtr,
              status: 'settled',
              statusStep: 3,
              statusLabel: 'खात्यात जमा (Completed / Settled)',
              statusDescription: 'थेट DBT / NEFT द्वारे रक्कम बँक खात्यात जमा झाली.',
              settledAt: nowStr,
              smsAlert: `Dear SBI Customer, your A/C ${item.accountMasked} is credited by INR ${item.netAmount.toLocaleString('en-IN')}.00 on 03-Oct-26 by APMC Solapur e-Payment. Ref: ${finalUtr}. Avail Bal: INR ${(item.netAmount + 165000).toLocaleString('en-IN')}.00 - SBI`,
            };
          }
          return item;
        });
      }

      // If not present in settlements yet, create it as settled directly
      if (listingObj) {
        const qty = Number(listingObj.quantity) || 1;
        const rate = Number(listingObj.winningPrice || listingObj.basePrice) || 0;
        const gross = Math.round(qty * rate);
        const apmcCess = Math.round(gross * 0.0105);
        const handlingFee = Math.round(gross * 0.005);
        const net = gross - (apmcCess + handlingFee);
        const uniqueSuffix = listingId.replace('KM-', '') || Date.now().toString().slice(-5);
        const finalUtr = utrNo || `UTR20261003${uniqueSuffix}`;

        const newRecord = {
          id: `SETTL_${uniqueSuffix}`,
          listingId: listingId,
          receiptId: listingObj.receiptId || `APMC-SLP-2026-${uniqueSuffix}`,
          utr: finalUtr,
          cropName: listingObj.cropName,
          variety: listingObj.variety || (listingObj.qualityGrade ? `${listingObj.qualityGrade} ग्रेड` : 'स्थानिक प्रत'),
          quantity: qty,
          unit: listingObj.unit || 'क्विंटल',
          winningMerchant: listingObj.winningMerchant || 'सोलापूर ॲग्रो ट्रेडर्स',
          merchantLicense: listingObj.merchantLicense || 'APMC-SLP-TR-4182',
          winningPrice: rate,
          grossAmount: gross,
          apmcCess: apmcCess,
          handlingFee: handlingFee,
          netAmount: net,
          status: 'settled',
          statusStep: 3,
          statusLabel: 'खात्यात जमा (Completed / Settled)',
          statusDescription: 'थेट DBT / NEFT द्वारे रक्कम बँक खात्यात जमा झाली.',
          paymentMethod: 'Direct Bank Transfer (DBT / APMC e-Payment)',
          bankName: 'State Bank of India',
          accountMasked: '****5678',
          ifsc: 'SBIN0001234',
          branch: 'सोलापूर मुख्य शाखा (मंगळवार पेठ)',
          createdAt: listingObj.dealFinalizedAt || nowStr,
          settledAt: nowStr,
          smsAlert: `Dear SBI Customer, your A/C ****5678 is credited by INR ${net.toLocaleString('en-IN')}.00 on 03-Oct-26 by APMC Solapur e-Payment. Ref: ${finalUtr}. Avail Bal: INR ${(net + 165000).toLocaleString('en-IN')}.00 - SBI`,
        };
        return [newRecord, ...prev];
      }

      return prev;
    });
  };

  // Compute live totals
  const totalReceived = settlements
    .filter((s) => s.status === 'settled')
    .reduce((sum, s) => sum + s.netAmount, 0);

  const totalPending = settlements
    .filter((s) => s.status === 'pending' || s.status === 'in_process')
    .reduce((sum, s) => sum + s.netAmount, 0);

  const linkedAccount = {
    bankName: 'State Bank of India',
    accountMasked: '****5678',
    ifsc: 'SBIN0001234',
    branch: 'सोलापूर मुख्य शाखा (मंगळवार पेठ)',
    verified: true,
  };

  const value = {
    settlements,
    totalReceived,
    totalPending,
    linkedAccount,
    createSettlementForListing,
    updateSettlementStatus,
    advanceSettlementLifecycle,
    markSettlementSettled,
  };

  return <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>;
}

export function usePayments() {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error('usePayments must be used within a PaymentsProvider');
  }
  return context;
}
