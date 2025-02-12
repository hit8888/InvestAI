import { cn } from '@breakout/design-system/lib/cn';
import AgentHeader from '@breakout/design-system/components/layout/AgentHeader';
import AgentInput from '@breakout/design-system/components/layout/AgentInput';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import { useArtifactStore } from '../../../stores/useArtifactStore.ts';
import { DemoEvent, IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import { useUpdateActiveArtifactOnNewMessage } from '../../../hooks/useUpdateActiveArtifactOnNewMessage.ts';
import { useDemoDetails } from '../../../hooks/useDemoDetails.ts';
import useUnifiedConfigurationResponseManager from '@meaku/core/hooks/useUnifiedConfigurationResponseManager';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { useExpandWidthOnDemoFrame } from '../../../hooks/demoFlow/useExpandWidthOnDemoFrame.ts';
import AgentMessagesContainer from './AgentMessagesContainer.tsx';
import ArtifactContainer from './ArtifactContainer.tsx';
import { Demo } from './Demo/index.tsx';

interface IProps {
  handleSendMessage: (data: IWebSocketHandleMessage) => void;
  handleCloseAgent?: () => void;
  isCollapsible: boolean;
}

const AgentInOpenState = ({ handleSendMessage, handleCloseAgent, isCollapsible }: IProps) => {
  const { isDemoAvailable, demoDetails, demoFeatures, onStepEnd, switchToDemo } = useDemoDetails();
  useUpdateActiveArtifactOnNewMessage();
  useExpandWidthOnDemoFrame(demoDetails);

  const isMediaTakingFullWidth = useMessageStore((state) => state.isMediaTakingFullWidth);
  const setMediaTakeFullScreenWidth = useMessageStore((state) => state.setMediaTakeFullScreenWidth);
  const activeArtifact = useArtifactStore((state) => state.activeArtifact);
  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);

  const messages = useMessageStore((state) => state.messages);
  const setDemoPlayingStatus = useMessageStore((state) => state.setDemoPlayingStatus);
  const demoPlayingStatus = useMessageStore((state) => state.demoPlayingStatus);

  const responseManager = useUnifiedConfigurationResponseManager();

  const ctaConfig = responseManager.getCTAConfig();
  const logoURL = responseManager.getLogoUrl() ?? '';

  const hasArtifactOrDemoInMessageHistory =
    messages.findIndex((message) => message.role === 'ai' && !!message.artifact?.artifact_id) !== -1 || isDemoAvailable;

  const handleFinishDemo = () => {
    setMediaTakeFullScreenWidth(false);
    setDemoPlayingStatus(DemoPlayingStatus.INITIAL);
    handleSendMessage({ message: '', eventType: DemoEvent.DEMO_END, eventData: {} });
  };

  const showArtifactContent = !!activeArtifact && demoPlayingStatus === DemoPlayingStatus.INITIAL;

  const hideAgentHeader =
    demoPlayingStatus !== DemoPlayingStatus.INITIAL && demoPlayingStatus !== DemoPlayingStatus.STARTED;

  const handleSlideItemClick = (title: string) => {
    handleSendMessage({ message: `Can you elaborate more on ${title}` });
  };

  return (
    <div className="custom-blur flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-primary/20 p-2 transition-all duration-300 ease-in-out">
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-primary-foreground/60">
        <AgentHeader
          handleSendMessage={(message) => handleSendMessage({ message })}
          handleCloseAgent={handleCloseAgent}
          isHidden={hideAgentHeader}
          isCollapsible={isCollapsible}
          ctaConfig={ctaConfig}
        />
        <div
          className={cn('h-full flex-1 overflow-hidden', {
            'grid grid-cols-3 gap-2': hasArtifactOrDemoInMessageHistory,
          })}
        >
          <AgentMessagesContainer
            handleSendMessage={handleSendMessage}
            hasArtifactOrDemoInMessageHistory={hasArtifactOrDemoInMessageHistory}
            isMediaTakingFullWidth={isMediaTakingFullWidth}
            showDemoPreQuestions={isDemoAvailable && !demoDetails}
          />

          <ArtifactContainer
            showArtifactContent={showArtifactContent}
            logoURL={logoURL}
            isMediaTakingFullWidth={isMediaTakingFullWidth}
            handleSendMessage={handleSendMessage}
            onSlideItemClick={handleSlideItemClick}
          />

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
        {!isMediaTakingFullWidth && (
          <AgentInput
            handleSendMessage={(message) => handleSendMessage({ message })}
            isAMessageBeingProcessed={isAMessageBeingProcessed}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
};

export default AgentInOpenState;
