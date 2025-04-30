import { cn } from '../../../lib/cn';
import UserMessageChatTail from '../../icons/user-message-chat-tail';
import { DISCOVERY_QUESTION_ANSWER_TYPE } from '@meaku/core/constants/index';
import Typography from '../../Typography';
import { getMessageTimestamp } from '@meaku/core/utils/index';

interface IProps {
  question: string;
  responses: string[];
  answerType: keyof typeof DISCOVERY_QUESTION_ANSWER_TYPE;
  usingForAgent: boolean;
  timestamp: string;
}

const CommonDiscoveryAnswer = ({ question, responses, answerType, usingForAgent, timestamp }: IProps) => {
  // NOTE: There are only two types of answers, multi-select and single-select.
  // If in future, we add more types of answers, we need to add them to the DISCOVERY_QUESTION_ANSWER_TYPE enum.
  // Then, we need to update the CommonDiscoveryAnswer component to handle the new types of answers.
  const { MULTI_SELECT, SINGLE_SELECT } = DISCOVERY_QUESTION_ANSWER_TYPE;
  const isMultiSelect = answerType === MULTI_SELECT;
  const formattedTimestamp = getMessageTimestamp(timestamp);

  const getResponsesContent = () => {
    switch (answerType) {
      case MULTI_SELECT:
        return (
          <ul className="list-disc pl-5">
            {responses.map((response) => (
              <li key={response} className="mb-2">
                <span className="text-customPrimaryText">{response}</span>
              </li>
            ))}
          </ul>
        );
      case SINGLE_SELECT:
        return <span className="text-right text-customPrimaryText">{responses[0]}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 text-customPrimaryText">{question}</div>
      <div
        className={cn('ml-16 flex items-center justify-end', {
          'py-4 pr-2': isMultiSelect,
          'p-2': !isMultiSelect,
          'flex-col items-end gap-0': !usingForAgent,
        })}
      >
        {!usingForAgent ? (
          <Typography
            variant="caption-12-medium"
            align="right"
            textColor="gray500"
            className="w-full self-stretch pb-1 pr-2"
          >
            User
          </Typography>
        ) : null}
        <div className="relative flex max-w-full flex-col justify-end rounded-2xl bg-transparent_gray_6 px-4 py-2">
          <div className="flex flex-col">{getResponsesContent()}</div>
          <UserMessageChatTail />
          {!usingForAgent ? (
            <Typography variant="caption-12-medium" align="right" textColor="gray400">
              {formattedTimestamp}
            </Typography>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CommonDiscoveryAnswer;
