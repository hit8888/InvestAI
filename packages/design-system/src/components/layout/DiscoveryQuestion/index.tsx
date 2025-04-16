import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { SingleSelectQuestion } from './SingleSelectQuestion';
import { MultiSelectQuestion } from './MultiSelectQuestion';
import { EventData, OptionType } from './types';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { useEffect } from 'react';
import { cn } from '../../../lib/cn';
import { ReactNode } from 'react';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';

interface IProps {
  message: WebSocketMessage;
  isLastMessage?: boolean;
  onSubmit: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
}

export default function DiscoveryQuestion({ message, isLastMessage = false, onSubmit }: IProps) {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  useEffect(() => {
    if (
      !message.message ||
      message.message_type !== 'EVENT' ||
      !('event_type' in message.message) ||
      message.message.event_type !== 'DISCOVERY_QUESTIONS'
    ) {
      return;
    }

    const { event_data } = message.message;
    const { answer_type, question, response_options } = event_data;

    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DISCOVERY_QUESTIONS, {
      answer_type,
      question,
      response_options,
    });
  }, [message.message, message.message_type]);

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

  const discoveryQuestionsRef = useElementScrollIntoView<HTMLDivElement>();

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
  const isAnswerTypeText = answer_type === 'TEXT';

  if (!isLastMessage && !isAnswerTypeText) {
    return null;
  }

  const getDiscoveryQuestionContent: ReactNode | null = (() => {
    let content: ReactNode | null;
    switch (answer_type) {
      case 'SINGLE_SELECT':
        content = (
          <SingleSelectQuestion
            question={question}
            response_options={response_options}
            onSelect={(option) => handleSingleSelectSubmit(question, option)}
          />
        );
        break;
      case 'MULTI_SELECT':
        content = (
          <MultiSelectQuestion
            question={question}
            response_options={response_options}
            onSubmit={(responses) => handleMultiSelectSubmit(question, responses)}
          />
        );
        break;
      case 'TEXT':
        content = isLastMessage ? (
          <p className="text-md font-semibold text-gray-800">{question}</p>
        ) : (
          <div className="text-md mb-2 text-gray-700">{question}</div>
        );
        break;
      default:
        content = null;
    }

    return content;
  })();

  return (
    <div
      ref={discoveryQuestionsRef}
      className={cn('w-full max-w-md rounded-lg bg-transparent_gray_3', {
        'p-4': isAnswerTypeText,
        'p-5': !isAnswerTypeText,
      })}
    >
      {getDiscoveryQuestionContent}
    </div>
  );
}
