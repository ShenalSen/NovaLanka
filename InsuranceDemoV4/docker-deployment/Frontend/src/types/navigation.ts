import type { ReactNode } from 'react';

export interface NavRoute {
  path: string;
  label: string;
  icon: ReactNode;
  requiresAuth?: boolean;
}

export type PortalType = 'admin' | 'employee' | '';
