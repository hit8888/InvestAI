import { useEffect } from 'react';
import { initializeVectorTracking } from '../utils/vectorTracking';
import * as Sentry from '@sentry/react';

interface UseVectorTrackingProps {
  tenantId?: string;
  prospectId?: string;
  enabled?: boolean;
}

// When Vector is initialised, this key is stored in local storage
const VECTOR_VISITOR_ID_KEY = 'vector_visitor_id';
const getVectorVisitorId = () => {
  try {
    return localStorage.getItem(VECTOR_VISITOR_ID_KEY);
  } catch (error) {
    console.error('Failed to get vector visitor id:', error);
    return null;
  }
};

/**
 * Custom hook to manage Vector tracking initialization
 *
 * This hook ensures that Vector tracking is initialized only once when
 * both tenantId and prospectId are available. It handles the lifecycle
 * and prevents duplicate initialization calls.
 *
 * @param tenantId - The tenant identifier
 * @param prospectId - The prospect identifier
 * @param enabled - Whether tracking should be enabled (default: true)
 */
export const useVectorTracking = ({ tenantId, prospectId, enabled = true }: UseVectorTrackingProps) => {
  const vectorVisitorId = getVectorVisitorId();
  useEffect(() => {
    // Early return if tracking is disabled or we don't have both required IDs or have any existing vector visitor id
    if (!enabled || !tenantId || !prospectId || vectorVisitorId) {
      return;
    }

    // Initialize Vector tracking
    initializeVectorTracking(tenantId, prospectId).catch((error) => {
      Sentry.captureException(error);
      console.error('Failed to initialize Vector tracking in hook:', error);
    });
  }, [tenantId, prospectId, enabled, vectorVisitorId]);
};
