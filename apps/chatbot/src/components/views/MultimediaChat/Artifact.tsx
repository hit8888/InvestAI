import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';
import { DemoArtifactType, SlideArtifactType, SlideImageArtifactType, VideoArtifactType } from '@meaku/core/types/chat';
import { memo, useMemo } from 'react';
import DemoArtifact from './DemoArtifact';
import SlideArtifact from './SlideArtifact';
import VideoArtifact from './VideoArtifact';
import useUpdateLocalStorageOnArtifactResponse from '../../../hooks/useUpdateLocalStorageOnArtifactResponse';
import ArtifactManager from '@meaku/core/managers/ArtifactManager';
import useLocalStorageArtifact from '../../../hooks/useLocalStorageArtifact';
import useArtifactDataQuery from '@meaku/core/queries/useArtifactDataQuery';
import { cn } from '@breakout/design-system/lib/cn';

interface IProps {
  isArtifactMaximized: boolean;
}

const Artifact = (props: IProps) => {
  const { isArtifactMaximized } = props;

  const { artifact } = useLocalStorageArtifact();
  const { activeArtifactId, activeArtifactType } = artifact ?? {};

  const {
    data: artifactData,
    isFetching,
    isError,
  } = useArtifactDataQuery({
    artifactId: activeArtifactId ?? '',
    artifactType: activeArtifactType ?? null,
    queryOptions: {
      refetchInterval: (data) => {
        if (data) return false;
        return 1000;
      },
      enabled: !!activeArtifactId && !!activeArtifactType && activeArtifactType !== 'NONE',
    },
  });

  useUpdateLocalStorageOnArtifactResponse(artifactData);

  const manager = useMemo(() => {
    if (!artifactData) return;
    return new ArtifactManager(artifactData);
  }, [artifactData]);

  const artifactType = manager?.getArtifactType();
  const artifactContent = manager?.getArtifactContent();

  const renderArtifact = () => {
    switch (artifactType) {
      case 'SLIDE':
        return <SlideArtifact artifact={artifactContent as SlideArtifactType} />;

      case 'SLIDE_IMAGE':
        return (
          <img src={(artifactContent as SlideImageArtifactType).image_url} alt="Slide" className="h-full w-full" />
        );

      case 'DEMO':
        return <DemoArtifact artifact={artifactContent as DemoArtifactType} artifactId={activeArtifactId as string} />;

      case 'VIDEO':
        return (
          <VideoArtifact
            videoUrl={(artifactContent as VideoArtifactType).video_url}
            artifactId={activeArtifactId as string}
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
    <div className={cn('col-span-2 mr-2 pl-2', { 'col-span-3': isArtifactMaximized })}>
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
