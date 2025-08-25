import { Typography } from '@meaku/saral';
import { Sparkles } from 'lucide-react';
import { MessageEventType, type Message as MessageType } from '../../../../types/message';

type SuggestedQuestionsProps = {
  showTryAsking?: boolean;
  suggestedQuestions: string[];
  sendUserMessage?: (message: string, overrides?: Partial<MessageType>) => void;
};

export const SuggestedQuestions = ({
  suggestedQuestions,
  sendUserMessage,
  showTryAsking = false,
}: SuggestedQuestionsProps) => {
  return (
    <div className="w-full flex flex-col items-end gap-2 pl-8">
      {showTryAsking && (
        <Typography variant="body-small" className="flex items-center gap-2 p-2.5 pl-0 text-primary">
          <Sparkles className="size-4" />
          Try Asking
        </Typography>
      )}
      {suggestedQuestions.map((question) => (
        <button
          type="button"
          key={question}
          onClick={() => sendUserMessage?.(question, { event_type: MessageEventType.SUGGESTED_QUESTION_CLICKED })}
          className="rounded-full bg-card px-4 py-2 text-sm text-start text-foreground hover:bg-muted"
        >
          {question}
        </button>
      ))}
    </div>
  );
};
