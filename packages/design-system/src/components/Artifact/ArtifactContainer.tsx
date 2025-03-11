import Artifact from '@breakout/design-system/components/Artifact/index';
import { useCommonMessageStore } from '@meaku/core/stores/useCommonMessageStore';
import useArtifactStore from '@meaku/core/stores/useArtifactStore';
import { ArtifactMessageContent, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { ArtifactContent } from '@meaku/core/types/artifact';
import { checkIsArtifactMessage, SupportedArtifactType } from '@meaku/core/utils/messageUtils';
// import { useGetArtifactLoadingState } from '../../../hooks/useGetArtifactLoadingState';

type IProps = {
  logoURL: string;
  isMediaTakingFullWidth: boolean;
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  onSlideItemClick: (title: string) => void;
  messages: WebSocketMessage[];
};

const ArtifactContainer = ({
  logoURL,
  isMediaTakingFullWidth,
  handleSendMessage,
  onSlideItemClick,
  messages,
}: IProps) => {
  const handleToggleFullScreen = useCommonMessageStore((state) => state.handleToggleFullScreen);
  const setIsArtifactPlaying = useArtifactStore((state) => state.setIsArtifactPlaying);
  const activeArtifact = useArtifactStore((state) => state.activeArtifact);

  // const { hasGeneratingArtifactEvents } = useGetArtifactLoadingState();

  // Find the message that corresponds to the active artifact
  const artifactMessage = activeArtifact
    ? messages.find((message) => {
        if (message.role !== 'ai' || !checkIsArtifactMessage(message)) return false;
        const artifactData = (message.message as ArtifactMessageContent).artifact_data;
        return artifactData.artifact_id === activeArtifact.artifact_id;
      })
    : null;

  const artifactContent = artifactMessage
    ? ((artifactMessage.message as ArtifactMessageContent).artifact_data.content as ArtifactContent)
    : null;

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
      isGeneratingArtifact={false} // TODO: keeping it false for now, there is Too much gap b/w slides ( Linear task:- ENG-1451)
      artifactContent={artifactContent}
    />
  );
};

export default ArtifactContainer;
