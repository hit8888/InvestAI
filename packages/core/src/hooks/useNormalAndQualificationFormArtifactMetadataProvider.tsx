import { ArtifactMessageContent } from '../types/webSocketData';

import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { ArtifactContent, FormArtifactContent, QualificationResponsesType } from '@meaku/core/types/artifact';
import { checkIsQualificationFormArtifact, getCtaEvent } from '../utils/messageUtils';
import { getFormArtifactMessage } from '../utils/messageUtils';
import { getFormFilledEvent } from '../utils/messageUtils';

type IProps = {
  artifactMessage:
    | (WebSocketMessage & {
        message: ArtifactMessageContent & { artifact_data: ArtifactContent | FormArtifactContent };
      })
    | null
    | undefined;
  messages: WebSocketMessage[];
};

const useNormalAndQualificationFormArtifactMetadataProvider = ({ artifactMessage, messages }: IProps) => {
  if (!artifactMessage)
    return {
      isQualificationFormArtifact: false,
      isFormArtifact: false,
      formMetadata: {},
      qualificationQuestionFormMetadata: {},
    };

  const messagesWithSameResponseId = messages.filter(
    (msg: WebSocketMessage) => msg.response_id === artifactMessage?.response_id,
  );

  const formArtifactMessage = getFormArtifactMessage(messagesWithSameResponseId);
  const formFilledMessage = getFormFilledEvent(messages, formArtifactMessage, 'FORM_FILLED');

  const hasFormArtifactMessage = !!formArtifactMessage;
  const hasFormFilledMessage = !!formFilledMessage;

  const qualificationFormFilled = getFormFilledEvent(messages, artifactMessage, 'QUALIFICATION_FORM_FILLED');
  const hasQualificationFormFilled = !!qualificationFormFilled;

  const isQualificationFormArtifact = artifactMessage && checkIsQualificationFormArtifact(artifactMessage);
  const isFormArtifact =
    artifactMessage && hasFormArtifactMessage && !checkIsQualificationFormArtifact(artifactMessage);

  const ctaEvent = getCtaEvent(messages, qualificationFormFilled?.response_id, 'right');

  const qualificationQuestionFormMetadata = isQualificationFormArtifact
    ? {
        is_filled: hasFormFilledMessage || hasQualificationFormFilled,
        filled_data: hasQualificationFormFilled
          ? (qualificationFormFilled.message.event_data as { qualification_responses: QualificationResponsesType[] })
              .qualification_responses
          : hasFormFilledMessage
            ? formFilledMessage?.message.event_data.form_data
            : {},
        ctaMetadata: ctaEvent?.message?.event_data || {},
      }
    : {};

  const formMetadata = isFormArtifact
    ? {
        is_filled: hasFormFilledMessage || artifactMessage.message.artifact_data.metadata.is_filled,
        filled_data: hasFormFilledMessage
          ? formFilledMessage.message.event_data.form_data
          : artifactMessage.message.artifact_data.metadata?.filled_data,
        country_code: artifactMessage.message.artifact_data.metadata?.country_code,
      }
    : {};

  return {
    isQualificationFormArtifact,
    isFormArtifact,
    formMetadata,
    qualificationQuestionFormMetadata,
  };
};

export default useNormalAndQualificationFormArtifactMetadataProvider;
