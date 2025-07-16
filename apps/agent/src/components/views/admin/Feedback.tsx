import { ApiProviderContext } from '@meaku/core/contexts/Context';
import { useContextSelector } from 'use-context-selector';
import useWebSocketChat from '../../../hooks/useWebSocketChat.tsx';
import { useSearchParams } from 'react-router-dom';
import AgentInOpenState from '../AgentView/AgentInOpenState.tsx';
import Backdrop from '@breakout/design-system/components/layout/backdrop';
import { useEffect } from 'react';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';
import useSendMessageOnQueryParams from '@meaku/core/hooks/useSendMessageOnQueryParams';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { cn } from '@breakout/design-system/lib/cn';

const Feedback = () => {
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);
  const [searchParams] = useSearchParams();
  const { handleSendUserMessage } = useWebSocketChat();
  const manager = useSessionApiResponseManager();
  const isMobile = useIsMobile();

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

  useSendMessageOnQueryParams({ handleSendMessage });

  return (
    <Backdrop landingPageUrl={page_url} className="relative flex h-full flex-col items-center justify-center">
      <div className={cn(['flex h-[95vh] w-[98vw]', isMobile && 'mx-0 h-[100dvh] w-full'])}>
        <AgentInOpenState showAgentInOpenState={true} handleSendMessage={handleSendMessage} isCollapsible={true} />
      </div>
    </Backdrop>
  );
};

export default Feedback;
