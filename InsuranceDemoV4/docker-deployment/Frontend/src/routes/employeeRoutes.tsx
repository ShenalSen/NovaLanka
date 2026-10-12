import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/employee/Layout';
import Dashboard from '../portals/employee/pages/Dashboard';
import Policies from '../portals/employee/pages/Policies';
import Claims from '../portals/employee/pages/Claims';
import ClaimDetail from '../portals/employee/pages/ClaimDetail';
import Customers from '../portals/employee/pages/Customers';
import EmployeeDetail from '../portals/employee/pages/EmployeeDetail';
import Products from '../portals/employee/pages/Products';
import type { RouteItem } from '../types/types';

interface RouteWrapperProps {
  children: ReactNode;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const employeeRoutes: RouteItem[] = [
  {
    path: 'dashboard',
    element: <RouteWrapper><Dashboard /></RouteWrapper>
  },
  {
    path: 'customers',
    element: <RouteWrapper><Customers /></RouteWrapper>
  },
  {
    path: 'policies',
    element: <RouteWrapper><Policies /></RouteWrapper>
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
    path: 'employees/:id',
    element: <RouteWrapper><EmployeeDetail /></RouteWrapper>
  },
  {
    path: 'products',
    element: <RouteWrapper><Products /></RouteWrapper>
  },
  {
    path: 'employees',
    element: <RouteWrapper><Navigate to="007" /></RouteWrapper>
  },
  {
    path: 'profile',
    element: <RouteWrapper><EmployeeDetail /></RouteWrapper>
  },
  {
    path: '',
    element: <Navigate to="dashboard" />
  }
];

export default employeeRoutes;
