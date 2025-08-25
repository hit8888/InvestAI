import { SideDrawer } from '@meaku/saral';
import { SidebarArtifactContent } from './SidebarArtifactContent';

interface SidebarArtifactDrawerProps {
  isOpen: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
  calculatedWidth: number;
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
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onPlayPauseToggle: () => void;
  onClose: () => void;
}

export const SidebarArtifactDrawer = ({
  isOpen,
  calculatedWidth,
  artifact,
  currentVideo,
  videoError,
  videoRef,
  targetRef,
  onPlayPauseToggle,
  onClose,
}: SidebarArtifactDrawerProps) => {
  return (
    <SideDrawer isOpen={isOpen} targetRef={targetRef} side="left" onClose={onClose}>
      <div className="h-full w-full overflow-hidden" style={{ width: `${calculatedWidth}px` }}>
        {artifact && (
          <SidebarArtifactContent
            artifact={artifact}
            currentVideo={currentVideo}
            videoError={videoError}
            videoRef={videoRef}
            onPlayPauseToggle={onPlayPauseToggle}
            onClose={onClose}
          />
        )}
      </div>
    </SideDrawer>
  );
};
