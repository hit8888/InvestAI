import { createContext, useContext, ReactNode, useMemo } from 'react';

interface ShadowRootContextType {
  hostId: string | null;
  fallbackRoot: HTMLElement;
  root: ShadowRoot | null;
}

export const ShadowRootContext = createContext<ShadowRootContextType | null>(null);

interface ShadowRootProviderProps {
  hostId: string | null;
  fallbackRootId?: string;
  children: ReactNode;
}

function getShadowRoot(webComponentTag: string): ShadowRoot | null {
  const host = document.querySelector(webComponentTag);
  return host?.shadowRoot || null;
}

const ShadowRootProvider = ({ hostId, fallbackRootId, children }: ShadowRootProviderProps) => {
  const contextValue = useMemo(
    () => ({
      hostId,
      fallbackRoot: (fallbackRootId && document.getElementById(fallbackRootId)) || document.body,
      root: hostId ? getShadowRoot(hostId) : null,
    }),
    [hostId, fallbackRootId],
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
