import React, { createContext, useContext, useState } from 'react';
import { Intent } from '~/Widget';

interface IntentContextType {
  intent: Intent;
  setIntent: (newIntent: Intent) => void;
  updateIntent: <K extends keyof Intent>(key: K, value: Intent[K]) => void;
}

const IntentContext = createContext<IntentContextType | undefined>(undefined);

export const useIntent = () => {
  const context = useContext(IntentContext);
  if (!context) {
    throw new Error('useIntent must be used within an IntentProvider');
  }
  return context;
};

interface IntentProviderProps {
  children: React.ReactNode;
}

export const IntentProvider: React.FC<IntentProviderProps> = ({ children }) => {
  const [intent, setIntent] = useState<Intent>({});

  const updateIntent = <K extends keyof Intent>(key: K, value: Intent[K]) => {
    setIntent((prev) => {
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  return (
    <IntentContext.Provider value={{ intent, setIntent, updateIntent }}>
      {children}
    </IntentContext.Provider>
  );
}; 