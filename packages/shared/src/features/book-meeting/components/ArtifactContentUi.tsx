import {
  FormArtifactContent,
  FormArtifactMetadataType,
  ArtifactContentWithMetadataProps,
  AdditionalCalendarArtifactContent,
} from '../../../utils/artifact';
import { BookMeetingCalendarArtifact } from './BookMeetingCalendarArtifact';
import QualificationFlowArtifact from './QualificationFlow/QualificationFlowArtifact';
import { SendUserMessageParams } from '../../../types/message';
import { ViewType } from '../../../utils/enum';
import FormArtifact from './FormArtifact';

interface Props {
  viewType: ViewType;
  artifactType: string | undefined;
  artifactContent: ArtifactContentWithMetadataProps;
  activeArtifactId: string;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  isQualificationFormArtifact?: boolean;
  activeArtifactResponseId?: string;
  calendarMessageExist?: boolean;
}

export const ArtifactContentUi = ({
  artifactType,
  artifactContent,
  activeArtifactId,
  handleSendUserMessage,
  isQualificationFormArtifact,
  viewType,
  activeArtifactResponseId,
  calendarMessageExist,
}: Props) => {
  if (!artifactType || !artifactContent) {
    return null;
  }

  switch (artifactType) {
    case 'CALENDAR':
      return (
        <BookMeetingCalendarArtifact
          key={(artifactContent as AdditionalCalendarArtifactContent).calendar_url}
          calendarContent={artifactContent as AdditionalCalendarArtifactContent}
          handleSendUserMessage={handleSendUserMessage}
          artifactResponseId={activeArtifactResponseId}
        />
      );
    case 'FORM':
      if (isQualificationFormArtifact) {
        return (
          <QualificationFlowArtifact
            artifact={{
              artifact_id: activeArtifactId,
              content: artifactContent as FormArtifactContent,
              metadata: artifactContent.metadata as FormArtifactMetadataType,
              ctaEvent: artifactContent.ctaEvent,
              response_id: activeArtifactResponseId,
            }}
            handleSendUserMessage={handleSendUserMessage}
          />
        );
      } else {
        return (
          <FormArtifact
            artifactId={activeArtifactId}
            artifactResponseId={activeArtifactResponseId}
            artifact={artifactContent as FormArtifactContent}
            artifactMetadata={artifactContent.metadata as FormArtifactMetadataType}
            handleSendUserMessage={handleSendUserMessage}
            viewType={viewType}
            calendarMessageExist={calendarMessageExist}
          />
        );
      }
    default:
      return null;
  }
};
