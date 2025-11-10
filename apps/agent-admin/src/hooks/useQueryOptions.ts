import { useMemo } from 'react';
import { keepPreviousData } from '@tanstack/react-query';
import { useSessionStore } from '../stores/useSessionStore';

interface UseQueryOptionsProps {
  cacheTime?: number;
  enabled?: boolean;
}

export const useQueryOptions = ({
  cacheTime = 300000, // 5 minutes default
  enabled: customEnabled,
}: UseQueryOptionsProps = {}) => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  return useMemo(
    () => ({
      enabled: customEnabled !== undefined ? !!tenantName && customEnabled : !!tenantName,
      placeholderData: keepPreviousData,
      cacheTime,
    }),
    [tenantName, cacheTime, customEnabled],
  );
};
