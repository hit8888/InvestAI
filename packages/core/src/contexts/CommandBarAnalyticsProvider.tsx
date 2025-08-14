import { useCallback, useRef, createContext, useContext, ReactNode } from 'react';

import useAnalytics from '@meaku/core/hooks/useAnalytics';

interface CommonProperties {
  tenant_name?: string;
  agent_id: string;
  session_id?: string;
  prospect_id?: string;
  page_url?: string;
  distinct_id?: string;
}

interface CommandBarAnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => void;
  updateCommonProperties: (updates: Partial<CommonProperties>) => void;
}

const CommandBarAnalyticsContext = createContext<CommandBarAnalyticsContextType | null>(null);

interface CommandBarAnalyticsProviderProps {
  children: ReactNode;
  initialProperties: CommonProperties;
}

const CommandBarAnalyticsProvider = ({ children, initialProperties }: CommandBarAnalyticsProviderProps) => {
  const { trackEvent: trackBaseEvent } = useAnalytics();
  const commonPropertiesRef = useRef<CommonProperties>(initialProperties);

  const updateCommonProperties = useCallback((updates: Partial<CommonProperties>) => {
    commonPropertiesRef.current = { ...commonPropertiesRef.current, ...updates };
  }, []);

  const trackEvent = useCallback(
    (eventName: string, properties: Record<string, unknown> = {}) => {
      const payload = {
        ...commonPropertiesRef.current,
        ...properties,
      };
      trackBaseEvent(eventName, payload);
    },
    [trackBaseEvent],
  );

  const contextValue = {
    trackEvent,
    updateCommonProperties,
  };

  return <CommandBarAnalyticsContext.Provider value={contextValue}>{children}</CommandBarAnalyticsContext.Provider>;
};

export const useCommandBarAnalytics = () => {
  const context = useContext(CommandBarAnalyticsContext);

  if (!context) {
    throw new Error('useCommandBarAnalytics must be used within CommandBarAnalyticsProvider');
  }

  return context;
};

export default CommandBarAnalyticsProvider;
