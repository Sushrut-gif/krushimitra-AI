import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import FarmerDashboard from './pages/FarmerDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Role Selection / Login Portals */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<RoleSelection />} />

        {/* 3 Dedicated Role Dashboards */}
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/merchant" element={<MerchantDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
