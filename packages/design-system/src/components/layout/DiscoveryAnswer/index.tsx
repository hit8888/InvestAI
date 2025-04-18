import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import CommonDiscoveryAnswer from './CommonDiscoveryAnswer';
import { DISCOVERY_QUESTION_ANSWER_TYPE } from '@meaku/core/constants/index';

export const DiscoveryAnswer = ({ message }: { message: WebSocketMessage }) => {
  if (
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

  return <CommonDiscoveryAnswer question={question} responses={responses} answerType={answerType} />;
};
