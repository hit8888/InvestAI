import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';
import { ArtifactEnum, SlideArtifactType, SlideImageArtifactType, VideoArtifactType } from '@meaku/core/types/chat';
import { memo, useMemo } from 'react';
import SlideArtifact from './SlideArtifact';
import VideoArtifact from './VideoArtifact';
import ArtifactManager from '@meaku/core/managers/ArtifactManager';
import useArtifactDataQuery from '@meaku/core/queries/useArtifactDataQuery';
import { cn } from '@breakout/design-system/lib/cn';
import { IWebSocketHandleMessage } from '../../../hooks/useWebSocketChat';

interface IProps {
  isMediaTakingFullWidth: boolean;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  activeArtifactId: string;
  activeArtifactType: ArtifactEnum;
}

const Artifact = ({ isMediaTakingFullWidth, handleSendUserMessage, activeArtifactId, activeArtifactType }: IProps) => {
  const {
    data: artifactData,
    isFetching,
    isError,
  } = useArtifactDataQuery({
    artifactId: activeArtifactId,
    artifactType: activeArtifactType,
    queryOptions: {
      refetchInterval: (data) => {
        if (data) return false;
        return 1000;
      },
      enabled: !!activeArtifactId && !!activeArtifactType && activeArtifactType !== 'NONE',
    },
  });

  const manager = useMemo(() => {
    if (!artifactData) return;
    return new ArtifactManager(artifactData);
  }, [artifactData]);

  const artifactType = manager?.getArtifactType();
  const artifactContent = manager?.getArtifactContent();

  const renderArtifact = () => {
    switch (artifactType) {
      case 'SLIDE':
        return (
          <SlideArtifact
            artifact={artifactContent as SlideArtifactType}
            key={(artifactContent as SlideArtifactType).title}
          />
        );
      case 'SLIDE_IMAGE':
        return (
          <img
            key={(artifactContent as SlideImageArtifactType).image_url}
            src={(artifactContent as SlideImageArtifactType).image_url}
            alt="Slide"
            className="h-full w-full"
          />
        );
      case 'VIDEO':
        return (
          <VideoArtifact
            key={(artifactContent as VideoArtifactType).video_url}
            videoUrl={(artifactContent as VideoArtifactType).video_url}
            artifactId={activeArtifactId}
            handleSendUserMessage={handleSendUserMessage}
            isMediaTakingFullWidth={isMediaTakingFullWidth}
          />
        );

      default:
        return <></>;
    }
  };

  if (activeArtifactType === 'NONE' || !activeArtifactId || !artifactData) return null;

  if (isError) {
    return <></>;
  }
  return (
    <div className={cn('col-span-2 mr-2 pl-2', { 'col-span-3': isMediaTakingFullWidth })}>
      <div className="flex h-full w-full items-center justify-center">
        <AspectRatio ratio={16 / 9}>
          <div className="group relative h-full w-full overflow-hidden rounded-xl">
            {isFetching ? <div className="h-full w-full animate-pulse bg-gray-50"></div> : renderArtifact()}
          </div>
        </AspectRatio>
      </div>
    </div>
  );
};

export default memo(Artifact);
