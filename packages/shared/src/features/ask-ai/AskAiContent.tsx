import { useMemo, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { FeatureHeader } from '../../components/FeatureHeader';
import { LucideIcon } from '@meaku/saral';
import { HeaderAvatar } from '../../components/AvatarDisplay';
import type { FeatureContentProps } from '../';
import { AskAiInput } from './AskAiInput';
import { Messages } from './Messages';
import { SidebarArtifactDrawer } from './components/SidebarArtifactDrawer';
import { SidebarArtifactProvider, useSidebarArtifactContext } from './context/SidebarArtifactContext';
import { useAvatarSelection } from '../../hooks/useAvatarSelection';
import { checkIfSubmissionEventsPresent } from '../../utils/common';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import { useWsClient } from '../../hooks/useWsClient';
import { useAdminSession } from './hooks/useAdminSession';
import { useFormArtifactMessage } from '../../hooks/useFormArtifactMessage';
import { MessageEventType } from '../../types/message';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import PoweredByBreakout from '../../components/PoweredByBreakout';

const AskAiContentInner = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  const isMobile = useIsMobile();
  const {
    suggestedQuestions,
    isStreaming,
    getRenderableMessages,
    isDiscoveryQuestionShown,
    clearSuggestedQuestionsIfDiscoveryShown,
    isLoading,
    isAdminTyping,
    messages,
    settings,
    config,
    sessionData,
    addMessage,
  } = useCommandBarStore();

  const orbLogoUrl = config.style_config.orb_config?.logo_url;
  const showOnlineIndicator = config.style_config.orb_config?.show_online_indicator ?? false;
  const showFavicon = !config.style_config.orb_config?.show_orb;

  const { isSideDrawerOpen, closeSidebar, setContainerReady } = useSidebarArtifactContext();

  const askaiConfig = useMemo(
    () => ({
      agent_name: config?.agent_name ?? '',
      welcome_message: config?.body?.welcome_message ?? '',
      ctas: (config.body.ctas_list ?? []).map((cta) => ({
        text: cta?.text ?? '',
        message: cta?.message ?? '',
        url: cta?.url ?? '',
      })),
      welcomeQuestions: config?.body?.welcome_message?.suggested_questions ?? [],
    }),
    [config],
  );

  const { sendUserMessage } = useWsClient();

  // Use session_id if available, otherwise use a combination of agentId and prospectId
  const avatarKey = config.session_id || `${settings.agent_id}-${config.prospect_id}`;
  const { selectedAvatar, isAvatarLoaded } = useAvatarSelection(avatarKey);

  const shouldBookMeetingCTAButtonShow = checkIfSubmissionEventsPresent(messages ?? []);

  // Get renderable messages to determine UI state

  // Add form artifact message for consistent UI when form filled exists but no artifact message
  useFormArtifactMessage({
    messages: messages ?? [],
    sessionData,
    addMessage,
    moduleId: config.command_bar?.modules.find((m) => m.module_type === 'ASK_AI')?.id ?? 1, // ASK_AI Module ID
    artifactEventTypes: [MessageEventType.FORM_ARTIFACT],
    checkFormFilled: true,
    queryEnabled: !shouldBookMeetingCTAButtonShow,
  });

  // Use custom hook to get admin session information
  const { adminSessionInfo, hasActiveAdminSession } = useAdminSession(messages);

  const targetRef = useRef<HTMLDivElement>(null);

  // Callback to set container ready when the ref is attached to the DOM element
  const containerRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      // Update the stable ref
      targetRef.current = node;

      if (node) {
        // Use requestAnimationFrame to ensure the element is fully rendered and positioned
        requestAnimationFrame(() => {
          setContainerReady(true);
        });
      }
    },
    [setContainerReady],
  );

  // Use useLayoutEffect as a fallback to ensure container is ready after DOM updates
  useLayoutEffect(() => {
    if (targetRef.current) {
      setContainerReady(true);
    }
  }, [setContainerReady]);

  // Close sidebar when switching to expanded mode
  useEffect(() => {
    if (isExpanded && isSideDrawerOpen) {
      closeSidebar();
    }
  }, [isExpanded, isSideDrawerOpen, closeSidebar]);

  return (
    <div
      className="flex w-full flex-col rounded-[20px] relative border border-border-dark bg-card overflow-hidden"
      style={{ height: isMobile ? '100%' : `min(calc(100vh - 32px), 730px)` }}
      ref={containerRefCallback}
    >
      {/* Header with flex-shrink-0 to prevent shrinking */}
      <div className="flex-shrink-0">
        <FeatureHeader
          title={hasActiveAdminSession && adminSessionInfo ? `${adminSessionInfo.name}` : `${askaiConfig?.agent_name}`}
          subtitle={isAdminTyping ? `${adminSessionInfo?.name || 'Admin'} is typing...` : undefined}
          welcomeMessage={messages?.length === 0 && !isAdminTyping ? askaiConfig?.welcome_message.message : undefined}
          icon={
            <HeaderAvatar
              adminSessionInfo={hasActiveAdminSession ? adminSessionInfo : undefined}
              selectedAvatar={isAvatarLoaded ? selectedAvatar : undefined}
              showLogo={showFavicon}
              logoUrl={orbLogoUrl}
              logoAlt="Orb Logo"
              logoSize={messages?.length === 0 ? 52 : 36}
              showOnlineIndicator={hasActiveAdminSession || showOnlineIndicator}
              onlineIndicatorProps={{ size: 16, borderWidth: 2, offset: 4 }}
            />
          }
          onClose={onClose}
          onExpand={onExpand}
          isExpanded={isExpanded}
          ctas={shouldBookMeetingCTAButtonShow && Boolean(sessionData) ? (askaiConfig?.ctas ?? []) : []}
          sendUserMessage={sendUserMessage}
        />
      </div>

      {/* Main content area with proper flex layout */}
      <div className="flex-1 flex flex-col min-h-0 p-2 pt-0">
        <div className="flex-1 flex flex-col min-h-0 rounded-[16px] border bg-background">
          {/* Messages container that can scroll */}
          <div className="flex-1 relative min-h-0">
            {!sessionData && !hasActiveAdminSession ? (
              <div className="absolute bottom-0 flex w-full items-center justify-center gap-3">
                <LucideIcon name="circle-dashed" className="h-3 w-3 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Initialising...</p>
              </div>
            ) : null}
            <Messages
              sendUserMessage={sendUserMessage}
              selectedAvatar={selectedAvatar}
              suggestedQuestions={suggestedQuestions}
              isStreaming={isStreaming}
              isLoading={isLoading}
              isAdminTyping={isAdminTyping}
              getRenderableMessages={getRenderableMessages}
              isDiscoveryQuestionShown={isDiscoveryQuestionShown}
              clearSuggestedQuestionsIfDiscoveryShown={clearSuggestedQuestionsIfDiscoveryShown}
              adminSessionInfo={adminSessionInfo}
              hasActiveAdminSession={hasActiveAdminSession}
              isExpanded={isExpanded}
              onExpand={onExpand}
              showLogo={showFavicon}
              logoUrl={orbLogoUrl}
            />
          </div>

          {/* Input area with flex-shrink-0 to maintain fixed height */}
          <div className="flex-shrink-0">
            <AskAiInput
              sendUserMessage={sendUserMessage}
              hasActiveAdminSession={hasActiveAdminSession}
              disabled={!sessionData || (isLoading && !hasActiveAdminSession)}
            />
          </div>
        </div>
      </div>

      {/* Footer with flex-shrink-0 */}
      <div className="flex-shrink-0 -mt-1 mb-1">
        <PoweredByBreakout />
      </div>
    </div>
  );
};

const AskAiContentWrapper = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  return (
    <SidebarArtifactProvider>
      <AskAiContentWithSidebar onClose={onClose} onExpand={onExpand} isExpanded={isExpanded} />
    </SidebarArtifactProvider>
  );
};

const AskAiContentWithSidebar = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  const {
    sideBarArtifact,
    isSideDrawerOpen,
    videoError,
    videoRef,
    shouldAutoPlay,
    closeSidebar,
    handleCloseComplete,
    handleVideoError,
  } = useSidebarArtifactContext();

  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="h-full w-full" ref={targetRef}>
        <AskAiContentInner onClose={onClose} onExpand={onExpand} isExpanded={isExpanded} />
      </div>
      <SidebarArtifactDrawer
        targetRef={targetRef}
        isOpen={isSideDrawerOpen}
        artifact={sideBarArtifact}
        videoError={videoError}
        videoRef={videoRef}
        shouldAutoPlay={shouldAutoPlay}
        onClose={closeSidebar}
        onCloseComplete={handleCloseComplete}
        onVideoError={handleVideoError}
      />
    </>
  );
};

export default AskAiContentWrapper;
