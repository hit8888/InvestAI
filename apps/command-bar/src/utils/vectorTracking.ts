import { ENV } from '@neuraltrade/shared/constants/env';
import * as Sentry from '@sentry/react';

/**
 * Vector Pixel Tracking Utility
 *
 * This module provides functionality to load and initialize Vector tracking
 * pixel with proper deduplication and error handling.
 */

/* eslint-disable */
interface VectorWindow extends Window {
  vector?: {
    load: (pixelId: string) => void;
    identify: (data: any) => void;
    on: (event: string, handler: Function) => void;
    q?: Array<[string, any[]]>;
    loaded?: boolean;
    partnerId?: string;
  };
}
/* eslint-enable */

declare const window: VectorWindow;

// Vector Pixel ID - this should be configurable in production
const VECTOR_PIXEL_ID = ENV.VITE_VECTOR_PIXEL_ID;

/**
 * Loads the Vector tracking pixel script
 * This function is idempotent - it won't load the script multiple times
 */
const loadVectorScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Check if Vector is already loaded
      if (window.vector && window.vector.loaded) {
        resolve();
        return;
      }

      // Prevent multiple script includes
      if (window.vector) {
        resolve();
        return;
      }

      // Initialize Vector object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vector: any = {};
      vector.q = vector.q || [];

      // Create method stubs
      const methods = ['load', 'identify', 'on'];
      const factory = (method: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function (...params: any[]) {
          vector.q.push([method, params]);
        };
      };

      for (let i = 0; i < methods.length; i++) {
        const method = methods[i];
        vector[method] = factory(method);
      }

      window.vector = vector;

      if (!vector.loaded) {
        // Create and load the script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://cdn.vector.co/pixel.js';

        script.onload = () => {
          vector.loaded = true;
          resolve();
        };

        script.onerror = () => {
          reject(new Error('Failed to load Vector tracking script'));
        };

        document.head.appendChild(script);
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error loading Vector:', error);
      reject(error);
    }
  });
};

/**
 * Creates a composite identifier for Vector tracking
 */
const createCompositeId = (tenantId: string, prospectId: string): string => {
  return JSON.stringify({
    tenant_id: tenantId,
    prospect_id: prospectId,
  });
};

/**
 * Initializes Vector tracking with the provided tenant and prospect IDs
 * This function ensures tracking is only initialized once per session
 *
 * @param tenantId - The tenant identifier
 * @param prospectId - The prospect identifier
 */
export const initializeVectorTracking = async (tenantId: string, prospectId: string): Promise<void> => {
  try {
    // Load the Vector script
    await loadVectorScript();

    // Set the partner ID before calling load
    const compositeId = createCompositeId(tenantId, prospectId);
    window.vector!.partnerId = compositeId;

    // Initialize Vector with the pixel ID
    window.vector!.load(VECTOR_PIXEL_ID);
  } catch (error) {
    console.error('Failed to initialize Vector tracking:', error);
    throw error;
  }
};
