import ArtifactsHistory from './ArtifactsHistory.tsx';
import CtaEventMessage from './CtaEventMessage.tsx';
import { checkIsArtifactMessage, isCtaEvent } from '../../../utils/common.ts';
import { Message, SendUserMessageParams, MessageEventType } from '../../../types/message.ts';

interface IProps {
  messages: Message[];
  onExpand: () => void;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
}

const artifactPriorityOrder = {
  [MessageEventType.FORM_ARTIFACT]: 1,
  [MessageEventType.QUALIFICATION_FORM_ARTIFACT]: 2,
  [MessageEventType.CALENDAR_ARTIFACT]: 3,
};

const BookMeetingFlowContainer = ({ messages, handleSendUserMessage, onExpand }: IProps) => {
  // Filter messages to get explicit event messages for form, qualification form, and calendar flows
  const artifactMessages = messages.filter(
    (message) =>
      message.event_type === MessageEventType.FORM_ARTIFACT ||
      message.event_type === MessageEventType.QUALIFICATION_FORM_ARTIFACT ||
      message.event_type === MessageEventType.CALENDAR_ARTIFACT,
  );

  const orderedArtifactMessages = artifactMessages.sort(
    (a, b) => artifactPriorityOrder[a.event_type] - artifactPriorityOrder[b.event_type],
  );

  // Filter CTA event messages with left alignment (as per original logic)
  const ctaEventMessage = messages.find((message) => isCtaEvent(message));

  const renderArtifactMessage = (message: Message) => {
    const isArtifactMessage = checkIsArtifactMessage(message);
    if (!isArtifactMessage) return null;

    return (
      <ArtifactsHistory
        key={`artifact-${message.response_id}-${message.timestamp}`}
        message={message}
        messages={messages}
        handleSendUserMessage={handleSendUserMessage}
        onExpand={onExpand}
      />
    );
  };

  // If no relevant messages to display, return empty div
  if (orderedArtifactMessages.length === 0 && !ctaEventMessage) {
    return null;
  }

  const latestArtifactMessage = orderedArtifactMessages[orderedArtifactMessages.length - 1];

  return (
    <div className="w-full p-4">
      {/* Render artifact messages (Form and Calendar artifacts) */}
      {!ctaEventMessage && renderArtifactMessage(latestArtifactMessage)}

      {/* Render CTA event messages */}
      {ctaEventMessage && (
        <CtaEventMessage
          key={`cta-${ctaEventMessage.response_id}-${ctaEventMessage.timestamp}`}
          event={ctaEventMessage}
          handleSendUserMessage={handleSendUserMessage}
          showIcon
        />
      )}
    </div>
  );
};

export default BookMeetingFlowContainer;
