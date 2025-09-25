import React, { useState } from 'react';
import * as Sentry from '@sentry/react';
import { ENV } from '@meaku/core/types/env';

interface SentryErrorBoundaryProps {
  children: React.ReactNode;
  hostId?: string | null;
  tenantId?: string | null;
}

const MAX_RETRY_COUNT = 3;

const SentryErrorBoundary: React.FC<SentryErrorBoundaryProps> = ({ children, hostId, tenantId }) => {
  const [retryCount, setRetryCount] = useState(0);

  const handleError = (_: unknown, __: string | undefined, eventId: string) => {
    if (retryCount < MAX_RETRY_COUNT) {
      // Increment retry count to force a re-render
      setRetryCount((prev) => prev + 1);

      // Log retry attempt
      console.warn(`Retrying after error (attempt ${retryCount + 1}/${MAX_RETRY_COUNT}). Event ID: ${eventId}`);
    }
  };

  return (
    <React.Fragment key={retryCount}>
      <Sentry.ErrorBoundary
        fallback={<></>}
        onError={handleError}
        beforeCapture={(scope) => {
          // ---- Tags for filtering ----
          scope.setTag('component', 'SentryErrorBoundary');
          scope.setTag('hostId', hostId ?? 'unknown');
          scope.setTag('tenantId', tenantId ?? 'unknown');

          // ---- App / environment info ----
          scope.setContext('app', {
            environment: ENV.VITE_APP_ENV,
            retryCount: retryCount.toString(),
          });
        }}
      >
        {children}
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
};

export default SentryErrorBoundary;
