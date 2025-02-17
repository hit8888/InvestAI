import useUnifiedConfigurationResponseManager from './useUnifiedConfigurationResponseManager';
import { useIsAdmin } from '../contexts/UrlDerivedDataProvider';
import { WebSocketMessage, BaseMessageContent, EventMessageContent } from '../types';

type MessagePayloadParams = {
  message: BaseMessageContent | EventMessageContent;
  response_id: string;
  message_type: WebSocketMessage['message_type'];
};

const useGetMessagePayload = () => {
  const is_admin = useIsAdmin();

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const session_id = unifiedConfigurationResponseManager.getSessionId() ?? '';

  const getMessagePayload = ({ message, response_id, message_type }: MessagePayloadParams): WebSocketMessage => {
    const basePayload = {
      session_id,
      response_id,
      role: 'user' as const,
      is_admin,
      timestamp: new Date().toISOString(),
      message_type,
      message,
    };

    if (message_type === 'EVENT') {
      return basePayload as WebSocketMessage & { message_type: 'EVENT' };
    }

    return basePayload as WebSocketMessage & { message_type: typeof message_type };
  };

  return getMessagePayload;
};

export default useGetMessagePayload;
