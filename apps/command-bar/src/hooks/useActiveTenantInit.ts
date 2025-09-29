import { useRef } from 'react';
import { setTenantHeader } from '@meaku/core/http/client';
import { setActiveTenantData } from '@meaku/core/utils/storage-utils';

interface UseActiveTenantInitProps {
  tenantId?: string;
  agentId?: string;
}

/**
 * Custom hook to initialize the active tenant context by setting tenant header
 * and active tenant data before any other operations that depend on tenant context.
 *
 * This hook runs synchronously during render to guarantee proper initialization order.
 */
export const useActiveTenantInit = ({ tenantId, agentId }: UseActiveTenantInitProps): void => {
  // Track if tenant setup has been initialized
  const isSetupDone = useRef(false);

  // Initialize tenant setup synchronously if not already done
  if (!isSetupDone.current && tenantId && agentId) {
    setTenantHeader(tenantId);
    setActiveTenantData(tenantId, agentId);
    isSetupDone.current = true;
  }
};
