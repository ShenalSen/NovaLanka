import type { BasicUserInfo } from "@asgardeo/auth-react";
import { ROUTES_CONFIG } from "../../types/routesConfig";
import type { PortalType } from "../../types/types";

const USER_ID_STORAGE_KEY = 'userDbId';

export const handleAuthCallback = (state: any): void => {
  if (state?.isAuthenticated) {
    console.log('Authentication successful');
  }
};

export const getUserProfile = async (getBasicUserInfo: () => Promise<BasicUserInfo>): Promise<BasicUserInfo | null> => {
  try {
    const userInfo = await getBasicUserInfo();
    return userInfo;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const isAuthenticated = (state: any): boolean => {
  return !!state?.isAuthenticated;
};
export const getUserPortalType = (groups: string[]): PortalType | null => {
  if (!groups || groups.length === 0) return null;

  if (groups.includes('admin') || groups.includes('admins')) return 'admin';
  if (groups.includes('Employees')) return 'employee';
  if (groups.includes('Customers')) return 'customer';

  // Fail closed — unrecognised group gets no portal access
  return null;
};
export const getPortalBasePath = (portalType: PortalType): string => {
  switch (portalType) {
    case 'admin':
      return ROUTES_CONFIG.ADMIN_BASE_PATH;
    case 'employee':
      return ROUTES_CONFIG.EMPLOYEE_BASE_PATH;
    case 'customer':
      return ROUTES_CONFIG.CUSTOMER_BASE_PATH;
    default:
      return ROUTES_CONFIG.CUSTOMER_BASE_PATH;
  }
};

export const storeUserPortalType = (portalType: PortalType | null): void => {
  if (portalType) sessionStorage.setItem(ROUTES_CONFIG.USER_STORAGE_KEY, portalType);
};

export const getUserPortalTypeFromStorage = (): PortalType | null => {
  const portalType = sessionStorage.getItem(ROUTES_CONFIG.USER_STORAGE_KEY) as PortalType | null;
  return portalType;
};
export const extractUserDbId = (decodedToken: any, userPortal: PortalType): string | null => {
  if (userPortal === 'admin') return null;
  if (!decodedToken?.db_id) {
    console.error('db_id claim missing from ID token');
    return null;
  }
  return decodedToken.db_id;
};

export const storeUserDbId = (userType: PortalType, dbId: string | null): void => {
  if (userType === 'admin' || !dbId) return;
  
  const key = `${USER_ID_STORAGE_KEY}_${userType}`;
  sessionStorage.setItem(key, dbId);
  
  try {
    const event = new CustomEvent('userDbIdChanged', { 
      detail: { userType, dbId } 
    });
    window.dispatchEvent(event);
    console.log(`Dispatched userDbIdChanged event for ${userType} with ID ${dbId}`);
  } catch (error) {
    console.error('Failed to dispatch userDbIdChanged event:', error);
  }
};
export const getUserDbId = (userType: PortalType): string | null => {
  const id = sessionStorage.getItem(`${USER_ID_STORAGE_KEY}_${userType}`);
  if (process.env.NODE_ENV === 'development') {
    const lastLoggedId = sessionStorage.getItem(`lastLogged_${userType}_id`);
    if (id !== lastLoggedId) {
      console.log(`Getting ${userType} ID from storage:`, id);
      if (id) sessionStorage.setItem(`lastLogged_${userType}_id`, id);
    }
  }
  return id;
};
