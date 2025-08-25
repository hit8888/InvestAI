import { SideDrawer } from '@meaku/saral';
import { SidebarArtifactContent } from './SidebarArtifactContent';

interface SidebarArtifactDrawerProps {
  isOpen: boolean;
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
  onPlayPauseToggle,
  onClose,
}: SidebarArtifactDrawerProps) => {
  return (
    <SideDrawer
      isOpen={isOpen}
      position={{ top: 0, right: 0 }}
      className="!h-[calc(100%+90px)]"
      side="left"
      onClose={onClose}
    >
      <div className="p-4 h-full min-w-[800px]" style={{ width: `${calculatedWidth}px` }}>
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
