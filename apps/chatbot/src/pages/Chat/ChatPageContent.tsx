import { ChatConfig } from '@meaku/core/types/config';
import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import useWebSocketChat from '../../hooks/useWebSocketChat';
import { withWhiteLabelConfig } from '../withWhiteLabelConfig';
import { useUpdateSessionOnSessionInit } from '../shared/hooks/useUpdateSessionOnSessionInit';
import useUnifiedConfigurationResponseManager from '../shared/hooks/useUnifiedConfigurationResponseManager';
import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '../shared/ApiProvider/Context';
import { useArtifactStore } from '../../stores/useArtifactStore';
// import { useHandleAppStateOnUnmount } from '../shared/hooks/useHandleAppStateOnUnmount';

const Widget = lazy(() => import('../../components/views/Widget'));
const Embed = lazy(() => import('../../components/views/Embed'));
const Multimedia = lazy(() => import('../../components/views/MultimediaChat'));

interface IProps {
  fetchSessionData: () => void;
  handleSendUserMessage: (message: string) => Promise<void>;
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
  const isArtifactPlaying = useArtifactStore((state) => state.isArtifactPlaying);
  const setShouldEndArtifactImmediately = useArtifactStore((state) => state.setShouldEndArtifactImmediately);

  const { handleSendUserMessage } = useWebSocketChat();

  useUpdateSessionOnSessionInit();

  // useHandleAppStateOnUnmount();

  const chatConfig = (searchParams.get('config')?.toLowerCase() as ChatConfig) || ChatConfig.EMBED;

  const Component = componentsMap[chatConfig];

  const handleOnFirstMessageSend = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  const onMessageSend = async (message: string) => {
    if (isArtifactPlaying) {
      setShouldEndArtifactImmediately(true);
    }
    handleSendUserMessage(message);
  };

  return (
    <Suspense fallback={<></>}>
      <Component fetchSessionData={handleOnFirstMessageSend} handleSendUserMessage={onMessageSend} />
    </Suspense>
  );
};

const ChatWithWhiteLabelConfig = withWhiteLabelConfig(Chat);
export default ChatWithWhiteLabelConfig;
