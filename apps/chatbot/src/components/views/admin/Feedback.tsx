import { ApiProviderContext } from '../../../pages/shared/ApiProvider/Context';
import { useContextSelector } from 'use-context-selector';
import useWebSocketChat from '../../../hooks/useWebSocketChat';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { useSearchParams } from 'react-router-dom';
import ChatArea from '../MultimediaChat/ChatArea.tsx';
import Backdrop from '@breakout/design-system/components/layout/backdrop';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import useLocalStorageSession from '../../../hooks/useLocalStorageSession.tsx';
import Button from '@breakout/design-system/components/layout/button';
import { CopyIcon } from 'lucide-react';
import RefreshChatIcon from '@breakout/design-system/components/icons/refresh';
import useLocalStorageArtifact from '../../../hooks/useLocalStorageArtifact.tsx';

const Feedback = () => {
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);

  const [searchParams] = useSearchParams();
  const { handleSendUserMessage } = useWebSocketChat();
  const manager = useUnifiedConfigurationResponseManager();

  const { handleUpdateSessionData } = useLocalStorageSession();
  const { handleUpdateArtifact } = useLocalStorageArtifact();

  const handleRefreshChat = () => {
    handleUpdateSessionData({
      sessionId: undefined,
      prospectId: undefined,
    });
    handleUpdateArtifact(undefined);
    window.location.reload();
  };

  const page_url = searchParams.get('url') || undefined;
  const sessionId = manager.getSessionId();

  const fetchSessionData = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  const handleSendMessage = (message: string) => {
    handleSendUserMessage(message);
  };

  const handleCopySession = () => {
    const prospectId = manager.getProspectId();
    const hashedSessionData = `${sessionId}|${prospectId}`;
    navigator.clipboard.writeText(hashedSessionData);
    toast.success('Session hash copied.');
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  return (
    <Backdrop landingPageUrl={page_url} className="flex h-screen flex-col items-center justify-center font-inter">
      <div className="flex w-[90vw]  justify-end">
        <Button onClick={handleCopySession} size="icon" className="rounded-md bg-primary-foreground/70 p-2 ">
          <CopyIcon className="h-5 w-5 text-primary " />
        </Button>
        <Button onClick={handleRefreshChat} size="icon" className="rounded-md bg-primary-foreground/70 p-1">
          <RefreshChatIcon className="text-primary" />
        </Button>
      </div>
      <div className="flex h-[90vh] w-[90vw]">
        <ChatArea handleSendMessage={handleSendMessage} />
      </div>
    </Backdrop>
  );
};

export default Feedback;
