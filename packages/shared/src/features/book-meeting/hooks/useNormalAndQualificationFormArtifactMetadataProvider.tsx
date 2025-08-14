import { ArtifactMessageContent } from '../../../types/message';

import { Message, MessageEventType } from '../../../types/message';
import { ArtifactContent, QualificationResponsesType } from '../../../utils/artifact';
import {
  checkIsQualificationFormArtifact,
  findArtifactMessageWithSameArtifactId,
  getCalendarArtifactMessage,
  getCtaEvent,
  getFormArtifactMessage,
  getFormFilledEventByArtifactId,
} from '../../../utils/common';

type IProps = {
  artifactId: string;
  messages: Message[];
};

const useNormalAndQualificationFormArtifactMetadataProvider = ({ artifactId, messages }: IProps) => {
  if (!artifactId)
    return {
      isQualificationFormArtifact: false,
      isFormArtifact: false,
      formMetadata: {},
      qualificationQuestionFormMetadata: {},
    };

  // Find the message that corresponds to the active artifact
  const artifactMessage = findArtifactMessageWithSameArtifactId(messages, artifactId);

  const artifactContent =
    ((artifactMessage?.event_data as ArtifactMessageContent)?.artifact_data?.content as ArtifactContent) ?? null;

  const messagesWithSameResponseId = messages.filter(
    (msg: Message) => msg.response_id === artifactMessage?.response_id,
  );

  const calendarArtifactMessage = getCalendarArtifactMessage(messagesWithSameResponseId);

  const formArtifactMessage = getFormArtifactMessage(messagesWithSameResponseId);
  const formFilledMessage = getFormFilledEventByArtifactId(messages, formArtifactMessage, MessageEventType.FORM_FILLED);
  const calendarFilledMessage = getFormFilledEventByArtifactId(
    messages,
    calendarArtifactMessage,
    MessageEventType.CALENDAR_SUBMIT,
  );

  const hasFormArtifactMessage = !!formArtifactMessage;
  const hasFormFilledMessage = !!formFilledMessage;
  const calendarArtifactContent = calendarFilledMessage?.event_data ?? null;

  const qualificationFormFilled = getFormFilledEventByArtifactId(
    messages,
    artifactMessage,
    MessageEventType.QUALIFICATION_FORM_FILLED,
  );
  const hasQualificationFormFilled = !!qualificationFormFilled;

  const isQualificationFormArtifact = artifactMessage && checkIsQualificationFormArtifact(artifactMessage);
  const isFormArtifact = artifactMessage && hasFormArtifactMessage && hasFormFilledMessage;

  const qualificationQuestionFormMetadata = isQualificationFormArtifact
    ? {
        is_filled: hasQualificationFormFilled,
        filled_data: hasQualificationFormFilled
          ? (qualificationFormFilled.event_data as { qualification_responses: QualificationResponsesType[] })
              .qualification_responses
          : {},
      }
    : {};

  const formMetadata = isFormArtifact
    ? {
        is_filled: hasFormFilledMessage || artifactMessage.event_data.artifact_data.metadata.is_filled,
        filled_data: hasFormFilledMessage
          ? formFilledMessage.event_data.form_data
          : artifactMessage.event_data.artifact_data.metadata?.filled_data,
        country_code: artifactMessage.event_data.artifact_data.metadata?.country_code,
      }
    : {};

  const artifactCtaEvent = getCtaEvent(messages, artifactMessage?.response_id, 'right');
  const ctaEvent = getCtaEvent(messages, qualificationFormFilled?.response_id, 'right');

  // Get the artifact type from the artifact message
  const artifactType = (artifactMessage?.event_data as ArtifactMessageContent)?.artifact_type;

  const artifactContentWithMetadata = {
    ...artifactContent,
    artifact_type: artifactType,
    artifact_id: calendarArtifactMessage ? calendarArtifactMessage.event_data.artifact_data.artifact_id : artifactId,
    metadata: {
      formMetadata,
      qualificationQuestionFormMetadata,
      calendarContent: calendarArtifactContent,
    },
    ctaEvent,
  };

  return {
    isQualificationFormArtifact,
    isFormArtifact,
    formMetadata,
    artifactCtaEvent,
    artifactMessage,
    artifactContent,
    qualificationQuestionFormMetadata,
    artifactContentWithMetadata,
  };
};

export default useNormalAndQualificationFormArtifactMetadataProvider;
