import Artifact from '@breakout/design-system/components/Artifact/index';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useMessageStore } from '../../../stores/useMessageStore';
import { ArtifactContentWithMetadataProps } from '@meaku/core/types/artifact';
import { SupportedArtifactType } from '@meaku/core/utils/messageUtils';
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
  setIsArtifactPlaying: (isPlaying: boolean) => void;
};

const ArtifactContainer = ({
  logoURL,
  isMediaTakingFullWidth,
  viewType,
  handleSendMessage,
  onSlideItemClick,
  setIsArtifactPlaying,
}: IProps) => {
  const handleToggleFullScreen = useMessageStore((state) => state.handleToggleFullScreen);
  const messages = useMessageStore((state) => state.messages);
  const activeArtifact = useArtifactStore((state) => state.activeArtifact);

  const { hasGeneratingArtifactEvents } = useGetArtifactLoadingState();

  const {
    artifactMessage,
    artifactCtaEvent,
    isQualificationFormArtifact,
    artifactContent,
    artifactContentWithMetadata,
  } = useNormalAndQualificationFormArtifactMetadataProvider({
    artifactId: activeArtifact?.artifact_id ?? '',
    messages,
  });

  if (!activeArtifact || !artifactContent) return null;

  const artifactWithContent = {
    artifact_id: activeArtifact.artifact_id,
    artifact_type: activeArtifact.artifact_type as SupportedArtifactType,
    response_id: artifactMessage?.response_id,
    content: artifactContent,
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
      artifactContent={artifactContentWithMetadata as ArtifactContentWithMetadataProps}
      isQualificationFormArtifact={isQualificationFormArtifact ?? false}
    />
  );
};

export default ArtifactContainer;
