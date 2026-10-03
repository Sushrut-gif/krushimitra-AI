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

export const DEFAULT_SOLAPUR_LISTINGS = [
  {
    id: 'KM-88401',
    farmerId: 'FARMER_101',
    farmerName: 'विष्णू महादेव गायकवाड',
    farmerMobile: '9822012345',
    cropName: 'कांदा (लाल गावरान)',
    category: 'भाजीपाला',
    variety: 'नाशिक लाल / सोलापूर गावरान',
    qualityGrade: 'Grade A',
    aiScore: 95,
    moisture: '11.4%',
    quantity: 85,
    unit: 'क्विंटल',
    basePrice: 1650,
    location: 'कुर्डूवाडी, ता. माढा (सोलापूर)',
    listingDate: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    status: 'बोली सुरू (Active Bidding)',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    notes: 'सुपर सुका माल, एकसारखा ५५ मिमी+ आकार, कोणताही डाग किंवा सड नाही.',
    estimatedMarketPrice: '₹१,७०० - ₹२,१०० / क्विंटल',
    bids: [
      {
        id: 'BID_99101',
        merchantName: 'श्री सिद्धेश्वर व्हेजिटेबल कंपनी',
        merchantPhone: '9423456789',
        merchantLocation: 'बाजार समिती गाळा क्र. १२',
        amount: 1780,
        timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        timeFormatted: '२५ मिनिटांपूर्वी',
      },
      {
        id: 'BID_99102',
        merchantName: 'महादेव व्हेजिटेबल सप्लायर्स',
        merchantPhone: '9765432100',
        merchantLocation: 'नवीन कांदा मार्केट यार्ड',
        amount: 1920,
        timestamp: new Date(Date.now() - 6 * 60000).toISOString(),
        timeFormatted: '६ मिनिटांपूर्वी',
      },
    ],
  },
  {
    id: 'KM-88402',
    farmerId: 'FARMER_102',
    farmerName: 'समाधान रामचंद्र शिंदे',
    farmerMobile: '9850123789',
    cropName: 'डाळिंब (भगवा सुपर)',
    category: 'फळे',
    variety: 'सोलापूर भगवा (Export Quality)',
    qualityGrade: 'Grade A',
    aiScore: 98,
    moisture: '16.5° Brix Sugar',
    quantity: 40,
    unit: 'क्विंटल',
    basePrice: 7200,
    location: 'सांगोला, जि. सोलापूर',
    listingDate: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    status: 'बोली सुरू (Active Bidding)',
    createdAt: new Date(Date.now() - 65 * 60000).toISOString(),
    notes: '२५०-३०० ग्रॅम प्रति नग, गर्द लाल रंगाचे दाणे, उत्तम गोडी व टिकाऊपणा.',
    estimatedMarketPrice: '₹७,५०० - ₹८,५०० / क्विंटल',
    bids: [
      {
        id: 'BID_99201',
        merchantName: 'सोलापूर ॲग्रो ट्रेडर्स',
        merchantPhone: '9822154321',
        merchantLocation: 'सोलापूर APMC मार्केट यार्ड',
        amount: 7600,
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        timeFormatted: '३५ मिनिटांपूर्वी',
      },
      {
        id: 'BID_99202',
        merchantName: 'अपेक्स फ्रुट एक्स्पोर्टर्स',
        merchantPhone: '9822889900',
        merchantLocation: 'कुमठा नाका फ्रुट टर्मिनल',
        amount: 8150,
        timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
        timeFormatted: '८ मिनिटांपूर्वी',
      },
    ],
  },
  {
    id: 'KM-88403',
    farmerId: 'FARMER_103',
    farmerName: 'तानाजी बाबुराव माने',
    farmerMobile: '9890456123',
    cropName: 'मालदांडी ज्वारी (M 35-1)',
    category: 'धान्य व कडधान्ये',
    variety: 'मालदांडी मोती दाणा',
    qualityGrade: 'Grade A',
    aiScore: 96,
    moisture: '10.2%',
    quantity: 120,
    unit: 'क्विंटल',
    basePrice: 3400,
    location: 'मोहोळ, जि. सोलापूर',
    listingDate: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    status: 'बोली सुरू (Active Bidding)',
    createdAt: new Date(Date.now() - 110 * 60000).toISOString(),
    notes: 'गावरान मालदांडी ज्वारी, चमकणारा पांढरा मोत्यासारखा दाणा, भुसा नसलेला स्वच्छ माल.',
    estimatedMarketPrice: '₹३,५०० - ₹३,९०० / क्विंटल',
    bids: [
      {
        id: 'BID_99301',
        merchantName: 'सिद्धेश्वर ग्रेन मर्चंट्स',
        merchantPhone: '9890123456',
        merchantLocation: 'मंगळवार पेठ यार्ड',
        amount: 3620,
        timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
        timeFormatted: '४० मिनिटांपूर्वी',
      },
      {
        id: 'BID_99302',
        merchantName: 'श्री लक्ष्मी ट्रेडिंग कंपनी',
        merchantPhone: '9422055667',
        merchantLocation: 'धान्य बाजार गाळा क्र. ४',
        amount: 3780,
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        timeFormatted: '१५ मिनिटांपूर्वी',
      },
    ],
  },
  {
    id: 'KM-88404',
    farmerId: 'FARMER_104',
    farmerName: 'भारत तुकाराम भोसले',
    farmerMobile: '9764512398',
    cropName: 'सोयाबीन (पिवळे JS 335)',
    category: 'तेलबिया',
    variety: 'JS 335 बोल्ड',
    qualityGrade: 'Grade B+',
    aiScore: 91,
    moisture: '10.8%',
    quantity: 65,
    unit: 'क्विंटल',
    basePrice: 4150,
    location: 'बार्शी, जि. सोलापूर',
    listingDate: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80',
    status: 'बोली सुरू (Active Bidding)',
    createdAt: new Date(Date.now() - 140 * 60000).toISOString(),
    notes: 'तेल प्रमाण १९.५%+, ओलावा १०.८%, स्वच्छ चाळलेला माल.',
    estimatedMarketPrice: '₹४,२०० - ₹४,५५० / क्विंटल',
    bids: [
      {
        id: 'BID_99401',
        merchantName: 'सोलापूर ऑइल इंडस्ट्रीज',
        merchantPhone: '9823112233',
        merchantLocation: 'एमआयडीसी, सोलापूर',
        amount: 4320,
        timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
        timeFormatted: '५० मिनिटांपूर्वी',
      },
      {
        id: 'BID_99402',
        merchantName: 'किसान ॲग्रो ऑइल मिल्स',
        merchantPhone: '9850998877',
        merchantLocation: 'बाजार समिती आवक शेड',
        amount: 4450,
        timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
        timeFormatted: '१२ मिनिटांपूर्वी',
      },
    ],
  },
  {
    id: 'KM-88405',
    farmerId: 'FARMER_105',
    farmerName: 'अंकुश नारायण पवार',
    farmerMobile: '9921345670',
    cropName: 'द्राक्षे (शरद सीडलेस)',
    category: 'फळे',
    variety: 'काळी शरद सीडलेस',
    qualityGrade: 'Grade A',
    aiScore: 94,
    moisture: '18.2° Brix Sugar',
    quantity: 35,
    unit: 'क्विंटल',
    basePrice: 5500,
    location: 'नान्नज, ता. उत्तर सोलापूर',
    listingDate: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80',
    status: 'बोली सुरू (Active Bidding)',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
    notes: 'मण्यांचा आकार १८ मिमी+, उत्तम गोडवा व क्रंच, थेट निर्यात किंवा स्थानिक बाजार.',
    estimatedMarketPrice: '₹५,८०० - ₹६,४०० / क्विंटल',
    bids: [
      {
        id: 'BID_99501',
        merchantName: 'सोलापूर ॲग्रो ट्रेडर्स',
        merchantPhone: '9822154321',
        merchantLocation: 'सोलापूर APMC मार्केट यार्ड',
        amount: 5900,
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        timeFormatted: '४५ मिनिटांपूर्वी',
      },
      {
        id: 'BID_99502',
        merchantName: 'ग्लोबल फ्रेश एक्स्पोर्ट्स',
        merchantPhone: '9822776655',
        merchantLocation: 'कोल्ड स्टोरेज संकुल',
        amount: 6250,
        timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
        timeFormatted: '१८ मिनिटांपूर्वी',
      },
    ],
  },
  {
    id: 'KM-88406',
    farmerId: 'FARMER_106',
    farmerName: 'मल्लिकार्जुन शिवण्णा बिराजदार',
    farmerMobile: '9421034567',
    cropName: 'काटेरी गावरान वांगी (Brinjal)',
    category: 'भाजीपाला',
    variety: 'सोलापूर काटेरी वांगी',
    qualityGrade: 'Grade A',
    aiScore: 93,
    moisture: 'सकाळची ताजी तोडणी',
    quantity: 28,
    unit: 'क्विंटल',
    basePrice: 1800,
    location: 'मंद्रूप, ता. दक्षिण सोलापूर',
    listingDate: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    status: 'बोली सुरू (Active Bidding)',
    createdAt: new Date(Date.now() - 75 * 60000).toISOString(),
    notes: 'चमकदार जांभळा रंग, काटेरी देठ, भरतासाठी अतिशय उत्तम व ताजी तोडणी.',
    estimatedMarketPrice: '₹१,९०० - ₹२,३०० / क्विंटल',
    bids: [
      {
        id: 'BID_99601',
        merchantName: 'श्री सिद्धेश्वर व्हेजिटेबल कंपनी',
        merchantPhone: '9423456789',
        merchantLocation: 'बाजार समिती गाळा क्र. १२',
        amount: 1980,
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        timeFormatted: '३० मिनिटांपूर्वी',
      },
      {
        id: 'BID_99602',
        merchantName: 'महादेव व्हेजिटेबल सप्लायर्स',
        merchantPhone: '9765432100',
        merchantLocation: 'नवीन कांदा मार्केट यार्ड',
        amount: 2150,
        timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
        timeFormatted: '४ मिनिटांपूर्वी',
      },
    ],
  },
];

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

      if (!parsed || parsed.length === 0) {
        localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SOLAPUR_LISTINGS));
        return DEFAULT_SOLAPUR_LISTINGS;
      }

      // Ensure every listing has realistic bids array and category populated
      return parsed.map((item) => {
        const withBids = !item.bids || item.bids.length === 0
          ? { ...item, bids: generateSampleBids(item.basePrice) }
          : item;
        return {
          ...withBids,
          category: withBids.category || getCropCategory(withBids.cropName),
        };
      });
    } catch (e) {
      console.error('Failed to load listings from localStorage:', e);
      return DEFAULT_SOLAPUR_LISTINGS;
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
