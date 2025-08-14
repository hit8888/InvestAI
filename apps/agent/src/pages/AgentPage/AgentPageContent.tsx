import { useParams } from 'react-router-dom';
import { withWhiteLabelConfig } from '../withWhiteLabelConfig';
import { useContextSelector } from 'use-context-selector';
import { ApiProviderContext } from '@meaku/core/contexts/Context';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import { CDN_URL_FOR_ASSETS } from '@meaku/core/constants/index';
import { Toaster } from 'react-hot-toast';
import AgentView from '../../components/views/AgentView';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';
import { useUpdateSessionOnSessionInit } from '../shared/hooks/useUpdateSessionOnSessionInit';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { cn } from '@breakout/design-system/lib/cn';

const Agent = () => {
  const { getParam } = useUrlParams();
  const isMobile = useIsMobile();
  const { orgName } = useParams<{ orgName: string }>();

  const sessionApiResponseManager = useSessionApiResponseManager();
  const sessionId = sessionApiResponseManager?.getSessionId();
  const sessionQuery = useContextSelector(ApiProviderContext, (state) => state.sessionQuery);
  const isShowingBGCover = getParam('bc') === 'true' || getParam('showBackgroundCover') === 'true';

  // Initialize the session update hook
  useUpdateSessionOnSessionInit();

  const handleOnFirstMessageSend = () => {
    if (sessionId) return;
    sessionQuery.refetch();
  };

  return (
    <>
      {isShowingBGCover && (
        <div className={cn('h-full w-full', !isMobile && 'fixed inset-0 z-0 h-screen w-screen overflow-hidden')}>
          <div
            className={cn('absolute inset-0 h-full w-full bg-contain bg-center bg-no-repeat', isMobile && 'bg-cover')}
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
