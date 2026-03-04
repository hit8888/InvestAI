import { useIsMobile } from '@neuraltrade/core/contexts/DeviceManagerProvider';
import ArtifactManager from '@neuraltrade/core/managers/ArtifactManager';
import MessageArtifactPreview from './MessageArtifactPreview';
import { ArtifactBaseType, ArtifactEnum, ViewType, WebSocketMessage } from '@neuraltrade/core/types/index';
import { DemoPlayingStatus } from '@neuraltrade/core/types/index';
import { ArtifactContentUi } from '../../Artifact/ArtifactContentUi';
import { checkIsArtifactMessage } from '@neuraltrade/core/utils/messageUtils';
import ArtifactsCardMobile from './ArtifactsCardMobile';
import useNormalAndQualificationFormArtifactMetadataProvider from '@neuraltrade/core/hooks/useNormalAndQualificationFormArtifactMetadataProvider';
import { ArtifactContentWithMetadataProps } from '@neuraltrade/core/types/artifact';
import { EMPTY_FUNCTION } from '@neuraltrade/core/constants/index';

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
  const currentArtifactId = isArtifactMessage ? message.message.artifact_data?.artifact_id : '';

  const { isQualificationFormArtifact, artifactContentWithMetadata } =
    useNormalAndQualificationFormArtifactMetadataProvider({
      artifactId: currentArtifactId,
      messages,
    });

  if (!isArtifactMessage) return null;

  const artifactType = isArtifactMessage ? message.message.artifact_data?.artifact_type : undefined;

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
        activeArtifactId={currentArtifactId}
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
