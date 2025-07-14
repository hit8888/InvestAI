import { AgentEventType, ArtifactMessageContent } from '../types/webSocketData';

import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { ArtifactContent, QualificationResponsesType } from '@meaku/core/types/artifact';
import {
  checkIsQualificationFormArtifact,
  findArtifactMessageWithSameArtifactId,
  getCtaEvent,
} from '../utils/messageUtils';
import { getFormArtifactMessage } from '../utils/messageUtils';
import { getFormFilledEventByArtifactId } from '../utils/messageUtils';

type IProps = {
  artifactId: string;
  messages: WebSocketMessage[];
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
    ((artifactMessage?.message as ArtifactMessageContent)?.artifact_data?.content as ArtifactContent) ?? null;

  const messagesWithSameResponseId = messages.filter(
    (msg: WebSocketMessage) => msg.response_id === artifactMessage?.response_id,
  );

  const formArtifactMessage = getFormArtifactMessage(messagesWithSameResponseId);
  const formFilledMessage = getFormFilledEventByArtifactId(messages, formArtifactMessage, AgentEventType.FORM_FILLED);

  const hasFormArtifactMessage = !!formArtifactMessage;
  const hasFormFilledMessage = !!formFilledMessage;

  const qualificationFormFilled = getFormFilledEventByArtifactId(
    messages,
    artifactMessage,
    AgentEventType.QUALIFICATION_FORM_FILLED,
  );
  const hasQualificationFormFilled = !!qualificationFormFilled;

  const isQualificationFormArtifact = artifactMessage && checkIsQualificationFormArtifact(artifactMessage);
  const isFormArtifact = artifactMessage && hasFormArtifactMessage && hasFormFilledMessage;

  const qualificationQuestionFormMetadata = isQualificationFormArtifact
    ? {
        is_filled: hasFormFilledMessage || hasQualificationFormFilled,
        filled_data: hasQualificationFormFilled
          ? (qualificationFormFilled.message.event_data as { qualification_responses: QualificationResponsesType[] })
              .qualification_responses
          : hasFormFilledMessage
            ? formFilledMessage?.message.event_data.form_data
            : {},
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

  const artifactCtaEvent = getCtaEvent(messages, artifactMessage?.response_id, 'right');
  const ctaEvent = getCtaEvent(messages, qualificationFormFilled?.response_id, 'right');

  const artifactContentWithMetadata = {
    ...artifactContent,
    metadata: {
      formMetadata,
      qualificationQuestionFormMetadata,
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
