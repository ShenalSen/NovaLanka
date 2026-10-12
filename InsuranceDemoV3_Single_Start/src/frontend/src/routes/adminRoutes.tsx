import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/admin/Layout';
import Dashboard from '../portals/admin/pages/Dashboard';
import Policies from '../portals/admin/pages/Policies';
import CreatePolicy from '../portals/admin/pages/CreatePolicy';
import PolicyDetails from '../portals/admin/pages/PolicyDetails';
import Claims from '../portals/admin/pages/Claims';
import ClaimDetail from '../portals/admin/pages/ClaimDetail';
import Customers from '../portals/admin/pages/Customers';
import CustomerCreate from '../portals/admin/pages/CustomerCreate';
import Employees from '../portals/admin/pages/Employees';
import EmployeeCreate from '../portals/admin/pages/EmployeeCreate';
import EmployeeDetail from '../portals/admin/pages/EmployeeDetail';
import Products from '../portals/admin/pages/Products';
import ProductCreate from '../portals/admin/pages/ProductCreate';
import type { RouteItem } from '../types/types';

interface RouteWrapperProps {
  children: ReactNode;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const adminRoutes: RouteItem[] = [
  {
    path: 'dashboard',
    element: <RouteWrapper><Dashboard /></RouteWrapper>
  },
  {
    path: 'customers',
    element: <RouteWrapper><Customers /></RouteWrapper>
  },
  {
    path: 'customers/create',
    element: <RouteWrapper><CustomerCreate /></RouteWrapper>
  },
  {
    path: 'policies',
    element: <RouteWrapper><Policies /></RouteWrapper>
  },
  {
    path: 'policies/create',
    element: <RouteWrapper><CreatePolicy /></RouteWrapper>
  },
  {
    path: 'policies/:id',
    element: <RouteWrapper><PolicyDetails /></RouteWrapper>
  },
  {
    path: 'claims',
    element: <RouteWrapper><Claims /></RouteWrapper>
  },
  {
    path: 'claims/:id',
    element: <RouteWrapper><ClaimDetail /></RouteWrapper>
  },
  {
    path: 'employees',
    element: <RouteWrapper><Employees /></RouteWrapper>
  },
  {
    path: 'employees/create',
    element: <RouteWrapper><EmployeeCreate /></RouteWrapper>
  },
  {
    path: 'employees/:id',
    element: <RouteWrapper><EmployeeDetail /></RouteWrapper>
  },
  {
    path: 'products',
    element: <RouteWrapper><Products /></RouteWrapper>
  },
  {
    path: 'products/create',
    element: <RouteWrapper><ProductCreate /></RouteWrapper>
  },
  {
    path: '',
    element: <Navigate to="dashboard" />
  }
];

export default adminRoutes;
