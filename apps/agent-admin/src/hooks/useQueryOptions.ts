import { useMemo } from 'react';
import { keepPreviousData } from '@tanstack/react-query';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

interface UseQueryOptionsProps {
  cacheTime?: number;
  enabled?: boolean;
}

export const useQueryOptions = ({
  cacheTime = 300000, // 5 minutes default
  enabled: customEnabled,
}: UseQueryOptionsProps = {}) => {
  const tenantName = getTenantFromLocalStorage();
  return useMemo(
    () => ({
      enabled: customEnabled !== undefined ? !!tenantName && customEnabled : !!tenantName,
      placeholderData: keepPreviousData,
      cacheTime,
    }),
    [tenantName, cacheTime, customEnabled],
  );
};
