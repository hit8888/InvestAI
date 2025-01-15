import { AgentConfig } from '@meaku/core/types/config';
import { lazy, Suspense } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { withWhiteLabelConfig } from '../withWhiteLabelConfig';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';
import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '@meaku/core/contexts/Context';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import { CDN_URL_FOR_ASSETS } from '../../constants/chat';

const Embed = lazy(() => import('../../components/views/Embed'));
const Multimedia = lazy(() => import('../../components/views/MultimediaChat'));

interface IProps {
  fetchSessionData: () => void;
}

const componentsMap: Record<AgentConfig, React.ComponentType<IProps>> = {
  [AgentConfig.EMBED]: Embed,
  [AgentConfig.MULTIMEDIA]: Multimedia,
};

const Agent = () => {
  const [searchParams] = useSearchParams();
  const { getParam } = useUrlParams();
  const { orgName } = useParams<{ orgName: string }>();

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const sessionId = unifiedConfigurationResponseManager.getSessionId();
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);
  const isShowingBGCover = getParam('showBackgroundCover') === 'true';

  const agentConfig = (searchParams.get('config')?.toLowerCase() as AgentConfig) || AgentConfig.EMBED;

  const Component = componentsMap[agentConfig];

  const handleOnFirstMessageSend = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  return (
    <Suspense fallback={<></>}>
      {isShowingBGCover && (
        <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden">
          <div
            className="absolute inset-0 h-full w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${CDN_URL_FOR_ASSETS}${orgName}.png')`,
            }}
          ></div>
        </div>
      )}
      <Component fetchSessionData={handleOnFirstMessageSend} />
    </Suspense>
  );
};

const AgentWithWhiteLabelConfig = withWhiteLabelConfig(Agent);
export default AgentWithWhiteLabelConfig;
