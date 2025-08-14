import { Typography } from '@meaku/saral';
import { SendUserMessageParams } from '../../../types/message';

interface DiscoveryQuestionProps {
  question: string;
  isRequired: boolean;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  responseId?: string;
}

export const DiscoveryQuestion = ({ question, isRequired }: DiscoveryQuestionProps) => {
  return (
    <div className="w-full border-none">
      <div className="flex flex-col gap-2">
        <Typography variant="body" className="font-semibold text-primary">
          {question}
        </Typography>
        {isRequired && (
          <Typography variant="body-small" className="text-muted-foreground">
            * Required - Please answer in the chat below
          </Typography>
        )}
      </div>
    </div>
  );
};
