import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import RoleSelection from './pages/RoleSelection';
import FarmerAuth from './pages/FarmerAuth';
import FarmerProtectedRoute from './components/FarmerProtectedRoute';
import FarmerDashboard from './pages/FarmerDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AIAssistant from './components/AIAssistant';

export default function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Role Selection Portals */}
            <Route path="/" element={<RoleSelection />} />
            <Route path="/login" element={<RoleSelection />} />

            {/* Farmer Authentication Routes */}
            <Route path="/farmer/login" element={<FarmerAuth initialMode="login" />} />
            <Route path="/farmer/register" element={<FarmerAuth initialMode="register" />} />

            {/* Protected Farmer Portal */}
            <Route
              path="/farmer"
              element={
                <FarmerProtectedRoute>
                  <FarmerDashboard />
                </FarmerProtectedRoute>
              }
            />

            {/* Merchant & APMC Admin Dashboards (Step 1 Shells) */}
            <Route path="/merchant" element={<MerchantDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Catch-all redirect to role selection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Multi-Lingual AI Farming Assistant (Voice & Chat) */}
          <AIAssistant />
        </BrowserRouter>
      </ListingsProvider>
    </AuthProvider>
  );
}
