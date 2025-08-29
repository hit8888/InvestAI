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
 * Hook to manage sidebar artifact display and video playback
 *
 * Features:
 * - Auto-opening sidebar for latest message artifacts (no autoplay)
 * - Manual opening with autoplay when user clicks "Play Video"
 * - Video play/pause controls with state synchronization
 * - Image artifact display
 * - Error handling for video playback issues
 *
 * Video Playback Logic:
 * - Uses dual useEffect system to handle timing issues
 * - First effect: Handles play/pause when video element exists
 * - Second effect: Handles video element becoming available after sidebar opens
 * - Ensures videos play reliably in all scenarios
 */
export const useSidebarArtifact = () => {
  const [sideBarArtifact, setSideBarArtifact] = useState<SidebarArtifact | null>(null);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [calculatedWidth, setCalculatedWidth] = useState<number>(700);
  const [currentVideo, setCurrentVideo] = useState<VideoState | null>(null);
  const [currentImage, setCurrentImage] = useState<ImageState | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isContainerReady, setIsContainerReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const calculateDimensions = (url: string, artifactType: 'VIDEO' | 'SLIDE_IMAGE'): Promise<number> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Dimension calculation timeout'));
      }, 5000); // 5 second timeout

      if (artifactType === 'VIDEO') {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          try {
            const aspectRatio = video.videoWidth / video.videoHeight;
            const containerHeight = window.innerHeight - 200;
            const calculatedWidth = Math.min(Math.max(containerHeight * aspectRatio + 80, 700), 800);
            resolve(calculatedWidth);
          } catch (error) {
            console.error('Error calculating video dimensions:', error);
            resolve(700);
          }
        };
        video.onerror = () => {
          clearTimeout(timeout);
          console.warn('Video failed to load for dimension calculation');
          resolve(700);
        };
        video.src = url;
      } else {
        const img = new Image();
        img.onload = () => {
          clearTimeout(timeout);
          try {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const containerHeight = window.innerHeight - 200;
            const calculatedWidth = Math.min(Math.max(containerHeight * aspectRatio + 80, 700), 800);
            resolve(calculatedWidth);
          } catch (error) {
            console.error('Error calculating image dimensions:', error);
            resolve(700);
          }
        };
        img.onerror = () => {
          clearTimeout(timeout);
          console.warn('Image failed to load for dimension calculation');
          resolve(700);
        };
        img.src = url;
      }
    });
  };

  /**
   * Open the sidebar with an artifact (video or image)
   *
   * @param url - The URL of the artifact
   * @param artifactType - Type of artifact ('VIDEO' or 'SLIDE_IMAGE')
   * @param title - Title to display in the sidebar
   * @param shouldPlay - For videos: true = autoplay, false = pause, undefined = default behavior
   *
   * Video Autoplay Behavior:
   * - shouldPlay: true → Video opens and starts playing immediately
   * - shouldPlay: false → Video opens but stays paused
   * - Used by: Auto-opening (false), Manual "Play Video" button (true)
   */
  const openSidebar = useCallback(
    async (url: string, artifactType: 'VIDEO' | 'SLIDE_IMAGE', title: string, shouldPlay?: boolean) => {
      try {
        // Calculate width first
        const width = await calculateDimensions(url, artifactType);

        // Set all state at once to ensure sidebar opens with correct width
        setCalculatedWidth(width);
        setSideBarArtifact({ url, artifactType, title });
        setVideoError(null); // Clear any previous errors

        if (artifactType === 'VIDEO') {
          setCurrentVideo({ url, isPlaying: shouldPlay === true });
        } else if (artifactType === 'SLIDE_IMAGE') {
          setCurrentImage({ url, isExpanded: true });
        }

        // Small delay to ensure accurate positioning
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Open sidebar after all state is set
        setIsSideDrawerOpen(true);
      } catch (error) {
        console.error('Error opening sidebar:', error);
        // Fallback: open with default width
        setCalculatedWidth(700);
        setSideBarArtifact({ url, artifactType, title });
        setVideoError(null);

        if (artifactType === 'VIDEO') {
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
   * Close the sidebar and reset all state
   */
  const closeSidebar = useCallback(() => {
    setIsSideDrawerOpen(false);
    setSideBarArtifact(null);
    setCurrentVideo(null);
    setCurrentImage(null);
    setVideoError(null);
  }, []);

  /**
   * Toggle video play/pause state
   * Used when user clicks play/pause button in sidebar
   */
  const toggleVideoPlayPause = useCallback(() => {
    if (currentVideo) {
      setCurrentVideo({ ...currentVideo, isPlaying: !currentVideo.isPlaying });
    }
  }, [currentVideo]);

  /**
   * Handle video playback errors
   * @param error - Error message to display
   */
  const handleVideoError = useCallback((error: string) => {
    setVideoError(error);
  }, []);

  const setContainerReady = useCallback((ready: boolean) => {
    setIsContainerReady(ready);
  }, []);

  /**
   * Control video playback based on currentVideo state
   *
   * This effect handles video play/pause when the video element is already available.
   * It triggers when currentVideo.isPlaying changes and the video element exists.
   *
   * Scenarios:
   * - User clicks play/pause button in sidebar (video element exists)
   * - Auto-opening with shouldPlay: false (video element exists, stays paused)
   * - Manual opening with shouldPlay: true (video element exists, starts playing)
   */
  useEffect(() => {
    if (videoRef.current && sideBarArtifact?.artifactType === 'VIDEO' && currentVideo) {
      if (currentVideo.isPlaying) {
        // Check if video is ready to play
        if (videoRef.current.readyState >= 2) {
          // Video is ready, play it immediately
          videoRef.current.play().catch((error) => {
            console.error('Video play error:', error);
            setVideoError('Failed to play video. Please try again.');
          });
        } else {
          // Video not ready yet, wait for it to load
          const handleCanPlay = () => {
            videoRef.current!.play().catch((error) => {
              console.error('Video play error:', error);
              setVideoError('Failed to play video. Please try again.');
            });
            videoRef.current!.removeEventListener('canplay', handleCanPlay);
          };
          videoRef.current.addEventListener('canplay', handleCanPlay);
        }
      } else {
        // Pause video when isPlaying is false
        videoRef.current.pause();
      }
    }
  }, [currentVideo?.isPlaying, sideBarArtifact?.artifactType, sideBarArtifact?.url, currentVideo?.url, currentVideo]);

  /**
   * Handle video element becoming available after sidebar opens
   *
   * This effect specifically handles the case where:
   * 1. User clicks "Play Video" button (currentVideo.isPlaying = true)
   * 2. Sidebar opens but video element is not yet mounted
   * 3. Video element gets mounted and becomes available
   * 4. This effect triggers and starts playing the video
   *
   * This solves the timing issue where the video element doesn't exist
   * when the first effect tries to play it.
   */
  const videoRefExists = !!videoRef.current;
  useEffect(() => {
    if (videoRef.current && sideBarArtifact?.artifactType === 'VIDEO' && currentVideo?.isPlaying) {
      // Check if video is ready to play
      if (videoRef.current.readyState >= 2) {
        // Video is ready, play it immediately
        videoRef.current.play().catch((error) => {
          console.error('Video play error:', error);
          setVideoError('Failed to play video. Please try again.');
        });
      } else {
        // Video not ready yet, wait for it to load
        const handleCanPlay = () => {
          videoRef.current!.play().catch((error) => {
            console.error('Video play error:', error);
            setVideoError('Failed to play video. Please try again.');
          });
          videoRef.current!.removeEventListener('canplay', handleCanPlay);
        };
        videoRef.current.addEventListener('canplay', handleCanPlay);
      }
    }
  }, [videoRefExists, sideBarArtifact?.artifactType, currentVideo?.isPlaying]);

  return {
    // State
    sideBarArtifact,
    isSideDrawerOpen,
    _calculatedWidth: calculatedWidth,
    currentVideo,
    currentImage,
    videoError,
    videoRef,
    isContainerReady,

    // Actions
    openSidebar,
    closeSidebar,
    toggleVideoPlayPause,
    handleVideoError,
    setContainerReady,
  };
};
