import { createContext, useContext, ReactNode, useMemo } from 'react';
import { getShadowRoot } from '../utils/dom-utils';

interface ShadowRootContextType {
  rootNodeId: string | null;
  shadowRoot: ShadowRoot | null;
}

const ShadowRootContext = createContext<ShadowRootContextType | null>(null);

interface ShadowRootProviderProps {
  rootNodeId: string | null;
  children: ReactNode;
}

const ShadowRootProvider = ({ rootNodeId, children }: ShadowRootProviderProps) => {
  const contextValue = useMemo(
    () => ({
      rootNodeId,
      shadowRoot: rootNodeId ? getShadowRoot(rootNodeId) : null,
    }),
    [rootNodeId],
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
