import React, { createContext, useContext } from 'react';
import { useUrlParams } from '../hooks/useUrlParams';
import { useAvailability } from '../hooks/useAvailability';

interface AppContextType {
  state: ReturnType<typeof useUrlParams>;
  availability: ReturnType<typeof useAvailability>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const state = useUrlParams();
  const availability = useAvailability(state.selectedPeople);

  console.log("time ", availability);
  return (
    <AppContext.Provider value={{ state, availability }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}