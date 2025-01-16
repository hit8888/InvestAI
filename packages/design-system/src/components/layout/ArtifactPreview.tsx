import useArtifactDataQuery from '@meaku/core/queries/useArtifactDataQuery';
import {
  ArtifactEnum,
  SlideArtifactContent,
  SlideImageArtifactContent,
  VideoArtifactContent,
} from '@meaku/core/types/agent';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogTrigger 
} from '@breakout/design-system/components/layout/dialog';
import { ArrowUpRight, CirclePlay } from 'lucide-react';
import { useMemo, useState } from 'react';
import ArtifactManager from '@meaku/core/managers/ArtifactManager';
import { cn } from '@breakout/design-system/lib/cn';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import SlideArtifactPreview from './SlideArtifactPreview.tsx';
import { GetArtifactPayload } from '@meaku/core/types/api';
import CustomVideoPlayer from './CustomVideoPlayer.tsx';

interface IProps {
  usingForAgent: boolean;
  artifactId: string;
  artifactType?: ArtifactEnum;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: GetArtifactPayload | null) => void;
}

const truncateText = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  const truncated = text.slice(0, limit);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  return lastSpaceIndex > -1 ? truncated.slice(0, lastSpaceIndex) + '...' : truncated + '...';
};

const ArtifactPreview = ({
  usingForAgent,
  artifactId,
  artifactType,
  setDemoPlayingStatus,
  setActiveArtifact,
}: IProps) => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const { data, isError, isFetching } = useArtifactDataQuery({
    role: usingForAgent ? 'agent' : 'admin',
    artifactId: artifactId,
    artifactType: artifactType ?? 'NONE',
    queryOptions: {
      enabled: !!artifactId && artifactType !== 'NONE',
    },
  });

  const manager = useMemo(() => {
    if (!data) return null;

    return new ArtifactManager(data);
  }, [data]);

  const title = manager?.getArtifactTitle();
  const description = manager?.getArtifactDescription();
  const artifactContent = manager?.getArtifactContent();

  const handleArtifactOnClick = () => {
    setDemoPlayingStatus(DemoPlayingStatus.INITIAL);
    setActiveArtifact({ artifactId, artifactType: artifactType ?? 'NONE' });
    if (artifactType === 'VIDEO' && !usingForAgent) {
      setIsVideoDialogOpen(true);
    }
  };

  if (isError) return null;

  if (artifactType === 'SLIDE' || artifactType === 'SLIDE_IMAGE') {
    return (
      <SlideArtifactPreview
        artifactType={artifactType}
        logoURL=""
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
      <button
        onClick={handleArtifactOnClick}
        className="mt-3 flex-col gap-6 rounded-xl bg-primary/10 p-5 transition-colors duration-300 ease-in-out hover:bg-primary/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-14 min-h-14 w-14 min-w-14 items-center justify-center rounded-2xl border-2 border-primary-foreground/60 bg-primary/60">
            <CirclePlay className="text-primary-foreground/90" height={32} width={32} />
          </div>
          <div className="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-full bg-primary/10">
            <ArrowUpRight className="text-primary/70" height={24} width={24} />
          </div>
        </div>
        <div className=" mt-2 flex items-center gap-4">
          {isFetching ? (
            <div className="h-4 w-full animate-pulse rounded-lg bg-primary/40" />
          ) : (
            <div
              className={cn('flex flex-1 flex-col items-start text-left', {
                'space-y-1': title && description,
                'space-y-6': !title || !description,
              })}
            >
              {title ? (
                <h4 className="lg:text-md text-base font-semibold text-primary 2xl:text-lg">{title}</h4>
              ) : (
                <div className="h-4 w-full animate-pulse rounded-lg bg-primary/30" />
              )}
              {description && <p className="text-sm text-primary/60 2xl:text-base">{truncateText(description, 100)}</p>}
            </div>
          )}
        </div>
      </button>
    );
  };

  const getVideoPlayerContent = () => {
    const videoURL = (artifactContent as VideoArtifactContent)?.video_url;
    return <CustomVideoPlayer videoURL={videoURL} />;
  };

  return usingForAgent ? (
    <>{showArtifactPreviewButtonDisplay()}</>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{showArtifactPreviewButtonDisplay()}</DialogTrigger>
      <DialogContent className="bg-primary-foreground/80 sm:min-w-[1200px]">
        <DialogTitle className="text-lg font-semibold text-primary">{title}</DialogTitle>
        {isVideoDialogOpen ? <div className="h-full w-full rounded-lg">{getVideoPlayerContent()}</div> : null}
      </DialogContent>
    </Dialog>
  );
};

export default ArtifactPreview;
