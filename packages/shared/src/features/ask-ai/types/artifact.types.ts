import ReactPlayer from 'react-player';

export type ArtifactType = 'VIDEO' | 'SLIDE_IMAGE' | 'DEMO' | 'PDF';

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
  artifactType: Exclude<ArtifactType, 'DEMO' | 'PDF'>;
  title: string;
}

export interface VideoPlayState {
  url: string;
  isPlaying: boolean;
}

export interface ArtifactContextState {
  sideBarArtifact: SidebarArtifactState | null;
  isSideDrawerOpen: boolean;
  currentVideo: VideoState | null;
  currentImage: ImageState | null;
  videoError: string | null;
  videoRef: React.RefObject<ReactPlayer | null>;
  isContainerReady: boolean;
  videoPlayState: VideoPlayState | null;
  shouldAutoPlay: boolean;
}

export interface ArtifactContextActions {
  openSidebar: (
    url: SidebarArtifactState['url'],
    artifactType: SidebarArtifactState['artifactType'],
    title: SidebarArtifactState['title'],
    shouldPlay?: boolean,
  ) => Promise<void>;
  closeSidebar: () => void;
  handleCloseComplete: () => void;
  setCurrentVideo: React.Dispatch<React.SetStateAction<VideoState | null>>;
  toggleVideoPlayPause: () => void;
  handleVideoError: (error: string) => void;
  setContainerReady: (ready: boolean) => void;
  handleReactPlayerPlay: () => void;
  handleReactPlayerPause: () => void;
  handleReactPlayerEnded: () => void;
}
