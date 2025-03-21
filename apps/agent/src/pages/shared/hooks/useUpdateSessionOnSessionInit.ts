import { trackError } from '../../../utils/error';
import { useCallback, useEffect, useRef } from 'react';
import useUpdateSession from '@meaku/core/queries/mutation/useUpdateSession';
import { UpdateSessionDataPayload, UpdateSessionDataPayloadSchema } from '@meaku/core/types/api/session_update_request';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';
import { useAppEventsHook } from '@meaku/core/hooks/useAppEventsHook';

const useUpdateSessionOnSessionInit = () => {
  const hasUpdatedSession = useRef(false);
  const pendingPayload = useRef<null | UpdateSessionDataPayload>(null);

  const manager = useSessionApiResponseManager();

  const sessionId = manager?.getSessionId() ?? '';

  const { mutateAsync: handleMutateSession } = useUpdateSession({
    onError: (error) => {
      trackError(error, {
        action: 'handleMutateSession',
        component: 'Chat',
        sessionId,
      });
    },
  });

  // Effect to send mutation when sessionId becomes available
  useEffect(() => {
    const sendPendingUpdate = async () => {
      if (hasUpdatedSession.current || !sessionId || !pendingPayload.current) return;

      hasUpdatedSession.current = true;
      await handleMutateSession({
        sessionId,
        payload: pendingPayload.current,
      });

      // Clear the pending payload after successful mutation
      pendingPayload.current = null;
    };

    sendPendingUpdate();
  }, [sessionId, handleMutateSession]);

  const handleMessagePassing = useCallback(
    async (event: MessageEvent) => {
      const type = event.data?.type;

      if (type !== 'INIT') return;

      // Prevent multiple updates
      if (hasUpdatedSession.current) return;

      const payload = event.data.payload;

      const validatedPayload = UpdateSessionDataPayloadSchema.safeParse({
        query_params: payload?.utmParams,
        referrer: payload?.http_referrer,
        parent_url: payload?.url,
      });

      if (!validatedPayload.success) {
        trackError(validatedPayload.error, {
          action: 'handleMessagePassing | UpdateSessionDataPayloadSchema',
          component: 'Chat',
        });
        return;
      }

      // Store the validated payload
      pendingPayload.current = validatedPayload.data;

      // Only send mutation if sessionId is available
      if (sessionId) {
        hasUpdatedSession.current = true;
        await handleMutateSession({ sessionId, payload: validatedPayload.data });
        pendingPayload.current = null;
      }
    },
    [handleMutateSession, sessionId],
  );

  useAppEventsHook(handleMessagePassing);
};

export { useUpdateSessionOnSessionInit };
