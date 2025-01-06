import { AgentConfig } from '@meaku/core/types/config';
import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { withWhiteLabelConfig } from '../withWhiteLabelConfig';
import useUnifiedConfigurationResponseManager from '../shared/hooks/useUnifiedConfigurationResponseManager';
import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '../shared/ApiProvider/Context';

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
  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const sessionId = unifiedConfigurationResponseManager.getSessionId();
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);

  const agentConfig = (searchParams.get('config')?.toLowerCase() as AgentConfig) || AgentConfig.EMBED;

  const Component = componentsMap[agentConfig];

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

const AgentWithWhiteLabelConfig = withWhiteLabelConfig(Agent);
export default AgentWithWhiteLabelConfig;
