import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from '../styles/GlobalStyles';
import employeeRoutes from './employeeRoutes';
import type { RouteItem } from '../types/types';
import { EmployeeProvider } from '../lib/auth/employeeContext';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const EmployeeRouteWrapper: React.FC = () => {
  return (
    <EmployeeProvider>
      <AppContainer>
        <GlobalStyles />
        <Routes>
          {employeeRoutes.map((route: RouteItem) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </AppContainer>
    </EmployeeProvider>
  );
};

export default EmployeeRouteWrapper;
