import React, { createContext, useContext, ReactNode } from 'react';
// Make sure to export `LocationData` from your useLocation hook file
import { useLocation, LocationData } from '../hooks/useLocation'; 

// The context will provide the return value of the useLocation hook
const LocationContext = createContext<LocationData | undefined>(undefined);

// The provider component that will wrap our app
export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};

// A custom hook to easily access the location context in any component
export const useSharedLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useSharedLocation must be used within a LocationProvider');
  }
  return context;
};
