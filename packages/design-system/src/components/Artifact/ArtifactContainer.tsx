import Artifact from '@breakout/design-system/components/Artifact/index';
import { useCommonMessageStore } from '@neuraltrade/core/stores/useCommonMessageStore';
import useArtifactStore from '@neuraltrade/core/stores/useArtifactStore';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { SupportedArtifactType } from '@neuraltrade/core/utils/messageUtils';
import { ViewType } from '@neuraltrade/core/types/common';
import useNormalAndQualificationFormArtifactMetadataProvider from '@neuraltrade/core/hooks/useNormalAndQualificationFormArtifactMetadataProvider';
import { ArtifactContentWithMetadataProps } from '@neuraltrade/core/types/artifact';

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

  const { isQualificationFormArtifact, artifactContent, artifactContentWithMetadata } =
    useNormalAndQualificationFormArtifactMetadataProvider({
      artifactId: activeArtifact?.artifact_id ?? '',
      messages,
    });

  if (!activeArtifact || !artifactContent) return null;

  const artifactWithContent = {
    artifact_id: activeArtifact.artifact_id,
    artifact_type: activeArtifact.artifact_type as SupportedArtifactType,
    content: artifactContent,
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
      artifactContent={artifactContentWithMetadata as ArtifactContentWithMetadataProps}
      isQualificationFormArtifact={isQualificationFormArtifact ?? false}
      viewType={viewType}
    />
  );
};

export default ArtifactContainer;
