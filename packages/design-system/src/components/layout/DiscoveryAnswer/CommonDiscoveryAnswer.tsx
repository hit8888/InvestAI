import { cn } from '../../../lib/cn';
import UserMessageChatTail from '../../icons/user-message-chat-tail';
import { DISCOVERY_QUESTION_ANSWER_TYPE } from '@meaku/core/constants/index';

interface IProps {
  question: string;
  responses: string[];
  answerType: keyof typeof DISCOVERY_QUESTION_ANSWER_TYPE;
}

const CommonDiscoveryAnswer = ({ question, responses, answerType }: IProps) => {
  // NOTE: There are only two types of answers, multi-select and single-select.
  // If in future, we add more types of answers, we need to add them to the DISCOVERY_QUESTION_ANSWER_TYPE enum.
  // Then, we need to update the CommonDiscoveryAnswer component to handle the new types of answers.
  const { MULTI_SELECT, SINGLE_SELECT } = DISCOVERY_QUESTION_ANSWER_TYPE;
  const isMultiSelect = answerType === MULTI_SELECT;

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
        return <span className="text-customPrimaryText">{responses[0]}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 text-customPrimaryText">{question}</div>
      <div
        className={cn('ml-16 flex items-center justify-end', {
          'py-4 pr-2': isMultiSelect,
          'p-2': !isMultiSelect,
        })}
      >
        <div className="relative max-w-full rounded-2xl bg-transparent_gray_6 px-4 py-2">
          <div className="flex-col">{getResponsesContent()}</div>
          <UserMessageChatTail />
        </div>
      </div>
    </div>
  );
};

export default CommonDiscoveryAnswer;
