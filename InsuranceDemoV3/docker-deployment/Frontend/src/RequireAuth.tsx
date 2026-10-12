import React from 'react';
import { Navigate } from 'react-router-dom';

interface RequireAuthProps {
  portal: 'admin' | 'customer' | 'employee';
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ portal, children }) => {
  const userStr = localStorage.getItem('portalUser');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  try {
    const user = JSON.parse(userStr);
    if (user.portal !== portal) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  } catch {
    localStorage.removeItem('portalUser');
    return <Navigate to="/login" replace />;
  }
};

export default RequireAuth;