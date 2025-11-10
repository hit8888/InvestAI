import { useCallback, useMemo } from 'react';
import useAnalytics from '@meaku/core/hooks/useAnalytics';
import { useSessionStore } from '../stores/useSessionStore';

const useAdminEventAnalytics = () => {
  const tenantDetails = useSessionStore((state) => state.activeTenant);
  const userEmail = useSessionStore((state) => state.userInfo?.email);

  const { trackEvent } = useAnalytics();

  const commonProperties = useMemo(
    () => ({
      tenant_name: tenantDetails?.['tenant-name'],
      page_url: window.location.href,
      user_email: userEmail,
    }),
    [tenantDetails, userEmail],
  );

  const trackAdminEvent = useCallback(
    (eventName: string, properties: Record<string, unknown> = {}) => {
      trackEvent(eventName, { ...commonProperties, ...properties });
    },
    [trackEvent, commonProperties],
  );

  return { trackAdminEvent };
};

export default useAdminEventAnalytics;
