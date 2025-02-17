import {
  ArtifactContent,
  SlideArtifactContent,
  SlideImageArtifactContent,
  VideoArtifactContent,
} from '@meaku/core/types/artifact';
import SlideArtifact from './SlideArtifact';
import VideoArtifact from './VideoArtifact';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';

interface Props {
  artifactType: string | undefined;
  artifactContent: ArtifactContent | null;
  activeArtifactId: string;
  logoURL: string;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  isMediaTakingFullWidth: boolean;
  handleToggleFullScreen: () => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  onSlideItemClick: (title: string) => void;
}

export const ArtifactContentUi = ({
  artifactType,
  logoURL,
  artifactContent,
  activeArtifactId,
  handleSendUserMessage,
  isMediaTakingFullWidth,
  handleToggleFullScreen,
  setIsArtifactPlaying,
  onSlideItemClick,
}: Props) => {
  if (!artifactType || !artifactContent) {
    return null;
  }

  switch (artifactType) {
    case 'SLIDE':
      return (
        <SlideArtifact
          logoURL={logoURL}
          artifact={artifactContent as SlideArtifactContent}
          key={(artifactContent as SlideArtifactContent).title}
          onItemClick={onSlideItemClick}
        />
      );
    case 'SLIDE_IMAGE':
      return (
        <img
          key={(artifactContent as SlideImageArtifactContent).image_url}
          src={(artifactContent as SlideImageArtifactContent).image_url}
          alt="Slide"
          className="h-full w-full"
        />
      );
    case 'VIDEO':
      return (
        <VideoArtifact
          key={(artifactContent as VideoArtifactContent).video_url}
          videoUrl={(artifactContent as VideoArtifactContent).video_url}
          artifactId={activeArtifactId}
          handleToggleFullScreen={handleToggleFullScreen}
          setIsArtifactPlaying={setIsArtifactPlaying}
          handleSendUserMessage={handleSendUserMessage}
          isMediaTakingFullWidth={isMediaTakingFullWidth}
        />
      );
    default:
      return null;
  }
};
