import React, { createContext, useContext, useState, useEffect } from 'react';

const ListingsContext = createContext(null);

const LISTINGS_STORAGE_KEY = 'krushimitra_listings';

/**
 * Generate 2-3 realistic sample merchant bids for active bidding simulation
 */
export function generateSampleBids() {
  return [];
}

export function getCropCategory(cropName = '', currentCategory = '') {
  if (currentCategory && currentCategory !== 'सर्व') return currentCategory;
  const name = (cropName || '').toLowerCase();
  if (
    name.includes('कांदा') ||
    name.includes('onion') ||
    name.includes('बटाटा') ||
    name.includes('potato') ||
    name.includes('टोमॅटो') ||
    name.includes('tomato') ||
    name.includes('वांगी') ||
    name.includes('brinjal') ||
    name.includes('भेंडी') ||
    name.includes('okra') ||
    name.includes('लसूण') ||
    name.includes('garlic') ||
    name.includes('मिरची') ||
    name.includes('chilli') ||
    name.includes('कोबी') ||
    name.includes('cabbage') ||
    name.includes('फ्लॉवर') ||
    name.includes('cauliflower') ||
    name.includes('भाजी')
  ) {
    return 'भाजीपाला';
  }
  if (
    name.includes('डाळिंब') ||
    name.includes('pomegranate') ||
    name.includes('द्राक्ष') ||
    name.includes('grape') ||
    name.includes('बोर') ||
    name.includes('पेरू') ||
    name.includes('guava') ||
    name.includes('केळी') ||
    name.includes('banana') ||
    name.includes('पपई') ||
    name.includes('papaya') ||
    name.includes('आंबा') ||
    name.includes('mango') ||
    name.includes('संत्री') ||
    name.includes('orange') ||
    name.includes('मोसंबी') ||
    name.includes('कलिंगड') ||
    name.includes('watermelon') ||
    name.includes('फळ')
  ) {
    return 'फळे';
  }
  if (
    name.includes('ज्वारी') ||
    name.includes('jowar') ||
    name.includes('sorghum') ||
    name.includes('गहू') ||
    name.includes('wheat') ||
    name.includes('बाजरी') ||
    name.includes('bajra') ||
    name.includes('मका') ||
    name.includes('maize') ||
    name.includes('तूर') ||
    name.includes('tur') ||
    name.includes('हरभरा') ||
    name.includes('chana') ||
    name.includes('उडीद') ||
    name.includes('udid') ||
    name.includes('मूग') ||
    name.includes('moong') ||
    name.includes('धान्य') ||
    name.includes('कडधान्य')
  ) {
    return 'धान्य व कडधान्ये';
  }
  if (
    name.includes('सोयाबीन') ||
    name.includes('soybean') ||
    name.includes('सूर्यफूल') ||
    name.includes('sunflower') ||
    name.includes('भुईमूग') ||
    name.includes('groundnut') ||
    name.includes('करडई') ||
    name.includes('safflower') ||
    name.includes('तीळ') ||
    name.includes('sesame') ||
    name.includes('तेलबिया')
  ) {
    return 'तेलबिया';
  }
  return 'भाजीपाला';
}

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem(LISTINGS_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];

      // Purge any previously seeded dummy items (e.g. KM-88401 to KM-88406, KM-INIT, or mock farmer IDs)
      const cleanList = (parsed || [])
        .filter((item) => {
          const isMockId = typeof item.id === 'string' && (item.id.startsWith('KM-8840') || item.id.startsWith('KM-INIT'));
          const isMockFarmer = typeof item.farmerId === 'string' && item.farmerId.startsWith('FARMER_10');
          return !isMockId && !isMockFarmer;
        })
        .map((item) => {
          // Strip out old mock/simulated bids that have mock merchant names and lack valid merchant license
          const mockMerchantNames = ['सोलापूर ॲग्रो ट्रेडर्स', 'श्री सिद्धेश्वर व्हेजिटेबल कंपनी', 'महादेव व्हेजिटेबल सप्लायर्स'];
          const realBids = Array.isArray(item.bids)
            ? item.bids.filter((b) => b.merchantLicense || !mockMerchantNames.includes(b.merchantName))
            : [];
          return {
            ...item,
            bids: realBids,
            category: item.category || getCropCategory(item.cropName),
          };
        });

      // Synchronize back to localStorage if mock items or bids were purged
      if (cleanList.length !== parsed.length || JSON.stringify(cleanList) !== saved) {
        localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(cleanList));
      }

      return cleanList;
    } catch (e) {
      console.error('Failed to load listings from localStorage:', e);
      return [];
    }
  });

  // Save to localStorage whenever listings change
  useEffect(() => {
    try {
      localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
    } catch (e) {
      console.error('Failed to save listings to localStorage:', e);
    }
  }, [listings]);

  /**
   * Add a new produce listing
   */
  const addListing = (listingData) => {
    const basePriceNum = Number(listingData.basePrice) || 0;

    const newListing = {
      id: 'KM-' + Date.now().toString().slice(-6),
      farmerId: listingData.farmerId || 'FARMER_' + Date.now(),
      farmerName: listingData.farmerName || 'शेतकरी',
      farmerMobile: listingData.farmerMobile || '',
      cropName: listingData.cropName.trim(),
      category: listingData.category || getCropCategory(listingData.cropName),
      qualityGrade: listingData.qualityGrade || 'मध्यम',
      quantity: Number(listingData.quantity) || 1,
      unit: listingData.unit || 'क्विंटल',
      basePrice: basePriceNum,
      location: listingData.location.trim(),
      listingDate: listingData.listingDate || new Date().toISOString().split('T')[0],
      image: listingData.image || null,
      status: 'बोली सुरू (Active Bidding)',
      createdAt: new Date().toISOString(),
      notes: listingData.notes || '',
      estimatedMarketPrice: listingData.estimatedMarketPrice || '',
      bids: [], // Start with empty array for strictly real merchant bids
      winningMerchant: null,
      winningPrice: null,
      winningBidId: null,
      dealFinalizedAt: null,
    };

    setListings((prev) => [newListing, ...prev]);
    return newListing;
  };

  /**
   * Accept a specific merchant bid and finalize deal
   */
  const acceptBid = (listingId, bid) => {
    let updatedItem = null;
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          const receiptId = item.receiptId || `APMC-SLP-2026-${item.id.replace('KM-', '')}`;
          const merchantLicense = bid.merchantLicense || `APMC-SLP-TR-${Math.floor(1000 + Math.random() * 9000)}`;
          updatedItem = {
            ...item,
            status: 'विक्री पूर्ण (Deal Finalized / Sold)',
            winningMerchant: bid.merchantName,
            merchantLicense: merchantLicense,
            winningPrice: bid.amount,
            winningBidId: bid.id,
            receiptId: receiptId,
            dealFinalizedAt: new Date().toISOString(),
          };

          // Also automatically initialize in settlements storage if not already there
          try {
            const settlementsKey = 'krushimitra_settlements';
            const savedSettlements = JSON.parse(localStorage.getItem(settlementsKey) || '[]');
            const uniqueSuffix = item.id.replace('KM-', '') || Date.now().toString().slice(-5);
            const exists = savedSettlements.some((s) => s.listingId === item.id);
            if (!exists) {
              const qty = Number(item.quantity) || 1;
              const gross = Math.round(qty * bid.amount);
              const apmcCess = Math.round(gross * 0.01);
              const handling = Math.round(gross * 0.005);
              const net = gross - (apmcCess + handling);
              const newSettlement = {
                id: `SETTL_${uniqueSuffix}`,
                listingId: item.id,
                receiptId: receiptId,
                utr: `UTR20261003${uniqueSuffix}`,
                cropName: item.cropName,
                variety: item.qualityGrade ? `${item.qualityGrade} प्रत` : 'स्थानिक प्रत',
                quantity: qty,
                unit: item.unit || 'क्विंटल',
                winningMerchant: bid.merchantName,
                merchantLicense: merchantLicense,
                winningPrice: bid.amount,
                grossAmount: gross,
                apmcCess: apmcCess,
                handlingFee: handling,
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
                createdAt: new Date().toISOString(),
                settledAt: null,
                smsAlert: null,
              };
              localStorage.setItem(settlementsKey, JSON.stringify([newSettlement, ...savedSettlements]));
            }
          } catch (e) {
            // Ignore non-critical storage error
          }

          return updatedItem;
        }
        return item;
      })
    );
    return updatedItem;
  };

  /**
   * Place a new merchant bid on a produce listing
   */
  const placeBid = (listingId, bidData) => {
    let updatedLot = null;
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          const currentBids = Array.isArray(item.bids) ? item.bids : [];
          const newBid = {
            id: bidData.id || 'BID_' + Date.now().toString().slice(-6),
            merchantName: bidData.merchantName || 'व्यापारी',
            merchantPhone: bidData.merchantPhone || '',
            merchantLocation: bidData.merchantLocation || 'सोलापूर APMC मार्केट यार्ड',
            merchantLicense: bidData.merchantLicense || '',
            amount: Number(bidData.amount),
            timestamp: bidData.timestamp || new Date().toISOString(),
            timeFormatted: bidData.timeFormatted || 'आत्ताच',
          };
          const updatedBids = [newBid, ...currentBids];
          updatedLot = {
            ...item,
            bids: updatedBids,
          };
          return updatedLot;
        }
        return item;
      })
    );
    return updatedLot;
  };

  /**
   * Mark payment released for a sold listing
   */
  const markPaymentReleased = (listingId, paymentInfo = {}) => {
    let updatedItem = null;
    const nowStr = new Date().toISOString();
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          updatedItem = {
            ...item,
            paymentStatus: 'खात्यात जमा (Completed)',
            utr: paymentInfo.utr || `UTR20261003${Math.floor(100000 + Math.random() * 900000)}`,
            paidAt: paymentInfo.paidAt || nowStr,
          };
          return updatedItem;
        }
        return item;
      })
    );
    return updatedItem;
  };

  /**
   * Mark lot verified at gate pass and delivered at yard
   */
  const markLotInwardDelivered = (listingId, inwardInfo = {}) => {
    let updatedItem = null;
    const nowStr = new Date().toISOString();
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId || `GP-SLP-${item.id}` === listingId) {
          updatedItem = {
            ...item,
            inwardStatus: 'यार्डात प्राप्त (Delivered at Yard)',
            inwardVerifiedAt: inwardInfo.verifiedAt || nowStr,
            gatePassVerified: true,
            gatePassId: `GP-SLP-${item.id}`,
            gatePassVerifiedBy: inwardInfo.verifiedBy || 'सोलापूर APMC इनवर्ड यार्ड तपासणी नाका',
          };
          return updatedItem;
        }
        return item;
      })
    );
    return updatedItem;
  };

  /**
   * Get listings for a specific farmer
   */
  const getFarmerListings = (farmerMobile) => {
    if (!farmerMobile) return listings;
    return listings.filter((item) => item.farmerMobile === farmerMobile);
  };

  /**
   * Remove a listing
   */
  const removeListing = (id) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  const value = {
    listings,
    addListing,
    acceptBid,
    placeBid,
    markPaymentReleased,
    markLotInwardDelivered,
    getFarmerListings,
    removeListing,
  };

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
}
