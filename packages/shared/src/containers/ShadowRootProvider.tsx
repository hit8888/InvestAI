import { createContext, useContext, ReactNode, useMemo } from 'react';
import { getShadowRoot } from '../utils/dom-utils';

interface ShadowRootContextType {
  hostId: string | null;
  root: ShadowRoot | null;
}

const ShadowRootContext = createContext<ShadowRootContextType | null>(null);

interface ShadowRootProviderProps {
  hostId: string | null;
  children: ReactNode;
}

const ShadowRootProvider = ({ hostId, children }: ShadowRootProviderProps) => {
  const contextValue = useMemo(
    () => ({
      hostId,
      root: hostId ? getShadowRoot(hostId) : null,
    }),
    [hostId],
  );

  return <ShadowRootContext.Provider value={contextValue}>{children}</ShadowRootContext.Provider>;
};

export const useShadowRoot = () => {
  const context = useContext(ShadowRootContext);

  if (!context) {
    throw new Error('useShadowRoot must be used within ShadowRootProvider');
  }

  return context;
};

export default ShadowRootProvider;
