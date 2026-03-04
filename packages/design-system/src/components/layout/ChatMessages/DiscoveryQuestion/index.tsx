import { useEffect } from 'react';
import { ReactNode } from 'react';
import { AgentEventType, WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { SingleSelectQuestion } from './SingleSelectQuestion';
import { MultiSelectQuestion } from './MultiSelectQuestion';
import { EventData, OptionType } from './types';
import ANALYTICS_EVENT_NAMES from '@neuraltrade/core/constants/analytics';
import useAgentbotAnalytics from '@neuraltrade/core/hooks/useAgentbotAnalytics';
import { DISCOVERY_QUESTION_ANSWER_TYPE } from '@neuraltrade/core/constants/index';
import TextBasedDiscoveryQuestion from './TextBasedDiscoveryQuestion';
import { ViewType } from '@neuraltrade/core/types/common';
import MessageItemLayout, { Alignment, Gap, Padding } from '../MessageItemLayout';

interface IProps {
  message: WebSocketMessage;
  isLastMessage?: boolean;
  onSubmit: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  viewType: ViewType;
  renderOrb: () => ReactNode;
  shouldShowActiveOrb: boolean;
}

export default function DiscoveryQuestion({
  message,
  isLastMessage = false,
  onSubmit,
  viewType,
  renderOrb,
  shouldShowActiveOrb,
}: IProps) {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  // TODO: Block of code (Line 29-39) is a duplicate of the Code Block (Line 81 - 91)  below.
  // We should refactor this to use a single check.
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
  }, [message.message, message.message_type, trackAgentbotEvent]);

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

  const { MULTI_SELECT, SINGLE_SELECT, TEXT } = DISCOVERY_QUESTION_ANSWER_TYPE;
  const isAnswerTypeText = answer_type === TEXT;

  if (!isLastMessage && !isAnswerTypeText) {
    return null;
  }

  const getDiscoveryQuestionContent: ReactNode | null = (() => {
    let content: ReactNode | null;
    switch (answer_type) {
      case SINGLE_SELECT:
        content = (
          <SingleSelectQuestion
            message={message}
            viewType={viewType}
            question={question}
            response_options={response_options}
            onSelect={(option) => handleSingleSelectSubmit(question, option)}
          />
        );
        break;
      case MULTI_SELECT:
        content = (
          <MultiSelectQuestion
            message={message}
            viewType={viewType}
            question={question}
            response_options={response_options}
            onSubmit={(responses) => handleMultiSelectSubmit(question, responses)}
          />
        );
        break;
      case TEXT:
        content = <TextBasedDiscoveryQuestion isLastMessage={isLastMessage} question={question} />;
        break;
      default:
        content = null;
    }

    return content;
  })();

  return (
    <MessageItemLayout
      align={Alignment.LEFT}
      gap={Gap.MEDIUM}
      paddingInline={shouldShowActiveOrb ? Padding.NONE : Padding.INLINE}
    >
      {shouldShowActiveOrb && renderOrb()}
      {getDiscoveryQuestionContent}
    </MessageItemLayout>
  );
}
