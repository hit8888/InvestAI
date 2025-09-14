export type ArtifactType = 'VIDEO' | 'SLIDE_IMAGE';

export interface BaseArtifactProps {
  title: string;
  url: string;
  isLatestMessage?: boolean;
  isExpanded?: boolean;
}

export interface VideoState {
  url: string;
  isPlaying: boolean;
}

export interface ImageState {
  url: string;
  isExpanded: boolean;
}

export interface SidebarArtifactState {
  url: string;
  artifactType: ArtifactType;
  title: string;
}

export interface VideoPlayState {
  url: string;
  isPlaying: boolean;
}

export interface ImageOpenState {
  url: string;
  isOpen: boolean;
}

export interface ArtifactContextState {
  sideBarArtifact: SidebarArtifactState | null;
  isSideDrawerOpen: boolean;
  currentVideo: VideoState | null;
  currentImage: ImageState | null;
  videoError: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isContainerReady: boolean;
  videoPlayState: VideoPlayState | null;
  imageOpenState: ImageOpenState | null;
  shouldAutoPlay: boolean;
}

export interface ArtifactContextActions {
  openSidebar: (url: string, artifactType: ArtifactType, title: string, shouldPlay?: boolean) => Promise<void>;
  closeSidebar: () => void;
  handleCloseComplete: () => void;
  setCurrentVideo: React.Dispatch<React.SetStateAction<VideoState | null>>;
  toggleVideoPlayPause: () => void;
  handleVideoError: (error: string) => void;
  setContainerReady: (ready: boolean) => void;
}
