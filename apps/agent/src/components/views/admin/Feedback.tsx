import { ApiProviderContext } from '@meaku/core/contexts/Context';
import { useContextSelector } from 'use-context-selector';
import useWebSocketChat from '../../../hooks/useWebSocketChat.tsx';
import { useSearchParams } from 'react-router-dom';
import AgentInOpenState from '../AgentView/AgentInOpenState.tsx';
import Backdrop from '@breakout/design-system/components/layout/backdrop';
import { useEffect } from 'react';

import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import Button from '@breakout/design-system/components/Button/index';
import RefreshChatIcon from '@breakout/design-system/components/icons/refresh';
import { useArtifactStore } from '../../../stores/useArtifactStore.ts';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';
const Feedback = () => {
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);

  const [searchParams] = useSearchParams();
  const { handleSendUserMessage } = useWebSocketChat();
  const manager = useSessionApiResponseManager();

  const { handleUpdateSessionData } = useLocalStorageSession();
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);

  const handleRefreshChat = () => {
    handleUpdateSessionData({
      sessionId: undefined,
      prospectId: undefined,
    });
    setActiveArtifact(null);
    window.location.reload();
  };

  const page_url = searchParams.get('url') || undefined;
  const sessionId = manager?.getSessionId();
  const prospectId = manager?.getProspectId();
  const hashedSessionData = `${sessionId}|${prospectId}`;

  const handleSendMessage = (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => {
    handleSendUserMessage(data);
  };

  const fetchSessionData = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  return (
    <Backdrop landingPageUrl={page_url} className="flex h-screen flex-col items-center justify-center font-inter">
      <div className="flex w-[90vw]  justify-end">
        <CopyToClipboardButton
          textToCopy={hashedSessionData}
          toastMessage="Session hash copied."
          copyIconClassname="h-6 w-6"
        />
        <Button onClick={handleRefreshChat} buttonStyle="icon" variant="tertiary">
          <RefreshChatIcon className="text-primary" />
        </Button>
      </div>
      <div className="flex h-[90vh] w-[90vw]">
        <AgentInOpenState handleSendMessage={handleSendMessage} isCollapsible={true} />
      </div>
    </Backdrop>
  );
};

export default Feedback;
