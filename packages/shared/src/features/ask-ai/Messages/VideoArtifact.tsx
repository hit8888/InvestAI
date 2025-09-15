import { Button, cn, Icons } from '@meaku/saral';
import { useSidebarArtifactContext } from '../context/SidebarArtifactContext';
import { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseArtifact } from '../components/BaseArtifact';
import { BaseArtifactProps } from '../types/artifact.types';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

/**
 * Strips leading @ symbols from URLs
 * @param url - URL with potential @ prefixes
 * @returns Clean URL string
 */
const cleanUrl = (url: string): string => {
  return url.replace(/^@+/, '');
};

/**
 * VideoArtifact component with dual rendering modes
 *
 * Rendering modes:
 * - isExpanded=true: Inline video with controls (no sidebar)
 * - isExpanded=false: Play button that opens sidebar
 *
 * Auto-open behavior:
 * - Only for isLatestMessage=true
 * - Requires isContainerReady=true
 * - Disabled when isExpanded=true or isMobile=true
 * - Opens sidebar without autoplay (shouldPlay=false)
 */
export const VideoArtifact = ({ title, url, isLatestMessage = false, isExpanded = false }: BaseArtifactProps) => {
  const {
    currentVideo,
    openSidebar,
    toggleVideoPlayPause,
    isContainerReady,
    sideBarArtifact,
    isSideDrawerOpen,
    videoPlayState,
  } = useSidebarArtifactContext();

  const hasAutoOpened = useRef(false);
  const isMobile = useIsMobile();
  const cleanedUrl = cleanUrl(url);

  // Auto-open sidebar for latest message (no autoplay)
  useEffect(() => {
    if (cleanedUrl && !hasAutoOpened.current && isLatestMessage && isContainerReady && !isExpanded && !isMobile) {
      // Don't auto-open if sidebar is already open with the same video
      const isSameVideoOpen =
        isSideDrawerOpen && sideBarArtifact?.artifactType === 'VIDEO' && currentVideo?.url === cleanedUrl;

      if (!isSameVideoOpen) {
        hasAutoOpened.current = true;
        openSidebar(cleanedUrl, 'VIDEO', title, false); // shouldPlay=false
      }
    }
  }, [
    cleanedUrl,
    title,
    isLatestMessage,
    isContainerReady,
    isExpanded,
    openSidebar,
    isMobile,
    isSideDrawerOpen,
    sideBarArtifact?.artifactType,
    currentVideo?.url,
  ]);

  // Only reset hasAutoOpened when the component unmounts or when isLatestMessage changes
  useEffect(() => {
    if (!isLatestMessage) {
      hasAutoOpened.current = false;
    }
    return () => {
      hasAutoOpened.current = false;
    };
  }, [isLatestMessage]);

  // Check if this video is currently playing in sidebar
  const isThisVideoPlaying = useMemo(() => {
    if (videoPlayState?.url !== cleanedUrl || sideBarArtifact?.artifactType !== 'VIDEO') {
      return false;
    }
    return videoPlayState.isPlaying;
  }, [videoPlayState?.url, videoPlayState?.isPlaying, cleanedUrl, sideBarArtifact?.artifactType]);

  // Button click handler - disabled in expanded mode
  const handleButtonClick = () => {
    if (isExpanded) return;

    // Check if this video is currently open AND the sidebar is actually open
    const isSameVideo = currentVideo?.url === cleanedUrl;
    const isSidebarOpen = isSideDrawerOpen;
    const isVideoArtifact = sideBarArtifact?.artifactType === 'VIDEO';

    if (isSameVideo && isSidebarOpen && isVideoArtifact) {
      // Video already open in sidebar - toggle play/pause
      toggleVideoPlayPause();
    } else {
      // Open sidebar with autoplay (either new video or sidebar is closed)
      openSidebar(cleanedUrl, 'VIDEO', title, true); // shouldPlay=true
    }
  };

  if (!cleanedUrl) return null;

  const expandedContent = <video src={cleanedUrl} controls className="w-full h-auto max-w-full object-contain" />;

  // When expanded, use BaseArtifact for consistent layout
  if (isExpanded) {
    return <BaseArtifact title={title} url={cleanedUrl} isExpanded={true} expandedContent={expandedContent} />;
  }

  // Regular mode: just the play button
  return (
    <div className="w-full">
      <motion.div initial={false} layout>
        <Button
          className={cn(
            'min-w-[120px] h-8 transition-colors duration-200 px-3',
            isThisVideoPlaying
              ? 'rounded-2 !bg-primary/15 !border !text-foreground'
              : 'rounded-full bg-primary text-white',
          )}
          onClick={handleButtonClick}
        >
          <AnimatePresence mode="wait">
            {isThisVideoPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Icons.Pause className="size-4 fill-primary stroke-0" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="flex items-center justify-center"
              >
                <div className="rounded-full bg-background p-1">
                  <Icons.Play className="size-2.5 fill-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.span initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {isThisVideoPlaying ? 'Video Playing' : 'Play Video'}
          </motion.span>
        </Button>
      </motion.div>
    </div>
  );
};

export type { BaseArtifactProps as VideoArtifactProps };
