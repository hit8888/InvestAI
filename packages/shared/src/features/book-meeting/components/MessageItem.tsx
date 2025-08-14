import ArtifactsHistory from './ArtifactsHistory.tsx';
import MessageItemErrorBoundary from '../../../components/MessageItemErrorBoundary';
import CtaEventMessage from './CtaEventMessage.tsx';
import {
  checkIsArtifactMessage,
  checkIsSalesResponseComplete,
  getFormArtifactMessage,
  getFormFilledEventByArtifactId,
  isMediaArtifact,
  isCtaEvent,
  getMessagesWithSameResponseId,
} from '../../../utils/common';
import { ViewType } from '../../../utils/enum';
import { Message, SendUserMessageParams, MessageEventType } from '../../../types/message';
import { ArtifactMessageContent } from '../../../types/message';

interface IProps {
  viewType: ViewType;
  message: Message;
  messages: Message[];
  handleSendUserMessage: (data: SendUserMessageParams) => void;
}

const MessageItem = ({ viewType, message, messages, handleSendUserMessage }: IProps) => {
  const isArtifactMessage = checkIsArtifactMessage(message);

  const messagesWithSameResponseId = getMessagesWithSameResponseId(messages, message.response_id);
  const isSalesResponseComplete = checkIsSalesResponseComplete(messagesWithSameResponseId);

  const formArtifactMessage = getFormArtifactMessage(messagesWithSameResponseId);
  const qualifiedFormFilledMessage = getFormFilledEventByArtifactId(
    messages,
    formArtifactMessage,
    MessageEventType.QUALIFICATION_FORM_FILLED,
  );

  const isCtaEventMessage = isCtaEvent(message, 'left');

  const showMessageArtifactPreview =
    isArtifactMessage &&
    (isMediaArtifact((message.event_data as ArtifactMessageContent).artifact_type) || !!qualifiedFormFilledMessage) &&
    isSalesResponseComplete;

  const getMessageArtifactPreviewContent = (message: Message, showMessageArtifactPreview: boolean) => {
    if (!showMessageArtifactPreview) return null;
    return (
      <ArtifactsHistory
        message={message}
        messages={messages}
        viewType={viewType}
        handleSendUserMessage={handleSendUserMessage}
      />
    );
  };

  return (
    <MessageItemErrorBoundary message={message}>
      {getMessageArtifactPreviewContent(message, showMessageArtifactPreview)}

      {isCtaEventMessage && <CtaEventMessage event={message} handleSendUserMessage={handleSendUserMessage} />}
    </MessageItemErrorBoundary>
  );
};

export default MessageItem;
