import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { SingleSelectQuestion } from './SingleSelectQuestion';
import { MultiSelectQuestion } from './MultiSelectQuestion';
import { EventData, OptionType } from './types';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';

interface IProps {
  message: WebSocketMessage;
  onSubmit: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
}

export default function DiscoveryQuestion({ message, onSubmit }: IProps) {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const sendEvent = (eventData: EventData) => {
    onSubmit({
      message_type: 'EVENT',
      message: {
        content: '',
        event_type: AgentEventType.DISCOVERY_ANSWER,
        event_data: eventData,
      },
    });
  };

  const handleSingleSelectSubmit = (question: string, option: OptionType) => {
    const eventData = {
      question,
      responses: [option],
    };

    sendEvent(eventData);

    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.SINGLE_SELECT_DISCOVERY_QUESTION_SUBMIT, eventData);
  };

  const handleMultiSelectSubmit = (question: string, responses: OptionType[]) => {
    const eventData = {
      question,
      responses,
    };

    sendEvent(eventData);

    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.MULTI_SELECT_DISCOVERY_QUESTION_SUBMIT, eventData);
  };

  if (
    !message.message ||
    message.message_type !== 'EVENT' ||
    !('event_type' in message.message) ||
    message.message.event_type !== 'DISCOVERY_QUESTIONS'
  ) {
    return null;
  }

  const { event_data } = message.message;
  const { answer_type, question, response_options } = event_data;

  switch (answer_type) {
    case 'SINGLE_SELECT':
      return (
        <SingleSelectQuestion
          question={question}
          response_options={response_options}
          onSelect={(option) => handleSingleSelectSubmit(question, option)}
        />
      );
    case 'MULTI_SELECT':
      return (
        <MultiSelectQuestion
          question={question}
          response_options={response_options}
          onSubmit={(responses) => handleMultiSelectSubmit(question, responses)}
        />
      );
    case 'TEXT':
      return (
        <div className="w-full max-w-md rounded-lg bg-gray-50 p-4">
          <p className="text-md font-semibold text-gray-800">{question}</p>
        </div>
      );
    default:
      return null;
  }
}
