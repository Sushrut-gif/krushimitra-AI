import React, { createContext, useContext, useState, useEffect } from 'react';

const ListingsContext = createContext(null);

const LISTINGS_STORAGE_KEY = 'krushimitra_listings';

/**
 * Generate 2-3 realistic sample merchant bids for active bidding simulation
 */
export function generateSampleBids(basePrice = 2000) {
  const price = Number(basePrice) || 2000;
  const now = Date.now();

  return [
    {
      id: 'BID_' + (now - 3600000).toString().slice(-6),
      merchantName: 'सोलापूर ॲग्रो ट्रेडर्स',
      merchantPhone: '9822154321',
      merchantLocation: 'सोलापूर APMC मार्केट यार्ड',
      amount: Math.round(price * 1.05 / 10) * 10, // +5%
      timestamp: new Date(now - 45 * 60000).toISOString(),
      timeFormatted: '४५ मिनिटांपूर्वी',
    },
    {
      id: 'BID_' + (now - 1800000).toString().slice(-6),
      merchantName: 'श्री सिद्धेश्वर व्हेजिटेबल कंपनी',
      merchantPhone: '9423456789',
      merchantLocation: 'बाजार समिती गाळा क्र. १२',
      amount: Math.round(price * 1.10 / 10) * 10, // +10%
      timestamp: new Date(now - 20 * 60000).toISOString(),
      timeFormatted: '२० मिनिटांपूर्वी',
    },
    {
      id: 'BID_' + now.toString().slice(-6),
      merchantName: 'महादेव व्हेजिटेबल सप्लायर्स',
      merchantPhone: '9765432100',
      merchantLocation: 'नवीन कांदा मार्केट, सोलापूर',
      amount: Math.round(price * 1.15 / 10) * 10, // +15%
      timestamp: new Date(now - 5 * 60000).toISOString(),
      timeFormatted: '५ मिनिटांपूर्वी',
    },
  ];
}

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem(LISTINGS_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];

      // Ensure every listing has realistic bids array populated
      return parsed.map((item) => {
        if (!item.bids || item.bids.length === 0) {
          return {
            ...item,
            bids: generateSampleBids(item.basePrice),
          };
        }
        return item;
      });
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
    const initialBids = generateSampleBids(basePriceNum);

    const newListing = {
      id: 'KM-' + Date.now().toString().slice(-6),
      farmerId: listingData.farmerId || 'FARMER_' + Date.now(),
      farmerName: listingData.farmerName || 'शेतकरी',
      farmerMobile: listingData.farmerMobile || '',
      cropName: listingData.cropName.trim(),
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
      bids: initialBids,
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
