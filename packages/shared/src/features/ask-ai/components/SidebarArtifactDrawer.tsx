import { cn } from '@meaku/saral';
import { SideDrawer } from '../../../components/SideDrawer';
import { SidebarArtifactContent } from './SidebarArtifactContent';
import { RefObject } from 'react';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import ReactPlayer from 'react-player';

interface SidebarArtifactDrawerProps {
  targetRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  artifact: {
    url: string;
    artifactType: 'VIDEO' | 'SLIDE_IMAGE';
    title: string;
  } | null;
  videoError: string | null;
  shouldAutoPlay?: boolean;
  videoRef: RefObject<ReactPlayer | null>;
  isPlaying?: boolean;
  onClose: () => void;
  onCloseComplete?: () => void;
  onVideoError?: (error: string) => void;
}

export const SidebarArtifactDrawer = ({
  targetRef,
  isOpen,
  artifact,
  videoError,
  videoRef,
  shouldAutoPlay,
  isPlaying,
  onClose,
  onCloseComplete,
  onVideoError,
}: SidebarArtifactDrawerProps) => {
  const isMobile = useIsMobile();

  if (!artifact) return null;
  return (
    <SideDrawer
      isOpen={isOpen}
      targetRef={targetRef}
      side="left"
      className={cn({
        '!w-full !h-full !left-0 !top-0 !z-[100]': isMobile,
      })}
      onCloseComplete={onCloseComplete}
    >
      <div className="h-full w-full overflow-hidden">
        <SidebarArtifactContent
          artifact={artifact}
          videoError={videoError}
          videoRef={videoRef}
          shouldAutoPlay={shouldAutoPlay}
          isPlaying={isPlaying}
          onClose={onClose}
          onVideoError={onVideoError}
        />
      </div>
    </SideDrawer>
  );
};
