import React, { ReactNode } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { useLocation } from "react-router-dom";

const ADMIN_PATHS = ["/demo/"];
const READONLY_PATHS = [""];

interface UrlDerivedDataContextProps {
  isAdmin: boolean;
  areMessagesReadonly: boolean;
}

const UrlDerivedDataContext = createContext<UrlDerivedDataContextProps>({
  isAdmin: false,
  areMessagesReadonly: false,
});

interface UrlDerivedDataProviderProps {
  children: ReactNode;
}

const UrlDerivedDataProvider: React.FC<UrlDerivedDataProviderProps> = ({
  children,
}) => {
  const { pathname } = useLocation();

  const isAdmin = ADMIN_PATHS.some((path) => pathname.startsWith(path));
  const isReadOnly = READONLY_PATHS.some((path) => pathname.startsWith(path));

  const contextValue = {
    isAdmin: isAdmin,
    areMessagesReadonly: isReadOnly,
  };

  return (
    <UrlDerivedDataContext.Provider value={contextValue}>
      {children}
    </UrlDerivedDataContext.Provider>
  );
};

export default UrlDerivedDataProvider;

export const useIsAdmin = () =>
  useContextSelector(UrlDerivedDataContext, (context) => context.isAdmin);

export const useAreMessagesReadonly = () =>
  useContextSelector(
    UrlDerivedDataContext,
    (context) => context.areMessagesReadonly
  );
