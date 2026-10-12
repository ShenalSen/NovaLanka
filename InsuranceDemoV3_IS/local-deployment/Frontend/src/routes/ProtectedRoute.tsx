import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import type { ProtectedRouteProps } from '../types/types';
import { 
  getUserPortalTypeFromStorage, 
  getPortalBasePath 
} from '../lib/auth/authUtils';


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, portal }) => {
  const { state } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    if (state.isAuthenticated) {
      const userPortalType = getUserPortalTypeFromStorage();
      
      if (!userPortalType) {
        setRedirect('/');
        setLoading(false);
        return;
      }
      
      if (portal === userPortalType) {
        setHasAccess(true);
      } else {
        setRedirect(getPortalBasePath(userPortalType));
      }
      
      setLoading(false);
    } else {
      setRedirect('/');
      setLoading(false);
    }
  }, [state.isAuthenticated, portal]);

  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (loading) {
    return <div>Checking access...</div>;
  }
  
  if (!hasAccess && redirect) {
    return <Navigate to={redirect} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
