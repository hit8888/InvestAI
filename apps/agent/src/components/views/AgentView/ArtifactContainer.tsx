import Artifact from '@breakout/design-system/components/Artifact/index';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import { ArtifactMessageContent, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useMessageStore } from '../../../stores/useMessageStore';
import { ArtifactContent, FormArtifactContent, QualificationResponsesType } from '@meaku/core/types/artifact';
import {
  checkIsArtifactMessage,
  checkIsQualificationFormArtifact,
  getFormFilledEvent,
  SupportedArtifactType,
} from '@meaku/core/utils/messageUtils';
import { useGetArtifactLoadingState } from '../../../hooks/useGetArtifactLoadingState';

type IProps = {
  logoURL: string;
  isMediaTakingFullWidth: boolean;
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  onSlideItemClick: (title: string) => void;
};

const ArtifactContainer = ({ logoURL, isMediaTakingFullWidth, handleSendMessage, onSlideItemClick }: IProps) => {
  const handleToggleFullScreen = useMessageStore((state) => state.handleToggleFullScreen);
  const setIsArtifactPlaying = useArtifactStore((state) => state.setIsArtifactPlaying);
  const messages = useMessageStore((state) => state.messages);
  const activeArtifact = useArtifactStore((state) => state.activeArtifact);

  const { hasGeneratingArtifactEvents } = useGetArtifactLoadingState();

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

  const qualificationFormFilled = getFormFilledEvent(messages, artifactMessage, 'QUALIFICATION_FORM_FILLED');
  const hasQualificationFormFilled = !!qualificationFormFilled;

  const isQualificationFormArtifact = artifactMessage && checkIsQualificationFormArtifact(artifactMessage);

  const qualificationQuestionFormMetadata = isQualificationFormArtifact
    ? {
        is_filled: hasQualificationFormFilled,
        filled_data: hasQualificationFormFilled
          ? (qualificationFormFilled.message.event_data as { qualification_responses: QualificationResponsesType[] })
              .qualification_responses
          : artifactMessage?.message.artifact_data.metadata?.filled_data,
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
    metadata: qualificationQuestionFormMetadata,
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
      isGeneratingArtifact={hasGeneratingArtifactEvents}
      artifactContent={artifactContentWithMetadata}
    />
  );
};

export default ArtifactContainer;
