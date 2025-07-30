import { cn } from '@breakout/design-system/lib/cn';
import AgentHeader from '@breakout/design-system/components/layout/AgentHeader';
import AgentMobileHeader from '@breakout/design-system/components/layout/AgentMobileHeader';
import AgentActionPanel from '@breakout/design-system/components/layout/AgentActionPanel';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import { useDemoDetails } from '../../../hooks/useDemoDetails.ts';
import { DemoPlayingStatus, ViewType } from '@meaku/core/types/common';
import { useExpandWidthOnDemoFrame } from '../../../hooks/demoFlow/useExpandWidthOnDemoFrame.ts';
import AgentMessagesContainer from './AgentMessagesContainer.tsx';
import ArtifactContainer from './ArtifactContainer.tsx';
import StaticArtifactContainer from '@breakout/design-system/components/Artifact/StaticArtifactContainer';
import Orb from '@breakout/design-system/components/Orb/index';
import { Demo } from './Demo/index.tsx';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useSetArtifactOnNewMessage } from '../../../hooks/useSetArtifactOnNewMessage.ts';
import useValuesFromConfigApi from '../../../hooks/useValuesFromConfigApi.tsx';
import useLatestMessageComplete from '../../../hooks/useLatestMessageComplete.ts';
import { useArtifactStore } from '../../../stores/useArtifactStore.ts';
import { useIsAdmin } from '@meaku/core/contexts/UrlDerivedDataProvider';
import { isMediaArtifact } from '@meaku/core/utils/messageUtils';
import useForceEnableDelay from '../../../hooks/useForceEnableDelay.ts';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface IProps {
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  handleCloseAgent?: () => void;
  isCollapsible: boolean;
  showAgentInOpenState: boolean;
}

const AgentInOpenState = ({ handleSendMessage, handleCloseAgent, isCollapsible, showAgentInOpenState }: IProps) => {
  const isMobile = useIsMobile();
  const { isDemoAvailable, demoDetails, demoFeatures, onStepEnd, switchToDemo } = useDemoDetails();
  useExpandWidthOnDemoFrame(demoDetails);
  useSetArtifactOnNewMessage();

  const isAdmin = useIsAdmin();

  const isMediaTakingFullWidth = useMessageStore((state) => state.isMediaTakingFullWidth);
  const setMediaTakeFullScreenWidth = useMessageStore((state) => state.setMediaTakeFullScreenWidth);

  const orbState = useMessageStore((state) => state.orbState);

  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const { isMessageComplete } = useLatestMessageComplete();

  const defaultDisable = isAMessageBeingProcessed || !isMessageComplete();
  const forceEnable = useForceEnableDelay(defaultDisable, 30000);
  const disableMessageSend = defaultDisable && !forceEnable;

  const messages = useMessageStore((state) => state.messages);
  const setDemoPlayingStatus = useMessageStore((state) => state.setDemoPlayingStatus);
  const demoPlayingStatus = useMessageStore((state) => state.demoPlayingStatus);

  const setIsArtifactPlaying = useArtifactStore((state) => state.setIsArtifactPlaying);
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);
  const { agentName, logoURL, showOrb, ctaConfig, invertTextColor, defaultArtifactUrl, orbLogoUrl } =
    useValuesFromConfigApi();

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

  const showArtifactOnRightSide = demoPlayingStatus === DemoPlayingStatus.INITIAL && !isMobile;

  const aiMessages = messages.filter((message) => message.role === 'ai');
  const hasArtifactAiMessage = aiMessages.some(
    (message) => message.message_type === 'ARTIFACT' && isMediaArtifact(message.message.artifact_type),
  );

  // we only show the static artifact on the right side
  // if there are more than 1 ai messages ( other than welcome message that we show instantly ) and there is no artifact ai message
  const showStaticArtifactOnRightSide = aiMessages.length > 1 && !hasArtifactAiMessage && !isMobile;

  const renderOrb = () => (
    <Orb showThreeStar showOrb={showOrb} state={orbState} color={'rgb(var(--primary))'} orbLogoUrl={orbLogoUrl} />
  );

  const handleClickonAgent = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click target is a clickable element
    const target = e.target as HTMLElement;
    const isClickable = target.closest('button, a, input, textarea, select, [role="button"], [tabindex]');

    // Only focus if the click is not on a clickable element
    if (!isClickable) {
      const searchbarInput = document.querySelector('textarea#agent-input') as HTMLTextAreaElement;
      setTimeout(() => {
        searchbarInput?.focus();
      }, 100);
    }
  };
  return (
    <div
      className={cn(
        'custom-blur flex h-full flex-1 flex-col overflow-hidden rounded-3xl border border-gray-200 p-3 opacity-100 transition-all duration-300 ease-in-out',
        {
          'hidden opacity-0': !showAgentInOpenState,
          'rounded-none p-0': isMobile,
        },
      )}
    >
      <div
        className={cn([
          'chat-window-shadow relative flex h-full flex-1 flex-col overflow-hidden rounded-2xl bg-white',
          isMobile && 'rounded-none',
        ])}
        onClick={handleClickonAgent}
      >
        {isMobile ? (
          <AgentMobileHeader
            handleCloseAgent={handleCloseAgent}
            isHidden={hideAgentHeader}
            isCollapsible={isCollapsible}
            renderOrb={renderOrb}
            showFeedbackHeader={isAdmin}
            agentName={agentName}
            setActiveArtifact={setActiveArtifact}
          />
        ) : (
          <AgentHeader
            handleCloseAgent={handleCloseAgent}
            isHidden={hideAgentHeader}
            isCollapsible={isCollapsible}
            showFeedbackHeader={isAdmin}
            setActiveArtifact={setActiveArtifact}
          />
        )}
        <div
          className={cn('flex h-full w-full flex-1 overflow-hidden', {
            'gap-2': showMediaArtifactContainer,
          })}
        >
          {/* Left Side Chat History */}
          <AgentMessagesContainer
            handleSendMessage={handleSendMessage}
            hasArtifactOrDemoInMessageHistory={showMediaArtifactContainer}
            isMediaTakingFullWidth={isMediaTakingFullWidth}
            showDemoPreQuestions={isDemoAvailable && !demoDetails}
            setIsArtifactPlaying={setIsArtifactPlaying}
            orbState={orbState}
            viewType={ViewType.USER}
            ctaConfig={ctaConfig}
          />

          {/* Right Side Static Artifact Container */}
          {showStaticArtifactOnRightSide ? <StaticArtifactContainer defaultArtifactUrl={defaultArtifactUrl} /> : null}

          {/* Right Side Artifact Container */}
          {showArtifactOnRightSide && (
            <ArtifactContainer
              logoURL={logoURL}
              isMediaTakingFullWidth={isMediaTakingFullWidth}
              handleSendMessage={handleSendMessage}
              onSlideItemClick={handleSlideItemClick}
              setIsArtifactPlaying={setIsArtifactPlaying}
              viewType={ViewType.USER}
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
          <AgentActionPanel
            handleSendMessage={handleSendMessage}
            disableMessageSend={disableMessageSend}
            hasFirstUserMessageBeenSent={hasFirstUserMessageBeenSent}
            messages={messages}
            ctaConfig={ctaConfig}
            invertTextColor={invertTextColor}
          />
        )}
      </div>
    </div>
  );
};

export default AgentInOpenState;
