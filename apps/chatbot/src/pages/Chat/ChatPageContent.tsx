import { ChatConfig } from '@meaku/core/types/config';
import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import useWebSocketChat from '../../hooks/useWebSocketChat';
import { withWhiteLabelConfig } from '../withWhiteLabelConfig';
import { useUpdateSessionOnMount } from '../shared/hooks/useUpdateSessionOnMount';
import useUnifiedConfigurationResponseManager from '../shared/hooks/useUnifiedConfigurationResponseManager';
import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '../shared/ApiProvider/Context';

const Widget = lazy(() => import('../../components/views/Widget'));
const Embed = lazy(() => import('../../components/views/Embed'));
const Multimedia = lazy(() => import('../../components/views/MultimediaChat'));

interface IProps {
  fetchSessionData: () => void;
}

const componentsMap: Record<ChatConfig, React.ComponentType<IProps>> = {
  [ChatConfig.WIDGET]: Widget,
  [ChatConfig.EMBED]: Embed,
  [ChatConfig.MULTIMEDIA]: Multimedia,
};

const Chat = () => {
  const [searchParams] = useSearchParams();
  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const sessionId = unifiedConfigurationResponseManager.getSessionId();
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);

  useWebSocketChat();

  useUpdateSessionOnMount(); //Understand once more with Sankha

  const chatConfig = (searchParams.get('config')?.toLowerCase() as ChatConfig) || ChatConfig.EMBED;

  const Component = componentsMap[chatConfig];

  const handleOnFirstMessageSend = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  return (
    <Suspense fallback={<></>}>
      <Component fetchSessionData={handleOnFirstMessageSend} />
    </Suspense>
  );
};

const ChatWithWhiteLabelConfig = withWhiteLabelConfig(Chat);
export default ChatWithWhiteLabelConfig;
