import { useState, useRef, useEffect } from 'react';

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

export const useSidebarArtifact = () => {
  const [sideBarArtifact, setSideBarArtifact] = useState<SidebarArtifact | null>(null);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [calculatedWidth, setCalculatedWidth] = useState<number>(700);
  const [currentVideo, setCurrentVideo] = useState<VideoState | null>(null);
  const [currentImage, setCurrentImage] = useState<ImageState | null>(null);
  const [isUserControlling, setIsUserControlling] = useState(false);
  const [isInitialPlay, setIsInitialPlay] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
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
            // console.log('Video dimensions:', {
            //   videoWidth: video.videoWidth,
            //   videoHeight: video.videoHeight,
            //   aspectRatio,
            //   calculatedWidth,
            // });
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
            // console.log('Image dimensions:', {
            //   naturalWidth: img.naturalWidth,
            //   naturalHeight: img.naturalHeight,
            //   aspectRatio,
            //   calculatedWidth,
            // });
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

  const openSidebar = async (
    url: string,
    artifactType: 'VIDEO' | 'SLIDE_IMAGE',
    title: string,
    shouldPlay?: boolean,
  ) => {
    // console.log('Opening sidebar:', { url, artifactType, title, shouldPlay });

    try {
      // Calculate width first
      const width = await calculateDimensions(url, artifactType);
      // console.log('Calculated width:', width);

      // Set all state at once to ensure sidebar opens with correct width
      setCalculatedWidth(width);
      setSideBarArtifact({ url, artifactType, title });
      setVideoError(null); // Clear any previous errors

      if (artifactType === 'VIDEO') {
        setCurrentVideo({ url, isPlaying: shouldPlay !== undefined ? shouldPlay : true });
        setIsInitialPlay(true); // Mark for initial play
      } else if (artifactType === 'SLIDE_IMAGE') {
        setCurrentImage({ url, isExpanded: true });
      }

      // Open sidebar after all state is set
      setIsSideDrawerOpen(true);
      // console.log('SideDrawer should now be open with width:', width);
    } catch (error) {
      console.error('Error opening sidebar:', error);
      // Fallback: open with default width
      setCalculatedWidth(700);
      setSideBarArtifact({ url, artifactType, title });
      setVideoError(null);

      if (artifactType === 'VIDEO') {
        setCurrentVideo({ url, isPlaying: shouldPlay !== undefined ? shouldPlay : true });
        setIsInitialPlay(true);
      } else if (artifactType === 'SLIDE_IMAGE') {
        setCurrentImage({ url, isExpanded: true });
      }

      setIsSideDrawerOpen(true);
    }
  };

  const closeSidebar = () => {
    setIsSideDrawerOpen(false);
    setSideBarArtifact(null);
    setCurrentVideo(null);
    setCurrentImage(null);
    setIsInitialPlay(false);
    setVideoError(null);
  };

  const toggleVideoPlayPause = () => {
    if (currentVideo) {
      setIsUserControlling(true);
      setIsInitialPlay(false); // Mark that user has taken control
      setCurrentVideo({ ...currentVideo, isPlaying: !currentVideo.isPlaying });
    }
  };

  // Control video playback based on currentVideo state
  useEffect(() => {
    if (videoRef.current && sideBarArtifact?.artifactType === 'VIDEO' && currentVideo) {
      if (isUserControlling) {
        // User-initiated play/pause toggle
        if (currentVideo.isPlaying) {
          videoRef.current.play().catch((error) => {
            console.error('Video play error:', error);
            setVideoError('Failed to play video. Please try again.');
          });
        } else {
          videoRef.current.pause();
        }
        // Reset user control flag after applying the change
        setIsUserControlling(false);
      } else if (currentVideo.isPlaying && isInitialPlay) {
        // Auto-play when sidebar opens with video (only on initial play)
        videoRef.current.currentTime = 0; // Reset to start
        videoRef.current.play().catch((error) => {
          console.error('Video play error:', error);
          setVideoError('Failed to play video. Please try again.');
        });
        setIsInitialPlay(false); // Reset initial play flag
      }
    }
  }, [currentVideo?.isPlaying, sideBarArtifact?.artifactType, isUserControlling, currentVideo, isInitialPlay]);

  // Debug state changes
  useEffect(() => {
    // console.log('State changed:', { isSideDrawerOpen, sideBarArtifact, currentVideo, currentImage });
  }, [isSideDrawerOpen, sideBarArtifact, currentVideo, currentImage]);

  return {
    // State
    sideBarArtifact,
    isSideDrawerOpen,
    calculatedWidth,
    currentVideo,
    currentImage,
    videoError,
    videoRef,

    // Actions
    openSidebar,
    closeSidebar,
    toggleVideoPlayPause,
  };
};
