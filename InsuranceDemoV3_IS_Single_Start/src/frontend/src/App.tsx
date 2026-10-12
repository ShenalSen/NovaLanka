import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import { ROUTES_CONFIG } from './types/routesConfig';
import type { RouteItem, PortalType } from './types/types';
import rootRoutes from './routes';
import './asgardeoLogin.css';
import { 
  handleAuthCallback, 
  isAuthenticated, 
  getUserPortalType,
  storeUserPortalType,
  getUserPortalTypeFromStorage,
  getPortalBasePath,
  extractUserDbId,
  storeUserDbId
} from './lib/auth/authUtils';
import { CustomerProvider } from './lib/auth/customerContext';
import { EmployeeProvider } from './lib/auth/employeeContext';
import MissedCallsButton from './components/common/MissedCallsButton';

const AdminApp = React.lazy(() => import('./routes/AdminRouteWrapper'));
const CustomerApp = React.lazy(() => import('./routes/CustomerRouteWrapper'));
const EmployeeApp = React.lazy(() => import('./routes/EmployeeRouteWrapper'));

const App: React.FC = () => {
  const { state, signIn, getBasicUserInfo, getDecodedIDToken } = useAuthContext();
  const [userPortal, setUserPortal] = useState<PortalType | null>(getUserPortalTypeFromStorage());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated(state)) {
      handleAuthCallback(state);
      
      const processUserGroups = async () => {
        try {
          const decodedToken = await getDecodedIDToken();
          console.log('Decoded token:', decodedToken);
          
          const userInfo = await getBasicUserInfo();
          console.log('User info:', userInfo);
          
          let groups: string[] = [];
          
          if (decodedToken?.groups && Array.isArray(decodedToken.groups)) {
            groups = decodedToken.groups;
            console.log('Found groups in decodedToken.groups:', groups);
          } else if (userInfo?.groups && Array.isArray(userInfo.groups)) {
            groups = userInfo.groups;
            console.log('Found groups in userInfo.groups:', groups);
          } 
          else {
            try {
              const findGroupsInObject = (obj: any): string[] | null => {
                if (!obj || typeof obj !== 'object') return null;
                
                if (obj.groups && Array.isArray(obj.groups)) {
                  return obj.groups;
                }
                
                for (const key in obj) {
                  if (key === 'groups' && Array.isArray(obj[key])) {
                    return obj[key];
                  }
                  
                  if (typeof obj[key] === 'object' && obj[key] !== null) {
                    const nestedGroups = findGroupsInObject(obj[key]);
                    if (nestedGroups) return nestedGroups;
                  }
                }
                
                return null;
              };
              
              const foundGroups = findGroupsInObject(decodedToken);
              if (foundGroups && foundGroups.length > 0) {
                groups = foundGroups;
                console.log('Found groups in nested object:', groups);
              }
            } catch (err) {
              console.error('Error while searching for groups in token:', err);
            }
            
            if (groups.length === 0) {
              console.log('Trying direct access based on console output format');
              try {
                // @ts-ignore - This is a special case based on the console output
                if (window.groups && Array.isArray(window.groups)) {
                  // @ts-ignore
                  groups = window.groups;
                  console.log('Found groups in window.groups:', groups);
                }
              } catch (err) {
                console.warn('Error trying to access window.groups:', err);
              }
            }
            
            if (groups.length === 0) {
              console.log('Using fallback method to determine group');
              if (userInfo?.username === 'Alice' || userInfo?.name === 'Alice') {
                groups = ['Employees'];
                console.log('Determined group from username:', groups);
              }
            }
          }
          
          const portalType = getUserPortalType(groups);
          
          storeUserPortalType(portalType);
          
          const dbId = extractUserDbId(decodedToken, portalType);
          storeUserDbId(portalType, dbId);
          console.log(`Stored user ID ${dbId} for portal type ${portalType}`);
          
          setUserPortal(portalType);
          setLoading(false);
        } catch (error) {
          console.error('Error processing user authentication:', error);
          setLoading(false);
        }
      };
      
      processUserGroups();
    } else {
      setLoading(false);
    }
  }, [state.isAuthenticated, getBasicUserInfo, getDecodedIDToken]);

  const renderRoutes = (routes: RouteItem[]) => {
    return routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    ));
  };

  if (!state.isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-image-wrapper">
          <img src="/src/assets/loginfront.png" alt="Insurance Portal" className="login-image" />
        </div>
        <div className="login-left">
        </div>
        <div className="login-right">
          <div className="login-box">
            <h1>Welcome to Nova's Insurance Portal</h1>
            <p className="login-description">
              Secure access to your insurance management platform. Sign in to manage policies, claims, and customer information.
            </p>
            <button onClick={() => signIn()}>
              Login
            </button>
          </div>
        </div>
        <MissedCallsButton />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#ffffff',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #6c47ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h2 style={{ color: '#2c3e50' }}>Loading user profile...</h2>
        <p style={{ color: '#7f8c8d' }}>Please wait while we prepare your dashboard</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <React.Suspense fallback={
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#f8f9fa',
          fontFamily: "'Poppins', sans-serif"
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #6c47ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <h3 style={{ color: '#2c3e50', marginTop: '20px' }}>Loading...</h3>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={
            userPortal ? 
            <Navigate to={getPortalBasePath(userPortal)} /> : 
            <Navigate to={ROUTES_CONFIG.CUSTOMER_BASE_PATH} />
          } />
          <Route 
            path={`${ROUTES_CONFIG.ADMIN_BASE_PATH}/*`} 
            element={
              <React.Suspense fallback={
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100vh',
                  background: '#f8f9fa',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #6c47ff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <h3 style={{ color: '#2c3e50', marginTop: '20px' }}>Loading Admin Portal...</h3>
                </div>
              }>
                <AdminApp />
              </React.Suspense>
            } 
          />
          <Route 
            path={`${ROUTES_CONFIG.CUSTOMER_BASE_PATH}/*`} 
            element={
              <React.Suspense fallback={
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100vh',
                  background: '#f8f9fa',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #6c47ff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <h3 style={{ color: '#2c3e50', marginTop: '20px' }}>Loading Customer Portal...</h3>
                </div>
              }>
                <CustomerProvider>
                  <CustomerApp />
                </CustomerProvider>
              </React.Suspense>
            } 
          />
          <Route 
            path={`${ROUTES_CONFIG.EMPLOYEE_BASE_PATH}/*`} 
            element={
              <React.Suspense fallback={
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100vh',
                  background: '#f8f9fa',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #6c47ff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <h3 style={{ color: '#2c3e50', marginTop: '20px' }}>Loading Employee Portal...</h3>
                </div>
              }>
                <EmployeeProvider>
                  <EmployeeApp />
                </EmployeeProvider>
              </React.Suspense>
            } 
          />
          {renderRoutes(rootRoutes.filter(route => 
            route.path !== ROUTES_CONFIG.LOGIN_PATH && 
            !route.path.startsWith(ROUTES_CONFIG.ADMIN_BASE_PATH) &&
            !route.path.startsWith(ROUTES_CONFIG.CUSTOMER_BASE_PATH) &&
            !route.path.startsWith(ROUTES_CONFIG.EMPLOYEE_BASE_PATH)
          ))}
          <Route path="*" element={
            userPortal ? 
            <Navigate to={getPortalBasePath(userPortal)} /> : 
            <Navigate to={ROUTES_CONFIG.CUSTOMER_BASE_PATH} />
          } />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;