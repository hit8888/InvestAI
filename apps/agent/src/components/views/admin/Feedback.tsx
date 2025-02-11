import { ApiProviderContext } from '@meaku/core/contexts/Context';
import { useContextSelector } from 'use-context-selector';
import useWebSocketChat from '../../../hooks/useWebSocketChat.tsx';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';
import { useSearchParams } from 'react-router-dom';
import AgentInOpenState from '../MultimediaChat/AgentInOpenState.tsx';
import Backdrop from '@breakout/design-system/components/layout/backdrop';
import { useEffect } from 'react';

import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import Button from '@breakout/design-system/components/layout/button';
import RefreshChatIcon from '@breakout/design-system/components/icons/refresh';
import { useArtifactStore } from '../../../stores/useArtifactStore.ts';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';

const Feedback = () => {
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);

  const [searchParams] = useSearchParams();
  const { handleSendUserMessage } = useWebSocketChat();
  const manager = useUnifiedConfigurationResponseManager();

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
  const sessionId = manager.getSessionId();
  const prospectId = manager.getProspectId();
  const hashedSessionData = `${sessionId}|${prospectId}`;

  const fetchSessionData = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  const handleSendMessage = (data: IWebSocketHandleMessage) => {
    handleSendUserMessage(data);
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  return (
    <Backdrop landingPageUrl={page_url} className="flex h-screen flex-col items-center justify-center font-inter">
      <div className="flex w-[90vw]  justify-end">
        <CopyToClipboardButton textToCopy={hashedSessionData} toastMessage="Session hash copied." />
        <Button onClick={handleRefreshChat} size="icon" className="rounded-md bg-primary-foreground/70 p-1">
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
