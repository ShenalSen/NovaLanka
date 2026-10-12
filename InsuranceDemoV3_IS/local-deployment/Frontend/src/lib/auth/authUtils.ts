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
export const getUserPortalType = (groups: string[]): PortalType => {
  console.log('Determining user portal type from groups:', groups);
  
  if (!groups || groups.length === 0) {
    console.log('No groups found, defaulting to customer portal');
    return 'customer';
  }
  
  if (groups.includes('admin')) {
    console.log('User belongs to admin group, redirecting to admin portal');
    return 'admin';
  } else if (groups.includes('Employees')) {
    console.log('User belongs to Employees group, redirecting to employee portal');
    return 'employee';
  } else if (groups.includes('Customers')) {
    console.log('User belongs to Customers group, redirecting to customer portal');
    return 'customer';
  }
  
  console.log('User has groups but none match expected values, defaulting to customer portal');
  return 'customer';
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

export const storeUserPortalType = (portalType: PortalType): void => {
  sessionStorage.setItem(ROUTES_CONFIG.USER_STORAGE_KEY, portalType);
};

export const getUserPortalTypeFromStorage = (): PortalType | null => {
  const portalType = sessionStorage.getItem(ROUTES_CONFIG.USER_STORAGE_KEY) as PortalType | null;
  return portalType;
};
export const extractUserDbId = (decodedToken: any, userPortal: PortalType): string => {
  if (userPortal === 'admin') {
    console.log('Admin portal does not use db_id, using default admin ID');
    return getDefaultId(userPortal);
  }
  
  if (!decodedToken) {
    console.error('No decoded token provided');
    return getDefaultId(userPortal);
  }
  
  if (decodedToken.db_id) {
    console.log('Found db_id directly in token:', decodedToken.db_id);
    return decodedToken.db_id;
  }
  
  const findDbIdInObject = (obj: any): string | null => {
    if (!obj || typeof obj !== 'object') return null;
    
    if (obj.db_id) {
      return obj.db_id;
    }
    
    for (const key in obj) {
      if (key === 'db_id') {
        return obj[key];
      }
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const nestedDbId = findDbIdInObject(obj[key]);
        if (nestedDbId) return nestedDbId;
      }
    }
    
    return null;
  };
  
  const dbId = findDbIdInObject(decodedToken);
  if (dbId) {
    console.log('Found db_id in nested property:', dbId);
    return dbId;
  }
  
  console.error('Could not find db_id in token, using default ID');
  return getDefaultId(userPortal);
};
const getDefaultId = (portalType: PortalType): string => {
  switch (portalType) {
    case 'admin':
      return 'A_001';
    case 'employee':
      return 'E_001';
    case 'customer':
      return 'C_002';
    default:
      return 'C_002';
  }
};

export const storeUserDbId = (userType: PortalType, dbId: string): void => {
  if (userType === 'admin') {
    console.log('Admin portal does not use db_id, not storing ID');
    return;
  }
  
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
