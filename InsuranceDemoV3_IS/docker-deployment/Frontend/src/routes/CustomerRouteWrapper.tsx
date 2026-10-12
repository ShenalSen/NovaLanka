import React from 'react';
import { Routes, Route } from 'react-router-dom';
import customerRoutes from './customerRoutes';
import type { RouteItem } from '../types/types';

const CustomerRouteWrapper: React.FC = () => {
  const renderRoutes = (routes: RouteItem[]) => {
    return routes.map((route) => {
      if (route.children) {
        return (
          <Route key={route.path} path={route.path} element={route.element}>
            {renderRoutes(route.children)}
          </Route>
        );
      }
      return (
        <Route key={route.path} path={route.path} element={route.element} />
      );
    });
  };

  return (
    <Routes>
      {renderRoutes(customerRoutes)}
    </Routes>
  );
};

export default CustomerRouteWrapper;
