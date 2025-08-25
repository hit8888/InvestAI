import React from 'react';
import { Typography, Icons } from '@meaku/saral';
import { MessageEventType, type Message as MessageType } from '../../../../types/message';

interface SuggestedQuestionsProps {
  suggestedQuestions: string[];
  isStreaming: boolean;
  isDiscoveryQuestionShown: () => boolean;
  sendUserMessage?: (message: string, overrides?: Partial<MessageType>) => void;
  messages: MessageType[];
  isLastGroup: boolean;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  suggestedQuestions,
  isStreaming,
  isDiscoveryQuestionShown,
  sendUserMessage,
  messages,
  isLastGroup,
}) => {
  const shouldShowSuggestedQuestions =
    isLastGroup &&
    suggestedQuestions.length > 0 &&
    !isStreaming &&
    !isDiscoveryQuestionShown() &&
    (() => {
      // Don't show suggested questions if the last message is a calendar or form artifact
      const lastMessage = messages[messages.length - 1];
      const isLastMessageCalendarArtifact = lastMessage?.event_type === MessageEventType.CALENDAR_ARTIFACT;
      const isLastMessageFormArtifact =
        lastMessage?.event_type === MessageEventType.FORM_ARTIFACT ||
        lastMessage?.event_type === MessageEventType.FORM_FILLED;

      return !isLastMessageCalendarArtifact && !isLastMessageFormArtifact;
    })();

  if (!shouldShowSuggestedQuestions) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      <Typography variant="body-small" className="flex items-center gap-2 p-2.5 pl-0 text-primary">
        <Icons.Sparkles className="size-4" />
        Try Asking
      </Typography>
      {suggestedQuestions.map((question) => (
        <div
          key={question}
          onClick={() => sendUserMessage?.(question, { event_type: MessageEventType.SUGGESTED_QUESTION_CLICKED })}
          className="inline-block max-w-full cursor-pointer rounded-[108px] bg-card px-4 py-2 text-sm text-foreground hover:bg-muted font-normal"
        >
          {question}
        </div>
      ))}
    </div>
  );
};
