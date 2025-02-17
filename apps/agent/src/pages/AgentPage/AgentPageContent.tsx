import { useParams } from 'react-router-dom';
import { withWhiteLabelConfig } from '../withWhiteLabelConfig';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';
import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '@meaku/core/contexts/Context';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import { CDN_URL_FOR_ASSETS } from '../../constants/chat';
import { Toaster } from 'react-hot-toast';
import AgentView from '../../components/views/AgentView';

const Agent = () => {
  const { getParam } = useUrlParams();
  const { orgName } = useParams<{ orgName: string }>();

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const sessionId = unifiedConfigurationResponseManager.getSessionId();
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);
  const isShowingBGCover = getParam('bc') === 'true' || getParam('showBackgroundCover') === 'true';

  const handleOnFirstMessageSend = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  return (
    <>
      {isShowingBGCover && (
        <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden">
          <div
            className="absolute inset-0 h-full w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${CDN_URL_FOR_ASSETS}/agents-website-SS/${orgName}.png')`,
            }}
          ></div>
        </div>
      )}
      <AgentView fetchSessionData={handleOnFirstMessageSend} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

const AgentWithWhiteLabelConfig = withWhiteLabelConfig(Agent);
export default AgentWithWhiteLabelConfig;
