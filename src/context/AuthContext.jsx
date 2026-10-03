import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const FARMERS_STORAGE_KEY = 'krushimitra_farmers';
const FARMER_SESSION_KEY = 'krushimitra_farmer_session';

export function AuthProvider({ children }) {
  const [farmerUser, setFarmerUser] = useState(() => {
    try {
      const saved = localStorage.getItem(FARMER_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
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

  const value = {
    farmerUser,
    isFarmerAuthenticated: !!farmerUser,
    registerFarmer,
    loginFarmer,
    logoutFarmer,
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
