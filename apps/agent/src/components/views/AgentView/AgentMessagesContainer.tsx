import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import { useMessageStore } from '../../../stores/useMessageStore';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import { useAllowFeedback } from '@meaku/core/contexts/UrlDerivedDataProvider';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import { ViewType } from '@meaku/core/types/common';

interface IProps {
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  hasArtifactOrDemoInMessageHistory: boolean;
  isMediaTakingFullWidth: boolean;
  showDemoPreQuestions: boolean;
  viewType: ViewType;
}

const AgentMessagesContainer = ({
  handleSendMessage,
  hasArtifactOrDemoInMessageHistory,
  isMediaTakingFullWidth,
  showDemoPreQuestions,
  viewType,
}: IProps) => {
  const messages = useMessageStore((state) => state.messages);

  const orbState = useMessageStore((state) => state.orbState);
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

  if (isMediaTakingFullWidth) return null;

  const sessionId = sessionApiResponseManager?.getSessionId() ?? '';
  const feedbackData = sessionApiResponseManager?.getFeedback();

  return (
    <AgentMessages
      sessionId={sessionId}
      orbState={orbState}
      viewType={viewType}
      messages={messages}
      showRightPanel={hasArtifactOrDemoInMessageHistory}
      hasFirstUserMessageBeenSent={hasFirstUserMessageBeenSent}
      isAMessageBeingProcessed={isAMessageBeingProcessed}
      setActiveArtifact={setActiveArtifact}
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
  );
};

export default AgentMessagesContainer;
