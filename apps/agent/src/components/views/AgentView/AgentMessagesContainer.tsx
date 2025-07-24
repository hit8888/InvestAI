import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import { useMessageStore } from '../../../stores/useMessageStore';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import { useAllowFeedback } from '@meaku/core/contexts/UrlDerivedDataProvider';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import { ViewType } from '@meaku/core/types/common';
import { CTAConfigType, OrbStatusEnum } from '@meaku/core/types/index';
import { useMemo } from 'react';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { cn } from '@breakout/design-system/lib/cn';
import AgentCTA from '@breakout/design-system/components/layout/AgentCTA';
import { checkIfCTAButtonShown } from '@meaku/core/utils/messageUtils';

interface IProps {
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  hasArtifactOrDemoInMessageHistory: boolean;
  isMediaTakingFullWidth: boolean;
  showDemoPreQuestions: boolean;
  viewType: ViewType;
  orbState: OrbStatusEnum;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  ctaConfig: CTAConfigType;
}

const AgentMessagesContainer = ({
  handleSendMessage,
  hasArtifactOrDemoInMessageHistory,
  isMediaTakingFullWidth,
  showDemoPreQuestions,
  viewType,
  orbState,
  setIsArtifactPlaying,
  ctaConfig,
}: IProps) => {
  const isMobile = useIsMobile();
  const messages = useMessageStore((state) => state.messages);

  const setDemoPlayingStatus = useMessageStore((state) => state.setDemoPlayingStatus);
  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);

  const sessionApiResponseManager = useSessionApiResponseManager();
  const configurationApiResponseManager = useConfigurationApiResponseManager();
  const invertTextColor = configurationApiResponseManager.applyInvertTextColor();
  const orbConfig = configurationApiResponseManager.getOrbConfig();
  const orbLogoUrl = orbConfig?.logo_url;
  const showOrbFromConfig = orbConfig?.show_orb ?? true; // defaults to show Orb
  const latestResponseId = useMessageStore((state) => state.latestResponseId);
  const allowFeedback = useAllowFeedback();

  const styleConfig = configurationApiResponseManager.getStyleConfig();
  const logoURL = configurationApiResponseManager.getLogoUrl();
  const primaryColor = styleConfig.primary ?? null;

  const initialSuggestedQuestions = configurationApiResponseManager.getInitialSuggestedQuestions();

  const agentMessagesContainerClassName = useMemo(() => {
    if (isMobile || !hasArtifactOrDemoInMessageHistory) {
      return 'w-full shrink-0';
    } else if (!isMobile && hasArtifactOrDemoInMessageHistory) {
      return 'w-[35%] shrink-0';
    }
    return '';
  }, [isMobile, hasArtifactOrDemoInMessageHistory]);

  if (isMediaTakingFullWidth) return null;

  const sessionId = sessionApiResponseManager?.getSessionId() ?? '';
  const feedbackData = sessionApiResponseManager?.getFeedback();

  const shouldCTAButtonShow = checkIfCTAButtonShown(messages) && !isMobile;

  return (
    <div className={cn(agentMessagesContainerClassName, 'flex flex-col items-start justify-start')}>
      <AgentMessages
        sessionId={sessionId}
        orbState={orbState}
        viewType={viewType}
        messages={messages}
        showRightPanel={hasArtifactOrDemoInMessageHistory}
        hasFirstUserMessageBeenSent={hasFirstUserMessageBeenSent}
        isAMessageBeingProcessed={isAMessageBeingProcessed}
        setActiveArtifact={setActiveArtifact}
        setIsArtifactPlaying={setIsArtifactPlaying}
        setDemoPlayingStatus={setDemoPlayingStatus}
        handleSendUserMessage={handleSendMessage}
        initialSuggestedQuestions={initialSuggestedQuestions}
        allowFullWidthForText={false}
        showDemoPreQuestions={showDemoPreQuestions}
        primaryColor={primaryColor}
        logoURL={logoURL}
        allowFeedback={allowFeedback}
        feedbackData={feedbackData ?? []}
        lastMessageResponseId={latestResponseId}
        orbLogoUrl={orbLogoUrl}
        showOrbFromConfig={showOrbFromConfig}
        invertTextColor={invertTextColor ?? false}
      />
      {shouldCTAButtonShow && (
        <div className="flex w-full flex-col items-start justify-start p-4 pb-0">
          <AgentCTA
            handleSendMessage={handleSendMessage}
            messages={messages}
            ctaConfig={ctaConfig}
            invertTextColor={invertTextColor}
            isHidden={!hasFirstUserMessageBeenSent}
          />
        </div>
      )}
    </div>
  );
};

export default AgentMessagesContainer;
