import { useIsAdmin } from '../contexts/UrlDerivedDataProvider';
import { WebSocketMessage, BaseMessageContent, EventMessageContent, MessageSenderRole } from '../types';
import useSessionApiResponseManager from './useSessionApiResponseManager';

type MessagePayloadParams = {
  message: BaseMessageContent | EventMessageContent;
  response_id: string;
  message_type: WebSocketMessage['message_type'];
  role?: MessageSenderRole;
};

const useGetMessagePayload = () => {
  const is_admin = useIsAdmin();

  const sessionApiResponseManager = useSessionApiResponseManager();
  const session_id = sessionApiResponseManager ? sessionApiResponseManager.getSessionId() : '';

  const getMessagePayload = ({
    message,
    response_id,
    message_type,
    role = MessageSenderRole.USER,
  }: MessagePayloadParams): WebSocketMessage => {
    const basePayload = {
      session_id,
      response_id,
      role,
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
