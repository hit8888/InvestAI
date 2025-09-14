import { useState, useRef, useEffect, useCallback } from 'react';

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
  const [imageOpenState, setImageOpenState] = useState<{ url: string; isOpen: boolean } | null>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          setImageOpenState({ url, isOpen: true });
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
          setImageOpenState({ url, isOpen: true });
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
    // Immediately clear image open state when sidebar starts closing
    setImageOpenState(null);
    setVideoPlayState(null);
    setIsSideDrawerOpen(false);
  }, []);

  /**
   * Cleanup after sidebar close animation completes
   * - Pauses video and resets to beginning
   * - Clears all state
   */
  const handleCloseComplete = useCallback(() => {
    if (videoRef.current && currentVideo?.isPlaying) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setSideBarArtifact(null);
    setCurrentVideo(null);
    setCurrentImage(null);
    setVideoError(null);
    setVideoPlayState(null);
    setImageOpenState(null);
    setShouldAutoPlay(false);
  }, [currentVideo]);

  /**
   * Toggles video play/pause directly on element
   * State sync handled by useEffect event listeners
   */
  const toggleVideoPlayPause = useCallback(() => {
    if (videoRef.current && sideBarArtifact?.artifactType === 'VIDEO') {
      if (videoRef.current.paused) {
        videoRef.current.play().catch((error) => {
          console.error('Video play error:', error);
          setVideoError('Failed to play video. Please try again.');
        });
      } else {
        videoRef.current.pause();
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

        const video = videoRef.current;

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
      const video = videoRef.current;

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
    imageOpenState,
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
