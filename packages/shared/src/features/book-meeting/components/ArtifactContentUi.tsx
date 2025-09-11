import {
  FormArtifactContent,
  FormArtifactMetadataType,
  ArtifactContentWithMetadataProps,
  AdditionalCalendarArtifactContent,
  CalendarArtifactContent,
} from '../../../utils/artifact';
import { CalendarArtifact } from '../../../components/calendar';
import { SendUserMessageParams } from '../../../types/message';
import FormArtifact from '../../../components/FormArtifact';
import { QualificationFormArtifact } from '../../../components/QualificationFormArtifact';
import { transformQualificationFilledData } from '../../../utils/common';

interface Props {
  messageEventType: string | undefined;
  artifactContent: ArtifactContentWithMetadataProps;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  isQualificationFormArtifact?: boolean;
  activeArtifactResponseId?: string;
  calendarMessageExist?: boolean;
  onExpand: () => void;
}

export const ArtifactContentUi = ({
  messageEventType,
  artifactContent,
  handleSendUserMessage,
  activeArtifactResponseId,
  calendarMessageExist,
  onExpand,
}: Props) => {
  if (!messageEventType || !artifactContent) {
    return null;
  }

  switch (messageEventType) {
    case 'CALENDAR_ARTIFACT':
      return (
        <div className="relative">
          <CalendarArtifact
            key={(artifactContent as AdditionalCalendarArtifactContent).calendar_url}
            content={artifactContent as CalendarArtifactContent}
            metadata={artifactContent.metadata}
            handleSendUserMessage={handleSendUserMessage}
            artifactResponseId={activeArtifactResponseId}
            onExpand={onExpand}
          />
        </div>
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
          filledData={artifactContent.metadata.formMetadata?.filled_data}
        />
      );
    case 'QUALIFICATION_FORM_ARTIFACT':
      return (
        <QualificationFormArtifact
          artifactId={artifactContent.artifact_id}
          content={artifactContent as FormArtifactContent}
          handleSendUserMessage={handleSendUserMessage}
          isFilled={artifactContent.metadata.qualificationQuestionFormMetadata.is_filled}
          responseId={activeArtifactResponseId}
          filledData={transformQualificationFilledData(
            artifactContent.metadata.qualificationQuestionFormMetadata?.filled_data,
          )}
        />
      );
    default:
      return null;
  }
};
