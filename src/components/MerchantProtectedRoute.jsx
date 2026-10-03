import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MerchantProtectedRoute({ children }) {
  const { isMerchantAuthenticated } = useAuth();
  const location = useLocation();

  if (!isMerchantAuthenticated) {
    return <Navigate to="/merchant/login" state={{ from: location }} replace />;
  }

  return children;
}
