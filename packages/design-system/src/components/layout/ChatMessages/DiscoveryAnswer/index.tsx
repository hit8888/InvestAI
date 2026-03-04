import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import CommonDiscoveryAnswer from './CommonDiscoveryAnswer';
import { DISCOVERY_QUESTION_ANSWER_TYPE } from '@neuraltrade/core/constants/index';
import { ViewType } from '@neuraltrade/core/types/common';
import { isDiscoveryAnswer } from '@neuraltrade/core/utils/messageUtils';
import MessageItemLayout, { Gap, Padding } from '../MessageItemLayout';

type DiscoveryAnswerProps = {
  message: WebSocketMessage;
  viewType: ViewType;
};

export const DiscoveryAnswer = ({ message, viewType }: DiscoveryAnswerProps) => {
  const isDiscoveryAnswerMessage = isDiscoveryAnswer(message);
  if (
    !isDiscoveryAnswerMessage ||
    !message.message ||
    message.message_type !== 'EVENT' ||
    !('event_type' in message.message) ||
    message.message.event_type !== 'DISCOVERY_ANSWER'
  ) {
    return null;
  }

  const { MULTI_SELECT, SINGLE_SELECT } = DISCOVERY_QUESTION_ANSWER_TYPE;
  const question = message.message.event_data.question;
  const responses = message.message.event_data.responses.map((res) => res.value as string);

  const isMultiSelect = responses?.length > 1;
  const answerType = isMultiSelect ? MULTI_SELECT : SINGLE_SELECT;

  return (
    <MessageItemLayout gap={Gap.MEDIUM} paddingInline={viewType === ViewType.USER ? Padding.INLINE : Padding.NONE}>
      <CommonDiscoveryAnswer
        message={message}
        viewType={viewType}
        question={question}
        responses={responses}
        answerType={answerType}
      />
    </MessageItemLayout>
  );
};
