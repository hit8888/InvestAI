import { ApiProviderContext } from '../../../pages/shared/ApiProvider/Context';
import { useContextSelector } from 'use-context-selector';
import useWebSocketChat from '../../../hooks/useWebSocketChat';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { useSearchParams } from 'react-router-dom';
import ChatArea from '../MultimediaChat/ChatArea.tsx';
import Backdrop from '@breakout/design-system/components/layout/backdrop';
import { useEffect } from 'react';

const Feedback = () => {
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);

  const [searchParams] = useSearchParams();
  const { handleSendUserMessage } = useWebSocketChat();
  const manager = useUnifiedConfigurationResponseManager();

  const page_url = searchParams.get('url') || undefined;
  const sessionId = manager.getSessionId() ?? '';

  const fetchSessionData = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  const handleSendMessage = (message: string) => {
    fetchSessionData();
    handleSendUserMessage(message);
  };

  useEffect(() => {
    fetchSessionData();
    console.log('Hereeee');
  }, []);

  return (
    <Backdrop landingPageUrl={page_url} className="flex h-screen flex-col items-center justify-center font-inter">
      <div className="flex h-[90vh] w-[90vw]">
        <ChatArea handleSendMessage={handleSendMessage} />
      </div>
    </Backdrop>
  );
};

export default Feedback;
