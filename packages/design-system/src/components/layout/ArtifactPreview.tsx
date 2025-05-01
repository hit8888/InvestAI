import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@breakout/design-system/components/layout/dialog';
import { useState } from 'react';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import SlideArtifactPreview from './SlideArtifactPreview.tsx';
import CustomVideoPlayer from './CustomVideoPlayer.tsx';
import {
  ArtifactEnum,
  ArtifactPreviewEnum,
  FormArtifactContent,
  SlideArtifactContent,
  SlideImageArtifactContent,
  VideoArtifactContent,
} from '@meaku/core/types/artifact';
import { ArtifactBaseType } from '@meaku/core/types/webSocketData';
import CommonArtifactPreview from './CommonArtifactPreview.tsx';
import ArrowRight from '../icons/ArrowRight.tsx';

interface IProps {
  usingForAgent: boolean;
  artifactId: string;
  logoURL: string | null;
  artifactType?: ArtifactEnum;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  title?: string;
  artifactContent?: SlideImageArtifactContent | SlideArtifactContent | VideoArtifactContent | FormArtifactContent;
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
    if (artifactType === 'FORM') {
      return <QualificationQuestionFormPreview handleClick={handleArtifactOnClick} />;
    }
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

const QualificationQuestionFormPreview = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className="flex w-full max-w-[424px] cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-transparent_gray_3 p-2 ring-system hover:bg-transparent_gray_6"
    >
      <p className="pl-2 text-base font-semibold text-customPrimaryText">Additional Information</p>
      <div className="flex items-center justify-center rounded-lg border border-gray-600 p-2">
        <ArrowRight className="text-gray-600" width="16" height="16" />
      </div>
    </div>
  );
};

export default ArtifactPreview;
