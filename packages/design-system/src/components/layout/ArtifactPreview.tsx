import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@breakout/design-system/components/layout/dialog';
import { useState } from 'react';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import SlideArtifactPreview from './SlideArtifactPreview.tsx';
import CustomVideoPlayer from './CustomVideoPlayer.tsx';
import {
  ArtifactEnum,
  ArtifactPreviewEnum,
  SlideArtifactContent,
  SlideImageArtifactContent,
  VideoArtifactContent,
} from '@meaku/core/types/artifact';
import { ArtifactBaseType } from '@meaku/core/types/webSocketData';
import CommonArtifactPreview from './CommonArtifactPreview.tsx';

interface IProps {
  usingForAgent: boolean;
  artifactId: string;
  logoURL: string | null;
  artifactType?: ArtifactEnum;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  title?: string;
  artifactContent?: SlideImageArtifactContent | SlideArtifactContent | VideoArtifactContent;
  isError?: boolean;
  isFetching?: boolean;
}

const ArtifactPreview = ({
  usingForAgent,
  artifactId,
  artifactType,
  setDemoPlayingStatus,
  setActiveArtifact,
  logoURL,
  title,
  artifactContent,
  isError = false,
  isFetching = false,
}: IProps) => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  const handleArtifactOnClick = () => {
    setDemoPlayingStatus(DemoPlayingStatus.INITIAL);
    setActiveArtifact({
      artifact_id: artifactId,
      artifact_type: artifactType ?? 'NONE',
    });
    if (artifactType === 'VIDEO' && !usingForAgent) {
      setIsVideoDialogOpen(true);
    }
  };

  if (isError) return null;

  if (artifactType === 'SLIDE' || artifactType === 'SLIDE_IMAGE') {
    return (
      <SlideArtifactPreview
        artifactType={artifactType}
        logoURL={logoURL ?? ''}
        artifactContent={artifactContent as SlideImageArtifactContent | SlideArtifactContent}
        usingForAgent={usingForAgent}
        isFetching={isFetching}
        handleArtifactOnClick={handleArtifactOnClick}
        title={title}
      />
    );
  }

  const showArtifactPreviewButtonDisplay = () => {
    return (
      <CommonArtifactPreview
        title={title}
        isFetching={isFetching}
        artifactType={artifactType as keyof typeof ArtifactPreviewEnum}
        handleClick={handleArtifactOnClick}
      />
    );
  };

  const getVideoPlayerContent = () => {
    const videoURL = (artifactContent as VideoArtifactContent)?.video_url;
    return <CustomVideoPlayer videoURL={videoURL} />;
  };

  return usingForAgent ? (
    <>{showArtifactPreviewButtonDisplay()}</>
  ) : (
    <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
      <DialogTrigger asChild>{showArtifactPreviewButtonDisplay()}</DialogTrigger>
      <DialogContent className="bg-primary-foreground/80 sm:min-w-[1200px]">
        <DialogTitle className="text-lg font-semibold text-primary">{title}</DialogTitle>
        {isVideoDialogOpen ? <div className="h-full w-full rounded-lg">{getVideoPlayerContent()}</div> : null}
      </DialogContent>
    </Dialog>
  );
};

export default ArtifactPreview;
