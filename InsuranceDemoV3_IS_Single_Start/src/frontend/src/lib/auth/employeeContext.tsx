import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getUserDbId } from './authUtils';

interface EmployeeContextType {
  employeeId: string | null;
}

const defaultEmployeeContext: EmployeeContextType = {
  employeeId: null
};

export const EmployeeContext = createContext<EmployeeContextType>(defaultEmployeeContext);

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [employeeId, setEmployeeId] = useState<string | null>(getUserDbId('employee') || 'E_001');

  useEffect(() => {
    const updateIdFromStorage = () => {
      const id = getUserDbId('employee');
      if (id !== employeeId) {
        console.log('EmployeeContext: Updating from storage, id =', id);
        if (id) {
          setEmployeeId(id);
        } else {
          setEmployeeId('E_001');
        }
      }
    };

    updateIdFromStorage();

    window.addEventListener('storage', updateIdFromStorage);
    
    const handleCustomEvent = (e: any) => {
      if (e.detail?.userType === 'employee') {
        console.log('EmployeeContext: Received custom event with ID', e.detail.dbId);
        setEmployeeId(e.detail.dbId);
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
    employeeId
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => useContext(EmployeeContext);
