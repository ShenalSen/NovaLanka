import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../Login';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES_CONFIG } from '../types/routesConfig';
import type { RouteItem } from '../types/types';

const AdminApp = React.lazy(() => import('../routes/AdminRouteWrapper'));
const CustomerApp = React.lazy(() => import('../routes/CustomerRouteWrapper'));
const EmployeeApp = React.lazy(() => import('../routes/EmployeeRouteWrapper'));

const rootRoutes: RouteItem[] = [
  {
    path: ROUTES_CONFIG.LOGIN_PATH,
    element: <Login />
  },
  {
    path: `${ROUTES_CONFIG.ADMIN_BASE_PATH}/*`,
    element: (
      <ProtectedRoute portal="admin">
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminApp />
        </React.Suspense>
      </ProtectedRoute>
    )
  },
  {
    path: `${ROUTES_CONFIG.CUSTOMER_BASE_PATH}/*`,
    element: (
      <ProtectedRoute portal="customer">
        <React.Suspense fallback={<div>Loading...</div>}>
          <CustomerApp />
        </React.Suspense>
      </ProtectedRoute>
    )
  },
  {
    path: `${ROUTES_CONFIG.EMPLOYEE_BASE_PATH}/*`,
    element: (
      <ProtectedRoute portal="employee">
        <React.Suspense fallback={<div>Loading...</div>}>
          <EmployeeApp />
        </React.Suspense>
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to={ROUTES_CONFIG.LOGIN_PATH} />
  }
];

export default rootRoutes;
