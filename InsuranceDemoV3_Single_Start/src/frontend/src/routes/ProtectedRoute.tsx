import React from 'react';
import { Navigate } from 'react-router-dom';
import type { ProtectedRouteProps } from '../types/types';
import { ROUTES_CONFIG } from '../types/routesConfig';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ portal, children }) => {
  const userStr = localStorage.getItem(ROUTES_CONFIG.USER_STORAGE_KEY);
  if (!userStr) {
    return <Navigate to={ROUTES_CONFIG.LOGIN_PATH} replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    if (user.portal !== portal) {
      return <Navigate to={ROUTES_CONFIG.LOGIN_PATH} replace />;
    }
    return <>{children}</>;
  } catch {
    localStorage.removeItem(ROUTES_CONFIG.USER_STORAGE_KEY);
    return <Navigate to={ROUTES_CONFIG.LOGIN_PATH} replace />;
  }
};

export default ProtectedRoute;
