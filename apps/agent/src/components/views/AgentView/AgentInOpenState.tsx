import { cn } from '@breakout/design-system/lib/cn';
import AgentHeader from '@breakout/design-system/components/layout/AgentHeader';
import AgentInput from '@breakout/design-system/components/layout/AgentInput';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import { useDemoDetails } from '../../../hooks/useDemoDetails.ts';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { useExpandWidthOnDemoFrame } from '../../../hooks/demoFlow/useExpandWidthOnDemoFrame.ts';
import AgentMessagesContainer from './AgentMessagesContainer.tsx';
import ArtifactContainer from './ArtifactContainer.tsx';
import { Demo } from './Demo/index.tsx';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useSetArtifactOnNewMessage } from '../../../hooks/useSetArtifactOnNewMessage.ts';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import useLatestMessageComplete from '../../../hooks/useLatestMessageComplete.ts';

interface IProps {
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  handleCloseAgent?: () => void;
  isCollapsible: boolean;
}

const AgentInOpenState = ({ handleSendMessage, handleCloseAgent, isCollapsible }: IProps) => {
  const { isDemoAvailable, demoDetails, demoFeatures, onStepEnd, switchToDemo } = useDemoDetails();
  useExpandWidthOnDemoFrame(demoDetails);
  useSetArtifactOnNewMessage();

  const isMediaTakingFullWidth = useMessageStore((state) => state.isMediaTakingFullWidth);
  const setMediaTakeFullScreenWidth = useMessageStore((state) => state.setMediaTakeFullScreenWidth);

  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const { isMessageComplete } = useLatestMessageComplete();

  const disableMessageSend = isAMessageBeingProcessed || !isMessageComplete();

  const messages = useMessageStore((state) => state.messages);
  const setDemoPlayingStatus = useMessageStore((state) => state.setDemoPlayingStatus);
  const demoPlayingStatus = useMessageStore((state) => state.demoPlayingStatus);

  const configurationApiResponseManager = useConfigurationApiResponseManager();

  const ctaConfig = configurationApiResponseManager.getCTAConfig();
  const logoURL = configurationApiResponseManager.getLogoUrl() ?? '';

  const showMediaArtifactContainer = hasFirstUserMessageBeenSent;

  const handleFinishDemo = () => {
    setMediaTakeFullScreenWidth(false);
    setDemoPlayingStatus(DemoPlayingStatus.INITIAL);
    handleSendMessage({
      message: { content: '', event_type: AgentEventType.DEMO_END, event_data: {} },
      message_type: 'EVENT',
    });
  };

  const hideAgentHeader =
    demoPlayingStatus !== DemoPlayingStatus.INITIAL && demoPlayingStatus !== DemoPlayingStatus.STARTED;

  const handleSlideItemClick = (title: string) => {
    handleSendMessage({
      message: {
        content: `Can you elaborate more on ${title}?`,
        event_data: {},
        event_type: 'SLIDE_ITEM_CLICKED',
      },
      message_type: 'EVENT',
    });
  };

  const nonDemoFlow = demoPlayingStatus === DemoPlayingStatus.INITIAL;

  return (
    <div className="custom-blur flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-primary/20 p-2 transition-all duration-300 ease-in-out">
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-primary-foreground/60">
        <AgentHeader
          handleSendMessage={(message) => handleSendMessage({ message: { content: message }, message_type: 'TEXT' })}
          handleCloseAgent={handleCloseAgent}
          isHidden={hideAgentHeader}
          isCollapsible={isCollapsible}
          ctaConfig={ctaConfig}
        />
        <div
          className={cn('h-full flex-1 overflow-hidden', {
            'grid grid-cols-3 gap-2': showMediaArtifactContainer,
          })}
        >
          {/* Left Side Chat History */}
          <AgentMessagesContainer
            handleSendMessage={handleSendMessage}
            hasArtifactOrDemoInMessageHistory={showMediaArtifactContainer}
            isMediaTakingFullWidth={isMediaTakingFullWidth}
            showDemoPreQuestions={isDemoAvailable && !demoDetails}
          />

          {/* Right Side Artifact Container */}
          {nonDemoFlow && (
            <ArtifactContainer
              logoURL={logoURL}
              isMediaTakingFullWidth={isMediaTakingFullWidth}
              handleSendMessage={handleSendMessage}
              onSlideItemClick={handleSlideItemClick}
            />
          )}

          {/* Right Side Demo Container */}
          <Demo
            key={demoDetails?.audio_url}
            handleFinishDemo={handleFinishDemo}
            demoDetails={demoDetails}
            demoPlayingStatus={demoPlayingStatus}
            setDemoPlayingStatus={setDemoPlayingStatus}
            demoFeatures={demoFeatures}
            isDemoAvailable={isDemoAvailable}
            onStepEnd={onStepEnd}
            switchToDemo={switchToDemo}
          />
        </div>
        {/* Bottom Bar */}
        {!isMediaTakingFullWidth && (
          <AgentInput
            handleSendMessage={(message) => handleSendMessage({ message: { content: message }, message_type: 'TEXT' })}
            disableMessageSend={disableMessageSend}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
};

export default AgentInOpenState;
