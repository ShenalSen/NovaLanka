import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyles from '../styles/GlobalStyles';
import adminRoutes from './adminRoutes';
import type { RouteItem } from '../types/types';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const AdminRouteWrapper: React.FC = () => {
  return (
    <AppContainer>
      <GlobalStyles />
      <Routes>
        {adminRoutes.map((route: RouteItem) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </AppContainer>
  );
};

export default AdminRouteWrapper;
