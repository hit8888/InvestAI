import Artifact from '@breakout/design-system/components/Artifact/index';
import { useCommonMessageStore } from '@meaku/core/stores/useCommonMessageStore';
import useArtifactStore from '@meaku/core/stores/useArtifactStore';
import { ArtifactMessageContent, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { ArtifactContent, FormArtifactContent, QualificationResponsesType } from '@meaku/core/types/artifact';
import {
  checkIsArtifactMessage,
  checkIsQualificationFormArtifact,
  getFormArtifactMessage,
  getFormFilledEvent,
  SupportedArtifactType,
} from '@meaku/core/utils/messageUtils';
import { ViewType } from '@meaku/core/types/common';

type IProps = {
  logoURL: string;
  viewType: ViewType;
  isMediaTakingFullWidth: boolean;
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  onSlideItemClick: (title: string) => void;
  messages: WebSocketMessage[];
  isGeneratingArtifact?: boolean;
};

const ArtifactContainer = ({
  logoURL,
  viewType,
  isMediaTakingFullWidth,
  handleSendMessage,
  onSlideItemClick,
  messages,
  isGeneratingArtifact,
}: IProps) => {
  const handleToggleFullScreen = useCommonMessageStore((state) => state.handleToggleFullScreen);
  const setIsArtifactPlaying = useArtifactStore((state) => state.setIsArtifactPlaying);
  const activeArtifact = useArtifactStore((state) => state.activeArtifact);

  // Find the message that corresponds to the active artifact
  const artifactMessage = activeArtifact
    ? messages.find(
        (
          message,
        ): message is WebSocketMessage & {
          message: ArtifactMessageContent & { artifact_data: ArtifactContent | FormArtifactContent };
        } => {
          if (message.role !== 'ai' || !checkIsArtifactMessage(message)) return false;
          const artifactData = (message.message as ArtifactMessageContent).artifact_data;
          return artifactData.artifact_id === activeArtifact.artifact_id;
        },
      )
    : null;

  const artifactContent = artifactMessage
    ? ((artifactMessage.message as ArtifactMessageContent).artifact_data.content as ArtifactContent)
    : null;

  const messagesWithSameResponseId = messages.filter((msg) => msg.response_id === artifactMessage?.response_id);

  const formArtifactMessage = getFormArtifactMessage(messagesWithSameResponseId);
  const formFilledMessage = getFormFilledEvent(messages, formArtifactMessage, 'FORM_FILLED');

  const hasFormArtifactMessage = !!formArtifactMessage;
  const hasFormFilledMessage = !!formFilledMessage;

  const qualificationFormFilled = getFormFilledEvent(messages, artifactMessage, 'QUALIFICATION_FORM_FILLED');
  const hasQualificationFormFilled = !!qualificationFormFilled;

  const isQualificationFormArtifact = artifactMessage && checkIsQualificationFormArtifact(artifactMessage);

  const isFormArtifact =
    artifactMessage && hasFormArtifactMessage && !checkIsQualificationFormArtifact(artifactMessage);

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
      }
    : {};

  if (!activeArtifact || !artifactContent) return null;

  const artifactWithContent = {
    artifact_id: activeArtifact.artifact_id,
    artifact_type: activeArtifact.artifact_type as SupportedArtifactType,
    content: artifactContent,
  };

  const artifactContentWithMetadata = {
    ...artifactContent,
    metadata: isFormArtifact ? formMetadata : qualificationQuestionFormMetadata,
  };

  return (
    <Artifact
      logoURL={logoURL}
      isMediaTakingFullWidth={isMediaTakingFullWidth}
      handleSendUserMessage={handleSendMessage}
      handleToggleFullScreen={handleToggleFullScreen}
      setIsArtifactPlaying={setIsArtifactPlaying}
      activeArtifact={artifactWithContent}
      onSlideItemClick={onSlideItemClick}
      isGeneratingArtifact={isGeneratingArtifact}
      artifactContent={artifactContentWithMetadata}
      isQualificationFormArtifact={isQualificationFormArtifact ?? false}
      viewType={viewType}
    />
  );
};

export default ArtifactContainer;
