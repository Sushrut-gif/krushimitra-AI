import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

// Session storage keys (localStorage for persistence across reloads)
const FARMER_SESSION_KEY   = 'krushimitra_farmer_session';
const MERCHANT_SESSION_KEY = 'krushimitra_active_merchant';
const ADMIN_SESSION_KEY    = 'krushimitra_admin_session';

// ─── Helper: map a Supabase profiles row → normalized merchant object ───────
function rowToMerchant(m) {
  return {
    id:            m.id,
    name:          m.full_name || '',
    firmName:      m.firm_name  || m.full_name || '',
    licenseNo:     m.license_no || '',
    mobile:        m.mobile || '',
    gstin:         m.gstin || '',
    gstPan:        m.gstin || '',
    operatingYard: m.yard   || 'मंगळवार पेठ (मुख्य मार्केट)',
    merchantType:  m.merchant_type || 'अडत व्यापारी (Commission Agent)',
    status:        m.status  || 'APPROVED',
    registeredAt:  m.created_at || new Date().toISOString(),
  };
}

// ─── Helper: map a Supabase profiles row → normalized farmer session ─────────
function rowToFarmer(r) {
  return {
    id:          r.id,
    name:        r.full_name || '',
    mobile:      r.mobile || '',
    village:     r.village || '',
    taluka:      r.taluka || '',
    status:      r.status || 'APPROVED',
    registeredAt: r.created_at || new Date().toISOString(),
  };
}

// ─── Helper: map a Supabase profiles row → normalized admin session ──────────
function rowToAdmin(r) {
  return {
    id:           r.id,
    mobile:       r.mobile,
    name:         r.full_name || 'सोलापूर APMC प्रशासकीय अधिकारी',
    officerTitle: 'मुख्य बाजार निरीक्षक (Chief Market Inspector)',
    role:         'APMC प्रशासक (Super Admin)',
    yard:         r.yard || 'सोलापूर मुख्य प्रशासकीय नियंत्रण कक्ष',
    loginAt:      new Date().toISOString(),
  };
}

// ─── Helper: map a Supabase profiles row → normalized merchant session ───────
function rowToMerchantSession(r) {
  return {
    id:            r.id,
    name:          r.full_name || '',
    firmName:      r.firm_name  || r.full_name || '',
    licenseNo:     r.license_no || '',
    mobile:        r.mobile || '',
    gstin:         r.gstin || '',
    gstPan:        r.gstin || '',
    operatingYard: r.yard   || 'मंगळवार पेठ (मुख्य मार्केट)',
    merchantType:  r.merchant_type || 'अडत व्यापारी (Commission Agent)',
    status:        r.status  || 'APPROVED',
    registeredAt:  r.created_at || new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {

  // ── Rehydrate sessions from localStorage so reloads don't log users out ──
  const [farmerUser, setFarmerUser] = useState(() => {
    try { const s = localStorage.getItem(FARMER_SESSION_KEY); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  const [merchantUser, setMerchantUser] = useState(() => {
    try { const s = localStorage.getItem(MERCHANT_SESSION_KEY); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try { const s = localStorage.getItem(ADMIN_SESSION_KEY); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  // Merchant list for Admin dashboard — fetched from profiles where role='merchant'
  const [merchants, setMerchants] = useState([]);

  const [loading, setLoading] = useState(false);

  // ── Load + subscribe to merchant profiles for Admin dashboard ────────────
  useEffect(() => {
    let isMounted = true;

    async function loadMerchants() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'merchant')
          .order('created_at', { ascending: false });

        if (!isMounted) return;
        if (error) { console.warn('[Supabase] loadMerchants:', error.message); return; }
        setMerchants((data || []).map(rowToMerchant));
      } catch (err) {
        console.warn('[Supabase] loadMerchants error:', err);
      }
    }

    loadMerchants();

    // Realtime: react to insert/update in profiles for merchants
    const channel = supabase
      .channel('profiles-merchants-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        const row = payload.new || payload.old;
        if (!row || row.role !== 'merchant') return;

        if (payload.eventType === 'INSERT') {
          setMerchants((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [rowToMerchant(row), ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          setMerchants((prev) =>
            prev.map((m) => m.id === row.id ? rowToMerchant(row) : m)
          );
          // Also keep merchantUser session in sync if it's the logged-in merchant
          setMerchantUser((prev) => {
            if (!prev || prev.id !== row.id) return prev;
            const updated = rowToMerchantSession(row);
            localStorage.setItem(MERCHANT_SESSION_KEY, JSON.stringify(updated));
            return updated;
          });
        } else if (payload.eventType === 'DELETE' && payload.old) {
          setMerchants((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // FARMER REGISTRATION  →  Supabase profiles (role='farmer', status='APPROVED')
  // ═══════════════════════════════════════════════════════════════════════════
  const registerFarmer = async ({ name, mobile, village, taluka, district, password }) => {
    const cleanMobile = mobile.trim();
    setLoading(true);
    try {
      // 1. Check for duplicate mobile
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('mobile', cleanMobile)
        .eq('role', 'farmer')
        .maybeSingle();

      if (existing) {
        setLoading(false);
        return { success: false, error: 'हा मोबाईल नंबर आधीच नोंदणीकृत आहे. कृपया लॉगिन करा.' };
      }

      // 2. Insert new farmer
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          role:      'farmer',
          full_name: name.trim(),
          mobile:    cleanMobile,
          password:  password,
          village:   village.trim(),
          taluka:    taluka.trim(),
          status:    'APPROVED',
        }])
        .select()
        .single();

      if (error) {
        setLoading(false);
        return { success: false, error: 'नोंदणी अयशस्वी झाली. कृपया पुन्हा प्रयत्न करा.' };
      }

      // 3. Persist session
      const session = rowToFarmer(data);
      localStorage.setItem(FARMER_SESSION_KEY, JSON.stringify(session));
      setFarmerUser(session);
      setLoading(false);
      return { success: true, user: session };

    } catch (err) {
      console.error('[Auth] registerFarmer error:', err);
      setLoading(false);
      return { success: false, error: 'नेटवर्क किंवा सर्व्हर त्रुटी. कृपया पुन्हा प्रयत्न करा.' };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // FARMER LOGIN  →  Supabase profiles query
  // ═══════════════════════════════════════════════════════════════════════════
  const loginFarmer = async ({ mobile, password }) => {
    const cleanMobile = mobile.trim();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('mobile', cleanMobile)
        .eq('password', password)
        .eq('role', 'farmer')
        .maybeSingle();

      if (error || !data) {
        setLoading(false);
        return { success: false, error: 'चुकीचा मोबाईल किंवा पासवर्ड! कृपया तपासा किंवा नवीन नोंदणी करा.' };
      }

      const session = rowToFarmer(data);
      localStorage.setItem(FARMER_SESSION_KEY, JSON.stringify(session));
      setFarmerUser(session);
      setLoading(false);
      return { success: true, user: session };

    } catch (err) {
      console.error('[Auth] loginFarmer error:', err);
      setLoading(false);
      return { success: false, error: 'नेटवर्क किंवा सर्व्हर त्रुटी. कृपया पुन्हा प्रयत्न करा.' };
    }
  };

  const logoutFarmer = () => {
    localStorage.removeItem(FARMER_SESSION_KEY);
    setFarmerUser(null);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MERCHANT REGISTRATION  →  Supabase profiles (role='merchant', status='PENDING')
  // ═══════════════════════════════════════════════════════════════════════════
  const registerMerchant = async ({
    firmName, traderName, licenseNo, mobile, gstin, gstPan, yard, operatingYard, merchantType, password,
  }) => {
    const cleanMobile  = (mobile || '').trim();
    const cleanLicense = (licenseNo || '').trim().toUpperCase();
    const cleanFirm    = (traderName || firmName || '').trim();
    const cleanGstin   = (gstin || gstPan || '').trim().toUpperCase();
    const cleanYard    = (yard || operatingYard || 'मंगळवार पेठ (मुख्य मार्केट यार्ड, सोलापूर)').trim();
    const cleanType    = (merchantType || 'अडत व्यापारी (Commission Agent)').trim();

    setLoading(true);
    try {
      // 1. Check duplicate mobile
      const { data: existMobile, error: mobileErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('mobile', cleanMobile)
        .eq('role', 'merchant')
        .maybeSingle();

      if (mobileErr) {
        console.error('Registration Supabase Error:', mobileErr);
      }

      if (existMobile) {
        setLoading(false);
        return { success: false, error: 'हा मोबाईल नंबर आधीच नोंदणीकृत आहे.' };
      }

      // 2. Check duplicate license
      const { data: existLic, error: licErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('license_no', cleanLicense)
        .eq('role', 'merchant')
        .maybeSingle();

      if (licErr) {
        console.error('Registration Supabase Error:', licErr);
      }

      if (existLic) {
        setLoading(false);
        return { success: false, error: 'हा APMC परवाना क्रमांक आधीच नोंदणीकृत आहे. कृपया तपासा.' };
      }

      // 3. Insert new merchant (status: PENDING — Admin must approve)
      // Strictly matching Supabase columns:
      // role, full_name, firm_name, license_no, mobile, gstin, merchant_type, yard, password, status
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          role:          'merchant',
          full_name:     cleanFirm,
          firm_name:     cleanFirm,
          license_no:    cleanLicense,
          mobile:        cleanMobile,
          gstin:         cleanGstin,
          merchant_type: cleanType,
          yard:          cleanYard,
          password:      password,
          status:        'PENDING',
        }])
        .select()
        .single();

      if (error) {
        console.error('Registration Supabase Error:', error);
        setLoading(false);
        if (error.code === '23505') {
          return { success: false, error: 'हा मोबाईल नंबर आधीच नोंदणीकृत आहे.' };
        }
        return {
          success: false,
          error: error.message || error.details || 'नोंदणी अयशस्वी झाली. कृपया पुन्हा प्रयत्न करा.',
        };
      }

      // 4. Store session (status PENDING — user sees pending message)
      const session = rowToMerchantSession(data);
      localStorage.setItem(MERCHANT_SESSION_KEY, JSON.stringify(session));
      setMerchantUser(session);

      // 5. Also update local merchants list
      setMerchants((prev) => [rowToMerchant(data), ...prev]);

      setLoading(false);
      return { success: true, user: session };

    } catch (err) {
      console.error('Registration Supabase Error:', err);
      setLoading(false);
      if (err?.code === '23505') {
        return { success: false, error: 'हा मोबाईल नंबर आधीच नोंदणीकृत आहे.' };
      }
      return {
        success: false,
        error: err?.message || 'नेटवर्क किंवा सर्व्हर त्रुटी. कृपया पुन्हा प्रयत्न करा.',
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MERCHANT LOGIN  →  Supabase profiles query (mobile + password + role)
  // ═══════════════════════════════════════════════════════════════════════════
  const loginMerchant = async ({ identifier, password }) => {
    const cleanId = identifier.trim();
    setLoading(true);
    try {
      // Match by mobile (primary) or license_no (secondary)
      const { data: byMobile } = await supabase
        .from('profiles')
        .select('*')
        .eq('mobile', cleanId)
        .eq('password', password)
        .eq('role', 'merchant')
        .maybeSingle();

      let row = byMobile;

      if (!row) {
        const { data: byLic } = await supabase
          .from('profiles')
          .select('*')
          .eq('license_no', cleanId.toUpperCase())
          .eq('password', password)
          .eq('role', 'merchant')
          .maybeSingle();
        row = byLic;
      }

      if (!row) {
        setLoading(false);
        return {
          success: false,
          error: 'नोंदणीकृत मोबाईल नंबर / परवाना क्रमांक किंवा पासवर्ड चुकीचा आहे. कृपया योग्य माहिती भरा.',
        };
      }

      // Check status: PENDING → reject with advisory message
      if (row.status === 'PENDING') {
        setLoading(false);
        return {
          success: false,
          error: 'आपला परवाना ॲडमिन पडताळणीसाठी प्रलंबित आहे. मंजुरीनंतर लॉगिन करता येईल.',
        };
      }

      if (row.status === 'SUSPENDED') {
        setLoading(false);
        return {
          success: false,
          error: 'आपला व्यापारी परवाना तात्पुरता निलंबित केला आहे. APMC कार्यालयाशी संपर्क करा.',
        };
      }

      const session = rowToMerchantSession(row);
      localStorage.setItem(MERCHANT_SESSION_KEY, JSON.stringify(session));
      setMerchantUser(session);
      setLoading(false);
      return { success: true, user: session };

    } catch (err) {
      console.error('[Auth] loginMerchant error:', err);
      setLoading(false);
      return { success: false, error: 'नेटवर्क किंवा सर्व्हर त्रुटी. कृपया पुन्हा प्रयत्न करा.' };
    }
  };

  const logoutMerchant = () => {
    localStorage.removeItem(MERCHANT_SESSION_KEY);
    setMerchantUser(null);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN LOGIN  →  Supabase profiles where role='admin'
  // ═══════════════════════════════════════════════════════════════════════════
  const loginAdmin = async ({ identifier, password }) => {
    const cleanId   = (identifier || '').trim();
    const cleanPass = (password  || '').trim();
    setLoading(true);
    try {
      // Query by mobile (primary identifier for admins)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('mobile', cleanId)
        .eq('password', cleanPass)
        .eq('role', 'admin')
        .maybeSingle();

      // Fallback: also accept legacy hard-coded IDs for backwards compatibility
      const LEGACY_IDS  = ['admin', 'apmc-admin', 'apmc-slp-admin', 'admin@solapurapmc.gov.in', 'slp-admin', 'slp_admin', 'apmc-admin'];
      const LEGACY_PASS = ['admin', 'apmc@2026', 'admin123', 'apmc2026'];
      const isLegacy    = LEGACY_IDS.includes(cleanId.toLowerCase()) && LEGACY_PASS.includes(cleanPass);

      if ((error || !data) && !isLegacy) {
        setLoading(false);
        return {
          success: false,
          error: 'अवैध प्रशासक आयडी किंवा पासवर्ड! केवळ अधिकृत बाजार समिती अधिकाऱ्यांना प्रवेश आहे.',
        };
      }

      const adminSession = data
        ? rowToAdmin(data)
        : {
            id:           cleanId.toUpperCase(),
            name:         'सोलापूर APMC प्रशासकीय अधिकारी',
            mobile:       cleanId,
            officerTitle: 'मुख्य बाजार निरीक्षक (Chief Market Inspector)',
            role:         'APMC प्रशासक (Super Admin)',
            yard:         'सोलापूर मुख्य प्रशासकीय नियंत्रण कक्ष',
            loginAt:      new Date().toISOString(),
          };

      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
      setAdminUser(adminSession);
      setLoading(false);
      return { success: true, user: adminSession };

    } catch (err) {
      console.error('[Auth] loginAdmin error:', err);
      setLoading(false);
      return { success: false, error: 'नेटवर्क किंवा सर्व्हर त्रुटी. कृपया पुन्हा प्रयत्न करा.' };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminUser(null);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN: Update Merchant Status in Supabase profiles
  // ═══════════════════════════════════════════════════════════════════════════
  const updateMerchantStatus = async (merchantId, newStatus) => {
    // Optimistic local update
    setMerchants((prev) =>
      prev.map((m) => m.id === merchantId ? { ...m, status: newStatus } : m)
    );

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', merchantId);

      if (error) {
        console.warn('[Supabase] updateMerchantStatus error:', error.message);
        // Revert on error
        setMerchants((prev) =>
          prev.map((m) => m.id === merchantId ? { ...m, status: m.status } : m)
        );
      }
    } catch (err) {
      console.error('[Auth] updateMerchantStatus error:', err);
    }
  };

  const value = {
    // Farmer
    farmerUser,
    isFarmerAuthenticated: !!farmerUser,
    registerFarmer,
    loginFarmer,
    logoutFarmer,
    // Merchant
    merchantUser,
    merchants,
    isMerchantAuthenticated: !!merchantUser,
    registerMerchant,
    loginMerchant,
    logoutMerchant,
    updateMerchantStatus,
    // Admin
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
