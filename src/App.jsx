import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import { PaymentsProvider } from './context/PaymentsContext';
import { PWAProvider } from './context/PWAContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PWAOfflineNotice from './components/PWAOfflineNotice';
import PWAUpdateToast from './components/PWAUpdateToast';
import RoleSelection from './pages/RoleSelection';
import FarmerAuth from './pages/FarmerAuth';
import FarmerProtectedRoute from './components/FarmerProtectedRoute';
import MerchantAuth from './pages/MerchantAuth';
import MerchantProtectedRoute from './components/MerchantProtectedRoute';
import AdminAuth from './pages/AdminAuth';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import FarmerDashboard from './pages/FarmerDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AIAssistant from './components/AIAssistant';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <PWAProvider>
        <AuthProvider>
          <ListingsProvider>
            <PaymentsProvider>
              <BrowserRouter>
                <ErrorBoundary>
                  {/* Offline Notice Banner */}
                  <PWAOfflineNotice />

                  {/* App Routes */}
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

                    {/* Merchant Authentication Routes */}
                    <Route path="/merchant/login" element={<MerchantAuth initialMode="login" />} />
                    <Route path="/merchant/register" element={<MerchantAuth initialMode="register" />} />

                    {/* Protected Merchant Portal */}
                    <Route
                      path="/merchant"
                      element={
                        <MerchantProtectedRoute>
                          <MerchantDashboard />
                        </MerchantProtectedRoute>
                      }
                    />

                    {/* APMC Admin Authentication Route */}
                    <Route path="/admin/login" element={<AdminAuth />} />

                    {/* Protected APMC Admin Portal */}
                    <Route
                      path="/admin"
                      element={
                        <AdminProtectedRoute>
                          <AdminDashboard />
                        </AdminProtectedRoute>
                      }
                    />

                    {/* Catch-all redirect to role selection */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>

                  {/* Global Multi-Lingual AI Farming Assistant (Voice & Chat) */}
                  <AIAssistant />

                  {/* PWA Floating Install Prompt & Update Toast */}
                  <PWAInstallPrompt />
                  <PWAUpdateToast />
                </ErrorBoundary>
              </BrowserRouter>
            </PaymentsProvider>
          </ListingsProvider>
        </AuthProvider>
      </PWAProvider>
    </ErrorBoundary>
  );
}
