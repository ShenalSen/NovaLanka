import type { ReactNode } from 'react';

export interface RouteItem {
  path: string;
  element: ReactNode;
  children?: RouteItem[];
}

export type PortalType = 'admin' | 'customer' | 'employee';

export interface ProtectedRouteProps {
  portal: PortalType;
  children: ReactNode;
}
