import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { MultiSelectAnswer } from './MultiSelectAnswer';
import { SingleSelectAnswer } from './SingleSelectAnswer';

export const DiscoveryAnswer = ({ message }: { message: WebSocketMessage }) => {
  if (
    !message.message ||
    message.message_type !== 'EVENT' ||
    !('event_type' in message.message) ||
    message.message.event_type !== 'DISCOVERY_ANSWER'
  ) {
    return null;
  }

  const question = message.message.event_data.question;
  const responses = message.message.event_data.responses.map((res) => res.value as string);

  if (responses?.length > 1) {
    return <MultiSelectAnswer question={question} responses={responses} />;
  } else {
    return <SingleSelectAnswer question={question} response={responses[0]} />;
  }
};
