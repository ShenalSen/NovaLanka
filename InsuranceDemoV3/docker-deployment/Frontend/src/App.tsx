import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import rootRoutes from './routes';
import type { RouteItem } from './types/types';

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
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {renderRoutes(rootRoutes)}
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;