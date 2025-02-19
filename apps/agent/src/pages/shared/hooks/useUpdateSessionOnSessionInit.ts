import { trackError } from '../../../utils/error';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useUpdateSession from '@meaku/core/queries/mutation/useUpdateSession';
import { AgentParams } from '@meaku/core/types/config';
import { UpdateSessionDataPayloadSchema } from '@meaku/core/types/api/session_update_request';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';

const useUpdateSessionOnSessionInit = () => {
  const { agentId = '' } = useParams<AgentParams>();

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

  useEffect(() => {
    const handleMessagePassing = async (event: MessageEvent) => {
      const type = event.data?.type;

      if (type !== 'INIT') return;

      const payload = event.data.payload;

      const validatedPayload = UpdateSessionDataPayloadSchema.safeParse(payload);

      if (!validatedPayload.success) {
        trackError(validatedPayload.error, {
          action: 'handleMessagePassing | UpdateSessionDataPayloadSchema',
          component: 'Chat',
        });
        return;
      }

      try {
        window.top?.postMessage({ type: 'CHAT_READY' }, '*');
      } catch (error) {
        trackError(error, {
          action: 'handleMessagePassing | postMessage',
          component: 'Chat',
          sessionId,
        });
      }

      await handleMutateSession({ sessionId, agentId, payload: validatedPayload.data });
    };

    window.addEventListener('message', handleMessagePassing);

    return () => {
      window.removeEventListener('message', handleMessagePassing);
    };
  }, [agentId, handleMutateSession, sessionId]);
};

export { useUpdateSessionOnSessionInit };
