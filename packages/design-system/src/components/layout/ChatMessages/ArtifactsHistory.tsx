import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import ArtifactManager from '@meaku/core/managers/ArtifactManager';
import MessageArtifactPreview from './MessageArtifactPreview';
import { ArtifactBaseType, ArtifactEnum, ViewType, WebSocketMessage } from '@meaku/core/types/index';
import { DemoPlayingStatus } from '@meaku/core/types/index';
import { ArtifactContentUi } from '../../Artifact/ArtifactContentUi';
import { checkIsArtifactMessage } from '@meaku/core/utils/messageUtils';
import ArtifactsCardMobile from './ArtifactsCardMobile';
import useNormalAndQualificationFormArtifactMetadataProvider from '@meaku/core/hooks/useNormalAndQualificationFormArtifactMetadataProvider';
import { ArtifactContentWithMetadataProps } from '@meaku/core/types/artifact';
import { EMPTY_FUNCTION } from '@meaku/core/constants/index';

interface IProps {
  message: WebSocketMessage;
  messages: WebSocketMessage[];
  viewType: ViewType;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  logoURL: string | null;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
}

const ArtifactsHistory = ({
  message,
  messages,
  viewType,
  setDemoPlayingStatus,
  setActiveArtifact,
  logoURL,
  handleSendUserMessage,
  setIsArtifactPlaying,
}: IProps) => {
  const isMobile = useIsMobile();
  const isArtifactMessage = checkIsArtifactMessage(message);

  const { isQualificationFormArtifact, artifactContentWithMetadata } =
    useNormalAndQualificationFormArtifactMetadataProvider({
      artifactId: isArtifactMessage ? message.message.artifact_data?.artifact_id : '',
      messages,
    });

  if (!isArtifactMessage) return null;

  const artifactType = isArtifactMessage ? message.message.artifact_data?.artifact_type : undefined;

  const activeArtifactId = isArtifactMessage ? message.message.artifact_data?.artifact_id : '';

  const artifactManager = new ArtifactManager(message.message);
  const artifactTitle = artifactManager.getArtifactTitle();
  const isArtifactTypeGeneratedSlide = artifactType === 'SLIDE';

  if (isMobile && isArtifactTypeGeneratedSlide) {
    return null;
  }

  const getArtifactContent = () => {
    return (
      <ArtifactContentUi
        logoURL={logoURL ?? ''}
        handleToggleFullScreen={EMPTY_FUNCTION}
        setIsArtifactPlaying={setIsArtifactPlaying}
        artifactType={artifactType}
        artifactContent={artifactContentWithMetadata as ArtifactContentWithMetadataProps}
        activeArtifactId={activeArtifactId}
        handleSendUserMessage={handleSendUserMessage}
        isMediaTakingFullWidth={false}
        onSlideItemClick={EMPTY_FUNCTION}
        isQualificationFormArtifact={isQualificationFormArtifact}
        viewType={viewType}
      />
    );
  };

  if (isMobile && isArtifactMessage) {
    switch (artifactType) {
      case 'SLIDE_IMAGE':
      case 'VIDEO':
        return (
          <ArtifactsCardMobile artifactType={artifactType as ArtifactEnum} title={artifactTitle}>
            {getArtifactContent()}
          </ArtifactsCardMobile>
        );
      default:
        return getArtifactContent();
    }
  }
  return (
    <MessageArtifactPreview
      message={message}
      messages={messages}
      viewType={viewType}
      setDemoPlayingStatus={setDemoPlayingStatus}
      setActiveArtifact={setActiveArtifact}
      logoURL={logoURL}
      artifactTitle={artifactTitle}
    />
  );
};

export default ArtifactsHistory;
