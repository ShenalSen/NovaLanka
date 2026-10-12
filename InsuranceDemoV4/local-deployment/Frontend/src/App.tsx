import React, { useEffect, useState, useRef } from 'react';
import loginFront from './assets/loginfront.png';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import { ROUTES_CONFIG } from './types/routesConfig';
import type { RouteItem, PortalType } from './types/types';
import rootRoutes from './routes';
import InstantQuotePage from './portals/quotes/InstantQuotePage';
import BuyPolicyPage from './portals/purchase/BuyPolicyPage';
import PolicyPaymentPage from './portals/payments/PolicyPaymentPage';
import RenewPolicyPage from './portals/renewal/RenewPolicyPage';
import { type Currency, DEFAULT_CURRENCY, CURRENCY_OPTIONS } from './lib/utils/currency';
import { getUserDbId } from './lib/auth/authUtils';
import { getPolicyByCustomerId } from './lib/api/policiesApi';
import './asgardeoLogin.css';

/* ── Login Page Header Component ── */
interface LoginHeaderProps {
  onQuoteClick: () => void;
  onBuyPolicyClick: () => void;
  onPolicyPaymentClick: () => void;
  onRenewPolicyClick: () => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({
  onQuoteClick, onBuyPolicyClick, onPolicyPaymentClick, onRenewPolicyClick, currency, onCurrencyChange,
}) => {
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const paymentsRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paymentsRef.current && !paymentsRef.current.contains(e.target as Node))
        setPaymentsOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node))
        setCurrencyOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="login-header">
      <div className="login-header-brand">
        <span className="login-header-name">NOVA Insurance</span>
      </div>
      <nav className="login-header-nav">
        {/* Get a Quick Quote */}
        <button className="login-nav-btn" onClick={onQuoteClick}>
           Get a Quick Quote
        </button>

        {/* Payments dropdown */}
        <div className="login-nav-dropdown" ref={paymentsRef}>
          <button
            className="login-nav-btn login-nav-btn--outline"
            onClick={() => setPaymentsOpen(prev => !prev)}
          >
             Payments
            <span className={`login-nav-chevron${paymentsOpen ? ' open' : ''}`}>▾</span>
          </button>
          {paymentsOpen && (
            <div className="login-dropdown-menu">
              <button
                className="login-dropdown-item"
                onClick={() => { setPaymentsOpen(false); onBuyPolicyClick(); }}
              >
                <span className="login-dropdown-icon">📋</span>
                <div>
                  <div className="login-dropdown-label">Buy a Policy</div>
                  <div className="login-dropdown-desc">Purchase a new insurance policy</div>
                </div>
              </button>
              <button
                className="login-dropdown-item"
                onClick={() => { setPaymentsOpen(false); onPolicyPaymentClick(); }}
              >
                <span className="login-dropdown-icon">💰</span>
                <div>
                  <div className="login-dropdown-label">Policy Payments</div>
                  <div className="login-dropdown-desc">Make a payment for existing policy</div>
                </div>
              </button>
              <button
                className="login-dropdown-item"
                onClick={() => { setPaymentsOpen(false); onRenewPolicyClick(); }}
              >
                <span className="login-dropdown-icon">🔄</span>
                <div>
                  <div className="login-dropdown-label">Renew My Policy</div>
                  <div className="login-dropdown-desc">Extend your existing policy coverage</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Currency selector */}
        <div className="login-nav-dropdown" ref={currencyRef}>
          <button
            className="login-nav-btn login-nav-btn--currency"
            onClick={() => setCurrencyOpen(prev => !prev)}
          >
            {currency}
            <span className={`login-nav-chevron${currencyOpen ? ' open' : ''}`}>▾</span>
          </button>
          {currencyOpen && (
            <div className="login-dropdown-menu login-dropdown-menu--currency">
              {CURRENCY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`login-dropdown-item login-currency-item${currency === opt.value ? ' active' : ''}`}
                  onClick={() => { onCurrencyChange(opt.value); setCurrencyOpen(false); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
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

import MissedCallsButton from './components/common/MissedCallsButton';

/* ── Authenticated-only Renew Policy Route ── */
const RenewPolicyRoute: React.FC<{ currency: Currency }> = ({ currency }) => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const customerId = getUserDbId('customer');
    if (!customerId || !policyId) { navigate('/customer/policies'); return; }

    getPolicyByCustomerId(customerId)
      .then(res => {
        const policies: any[] = res.data?.Policies?.Policy ?? [];
        const owns = policies.some((p: any) => p.policy_id === policyId);
        owns ? setAuthorized(true) : navigate('/customer/policies');
      })
      .catch(() => navigate('/customer/policies'));
  }, [policyId]);

  if (authorized === null) return <div style={{ padding: '40px', textAlign: 'center' }}>Verifying access...</div>;
  return (
    <RenewPolicyPage
      policyId={policyId!}
      currency={currency}
      onBack={() => navigate('/customer/policies')}
    />
  );
};

// Portal lazy imports are handled inside rootRoutes 
const App: React.FC = () => {
  const { state, signIn, getDecodedIDToken } = useAuthContext();
  const [userPortal, setUserPortal] = useState<PortalType | null>(getUserPortalTypeFromStorage());
  const [loading, setLoading] = useState(true);
  const [showQuotePage, setShowQuotePage] = useState(false);
  const [showBuyPolicyPage, setShowBuyPolicyPage] = useState(false);
  const [showPolicyPaymentPage, setShowPolicyPaymentPage] = useState(false);
  const [pendingQuoteId, setPendingQuoteId] = useState<string | undefined>(undefined);
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    if (isAuthenticated(state)) {
      handleAuthCallback(state);
      
      const processUserGroups = async () => {
        try {
          const decodedToken = await getDecodedIDToken();

          const groups: string[] = Array.isArray(decodedToken?.groups) ? decodedToken.groups : [];
          const portalType = getUserPortalType(groups);

          if (portalType) {
            storeUserPortalType(portalType);
            const dbId = extractUserDbId(decodedToken, portalType);
            storeUserDbId(portalType, dbId);
          }

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
  }, [state.isAuthenticated, getDecodedIDToken]);

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
    if (showQuotePage) {
      return (
        <InstantQuotePage
          onBack={() => setShowQuotePage(false)}
          onBuyPolicy={(quoteId) => {
            setPendingQuoteId(quoteId);
            setShowQuotePage(false);
            setShowBuyPolicyPage(true);
          }}
          currency={currency}
        />
      );
    }
    if (showBuyPolicyPage) {
      return (
        <BuyPolicyPage
          onBack={() => { setShowBuyPolicyPage(false); setPendingQuoteId(undefined); }}
          currency={currency}
          initialQuoteId={pendingQuoteId}
        />
      );
    }
    if (showPolicyPaymentPage) {
      return <PolicyPaymentPage onBack={() => setShowPolicyPaymentPage(false)} currency={currency} />;
    }

    return (
      <div className="login-container">
        {/* ── Top Navigation Header ── */}
        <LoginHeader
          onQuoteClick={() => setShowQuotePage(true)}
          onBuyPolicyClick={() => setShowBuyPolicyPage(true)}
          onPolicyPaymentClick={() => setShowPolicyPaymentPage(true)}
          onRenewPolicyClick={() => signIn()}
          currency={currency}
          onCurrencyChange={setCurrency}
        />

        <div className="login-image-wrapper">
          <img src={loginFront} alt="Insurance Portal" className="login-image" />
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
          <Route path="/portal/renew/:policyId" element={<RenewPolicyRoute currency={currency} />} />
          <Route path="/home" element={
            userPortal
              ? <Navigate to={getPortalBasePath(userPortal)} />
              : <Navigate to="/" />
          } />
          {renderRoutes(rootRoutes.filter(route =>
            route.path !== ROUTES_CONFIG.LOGIN_PATH && route.path !== '*'
          ))}
          <Route path="*" element={
            userPortal
              ? <Navigate to={getPortalBasePath(userPortal)} />
              : <Navigate to="/" />
          } />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;