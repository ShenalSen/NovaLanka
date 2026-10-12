import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import rootRoutes from './index';
import type { RouteItem } from '../types/types';

const App: React.FC = () => {
  const renderRoutes = (routes: RouteItem[]) => {
    return routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    ));
  };

  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(rootRoutes)}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
