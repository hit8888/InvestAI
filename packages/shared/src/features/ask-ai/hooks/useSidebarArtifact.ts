import { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';

interface SidebarArtifact {
  url: string;
  artifactType: 'VIDEO' | 'SLIDE_IMAGE' | 'PDF';
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
   * @param artifactType - 'VIDEO' | 'SLIDE_IMAGE' | 'PDF'
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
    async (url: string, artifactType: 'VIDEO' | 'SLIDE_IMAGE' | 'PDF', title: string, shouldPlay?: boolean) => {
      try {
        // Don't reopen if manually closed
        if (wasManuallyClosed) {
          return;
        }

        // Set all state at once to ensure sidebar opens
        setSideBarArtifact({ url, artifactType, title });
        setVideoError(null); // Clear any previous errors

        if (artifactType === 'VIDEO') {
          // Set initial state to match shouldPlay for immediate button state accuracy
          // For iframe players (YouTube, Vimeo), this prevents state oscillation
          // For native videos, DOM events will quickly sync the actual state
          const initialPlayingState = shouldPlay === true;
          setCurrentVideo({ url, isPlaying: initialPlayingState });
          setVideoPlayState({ url, isPlaying: initialPlayingState });
          setShouldAutoPlay(shouldPlay === true);
        } else if (artifactType === 'SLIDE_IMAGE') {
          setCurrentImage({ url, isExpanded: true });
        } else if (artifactType === 'PDF') {
          // PDF artifacts don't need special state management
          // They're displayed in an iframe
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
          const initialPlayingState = shouldPlay === true;
          setCurrentVideo({ url, isPlaying: initialPlayingState });
        } else if (artifactType === 'SLIDE_IMAGE') {
          setCurrentImage({ url, isExpanded: true });
        } else if (artifactType === 'PDF') {
          // PDF artifacts don't need special state management
          // They're displayed in an iframe
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
    // PDF artifacts don't need special cleanup
    setIsSideDrawerOpen(false);
  }, [sideBarArtifact?.artifactType]);

  /**
   * Cleanup after sidebar close animation completes
   * - Pauses video and resets to beginning (native videos only)
   * - Clears all state (all video types)
   */
  const handleCloseComplete = useCallback(() => {
    if (videoRef.current && currentVideo?.isPlaying) {
      const internalPlayer = videoRef.current.getInternalPlayer() as HTMLVideoElement;
      // Only try to pause/reset native video elements directly
      // Iframe players will be cleaned up when the component unmounts
      if (internalPlayer && typeof internalPlayer.pause === 'function' && 'currentTime' in internalPlayer) {
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
   * Toggles video play/pause
   * - For native videos: directly controls element (fast, native)
   * - For iframe videos (YouTube, Vimeo, etc.): toggles state (ReactPlayer handles it)
   * State sync handled by useEffect event listeners (native) or ReactPlayer callbacks (iframe)
   */
  const toggleVideoPlayPause = useCallback(() => {
    if (videoRef.current && sideBarArtifact?.artifactType === 'VIDEO' && currentVideo) {
      const internalPlayer = videoRef.current.getInternalPlayer() as HTMLVideoElement;

      // Try native video element control first (for direct video files)
      if (internalPlayer && 'paused' in internalPlayer) {
        // Native HTML5 video element - use direct control
        if (internalPlayer.paused) {
          internalPlayer.play().catch((error) => {
            console.error('Video play error:', error);
            setVideoError('Failed to play video. Please try again.');
          });
        } else {
          internalPlayer.pause();
        }
      } else {
        // Iframe-based player (YouTube, Vimeo, etc.) - toggle via state
        // ReactPlayer will respond to the `playing` prop change
        const newPlayingState = !currentVideo.isPlaying;
        setCurrentVideo((prev) => (prev ? { ...prev, isPlaying: newPlayingState } : null));
        setVideoPlayState((prev) => (prev ? { ...prev, isPlaying: newPlayingState } : null));
        setShouldAutoPlay(newPlayingState);
      }
    }
  }, [sideBarArtifact?.artifactType, currentVideo]);

  const handleVideoError = useCallback((error: string) => {
    setVideoError(error);
  }, []);

  const setContainerReady = useCallback((ready: boolean) => {
    setIsContainerReady(ready);
  }, []);

  /**
   * Callback for ReactPlayer's onPlay event
   * This handles iframe players (YouTube, Vimeo, etc.) that don't emit native DOM events
   * Native videos are already handled by DOM event listeners in useEffect
   */
  const handleReactPlayerPlay = useCallback(() => {
    setCurrentVideo((prev) => (prev ? { ...prev, isPlaying: true } : null));
    setVideoPlayState((prev) => (prev ? { ...prev, isPlaying: true } : null));
  }, []);

  /**
   * Callback for ReactPlayer's onPause event
   * This handles iframe players (YouTube, Vimeo, etc.) that don't emit native DOM events
   */
  const handleReactPlayerPause = useCallback(() => {
    setCurrentVideo((prev) => (prev ? { ...prev, isPlaying: false } : null));
    setVideoPlayState((prev) => (prev ? { ...prev, isPlaying: false } : null));
  }, []);

  /**
   * Callback for ReactPlayer's onEnded event
   * This handles iframe players (YouTube, Vimeo, etc.) that don't emit native DOM events
   */
  const handleReactPlayerEnded = useCallback(() => {
    setCurrentVideo((prev) => (prev ? { ...prev, isPlaying: false } : null));
    setVideoPlayState((prev) => (prev ? { ...prev, isPlaying: false } : null));
  }, []);

  /**
   * Effect 1: Syncs video state with element events (NATIVE VIDEOS ONLY)
   * - Listens to play/pause/ended/canplay events
   * - Updates currentVideo.isPlaying based on element state
   * - readyState > 2 = can play
   * - IMPORTANT: Only for native HTML5 video elements, not iframe players
   */
  useEffect(() => {
    if (sideBarArtifact?.artifactType === 'VIDEO' && currentVideo) {
      // Set up a polling mechanism to wait for video element
      const setupEventListeners = () => {
        if (!videoRef.current) {
          return false;
        }

        const internalPlayer = videoRef.current.getInternalPlayer() as HTMLVideoElement;

        // Only set up listeners for native HTML5 video elements
        // Iframe players (YouTube, Vimeo, etc.) use ReactPlayer callbacks instead
        if (
          !internalPlayer ||
          typeof internalPlayer.addEventListener !== 'function' ||
          !('paused' in internalPlayer) ||
          !('readyState' in internalPlayer)
        ) {
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
   * Effect 2: Syncs state when native video element becomes available
   * - Triggers when currentVideo changes
   * - Syncs the actual video state with our state
   * - IMPORTANT: Only for native HTML5 video elements, not iframe players
   */
  useEffect(() => {
    if (videoRef.current && sideBarArtifact?.artifactType === 'VIDEO' && currentVideo) {
      const internalPlayer = videoRef.current.getInternalPlayer() as HTMLVideoElement;

      // Only sync for native HTML5 video elements
      // Iframe players (YouTube, Vimeo, etc.) use ReactPlayer callbacks instead
      if (
        !internalPlayer ||
        typeof internalPlayer.addEventListener !== 'function' ||
        !('paused' in internalPlayer) ||
        !('readyState' in internalPlayer)
      ) {
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

    // ReactPlayer callbacks for iframe videos (YouTube, Vimeo, etc.)
    handleReactPlayerPlay,
    handleReactPlayerPause,
    handleReactPlayerEnded,
  };
};
