import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route protection guard for APMC Solapur Admin portal (/admin).
 * Redirects unauthenticated visitors to /admin/login.
 */
export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
