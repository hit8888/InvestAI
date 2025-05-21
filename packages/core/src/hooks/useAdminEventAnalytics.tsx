import { useCallback, useMemo } from 'react';
import useAnalytics from '@meaku/core/hooks/useAnalytics';
import { getTenantIdentifier, getUserEmailFromLocalStorage } from '../utils';

const useAdminEventAnalytics = () => {
  const tenantDetails = getTenantIdentifier();
  const userEmail = getUserEmailFromLocalStorage();
  const { trackEvent } = useAnalytics();

  const commonProperties = useMemo(
    () => ({
      orgName: tenantDetails?.name,
      agentId: tenantDetails?.agentId,
      url: window.location.href,
      userEmail,
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
