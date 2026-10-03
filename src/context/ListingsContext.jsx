import React, { createContext, useContext, useState, useEffect } from 'react';

const ListingsContext = createContext(null);

const LISTINGS_STORAGE_KEY = 'krushimitra_listings';

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem(LISTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
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
    const newListing = {
      id: 'KM-' + Date.now().toString().slice(-6),
      farmerId: listingData.farmerId || 'FARMER_' + Date.now(),
      farmerName: listingData.farmerName || 'शेतकरी',
      farmerMobile: listingData.farmerMobile || '',
      cropName: listingData.cropName.trim(),
      qualityGrade: listingData.qualityGrade || 'मध्यम',
      quantity: Number(listingData.quantity) || 1,
      unit: listingData.unit || 'क्विंटल',
      basePrice: Number(listingData.basePrice) || 0,
      location: listingData.location.trim(),
      listingDate: listingData.listingDate || new Date().toISOString().split('T')[0],
      image: listingData.image || null,
      status: 'बोली सुरू (Active Bidding)',
      createdAt: new Date().toISOString(),
      notes: listingData.notes || '',
      estimatedMarketPrice: listingData.estimatedMarketPrice || '',
    };

    setListings((prev) => [newListing, ...prev]);
    return newListing;
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
