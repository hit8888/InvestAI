import { ApiProviderContext } from '@meaku/core/contexts/Context';
import { useContextSelector } from 'use-context-selector';
import useWebSocketChat from '../../../hooks/useWebSocketChat.tsx';
import { useSearchParams } from 'react-router-dom';
import AgentInOpenState from '../AgentView/AgentInOpenState.tsx';
import Backdrop from '@breakout/design-system/components/layout/backdrop';
import { useEffect } from 'react';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';

const Feedback = () => {
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);
  const [searchParams] = useSearchParams();
  const { handleSendUserMessage } = useWebSocketChat();
  const manager = useSessionApiResponseManager();

  const page_url = searchParams.get('url') || undefined;

  const handleSendMessage = (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => {
    handleSendUserMessage(data);
  };

  const fetchSessionData = () => {
    if (manager?.getSessionId()) return;
    sessionQuery.refetch();
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  return (
    <Backdrop
      landingPageUrl={page_url}
      className="relative mt-6 flex h-screen flex-col items-center justify-start font-inter"
    >
      <div className="flex h-[95vh] w-[98vw]">
        <AgentInOpenState handleSendMessage={handleSendMessage} isCollapsible={true} />
      </div>
    </Backdrop>
  );
};

export default Feedback;
