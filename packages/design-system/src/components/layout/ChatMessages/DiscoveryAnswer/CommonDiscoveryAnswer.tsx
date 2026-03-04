import { cn } from '@breakout/design-system/lib/cn';
import { DISCOVERY_QUESTION_ANSWER_TYPE } from '@neuraltrade/core/constants/index';
import { MessageSenderRole, ViewType } from '@neuraltrade/core/types/common';
import { getMessageViewType, isHumanMessageInDashboardView } from '@neuraltrade/core/utils/messageUtils';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import ChatMessageTail from '../ChatMessageTail';
import ChatMessageTimestamp from '../ChatMessageTimestamp';
import ChatMessageSender from '../ChatMessageSender';
import { getChatMessageClass, getDiscoveryAnswerContainerClass } from '../../messageUtils';

interface IProps {
  message: WebSocketMessage;
  question: string;
  responses: string[];
  answerType: keyof typeof DISCOVERY_QUESTION_ANSWER_TYPE;
  viewType: ViewType;
}

const CommonDiscoveryAnswer = ({ message, question, responses, answerType, viewType }: IProps) => {
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
        return <span className="text-right text-customPrimaryText">{responses[0]}</span>;
      default:
        return null;
    }
  };

  const messageViewType = getMessageViewType(message.role as MessageSenderRole, viewType);

  return (
    <div className="w-full">
      <div className="mb-2 text-customPrimaryText">{question}</div>
      <div
        className={cn('flex items-center', getDiscoveryAnswerContainerClass(messageViewType), {
          'py-4 pr-2': isMultiSelect,
          'p-2': !isMultiSelect,
          'flex-col items-end gap-0': isHumanMessageInDashboardView(messageViewType),
        })}
      >
        <div
          className={`relative flex max-w-full flex-col justify-end rounded-2xl px-4 py-2 ${getChatMessageClass(messageViewType)}`}
        >
          <ChatMessageSender messageViewType={messageViewType} role={message.role} />

          <div className="flex flex-col">{getResponsesContent()}</div>

          <ChatMessageTimestamp messageViewType={messageViewType} timestamp={message.timestamp} />

          <ChatMessageTail messageViewType={messageViewType} />
        </div>
      </div>
    </div>
  );
};

export default CommonDiscoveryAnswer;
