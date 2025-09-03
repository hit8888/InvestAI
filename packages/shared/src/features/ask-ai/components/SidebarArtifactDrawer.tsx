import { cn, SideDrawer } from '@meaku/saral';
import { SidebarArtifactContent } from './SidebarArtifactContent';
import { RefObject } from 'react';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface SidebarArtifactDrawerProps {
  targetRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  artifact: {
    url: string;
    artifactType: 'VIDEO' | 'SLIDE_IMAGE';
    title: string;
  } | null;
  currentVideo: {
    url: string;
    isPlaying: boolean;
  } | null;
  videoError: string | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  onPlayPauseToggle: () => void;
  onClose: () => void;
  onVideoError?: (error: string) => void;
}

export const SidebarArtifactDrawer = ({
  targetRef,
  isOpen,
  artifact,
  currentVideo,
  videoError,
  videoRef,
  onPlayPauseToggle,
  onClose,
  onVideoError,
}: SidebarArtifactDrawerProps) => {
  const isMobile = useIsMobile();

  if (!artifact) return null;
  return (
    <SideDrawer
      isOpen={isOpen}
      targetRef={targetRef}
      side="left"
      onClose={onClose}
      className={cn({
        '!w-full !h-full !left-0 !top-0': isMobile,
      })}
    >
      <div className="h-full w-full overflow-hidden">
        <SidebarArtifactContent
          artifact={artifact}
          currentVideo={currentVideo}
          videoError={videoError}
          videoRef={videoRef}
          onPlayPauseToggle={onPlayPauseToggle}
          onClose={onClose}
          onVideoError={onVideoError}
        />
      </div>
    </SideDrawer>
  );
};
