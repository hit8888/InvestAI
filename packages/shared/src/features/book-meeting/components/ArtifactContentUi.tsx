import {
  FormArtifactContent,
  FormArtifactMetadataType,
  ArtifactContentWithMetadataProps,
  AdditionalCalendarArtifactContent,
} from '../../../utils/artifact';
import { BookMeetingCalendarArtifact } from './BookMeetingCalendarArtifact';
import QualificationFlowArtifact from './QualificationFlow/QualificationFlowArtifact';
import { SendUserMessageParams } from '../../../types/message';
import FormArtifact from './FormArtifact';

interface Props {
  messageEventType: string | undefined;
  artifactContent: ArtifactContentWithMetadataProps;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  isQualificationFormArtifact?: boolean;
  activeArtifactResponseId?: string;
  calendarMessageExist?: boolean;
}

export const ArtifactContentUi = ({
  messageEventType,
  artifactContent,
  handleSendUserMessage,
  activeArtifactResponseId,
  calendarMessageExist,
}: Props) => {
  if (!messageEventType || !artifactContent) {
    return null;
  }

  switch (messageEventType) {
    case 'CALENDAR_ARTIFACT':
      return (
        <BookMeetingCalendarArtifact
          key={(artifactContent as AdditionalCalendarArtifactContent).calendar_url}
          calendarContent={artifactContent as AdditionalCalendarArtifactContent}
          handleSendUserMessage={handleSendUserMessage}
          artifactResponseId={activeArtifactResponseId}
        />
      );
    case 'FORM_ARTIFACT':
      return (
        <FormArtifact
          artifactId={artifactContent.artifact_id}
          artifactResponseId={activeArtifactResponseId}
          artifact={artifactContent as FormArtifactContent}
          artifactMetadata={artifactContent.metadata as FormArtifactMetadataType}
          handleSendUserMessage={handleSendUserMessage}
          calendarMessageExist={calendarMessageExist}
        />
      );
    case 'QUALIFICATION_FORM_ARTIFACT':
      return (
        <QualificationFlowArtifact
          artifact={{
            artifact_id: artifactContent.artifact_id,
            content: artifactContent as FormArtifactContent,
            metadata: artifactContent.metadata as FormArtifactMetadataType,
            ctaEvent: artifactContent.ctaEvent,
            response_id: activeArtifactResponseId,
          }}
          handleSendUserMessage={handleSendUserMessage}
        />
      );
    default:
      return null;
  }
};
