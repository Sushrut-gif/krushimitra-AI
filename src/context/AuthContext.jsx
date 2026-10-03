import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  fetchSupabaseMerchants,
  updateSupabaseMerchantStatus,
} from '../services/supabaseService';

const AuthContext = createContext(null);

const FARMERS_STORAGE_KEY = 'krushimitra_farmers';
const FARMER_SESSION_KEY = 'krushimitra_farmer_session';

const MERCHANTS_STORAGE_KEY = 'krushimitra_merchants';
const MERCHANT_SESSION_KEY = 'krushimitra_active_merchant';

const ADMIN_SESSION_KEY = 'krushimitra_admin_session';

const ALLOWED_ADMIN_IDS = [
  'admin',
  'apmc-admin',
  'apmc-slp-admin',
  'admin@solapurapmc.gov.in',
  'slp-admin',
  'slp_admin',
];

const ALLOWED_ADMIN_PASSWORDS = [
  'admin',
  'apmc@2026',
  'admin123',
  'apmc2026',
];

const DEFAULT_SEEDED_MERCHANTS = [
  {
    id: 'MERCHANT_SLP_8841',
    firmName: 'सोलापूर ॲग्रो ट्रेडर्स (Solapur Agro Traders)',
    licenseNo: 'APMC/SLP/TRD-8841',
    mobile: '9822154321',
    gstPan: '27AABCS1429B1Z8',
    operatingYard: 'मंगळवार पेठ (मुख्य मार्केट)',
    merchantType: 'अडत व्यापारी (Commission Agent)',
    status: 'APPROVED', // 'APPROVED' | 'PENDING' | 'SUSPENDED'
    password: 'password123',
    registeredAt: new Date().toISOString(),
  },
  {
    id: 'MERCHANT_SLP_7720',
    firmName: 'सिद्धेश्वर ग्रेन मर्चंट्स',
    licenseNo: 'APMC/SLP/TRD-7720',
    mobile: '9890123456',
    gstPan: '27XYZPA9876C1Z4',
    operatingYard: 'कुमठा नाका यार्ड',
    merchantType: 'थेट खरेदीदार (Direct Buyer)',
    status: 'APPROVED',
    password: 'password123',
    registeredAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }) {
  const [farmerUser, setFarmerUser] = useState(() => {
    try {
      const saved = localStorage.getItem(FARMER_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [merchantUser, setMerchantUser] = useState(() => {
    try {
      const saved = localStorage.getItem(MERCHANT_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [merchants, setMerchants] = useState(() => {
    try {
      const data = localStorage.getItem(MERCHANTS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.map((m) => ({
          ...m,
          status: m.status || 'APPROVED',
        }));
      }
      localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(DEFAULT_SEEDED_MERCHANTS));
      return DEFAULT_SEEDED_MERCHANTS;
    } catch {
      return DEFAULT_SEEDED_MERCHANTS;
    }
  });

  const [loading, setLoading] = useState(false);

  // Helper to get registered farmers from localStorage
  const getRegisteredFarmers = () => {
    try {
      const data = localStorage.getItem(FARMERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // Helper to get registered merchants from localStorage (seeded if empty)
  const getRegisteredMerchants = () => {
    try {
      const data = localStorage.getItem(MERCHANTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(DEFAULT_SEEDED_MERCHANTS));
      return DEFAULT_SEEDED_MERCHANTS;
    } catch {
      return DEFAULT_SEEDED_MERCHANTS;
    }
  };

  // Update merchant status (APPROVED, PENDING, SUSPENDED)
  const updateMerchantStatus = (merchantId, newStatus) => {
    setMerchants((prev) => {
      const updated = prev.map((m) =>
        m.id === merchantId || m.licenseNo === merchantId ? { ...m, status: newStatus } : m
      );
      try {
        localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving updated merchants:', e);
      }
      return updated;
    });

    // Asynchronously update Supabase merchants table
    updateSupabaseMerchantStatus(merchantId, newStatus);
  };

  // Initialize merchants from Supabase and subscribe to Realtime updates
  useEffect(() => {
    let isMounted = true;

    async function loadMerchantsFromSupabase() {
      try {
        const dbMerchants = await fetchSupabaseMerchants();
        if (!isMounted) return;
        if (dbMerchants && dbMerchants.length > 0) {
          const mapped = dbMerchants.map((m) => ({
            id: m.id,
            firmName: m.firm_name,
            licenseNo: m.license_no,
            mobile: m.mobile,
            status: m.status || 'APPROVED',
            operatingYard: m.yard || 'मंगळवार पेठ (मुख्य मार्केट)',
            merchantType: m.merchant_type || 'अडत व्यापारी (Commission Agent)',
            registeredAt: m.created_at || new Date().toISOString(),
          }));
          setMerchants(mapped);
        }
      } catch (err) {
        console.warn('[Supabase] Error loading merchants:', err);
      }
    }

    loadMerchantsFromSupabase();

    // Supabase Realtime channel for merchants table
    const channel = supabase
      .channel('merchants-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'merchants' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setMerchants((prev) =>
              prev.map((m) =>
                m.id === payload.new.id || m.licenseNo === payload.new.license_no
                  ? { ...m, status: payload.new.status }
                  : m
              )
            );
          } else if (payload.eventType === 'INSERT' && payload.new) {
            setMerchants((prev) => {
              if (prev.some((m) => m.id === payload.new.id || m.licenseNo === payload.new.license_no)) return prev;
              const newM = {
                id: payload.new.id,
                firmName: payload.new.firm_name,
                licenseNo: payload.new.license_no,
                mobile: payload.new.mobile,
                status: payload.new.status || 'APPROVED',
                operatingYard: payload.new.yard || 'मंगळवार पेठ (मुख्य मार्केट)',
                merchantType: payload.new.merchant_type || 'अडत व्यापारी (Commission Agent)',
                registeredAt: payload.new.created_at || new Date().toISOString(),
              };
              return [...prev, newM];
            });
          }
        }
      )
      .subscribe();

    try {
      if (!localStorage.getItem(MERCHANTS_STORAGE_KEY)) {
        localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(DEFAULT_SEEDED_MERCHANTS));
      }
    } catch (e) {
      console.error('Error initializing merchants storage:', e);
    }

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Farmer registration
  const registerFarmer = ({ name, mobile, village, taluka, district, password }) => {
    const cleanMobile = mobile.trim();
    const farmers = getRegisteredFarmers();

    const existing = farmers.find((f) => f.mobile === cleanMobile);
    if (existing) {
      return {
        success: false,
        error: 'हा मोबाईल नंबर आधीच नोंदणीकृत आहे. कृपया लॉगिन करा.',
      };
    }

    const newFarmer = {
      id: 'FARMER_' + Date.now(),
      name: name.trim(),
      mobile: cleanMobile,
      village: village.trim(),
      taluka: taluka.trim(),
      district: district.trim(),
      password,
      registeredAt: new Date().toISOString(),
    };

    const updatedFarmers = [...farmers, newFarmer];
    localStorage.setItem(FARMERS_STORAGE_KEY, JSON.stringify(updatedFarmers));

    // Save active session
    localStorage.setItem(FARMER_SESSION_KEY, JSON.stringify(newFarmer));
    setFarmerUser(newFarmer);

    return { success: true, user: newFarmer };
  };

  // Farmer login
  const loginFarmer = ({ mobile, password }) => {
    const cleanMobile = mobile.trim();
    const farmers = getRegisteredFarmers();

    const matched = farmers.find(
      (f) => f.mobile === cleanMobile && f.password === password
    );

    if (!matched) {
      return {
        success: false,
        error: 'मोबाईल नंबर किंवा पासवर्ड चुकीचा आहे. कृपया तपासा किंवा नवीन नोंदणी करा.',
      };
    }

    // Save active session
    localStorage.setItem(FARMER_SESSION_KEY, JSON.stringify(matched));
    setFarmerUser(matched);

    return { success: true, user: matched };
  };

  // Farmer logout
  const logoutFarmer = () => {
    localStorage.removeItem(FARMER_SESSION_KEY);
    setFarmerUser(null);
  };

  // Merchant registration
  const registerMerchant = ({
    firmName,
    licenseNo,
    mobile,
    gstPan,
    operatingYard,
    merchantType,
    password,
  }) => {
    const cleanMobile = mobile.trim();
    const cleanLicense = licenseNo.trim().toUpperCase();
    const merchants = getRegisteredMerchants();

    // Check for existing mobile
    const existingMobile = merchants.find((m) => m.mobile === cleanMobile);
    if (existingMobile) {
      return {
        success: false,
        error: 'हा मोबाईल नंबर आधीच एका व्यापाऱ्यासाठी नोंदणीकृत आहे. कृपया लॉगिन करा.',
      };
    }

    // Check for existing license
    const existingLicense = merchants.find(
      (m) => m.licenseNo && m.licenseNo.trim().toUpperCase() === cleanLicense
    );
    if (existingLicense) {
      return {
        success: false,
        error: 'हा APMC परवाना क्रमांक आधीच नोंदणीकृत आहे. कृपया तपासा.',
      };
    }

    const newMerchant = {
      id: 'MERCHANT_' + Date.now(),
      firmName: firmName.trim(),
      licenseNo: cleanLicense,
      mobile: cleanMobile,
      gstPan: gstPan ? gstPan.trim().toUpperCase() : '',
      operatingYard: operatingYard || 'मंगळवार पेठ (मुख्य मार्केट)',
      merchantType: merchantType || 'अडत व्यापारी (Commission Agent)',
      status: 'APPROVED',
      password,
      registeredAt: new Date().toISOString(),
    };

    const updatedMerchants = [...merchants, newMerchant];
    setMerchants(updatedMerchants);
    localStorage.setItem(MERCHANTS_STORAGE_KEY, JSON.stringify(updatedMerchants));

    // Save active session
    localStorage.setItem(MERCHANT_SESSION_KEY, JSON.stringify(newMerchant));
    setMerchantUser(newMerchant);

    return { success: true, user: newMerchant };
  };

  // Merchant login
  const loginMerchant = ({ identifier, password }) => {
    const cleanId = identifier.trim().toLowerCase();
    const merchants = getRegisteredMerchants();

    const matched = merchants.find((m) => {
      const matchMobile = m.mobile && m.mobile.toLowerCase() === cleanId;
      const matchLicense = m.licenseNo && m.licenseNo.toLowerCase() === cleanId;
      return (matchMobile || matchLicense) && m.password === password;
    });

    if (!matched) {
      return {
        success: false,
        error: 'नोंदणीकृत मोबाईल नंबर / परवाना क्रमांक किंवा पासवर्ड चुकीचा आहे. कृपया योग्य माहिती भरा.',
      };
    }

    // Save active session
    localStorage.setItem(MERCHANT_SESSION_KEY, JSON.stringify(matched));
    setMerchantUser(matched);

    return { success: true, user: matched };
  };

  // Merchant logout
  const logoutMerchant = () => {
    localStorage.removeItem(MERCHANT_SESSION_KEY);
    setMerchantUser(null);
  };

  // Admin login
  const loginAdmin = ({ identifier, password }) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const isIdValid = ALLOWED_ADMIN_IDS.some((id) => id.toLowerCase() === cleanId);
    const isPassValid = ALLOWED_ADMIN_PASSWORDS.some((p) => p === cleanPass);

    if (!isIdValid || !isPassValid) {
      return {
        success: false,
        error: 'अवैध प्रशासक आयडी किंवा पासवर्ड! केवळ अधिकृत बाजार समिती अधिकाऱ्यांना प्रवेश आहे.',
      };
    }

    const adminSession = {
      id: cleanId.toUpperCase(),
      name: 'सोलापूर APMC प्रशासकीय अधिकारी',
      officerTitle: 'मुख्य बाजार निरीक्षक (Chief Market Inspector)',
      role: 'APMC प्रशासक (Super Admin)',
      yard: 'सोलापूर मुख्य प्रशासकीय नियंत्रण कक्ष',
      loginAt: new Date().toISOString(),
    };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
    setAdminUser(adminSession);

    return { success: true, user: adminSession };
  };

  // Admin logout
  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminUser(null);
  };

  const value = {
    farmerUser,
    isFarmerAuthenticated: !!farmerUser,
    registerFarmer,
    loginFarmer,
    logoutFarmer,
    merchantUser,
    merchants,
    updateMerchantStatus,
    isMerchantAuthenticated: !!merchantUser,
    registerMerchant,
    loginMerchant,
    logoutMerchant,
    adminUser,
    isAdminAuthenticated: !!adminUser,
    loginAdmin,
    logoutAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
