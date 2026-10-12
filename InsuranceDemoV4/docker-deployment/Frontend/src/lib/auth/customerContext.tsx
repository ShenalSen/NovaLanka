import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getUserDbId } from './authUtils';

interface CustomerContextType {
  customerId: string | null;
}

const defaultCustomerContext: CustomerContextType = {
  customerId: null
};

export const CustomerContext = createContext<CustomerContextType>(defaultCustomerContext);

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [customerId, setCustomerId] = useState<string | null>(getUserDbId('customer') || 'C_002');

  useEffect(() => {
    const updateIdFromStorage = () => {
      const id = getUserDbId('customer');
      if (id !== customerId) {
        console.log('CustomerContext: Updating from storage, id =', id);
        if (id) {
          setCustomerId(id);
        } else {
          setCustomerId('C_002');
        }
      }
    };
    updateIdFromStorage();

    window.addEventListener('storage', updateIdFromStorage);
    
    const handleCustomEvent = (e: any) => {
      if (e.detail?.userType === 'customer') {
        console.log('CustomerContext: Received custom event with ID', e.detail.dbId);
        setCustomerId(e.detail.dbId);
      }
    };
    
    window.addEventListener('userDbIdChanged', handleCustomEvent as EventListener);
    
    const interval = setInterval(updateIdFromStorage, 5000);
    
    return () => {
      window.removeEventListener('storage', updateIdFromStorage);
      window.removeEventListener('userDbIdChanged', handleCustomEvent as EventListener);
      clearInterval(interval);
    };
  }, []);

  const value = {
    customerId
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);
