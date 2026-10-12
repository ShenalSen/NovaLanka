import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import type { ProtectedRouteProps } from '../types/types';
import { getUserPortalType, getPortalBasePath } from '../lib/auth/authUtils';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, portal }) => {
  const { state, getDecodedIDToken } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    if (!state.isAuthenticated) {
      setRedirectPath('/');
      setLoading(false);
      return;
    }

    const checkAccess = async () => {
      try {
        const decodedToken = await getDecodedIDToken();
        const groups: string[] = Array.isArray(decodedToken?.groups) ? decodedToken.groups : [];
        const userPortalType = getUserPortalType(groups);

        if (!userPortalType) {
          // Fail closed — unrecognised or missing group: send back to login
          setRedirectPath('/');
        } else if (portal === userPortalType) {
          setHasAccess(true);
        } else {
          setRedirectPath(getPortalBasePath(userPortalType));
        }
      } catch {
        setRedirectPath('/');
      }
      setLoading(false);
    };

    checkAccess();
  }, [state.isAuthenticated, portal, getDecodedIDToken]);

  if (!state.isAuthenticated) return <Navigate to="/" replace />;
  if (loading) return <div>Checking access...</div>;
  if (!hasAccess && redirectPath) return <Navigate to={redirectPath} replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
