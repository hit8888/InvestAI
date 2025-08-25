import { useMemo } from 'react';
import { FeatureHeader } from '../../components/FeatureHeader';
import { Icons, KatyIcon } from '@meaku/saral';
import type { FeatureContentProps } from '../';
import { AskAiInput } from './AskAiInput';
import { Messages } from './Messages';
import { SidebarArtifactDrawer } from './components/SidebarArtifactDrawer';
import { SidebarArtifactProvider, useSidebarArtifactContext } from './context/SidebarArtifactContext';
import { useAvatarSelection } from '../../hooks/useAvatarSelection';
import { checkIfSubmissionEventsPresent } from '../../utils/common';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import { useWsClient } from '../../hooks/useWsClient';
import { useFormArtifactMessage } from '../../hooks/useFormArtifactMessage';
import { MessageEventType } from '../../types/message';

const AskAiContentInner = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  const {
    suggestedQuestions,
    isStreaming,
    getRenderableMessages,
    isDiscoveryQuestionShown,
    clearSuggestedQuestionsIfDiscoveryShown,
    isLoading,
    messages,
    settings,
    config,
    sessionData,
    addMessage,
  } = useCommandBarStore();

  const {
    sideBarArtifact,
    isSideDrawerOpen,
    calculatedWidth,
    currentVideo,
    videoError,
    videoRef,
    closeSidebar,
    toggleVideoPlayPause,
  } = useSidebarArtifactContext();

  const askaiConfig = useMemo(
    () => ({
      agent_name: config?.agent_name ?? '',
      welcome_message: config?.body?.welcome_message ?? '',
      ctas: [
        {
          text: config.body.cta_config?.text ?? 'Contact Sales',
          message: config.body.cta_config?.message ?? 'I want to book a demo for the product.',
          url: config.body.cta_config?.url ?? '',
        },
      ],
      welcomeQuestions: config?.body?.welcome_message?.suggested_questions ?? [],
    }),
    [config],
  );

  const { sendUserMessage } = useWsClient();

  // Use session_id if available, otherwise use a combination of agentId and prospectId
  const avatarKey = config.session_id || `${settings.agent_id}-${config.prospect_id}`;
  const { selectedAvatar, isAvatarLoaded } = useAvatarSelection(avatarKey);

  const shouldBookMeetingCTAButtonShow = checkIfSubmissionEventsPresent(messages ?? []);

  // Add form artifact message for consistent UI when form filled exists but no artifact message
  useFormArtifactMessage({
    messages: messages ?? [],
    sessionData,
    addMessage,
    artifactEventTypes: [MessageEventType.FORM_ARTIFACT],
    checkFormFilled: true,
    queryEnabled: !shouldBookMeetingCTAButtonShow,
  });

  return (
    <div
      className="flex w-full flex-col space-y-1 rounded-[20px] relative border border-border-dark bg-card shadow-elevation-md"
      style={{ height: 'min(100vh, 680px)' }}
    >
      <FeatureHeader
        title={`${askaiConfig?.agent_name} - AI Copilot`}
        welcomeMessage={messages?.length === 0 ? askaiConfig?.welcome_message.message : undefined}
        icon={
          isAvatarLoaded && selectedAvatar ? <selectedAvatar.Component size={48} /> : <KatyIcon className="h-12 w-12" />
        }
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
        shouldBookMeetingCTAButtonShow={shouldBookMeetingCTAButtonShow && !!sessionData}
        ctas={askaiConfig?.ctas ?? []}
        sendUserMessage={sendUserMessage}
      />
      <div className="h-10 w-full flex-1  p-2 pt-0">
        <div className="flex h-full w-full flex-col rounded-[16px] border bg-background" id="ask-ai-messages">
          <div className="h-[calc(100%-80px)] flex-1 relative">
            {!sessionData ? (
              <div className="absolute bottom-20 flex w-full items-center justify-center gap-3">
                <Icons.CircleDashed className="h-3 w-3 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Initialising...</p>
              </div>
            ) : null}

            <SidebarArtifactDrawer
              isOpen={isSideDrawerOpen}
              calculatedWidth={calculatedWidth}
              artifact={sideBarArtifact}
              currentVideo={currentVideo}
              videoError={videoError}
              videoRef={videoRef}
              onPlayPauseToggle={toggleVideoPlayPause}
              onClose={closeSidebar}
            />
            <Messages
              messages={messages ?? []}
              sendUserMessage={sendUserMessage}
              selectedAvatar={selectedAvatar}
              suggestedQuestions={suggestedQuestions}
              isStreaming={isStreaming}
              isLoading={isLoading}
              getRenderableMessages={getRenderableMessages}
              isDiscoveryQuestionShown={isDiscoveryQuestionShown}
              clearSuggestedQuestionsIfDiscoveryShown={clearSuggestedQuestionsIfDiscoveryShown}
            />
          </div>
          <AskAiInput sendUserMessage={sendUserMessage} disabled={(!sessionData || isLoading) ?? false} />
        </div>
      </div>
    </div>
  );
};

const AskAiContentWrapper = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  return (
    <SidebarArtifactProvider>
      <AskAiContentInner onClose={onClose} onExpand={onExpand} isExpanded={isExpanded} />
    </SidebarArtifactProvider>
  );
};

export default AskAiContentWrapper;
