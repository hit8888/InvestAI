import {
  VideoArtifactContent,
  SlideArtifactContent,
  SlideImageArtifactContent,
  ArtifactContent,
} from '@meaku/core/types/agent';
import SlideArtifact from './SlideArtifact';
import VideoArtifact from './VideoArtifact';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';

interface Props {
  artifactType: string | undefined;
  artifactContent?: ArtifactContent;
  activeArtifactId: string;
  logoURL: string;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  isMediaTakingFullWidth: boolean;
  handleToggleFullScreen: () => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
}

export const ArtifactContentUi = ({
  artifactType,
  logoURL,
  artifactContent,
  activeArtifactId,
  handleSendUserMessage,
  isMediaTakingFullWidth,
  handleToggleFullScreen,
  setIsArtifactPlaying
}: Props) => {
  switch (artifactType) {
    case 'SLIDE':
      return (
        <SlideArtifact
          logoURL={logoURL}
          artifact={artifactContent as SlideArtifactContent}
          key={(artifactContent as SlideArtifactContent).title}
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
