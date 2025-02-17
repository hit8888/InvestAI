import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';
import { useMessageStore } from '../../../stores/useMessageStore';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import { useAllowFeedback } from '@meaku/core/contexts/UrlDerivedDataProvider';

interface IProps {
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  hasArtifactOrDemoInMessageHistory: boolean;
  isMediaTakingFullWidth: boolean;
  showDemoPreQuestions: boolean;
}

const AgentMessagesContainer = ({
  handleSendMessage,
  hasArtifactOrDemoInMessageHistory,
  isMediaTakingFullWidth,
  showDemoPreQuestions,
}: IProps) => {
  const messages = useMessageStore((state) => state.messages);

  const orbState = useMessageStore((state) => state.orbState);
  const setDemoPlayingStatus = useMessageStore((state) => state.setDemoPlayingStatus);
  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);

  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);

  const responseManager = useUnifiedConfigurationResponseManager();
  const latestResponseId = useMessageStore((state) => state.latestResponseId);

  const initialSuggestedQuestions = responseManager.getInitialSuggestedQuestions();
  const styleConfig = responseManager.getStyleConfig();
  const logoURL = responseManager.getLogoUrl();
  const sessionId = responseManager.getSessionId() ?? '';
  const primaryColor = styleConfig.primary ?? null;

  const allowFeedback = useAllowFeedback();

  const feedbackData = responseManager.getConfig()?.body.feedback ?? [];

  if (isMediaTakingFullWidth) return null;
  return (
    <AgentMessages
      sessionId={sessionId}
      orbState={orbState}
      messages={messages}
      showRightPanel={hasArtifactOrDemoInMessageHistory}
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
      feedbackData={feedbackData}
      lastMessageResponseId={latestResponseId}
    />
  );
};

export default AgentMessagesContainer;
