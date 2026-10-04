import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { compressImage, DEFAULT_PRODUCE_PLACEHOLDER } from '../utils/imageCompressor';
import {
  fetchSupabaseListings,
  fetchSupabaseBids,
  insertSupabaseListing,
  insertSupabaseBid,
  acceptSupabaseBid,
  markSupabaseLotInward,
  markSupabasePaymentReleased,
} from '../services/supabaseService';

const ListingsContext = createContext(null);

const LISTINGS_STORAGE_KEY = 'krushimitra_listings';

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

      const cleanList = (parsed || [])
        .filter((item) => {
          const isMockId = typeof item.id === 'string' && (item.id.startsWith('KM-8840') || item.id.startsWith('KM-INIT'));
          const isMockFarmer = typeof item.farmerId === 'string' && item.farmerId.startsWith('FARMER_10');
          return !isMockId && !isMockFarmer;
        })
        .map((item) => {
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

  // Initial fetch from Supabase and Supabase Realtime channel subscription
  useEffect(() => {
    let isMounted = true;

    async function loadFromSupabase() {
      try {
        const [dbListings, dbBids] = await Promise.all([
          fetchSupabaseListings(),
          fetchSupabaseBids(),
        ]);

        if (!isMounted) return;

        if (dbListings && dbListings.length > 0) {
          const mapped = dbListings.map((row) => {
            const lotBids = (dbBids || [])
              .filter((b) => b.listing_id === row.id)
              .map((b) => ({
                id: b.id,
                merchantName: b.merchant_name || 'व्यापारी',
                amount: Number(b.amount),
                timestamp: b.created_at,
                timeFormatted: 'आत्ताच',
              }));

            const isSold =
              row.status && (row.status.includes('विक्री पूर्ण') || row.status === 'विक्री पूर्ण');
            const isInward =
              row.status && (row.status.includes('यार्डात प्राप्त') || row.status === 'यार्डात प्राप्त');

            let displayStatus = 'बोली सुरू (Active Bidding)';
            if (isSold) {
              displayStatus = 'विक्री पूर्ण (Deal Finalized / Sold)';
            } else if (isInward) {
              displayStatus = 'यार्डात प्राप्त (Delivered at Yard)';
            } else if (row.status && row.status !== 'ACTIVE') {
              displayStatus = row.status;
            }

            return {
              id: row.id,
              farmerName: row.farmer_name || 'शेतकरी',
              farmerMobile: row.farmer_mobile || '',
              cropName: row.crop_name,
              category: getCropCategory(row.crop_name),
              qualityGrade: row.grade || 'मध्यम',
              quantity: Number(row.quantity) || 1,
              unit: row.unit || 'क्विंटल',
              basePrice: Number(row.base_price) || 0,
              highestBid: Number(row.highest_bid) || Number(row.base_price) || 0,
              status: displayStatus,
              winningMerchant: row.winning_merchant_id || null,
              winningPrice: Number(row.highest_bid) || 0,
              paymentStatus: row.payment_status || (isSold ? 'खात्यात जमा (Completed)' : null),
              location: row.location || 'सोलापूर',
              gatePassId: row.gate_pass_id || `GP-SLP-${row.id}`,
              gatePassVerified: isInward,
              inwardStatus: isInward ? 'यार्डात प्राप्त (Delivered at Yard)' : null,
              createdAt: row.created_at || new Date().toISOString(),
              image: row.image_url || DEFAULT_PRODUCE_PLACEHOLDER,
              imageUrl: row.image_url || DEFAULT_PRODUCE_PLACEHOLDER,
              bids: lotBids,
            };
          });

          // Merge: prioritize Supabase items, preserving local items not yet in DB
          setListings((localList) => {
            const remoteIds = new Set(mapped.map((m) => m.id));
            const remainingLocal = localList.filter((item) => !remoteIds.has(item.id));
            return [...mapped, ...remainingLocal];
          });
        }
      } catch (err) {
        console.warn('[Supabase] Initial load error:', err);
      }
    }

    loadFromSupabase();

    // Setup Supabase Realtime channel for listings and bids
    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'listings' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setListings((prev) => {
              if (prev.some((x) => x.id === payload.new.id)) return prev;
              const isSold =
                payload.new.status &&
                (payload.new.status.includes('विक्री पूर्ण') || payload.new.status === 'विक्री पूर्ण');
              const isInward =
                payload.new.status &&
                (payload.new.status.includes('यार्डात प्राप्त') || payload.new.status === 'यार्डात प्राप्त');
              let displayStatus = 'बोली सुरू (Active Bidding)';
              if (isSold) displayStatus = 'विक्री पूर्ण (Deal Finalized / Sold)';
              else if (isInward) displayStatus = 'यार्डात प्राप्त (Delivered at Yard)';
              else if (payload.new.status && payload.new.status !== 'ACTIVE')
                displayStatus = payload.new.status;

              const newItem = {
                id: payload.new.id,
                farmerName: payload.new.farmer_name || 'शेतकरी',
                farmerMobile: payload.new.farmer_mobile || '',
                cropName: payload.new.crop_name,
                category: getCropCategory(payload.new.crop_name),
                qualityGrade: payload.new.grade || 'मध्यम',
                quantity: Number(payload.new.quantity) || 1,
                unit: payload.new.unit || 'क्विंटल',
                basePrice: Number(payload.new.base_price) || 0,
                highestBid: Number(payload.new.highest_bid) || Number(payload.new.base_price) || 0,
                status: displayStatus,
                location: payload.new.location || 'सोलापूर',
                gatePassId: payload.new.gate_pass_id || `GP-SLP-${payload.new.id}`,
                image: payload.new.image_url || DEFAULT_PRODUCE_PLACEHOLDER,
                imageUrl: payload.new.image_url || DEFAULT_PRODUCE_PLACEHOLDER,
                createdAt: payload.new.created_at || new Date().toISOString(),
                bids: [],
              };
              return [newItem, ...prev];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setListings((prev) =>
              prev.map((item) => {
                if (item.id === payload.new.id) {
                  const isSold = payload.new.status && payload.new.status.includes('विक्री पूर्ण');
                  const isInward = payload.new.status && payload.new.status.includes('यार्डात प्राप्त');
                  let displayStatus = 'बोली सुरू (Active Bidding)';
                  if (isSold) displayStatus = 'विक्री पूर्ण (Deal Finalized / Sold)';
                  else if (isInward) displayStatus = 'यार्डात प्राप्त (Delivered at Yard)';
                  else if (payload.new.status && payload.new.status !== 'ACTIVE')
                    displayStatus = payload.new.status;
                  return {
                    ...item,
                    status: isSold
                      ? 'विक्री पूर्ण (Deal Finalized / Sold)'
                      : isInward
                      ? 'यार्डात प्राप्त (Delivered at Yard)'
                      : (payload.new.status || item.status),
                    highestBid: Number(payload.new.highest_bid) || item.highestBid,
                    winningMerchant: payload.new.winning_merchant_id || item.winningMerchant,
                    winningPrice: Number(payload.new.highest_bid) || item.winningPrice,
                    paymentStatus: payload.new.payment_status || item.paymentStatus,
                    gatePassId: payload.new.gate_pass_id || item.gatePassId,
                    gatePassVerified: isInward || item.gatePassVerified,
                    inwardStatus: isInward ? 'यार्डात प्राप्त (Delivered at Yard)' : item.inwardStatus,
                  };
                }
                return item;
              })
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setListings((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bids' },
        (payload) => {
          if (payload.new) {
            const newBid = {
              id: payload.new.id,
              merchantName: payload.new.merchant_name || 'व्यापारी',
              amount: Number(payload.new.amount),
              timestamp: payload.new.created_at,
              timeFormatted: 'आत्ताच',
            };
            setListings((prev) =>
              prev.map((item) => {
                if (item.id === payload.new.listing_id) {
                  const existingBids = item.bids || [];
                  if (existingBids.some((b) => b.id === newBid.id)) return item;
                  const updatedBids = [newBid, ...existingBids];
                  return {
                    ...item,
                    bids: updatedBids,
                    highestBid: Math.max(item.highestBid || 0, newBid.amount),
                  };
                }
                return item;
              })
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('[Supabase Realtime] custom-all-channel status:', status);
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  /**
   * Add a new produce listing
   */
  const addListing = async (listingData) => {
    const basePriceNum = Number(listingData.basePrice) || 0;
    const newId = 'KM-' + Date.now().toString().slice(-6);

    let processedImg = listingData.image || null;
    if (processedImg && typeof processedImg === 'string' && processedImg.startsWith('data:image')) {
      try {
        processedImg = await compressImage(processedImg, 600, 0.6);
      } catch (e) {
        // use existing
      }
    }

    const newListing = {
      id: newId,
      farmerId: listingData.farmerId || 'FARMER_' + Date.now(),
      farmerName: listingData.farmerName || 'शेतकरी',
      farmerMobile: listingData.farmerMobile || '',
      cropName: listingData.cropName.trim(),
      category: listingData.category || getCropCategory(listingData.cropName),
      qualityGrade: listingData.qualityGrade || 'मध्यम',
      quantity: Number(listingData.quantity) || 1,
      unit: listingData.unit || 'क्विंटल',
      basePrice: basePriceNum,
      highestBid: basePriceNum,
      location: (listingData.location || 'सोलापूर APMC').trim(),
      listingDate: listingData.listingDate || new Date().toISOString().split('T')[0],
      image: processedImg || DEFAULT_PRODUCE_PLACEHOLDER,
      imageUrl: processedImg || DEFAULT_PRODUCE_PLACEHOLDER,
      status: 'बोली सुरू (Active Bidding)',
      createdAt: new Date().toISOString(),
      notes: listingData.notes || '',
      estimatedMarketPrice: listingData.estimatedMarketPrice || '',
      bids: [],
      winningMerchant: null,
      winningPrice: null,
      winningBidId: null,
      dealFinalizedAt: null,
      gatePassId: `GP-SLP-${newId}`,
    };

    setListings((prev) => [newListing, ...prev]);

    // Asynchronously insert into Supabase
    try {
      insertSupabaseListing(newListing);
    } catch (err) {
      console.error('[ListingsContext] insertSupabaseListing error:', err);
    }

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
            highestBid: bid.amount,
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
              const apmcCess = Math.round(gross * 0.0105);
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

    // Asynchronously update Supabase: status to 'विक्री पूर्ण' and winning_merchant_id
    acceptSupabaseBid(listingId, bid.merchantName || bid.merchantId, bid.amount);

    return updatedItem;
  };

  /**
   * Place a new merchant bid on a produce listing
   */
  const placeBid = (listingId, bidData) => {
    let updatedLot = null;
    const bidAmount = Number(bidData.amount);
    const newBid = {
      id: bidData.id || 'BID_' + Date.now().toString().slice(-6),
      merchantName: bidData.merchantName || 'व्यापारी',
      merchantPhone: bidData.merchantPhone || '',
      merchantLocation: bidData.merchantLocation || 'सोलापूर APMC मार्केट यार्ड',
      merchantLicense: bidData.merchantLicense || '',
      amount: bidAmount,
      timestamp: bidData.timestamp || new Date().toISOString(),
      timeFormatted: bidData.timeFormatted || 'आत्ताच',
    };

    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          const currentBids = Array.isArray(item.bids) ? item.bids : [];
          const updatedBids = [newBid, ...currentBids];
          updatedLot = {
            ...item,
            bids: updatedBids,
            highestBid: Math.max(item.highestBid || 0, bidAmount),
          };
          return updatedLot;
        }
        return item;
      })
    );

    // Asynchronously insert into Supabase `bids` and update `highest_bid` in `listings`
    insertSupabaseBid(listingId, bidData);

    return updatedLot;
  };

  /**
   * Mark payment released for a sold listing
   */
  const markPaymentReleased = (listingId, paymentInfo = {}) => {
    let updatedItem = null;
    const nowStr = new Date().toISOString();
    const utr = paymentInfo.utr || `UTR20261003${Math.floor(100000 + Math.random() * 900000)}`;

    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          updatedItem = {
            ...item,
            paymentStatus: 'खात्यात जमा (Completed)',
            utr: utr,
            paidAt: paymentInfo.paidAt || nowStr,
          };
          return updatedItem;
        }
        return item;
      })
    );

    // Asynchronously update Supabase payment_status to 'खात्यात जमा'
    markSupabasePaymentReleased(listingId, utr);

    return updatedItem;
  };

  /**
   * Mark lot verified at gate pass and delivered at yard
   */
  const markLotInwardDelivered = (listingId, inwardInfo = {}) => {
    let updatedItem = null;
    const nowStr = new Date().toISOString();
    const cleanId = (listingId || '').replace('GP-SLP-', '');

    setListings((prev) =>
      prev.map((item) => {
        if (item.id === cleanId || item.id === listingId || `GP-SLP-${item.id}` === listingId) {
          updatedItem = {
            ...item,
            status: 'यार्डात प्राप्त (Delivered at Yard)',
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

    // Asynchronously update Supabase status to 'यार्डात प्राप्त'
    markSupabaseLotInward(cleanId, `GP-SLP-${cleanId}`);

    return updatedItem;
  };

  /**
   * Admin: Flag or pause suspicious listing / unflag
   */
  const toggleListingFlag = (listingId, reason = '') => {
    let updatedLot = null;
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listingId) {
          const isFlagged = !item.adminFlagged;
          updatedLot = {
            ...item,
            adminFlagged: isFlagged,
            adminFlagReason: isFlagged ? (reason || 'संशयास्पद लिलाव / बाजार समिती नियमावली पडताळणी') : null,
            adminFlaggedAt: isFlagged ? new Date().toISOString() : null,
          };
          return updatedLot;
        }
        return item;
      })
    );
    return updatedLot;
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
    toggleListingFlag,
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
