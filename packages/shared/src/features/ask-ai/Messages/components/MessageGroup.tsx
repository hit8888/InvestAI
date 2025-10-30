import React, { useMemo } from 'react';
import { type Message as MessageType } from '../../../../types/message';
import { Message } from '../Message';
import { WaveLoader } from '../../../../components/WaveLoader';
import { SuggestedQuestions } from './SuggestedQuestions';
import { TypingIndicator } from './TypingIndicator';
import { getLastGroupMinHeight } from '../utils/heightUtils';
import { AvatarComponentProps } from '@meaku/saral';
import { AvatarDisplay } from '../../../../components/AvatarDisplay';
import MessageErrorBoundary from '../../../../components/MessageErrorBoundary';
import { MessageFeedback } from '../MessageFeedback';

interface MessageGroupProps {
  messageGroup: MessageType[];
  groupIndex: number;
  isLastGroup: boolean;
  containerHeight: number;
  hasActiveAdminSession: boolean;
  sendUserMessage?: (message: string, overrides?: Partial<MessageType>) => void;
  filledFormArtifactIds: string[];
  getFilledData: (artifactId: string) => Record<string, string> | undefined;
  filledQualificationArtifactIds: string[];
  getQualificationFilledData: (artifactId: string, responseId?: string) => Array<{ id: string; answer: string }>;
  filledCalendarUrls: string[];
  selectedAvatar?: {
    Component: React.ComponentType<AvatarComponentProps>;
    name: string;
    index: number;
  } | null;
  adminSessionInfo?: {
    name: string;
    profilePicture?: string | null;
  } | null;
  messagesWithinAdminSessions: Set<string>;
  suggestedQuestions: string[];
  isStreaming: boolean;
  isLoading: boolean;
  isAdminTyping: boolean;
  isDiscoveryQuestionShown: () => boolean;
  lastMessageMarkerRef: React.RefObject<HTMLDivElement | null>;
  isExpanded?: boolean;
  shouldShowSessionIndicator: boolean;
  onExpand?: () => void;
  showLogo?: boolean;
  logoUrl?: string | null;
  feedbackEnabled?: boolean;
}

export const MessageGroup: React.FC<MessageGroupProps> = ({
  messageGroup,
  groupIndex,
  isLastGroup,
  containerHeight,
  hasActiveAdminSession,
  sendUserMessage,
  getFilledData,
  getQualificationFilledData,
  filledCalendarUrls,
  selectedAvatar,
  adminSessionInfo,
  messagesWithinAdminSessions,
  suggestedQuestions,
  isStreaming,
  isDiscoveryQuestionShown,
  isLoading,
  isAdminTyping,
  lastMessageMarkerRef,
  isExpanded = false,
  shouldShowSessionIndicator,
  onExpand,
  showLogo,
  logoUrl,
  feedbackEnabled,
}) => {
  const shouldShowSuggestedQuestions = useMemo(() => {
    return isLastGroup && suggestedQuestions.length > 0 && !isDiscoveryQuestionShown() && !isStreaming;
  }, [isLastGroup, suggestedQuestions, isDiscoveryQuestionShown, isStreaming]);

  return (
    <div
      key={`group-${groupIndex}`}
      data-group-index={groupIndex}
      className="flex flex-col gap-2"
      style={{
        ...(getLastGroupMinHeight(isLastGroup, containerHeight, hasActiveAdminSession)
          ? {
              minHeight: getLastGroupMinHeight(isLastGroup, containerHeight, hasActiveAdminSession),
            }
          : {}),
        transition: 'min-height 0.3s ease-in-out',
      }}
    >
      {messageGroup.map((message, messageIndex) => {
        const isLastMessageInGroup = messageIndex === messageGroup.length - 1;
        const isLatestMessage = isLastGroup && isLastMessageInGroup;

        return (
          <MessageErrorBoundary key={`${message.response_id}-${messageIndex}`} message={message}>
            <Message
              message={message}
              sendUserMessage={sendUserMessage}
              getFilledData={getFilledData}
              getQualificationFilledData={getQualificationFilledData}
              filledCalendarUrls={filledCalendarUrls}
              selectedAvatar={selectedAvatar}
              adminSessionInfo={adminSessionInfo}
              isWithinAdminSession={messagesWithinAdminSessions.has(message.response_id || '')}
              isLatestMessage={isLatestMessage}
              isExpanded={isExpanded}
              shouldShowSessionIndicator={shouldShowSessionIndicator}
              onExpand={onExpand}
              showLogo={showLogo}
              logoUrl={logoUrl}
            />
            {message.role === 'ai' &&
              (message.event_type === 'TEXT_RESPONSE' || message.event_type === 'STREAM_RESPONSE') &&
              feedbackEnabled && <MessageFeedback message={message} />}
          </MessageErrorBoundary>
        );
      })}

      {shouldShowSuggestedQuestions && (
        <SuggestedQuestions suggestedQuestions={suggestedQuestions} sendUserMessage={sendUserMessage} />
      )}

      {/* Show loader after the last message in the last group */}
      {isLastGroup && isLoading && !hasActiveAdminSession && (
        <div className="mr-auto flex gap-2 min-h-11 max-w-[80%] items-center justify-start rounded-xl">
          <AvatarDisplay
            adminSessionInfo={hasActiveAdminSession ? adminSessionInfo : undefined}
            selectedAvatar={selectedAvatar}
            showLogo={showLogo}
            logoUrl={logoUrl}
          />
          <WaveLoader />
        </div>
      )}

      <TypingIndicator
        isLastGroup={isLastGroup}
        hasActiveAdminSession={hasActiveAdminSession}
        isAdminTyping={isAdminTyping}
        adminSessionInfo={adminSessionInfo}
        selectedAvatar={selectedAvatar}
      />

      {/* Last message marker for live admin sessions */}
      {isLastGroup && hasActiveAdminSession && (
        <div ref={lastMessageMarkerRef} className="-my-1 h-0 w-0" aria-hidden="true" />
      )}
    </div>
  );
};
