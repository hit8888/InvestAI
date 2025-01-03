import {
  VideoArtifactContent,
  SlideArtifactContent,
  SlideImageArtifactContent,
  ArtifactContent,
} from '@meaku/core/types/chat';
import SlideArtifact from './SlideArtifact';
import VideoArtifact from './VideoArtifact';
import { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';

interface Props {
  artifactType: string | undefined;
  artifactContent?: ArtifactContent;
  activeArtifactId: string;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  isMediaTakingFullWidth: boolean;
}

export const ArtifactContentUi = ({
  artifactType,
  artifactContent,
  activeArtifactId,
  handleSendUserMessage,
  isMediaTakingFullWidth,
}: Props) => {
  switch (artifactType) {
    case 'SLIDE':
      return (
        <SlideArtifact
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
          handleSendUserMessage={handleSendUserMessage}
          isMediaTakingFullWidth={isMediaTakingFullWidth}
        />
      );
    default:
      return null;
  }
};
