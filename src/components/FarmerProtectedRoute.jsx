import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function FarmerProtectedRoute({ children }) {
  const { isFarmerAuthenticated } = useAuth();
  const location = useLocation();

  if (!isFarmerAuthenticated) {
    return <Navigate to="/farmer/login" state={{ from: location }} replace />;
  }

  return children;
}
