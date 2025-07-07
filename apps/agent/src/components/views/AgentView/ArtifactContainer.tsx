import Artifact from '@breakout/design-system/components/Artifact/index';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import { ArtifactMessageContent, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useMessageStore } from '../../../stores/useMessageStore';
import { ArtifactContent, FormArtifactContent } from '@meaku/core/types/artifact';
import {
  checkIsArtifactMessage,
  getCtaEvent,
  getFormFilledEvent,
  SupportedArtifactType,
} from '@meaku/core/utils/messageUtils';
import { useGetArtifactLoadingState } from '../../../hooks/useGetArtifactLoadingState';
import { ViewType } from '@meaku/core/types/common';
import useNormalAndQualificationFormArtifactMetadataProvider from '@meaku/core/hooks/useNormalAndQualificationFormArtifactMetadataProvider';
import CtaEventMessage from '@breakout/design-system/components/layout/ChatMessages/CtaEventMessage';

type IProps = {
  logoURL: string;
  isMediaTakingFullWidth: boolean;
  viewType: ViewType;
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  onSlideItemClick: (title: string) => void;
};

const ArtifactContainer = ({
  logoURL,
  isMediaTakingFullWidth,
  viewType,
  handleSendMessage,
  onSlideItemClick,
}: IProps) => {
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
  const artifactCtaEvent = getCtaEvent(messages, artifactMessage?.response_id, 'right');

  const artifactContent = artifactMessage
    ? ((artifactMessage.message as ArtifactMessageContent).artifact_data.content as ArtifactContent)
    : null;

  const { isQualificationFormArtifact, isFormArtifact, formMetadata, qualificationQuestionFormMetadata } =
    useNormalAndQualificationFormArtifactMetadataProvider({ artifactMessage, messages });

  if (!activeArtifact || !artifactContent) return null;

  const artifactWithContent = {
    artifact_id: activeArtifact.artifact_id,
    artifact_type: activeArtifact.artifact_type as SupportedArtifactType,
    response_id: artifactMessage?.response_id,
    content: artifactContent,
  };

  const artifactContentWithMetadata = {
    ...artifactContent,
    metadata: isFormArtifact ? formMetadata : qualificationQuestionFormMetadata,
    ctaEvent: getCtaEvent(
      messages,
      getFormFilledEvent(messages, artifactMessage, 'QUALIFICATION_FORM_FILLED')?.response_id,
      'right',
    ),
  };

  if (artifactCtaEvent) {
    return <CtaEventMessage event={artifactCtaEvent} handleSendUserMessage={handleSendMessage} />;
  }

  return (
    <Artifact
      logoURL={logoURL}
      viewType={viewType}
      isMediaTakingFullWidth={isMediaTakingFullWidth}
      handleSendUserMessage={handleSendMessage}
      handleToggleFullScreen={handleToggleFullScreen}
      setIsArtifactPlaying={setIsArtifactPlaying}
      activeArtifact={artifactWithContent}
      onSlideItemClick={onSlideItemClick}
      isGeneratingArtifact={hasGeneratingArtifactEvents}
      artifactContent={artifactContentWithMetadata}
      isQualificationFormArtifact={isQualificationFormArtifact ?? false}
    />
  );
};

export default ArtifactContainer;
