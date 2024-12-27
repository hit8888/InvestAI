import useUnifiedConfigurationResponseManager from '../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { useIsAdmin } from '../shared/UrlDerivedDataProvider';

export interface IUseGetMessagePayload {
  message: string;
  eventType?: string;
  eventData?: Record<string, unknown>;
  messageId: string;
}

const useGetMessagePayload = () => {
  const isAdmin = useIsAdmin();

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const sessionId = unifiedConfigurationResponseManager.getSessionId() ?? '';

  const getMessagePayload = ({ message, eventType, eventData, messageId }: IUseGetMessagePayload) => {
    const payload = {
      session_id: sessionId,
      message: message ?? '',
      response_id: messageId,
      event_type: eventType ?? '',
      event_data: eventData ?? {},
      is_admin: isAdmin,
    };

    return payload;
  };

  return getMessagePayload;
};

export default useGetMessagePayload;
