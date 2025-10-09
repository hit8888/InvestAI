import { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';

interface SidebarArtifact {
  url: string;
  artifactType: 'VIDEO' | 'SLIDE_IMAGE';
  title: string;
}

interface VideoState {
  url: string;
  isPlaying: boolean;
}

interface ImageState {
  url: string;
  isExpanded: boolean;
}

/**
 * useSidebarArtifact - manages sidebar artifact display and video playback
 *
 * Key features:
 * - Auto-open sidebar for latest messages (shouldPlay=false)
 * - Manual open with autoplay (shouldPlay=true)
 * - Dual useEffect system for video state sync
 * - Dimension calculation with 5s timeout
 * - Video state sync from element events
 *
 * Video playback system:
 * - Effect 1: Syncs state with video element events
 * - Effect 2: Handles video element becoming available
 * - State management: currentVideo.isPlaying controls playback
 */
export const useSidebarArtifact = () => {
  const [sideBarArtifact, setSideBarArtifact] = useState<SidebarArtifact | null>(null);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoState | null>(null);
  const [currentImage, setCurrentImage] = useState<ImageState | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isContainerReady, setIsContainerReady] = useState(false);
  const [videoPlayState, setVideoPlayState] = useState<{ url: string; isPlaying: boolean } | null>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState<boolean>(false);
  const [wasManuallyClosed, setWasManuallyClosed] = useState<boolean>(false);
  const videoRef = useRef<ReactPlayer>(null);

  /**
   * Opens sidebar with artifact
   *
   * @param url - Artifact URL
   * @param artifactType - 'VIDEO' | 'SLIDE_IMAGE'
   * @param title - Display title
   * @param shouldPlay - true=autoplay, false=pause, undefined=default
   *
   * Process:
   * 1. Calculate dimensions (5s timeout)
   * 2. Set state atomically
   * 3. 50ms delay for positioning
   * 4. Open sidebar
   */
  const openSidebar = useCallback(
    async (url: string, artifactType: 'VIDEO' | 'SLIDE_IMAGE', title: string, shouldPlay?: boolean) => {
      try {
        // Don't reopen if manually closed
        if (wasManuallyClosed) {
          return;
        }

        // Set all state at once to ensure sidebar opens
        setSideBarArtifact({ url, artifactType, title });
        setVideoError(null); // Clear any previous errors

        if (artifactType === 'VIDEO') {
          // Set initial video state - start with false, will be synced with actual video element
          // Don't assume video is playing until it actually starts
          setCurrentVideo({ url, isPlaying: false });
          setVideoPlayState({ url, isPlaying: false });
          setShouldAutoPlay(shouldPlay === true);
        } else if (artifactType === 'SLIDE_IMAGE') {
          setCurrentImage({ url, isExpanded: true });
        }

        // Small delay to ensure accurate positioning
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Open sidebar after all state is set
        setIsSideDrawerOpen(true);
      } catch (error) {
        console.error('Error opening sidebar:', error);
        // Fallback: open with default state
        setSideBarArtifact({ url, artifactType, title });
        setVideoError(null);

        if (artifactType === 'VIDEO') {
          // Set initial video state - will be synced with actual video element
          setCurrentVideo({ url, isPlaying: shouldPlay === true });
        } else if (artifactType === 'SLIDE_IMAGE') {
          setCurrentImage({ url, isExpanded: true });
        }

        // Small delay to ensure accurate positioning
        await new Promise((resolve) => setTimeout(resolve, 50));

        setIsSideDrawerOpen(true);
      }
    },
    [],
  );

  /**
   * Closes sidebar - triggers animation, cleanup handled in handleCloseComplete
   */
  const closeSidebar = useCallback(() => {
    // Mark that this was a manual close
    setWasManuallyClosed(true);
    // Clear image state immediately to remove overlay
    if (sideBarArtifact?.artifactType === 'SLIDE_IMAGE') {
      setCurrentImage(null);
    }
    setIsSideDrawerOpen(false);
  }, [sideBarArtifact?.artifactType]);

  /**
   * Cleanup after sidebar close animation completes
   * - Pauses video and resets to beginning
   * - Clears all state
   */
  const handleCloseComplete = useCallback(() => {
    if (videoRef.current && currentVideo?.isPlaying) {
      const internalPlayer = videoRef.current.getInternalPlayer() as HTMLVideoElement;
      if (internalPlayer && typeof internalPlayer.pause === 'function') {
        internalPlayer.pause();
        internalPlayer.currentTime = 0;
      }
    }

    setSideBarArtifact(null);
    setCurrentVideo(null);
    setCurrentImage(null);
    setVideoError(null);
    setVideoPlayState(null);
    setShouldAutoPlay(false);
  }, [currentVideo]);

  /**
   * Toggles video play/pause directly on element
   * State sync handled by useEffect event listeners
   */
  const toggleVideoPlayPause = useCallback(() => {
    if (videoRef.current && sideBarArtifact?.artifactType === 'VIDEO') {
      const internalPlayer = videoRef.current.getInternalPlayer() as HTMLVideoElement;
      if (internalPlayer && typeof internalPlayer.play === 'function') {
        if (internalPlayer.paused) {
          internalPlayer.play().catch((error) => {
            console.error('Video play error:', error);
            setVideoError('Failed to play video. Please try again.');
          });
        } else {
          internalPlayer.pause();
        }
      }
    }
  }, [sideBarArtifact?.artifactType]);

  const handleVideoError = useCallback((error: string) => {
    setVideoError(error);
  }, []);

  const setContainerReady = useCallback((ready: boolean) => {
    setIsContainerReady(ready);
  }, []);

  /**
   * Effect 1: Syncs video state with element events
   * - Listens to play/pause/ended/canplay events
   * - Updates currentVideo.isPlaying based on element state
   * - readyState > 2 = can play
   */
  useEffect(() => {
    if (sideBarArtifact?.artifactType === 'VIDEO' && currentVideo) {
      // Set up a polling mechanism to wait for video element
      const setupEventListeners = () => {
        if (!videoRef.current) {
          return false;
        }

        const internalPlayer = videoRef.current.getInternalPlayer() as HTMLVideoElement;
        if (!internalPlayer || typeof internalPlayer.addEventListener !== 'function') {
          return false;
        }

        const video = internalPlayer;

        const syncState = () => {
          const isActuallyPlaying = !video.paused && !video.ended && video.readyState > 2;
          if (isActuallyPlaying !== currentVideo.isPlaying) {
            setCurrentVideo((prev) => (prev ? { ...prev, isPlaying: isActuallyPlaying } : null));
            setVideoPlayState((prev) => (prev ? { ...prev, isPlaying: isActuallyPlaying } : null));
          }
        };

        const handlePlay = () => {
          setCurrentVideo((prev) => (prev ? { ...prev, isPlaying: true } : null));
          setVideoPlayState((prev) => (prev ? { ...prev, isPlaying: true } : null));
        };
        const handlePause = () => {
          setCurrentVideo((prev) => (prev ? { ...prev, isPlaying: false } : null));
          setVideoPlayState((prev) => (prev ? { ...prev, isPlaying: false } : null));
        };
        const handleEnded = () => {
          setCurrentVideo((prev) => (prev ? { ...prev, isPlaying: false } : null));
          setVideoPlayState((prev) => (prev ? { ...prev, isPlaying: false } : null));
        };

        // Initial state sync
        syncState();

        // Add event listeners
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('canplay', syncState);
        video.addEventListener('loadeddata', syncState);
        video.addEventListener('timeupdate', syncState);

        return () => {
          video.removeEventListener('play', handlePlay);
          video.removeEventListener('pause', handlePause);
          video.removeEventListener('ended', handleEnded);
          video.removeEventListener('canplay', syncState);
          video.removeEventListener('loadeddata', syncState);
          video.removeEventListener('timeupdate', syncState);
        };
      };

      // Try to set up listeners immediately
      let cleanup = setupEventListeners();

      // If video element not ready, poll for it
      if (!cleanup) {
        const pollInterval = setInterval(() => {
          cleanup = setupEventListeners();
          if (cleanup) {
            clearInterval(pollInterval);
          }
        }, 50); // Check every 50ms

        return () => {
          clearInterval(pollInterval);
          if (typeof cleanup === 'function') {
            cleanup();
          }
        };
      }

      return cleanup;
    }
  }, [sideBarArtifact?.artifactType, currentVideo, shouldAutoPlay]);

  /**
   * Effect 2: Syncs state when video element becomes available
   * - Triggers when currentVideo changes
   * - Syncs the actual video state with our state
   */
  useEffect(() => {
    if (videoRef.current && sideBarArtifact?.artifactType === 'VIDEO' && currentVideo) {
      const internalPlayer = videoRef.current.getInternalPlayer() as HTMLVideoElement;
      if (!internalPlayer || typeof internalPlayer.addEventListener !== 'function') {
        return;
      }

      const video = internalPlayer;

      // Sync state immediately when video element becomes available
      const syncStateImmediately = () => {
        const isActuallyPlaying = !video.paused && !video.ended && video.readyState > 2;
        if (isActuallyPlaying !== currentVideo.isPlaying) {
          setCurrentVideo((prev) => (prev ? { ...prev, isPlaying: isActuallyPlaying } : null));
          setVideoPlayState((prev) => (prev ? { ...prev, isPlaying: isActuallyPlaying } : null));
        }
      };

      // Sync state immediately
      syncStateImmediately();
    }
  }, [sideBarArtifact?.artifactType, currentVideo]);

  // Reset wasManuallyClosed when the artifact changes
  useEffect(() => {
    if (sideBarArtifact) {
      setWasManuallyClosed(false);
    }
  }, [sideBarArtifact?.url, sideBarArtifact?.artifactType]);

  return {
    // State
    sideBarArtifact,
    isSideDrawerOpen,
    currentVideo,
    currentImage,
    videoError,
    videoRef,
    isContainerReady,
    videoPlayState,
    shouldAutoPlay,

    // Actions
    openSidebar,
    closeSidebar,
    handleCloseComplete,
    toggleVideoPlayPause,
    setCurrentVideo,
    handleVideoError,
    setContainerReady,
  };
};
