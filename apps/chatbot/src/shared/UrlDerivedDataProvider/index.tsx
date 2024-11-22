import React, { ReactNode } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { useLocation } from 'react-router-dom';

const ADMIN_PATHS = ['/demo/', '/debug/'];
const READONLY_PATHS = ['/debug/'];

interface UrlDerivedDataContextProps {
  isAdmin: boolean;
  allowFeedback: boolean;
  areMessagesReadonly: boolean;
}

const UrlDerivedDataContext = createContext<UrlDerivedDataContextProps>({
  isAdmin: false,
  allowFeedback: false,
  areMessagesReadonly: false,
});

interface UrlDerivedDataProviderProps {
  children: ReactNode;
}

const UrlDerivedDataProvider: React.FC<UrlDerivedDataProviderProps> = ({ children }) => {
  const { pathname } = useLocation();

  const isAdmin = ADMIN_PATHS.some((path) => pathname.startsWith(path));
  const isReadOnly = READONLY_PATHS.some((path) => pathname.startsWith(path));

  const contextValue = {
    isAdmin: isAdmin,
    allowFeedback: isAdmin,
    areMessagesReadonly: isReadOnly,
  };

  console.log({ contextValue: contextValue });

  return <UrlDerivedDataContext.Provider value={contextValue}>{children}</UrlDerivedDataContext.Provider>;
};

export default UrlDerivedDataProvider;

export const useIsAdmin = () => useContextSelector(UrlDerivedDataContext, (context) => context.isAdmin);

export const useAllowFeedback = () => useContextSelector(UrlDerivedDataContext, (context) => context.allowFeedback);

export const useAreMessagesReadonly = () =>
  useContextSelector(UrlDerivedDataContext, (context) => context.areMessagesReadonly);
