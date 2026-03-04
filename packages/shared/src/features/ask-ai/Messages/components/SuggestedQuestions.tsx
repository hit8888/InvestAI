import { Typography, LucideIcon } from '@neuraltrade/saral';
import { MessageEventType, type Message as MessageType } from '../../../../types/message';

type SuggestedQuestionsProps = {
  suggestedQuestions: string[];
  sendUserMessage?: (message: string, overrides?: Partial<MessageType>) => void;
};

export const SuggestedQuestions = ({ suggestedQuestions, sendUserMessage }: SuggestedQuestionsProps) => {
  return (
    <div className="w-full flex flex-col items-end gap-2 pl-8">
      <Typography variant="body-small" className="flex items-center gap-2 p-2.5 pl-0 text-primary">
        <LucideIcon name="sparkles" className="size-4" />
        Try Asking
      </Typography>
      {suggestedQuestions.map((question) => (
        <div className="w-full flex justify-end mb-2 last:mb-0">
          <div className="w-fit">
            <button
              type="button"
              key={question}
              onClick={() => sendUserMessage?.(question, { event_type: MessageEventType.SUGGESTED_QUESTION_CLICKED })}
              className="rounded-full bg-card px-4 py-2 text-sm text-end text-foreground hover:bg-muted whitespace-normal break-words w-fit"
            >
              {question}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
