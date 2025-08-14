import { useState, useEffect } from 'react';
import { ViewType } from '../../../utils/enum';
import { ArtifactContentUi } from './ArtifactContentUi';
import { checkIsArtifactMessage, isCalendarArtifact } from '../../../utils/common';
import useNormalAndQualificationFormArtifactMetadataProvider from '../hooks/useNormalAndQualificationFormArtifactMetadataProvider';
import { ArtifactContentWithMetadataProps } from '../../../utils/artifact';
import { CalendarBookingSuccessfull } from '../../../components/calendar';
import { Message, SendUserMessageParams, ArtifactMessageContent } from '../../../types/message';
import { WaveLoader } from '../../../components/WaveLoader';

interface IProps {
  message: Message;
  messages: Message[];
  viewType: ViewType;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
}

const ArtifactsHistory = ({ message, messages, viewType, handleSendUserMessage }: IProps) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [delayComplete, setDelayComplete] = useState(false);

  const isArtifactMessage = checkIsArtifactMessage(message);
  const messageData = message.event_data as ArtifactMessageContent;
  const currentArtifactId = isArtifactMessage ? messageData.artifact_data?.artifact_id : '';

  const { isQualificationFormArtifact, artifactContentWithMetadata } =
    useNormalAndQualificationFormArtifactMetadataProvider({
      artifactId: currentArtifactId,
      messages,
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

  if (!isArtifactMessage) return null;

  const artifactType = isArtifactMessage ? messageData.artifact_data?.artifact_type : undefined;
  const isFormOrCalendarArtifact = artifactType === 'FORM' || artifactType === 'CALENDAR';

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
      artifactType={artifactType}
      artifactContent={artifactContentWithMetadata as ArtifactContentWithMetadataProps}
      activeArtifactId={currentArtifactId}
      handleSendUserMessage={handleSendUserMessage}
      isQualificationFormArtifact={isQualificationFormArtifact}
      viewType={viewType}
      activeArtifactResponseId={message.response_id}
      calendarMessageExist={calendarMessageExist}
    />
  );
};

export default ArtifactsHistory;
