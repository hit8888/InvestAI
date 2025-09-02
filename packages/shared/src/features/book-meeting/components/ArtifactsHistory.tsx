import { useState, useEffect } from 'react';
import { ArtifactContentUi } from './ArtifactContentUi';
import { isCalendarArtifact } from '../../../utils/common';
import useNormalAndQualificationFormArtifactMetadataProvider from '../hooks/useNormalAndQualificationFormArtifactMetadataProvider';
import { ArtifactContentWithMetadataProps } from '../../../utils/artifact';
import { CalendarBookingSuccessfull } from '../../../components/calendar';
import { Message, SendUserMessageParams } from '../../../types/message';
import { WaveLoader } from '../../../components/WaveLoader';

interface IProps {
  message: Message;
  messages: Message[];
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  onExpand: () => void;
}

const ArtifactsHistory = ({ message, messages, handleSendUserMessage, onExpand }: IProps) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [delayComplete, setDelayComplete] = useState(false);

  const messageEventType = message.event_type;

  const { isQualificationFormArtifact, artifactContentWithMetadata } =
    useNormalAndQualificationFormArtifactMetadataProvider({
      messageEventType,
      messages,
      responseId: message.response_id,
    });

  const calendarMessageExist = messages.some((msg) => isCalendarArtifact(msg));
  const shouldShowConfirmedMessage =
    isQualificationFormArtifact &&
    artifactContentWithMetadata?.metadata.qualificationQuestionFormMetadata.is_filled &&
    !calendarMessageExist &&
    !artifactContentWithMetadata?.ctaEvent;

  // Handle delay for success message
  useEffect(() => {
    if (shouldShowConfirmedMessage && !delayComplete) {
      const timer = setTimeout(() => {
        setDelayComplete(true);
        setShowSuccessMessage(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowConfirmedMessage, delayComplete]);

  const isFormOrCalendarArtifact =
    messageEventType === 'FORM_ARTIFACT' ||
    messageEventType === 'CALENDAR_ARTIFACT' ||
    messageEventType === 'QUALIFICATION_FORM_ARTIFACT';

  if (shouldShowConfirmedMessage) {
    if (showSuccessMessage) {
      return (
        <CalendarBookingSuccessfull
          title="Form Submitted Successfully"
          description="Thanks for reaching out—someone from our team will connect with you shortly."
        />
      );
    }
    return (
      <div className="flex min-h-60 items-center justify-center">
        <WaveLoader />
      </div>
    );
  }

  if (!isFormOrCalendarArtifact) return null;

  return (
    <ArtifactContentUi
      messageEventType={messageEventType}
      artifactContent={artifactContentWithMetadata as ArtifactContentWithMetadataProps}
      handleSendUserMessage={handleSendUserMessage}
      activeArtifactResponseId={message.response_id}
      calendarMessageExist={calendarMessageExist}
      onExpand={onExpand}
    />
  );
};

export default ArtifactsHistory;
