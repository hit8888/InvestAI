import AgentMessages from '@breakout/design-system/components/layout/AgentMessages';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';
import { useMessageStore } from '../../../stores/useMessageStore';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import { useAllowFeedback } from '@meaku/core/contexts/UrlDerivedDataProvider';
import AgentInput from '@breakout/design-system/components/layout/AgentInput';

interface IProps {
  handleSendMessage: (data: IWebSocketHandleMessage) => void;
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
  const handleAddMessageFeedback = useMessageStore((state) => state.handleAddMessageFeedback);
  const handleRemoveMessageFeedback = useMessageStore((state) => state.handleRemoveMessageFeedback);

  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);

  const responseManager = useUnifiedConfigurationResponseManager();

  const initialSuggestedQuestions = responseManager.getInitialSuggestedQuestions();
  const styleConfig = responseManager.getStyleConfig();
  const logoURL = responseManager.getLogoUrl();
  const sessionId = responseManager.getSessionId() ?? '';
  const primaryColor = styleConfig.primary ?? null;

  const allowFeedback = useAllowFeedback();
  if (isMediaTakingFullWidth) return null;

  return (
    <div className="flex h-full flex-col items-stretch overflow-auto">
      <AgentMessages
        sessionId={sessionId}
        orbState={orbState}
        messages={messages}
        showRightPanel={hasArtifactOrDemoInMessageHistory}
        isAMessageBeingProcessed={isAMessageBeingProcessed}
        setActiveArtifact={setActiveArtifact}
        setDemoPlayingStatus={setDemoPlayingStatus}
        handleSendUserMessage={handleSendMessage}
        handleAddMessageFeedback={handleAddMessageFeedback}
        handleRemoveMessageFeedback={handleRemoveMessageFeedback}
        initialSuggestedQuestions={initialSuggestedQuestions}
        allowFullWidthForText={false}
        showDemoPreQuestions={showDemoPreQuestions}
        primaryColor={primaryColor}
        logoURL={logoURL}
        allowFeedback={allowFeedback}
      />
      {!isMediaTakingFullWidth && (
        <AgentInput
          handleSendMessage={(message) => handleSendMessage({ message })}
          isAMessageBeingProcessed={isAMessageBeingProcessed}
          messages={messages}
        />
      )}
    </div>
  );
};

export default AgentMessagesContainer;
