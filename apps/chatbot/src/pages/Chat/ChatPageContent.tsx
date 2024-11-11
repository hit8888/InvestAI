import { ChatConfig } from '@meaku/core/types/config';
import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import useWebSocketChat from '../../hooks/useWebSocketChat';
import { withWhiteLabelConfig } from '../withWhiteLabelConfig';
import { useUpdateSessionOnMount } from '../shared/hooks/useUpdateSessionOnMount';

const Widget = lazy(() => import('../../components/views/Widget'));
const Embed = lazy(() => import('../../components/views/Embed'));
const Multimedia = lazy(() => import('../../components/views/MultimediaChat'));

const componentsMap: Record<ChatConfig, React.ComponentType> = {
  [ChatConfig.WIDGET]: Widget,
  [ChatConfig.EMBED]: Embed,
  [ChatConfig.MULTIMEDIA]: Multimedia,
};

const Chat = () => {
  const [searchParams] = useSearchParams();

  useWebSocketChat();

  useUpdateSessionOnMount();

  const chatConfig = (searchParams.get('config')?.toLowerCase() as ChatConfig) || ChatConfig.EMBED;

  const Component = componentsMap[chatConfig];

  return (
    <Suspense fallback={<></>}>
      <Component />
    </Suspense>
  );
};

const ChatWithWhiteLabelConfig = withWhiteLabelConfig(Chat);
export default ChatWithWhiteLabelConfig;
