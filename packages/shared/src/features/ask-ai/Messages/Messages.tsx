import { type Message as MessageType } from '../../../types/message';
import { AvatarComponentProps } from '@meaku/saral';
import React, { useMemo } from 'react';
import { groupMessagesWithAdminSessions, shouldShowSessionIndicator } from '../../../utils/message-utils';
import { useScrollManagement, useContainerHeight, useMessageData } from './hooks';
import { getLastGroupMinHeight } from './utils';
import { AdminSessionHeader, SuggestedQuestions, ScrollToBottomButton, MessageGroup } from './components';

interface MessagesProps {
  sendUserMessage?: (message: string, overrides?: Partial<MessageType>) => void;
  selectedAvatar?: {
    Component: React.ComponentType<AvatarComponentProps>;
    name: string;
    index: number;
  } | null;
  suggestedQuestions: string[];
  isStreaming: boolean;
  isLoading: boolean;
  isAdminTyping?: boolean;
  getRenderableMessages: () => MessageType[];
  isDiscoveryQuestionShown: () => boolean;
  clearSuggestedQuestionsIfDiscoveryShown: () => void;
  adminSessionInfo?: {
    name: string;
    profilePicture?: string | null;
  } | null;
  hasActiveAdminSession?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
}

export const Messages = ({
  sendUserMessage,
  selectedAvatar,
  suggestedQuestions,
  isStreaming,
  isLoading,
  isAdminTyping = false,
  getRenderableMessages,
  isDiscoveryQuestionShown,
  clearSuggestedQuestionsIfDiscoveryShown,
  adminSessionInfo,
  hasActiveAdminSession = false,
  isExpanded = false,
  onExpand,
}: MessagesProps) => {
  // Clear suggested questions if discovery questions are shown
  React.useEffect(() => {
    clearSuggestedQuestionsIfDiscoveryShown();
  }, [clearSuggestedQuestionsIfDiscoveryShown]);

  // Get renderable messages (filtered to exclude artifacts during streaming)
  const renderableMessages = getRenderableMessages();

  // Group messages using the declarative helper function
  const groupedMessages = useMemo(() => {
    return groupMessagesWithAdminSessions(renderableMessages);
  }, [renderableMessages]);

  // Calculate session indicator state
  const shouldShowIndicator = useMemo(() => {
    return shouldShowSessionIndicator(renderableMessages);
  }, [renderableMessages]);

  // Use custom hooks for different concerns
  const { containerRef, containerHeight } = useContainerHeight(renderableMessages.length);
  const { scrollContainerRef, lastMessageMarkerRef, showDownArrow, handleScroll, scrollToBottomHandler } =
    useScrollManagement({
      groupedMessagesLength: groupedMessages.length,
      hasActiveAdminSession,
      renderableMessagesLength: renderableMessages.length,
      isAdminTyping,
      isStreaming,
    });
  const {
    filledFormArtifactIds,
    filledQualificationArtifactIds,
    filledCalendarUrls,
    messagesWithinAdminSessions,
    getFilledData,
    getQualificationFilledData,
  } = useMessageData(renderableMessages);

  return (
    <div className="absolute inset-0 flex flex-col" ref={containerRef}>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef} onScroll={handleScroll}>
        <AdminSessionHeader hasActiveAdminSession={hasActiveAdminSession} />
        <div className="flex flex-col gap-6 p-3">
          {groupedMessages.map((messageGroup, groupIndex) => {
            const isLastGroup = groupIndex === groupedMessages.length - 1;

            return (
              <MessageGroup
                key={`group-${groupIndex}`}
                messageGroup={messageGroup}
                groupIndex={groupIndex}
                isLastGroup={isLastGroup}
                containerHeight={containerHeight}
                hasActiveAdminSession={hasActiveAdminSession}
                sendUserMessage={sendUserMessage}
                filledFormArtifactIds={filledFormArtifactIds}
                getFilledData={getFilledData}
                filledQualificationArtifactIds={filledQualificationArtifactIds}
                getQualificationFilledData={getQualificationFilledData}
                filledCalendarUrls={filledCalendarUrls}
                selectedAvatar={selectedAvatar}
                adminSessionInfo={adminSessionInfo}
                messagesWithinAdminSessions={messagesWithinAdminSessions}
                suggestedQuestions={suggestedQuestions}
                isStreaming={isStreaming}
                isDiscoveryQuestionShown={isDiscoveryQuestionShown}
                isLoading={isLoading}
                isAdminTyping={isAdminTyping}
                lastMessageMarkerRef={lastMessageMarkerRef}
                isExpanded={isExpanded}
                shouldShowSessionIndicator={shouldShowIndicator}
                onExpand={onExpand}
              />
            );
          })}
          {/* Show initial suggested questions when there are no messages */}
          {groupedMessages.length === 0 &&
            suggestedQuestions.length > 0 &&
            !isStreaming &&
            !isDiscoveryQuestionShown() && (
              <div
                className="flex flex-col gap-2"
                style={{
                  minHeight: getLastGroupMinHeight(true, containerHeight, hasActiveAdminSession),
                  transition: 'min-height 0.3s ease-in-out',
                }}
              >
                <SuggestedQuestions suggestedQuestions={suggestedQuestions} sendUserMessage={sendUserMessage} />
              </div>
            )}
        </div>
      </div>
      <ScrollToBottomButton showDownArrow={showDownArrow} onScrollToBottom={scrollToBottomHandler} />
    </div>
  );
};
