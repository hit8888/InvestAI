import { Button, cn, Icons } from '@meaku/saral';
import { useSidebarArtifactContext } from '../context/SidebarArtifactContext';
import { useEffect, useRef } from 'react';
import { Typography } from '@meaku/saral';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoArtifactProps {
  title: string;
  url: string;
  isLatestMessage?: boolean;
  isExpanded?: boolean;
}

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
export const VideoArtifact = ({ title, url, isLatestMessage = false, isExpanded = false }: VideoArtifactProps) => {
  const { currentVideo, openSidebar, toggleVideoPlayPause, isContainerReady, sideBarArtifact } =
    useSidebarArtifactContext();
  const hasAutoOpened = useRef(false);
  const isMobile = useIsMobile();
  const cleanedUrl = cleanUrl(url);

  // Check if this video is currently playing in sidebar
  const isThisVideoPlaying =
    currentVideo?.url === cleanedUrl && currentVideo?.isPlaying && sideBarArtifact?.artifactType === 'VIDEO';

  // Auto-open sidebar for latest message (no autoplay)
  useEffect(() => {
    if (cleanedUrl && !hasAutoOpened.current && isLatestMessage && isContainerReady && !isExpanded && !isMobile) {
      hasAutoOpened.current = true;
      openSidebar(cleanedUrl, 'VIDEO', title, false); // shouldPlay=false
    }
  }, [cleanedUrl, title, isLatestMessage, isContainerReady, isExpanded, openSidebar, isMobile]);

  // Button click handler - disabled in expanded mode
  const handleButtonClick = () => {
    if (isExpanded) return;

    if (currentVideo?.url === cleanedUrl) {
      // Video already open - toggle play/pause
      toggleVideoPlayPause();
    } else {
      // Open sidebar with autoplay
      openSidebar(cleanedUrl, 'VIDEO', title, true); // shouldPlay=true
    }
  };

  if (!cleanedUrl) return null;

  // Expanded mode: inline video with controls
  if (isExpanded) {
    return (
      <div className="w-full">
        <div className="flex flex-col border rounded-xl overflow-hidden w-full">
          <div className="flex items-center gap-2 w-full bg-primary/10 p-2 py-3 flex-shrink-0">
            <Typography variant="body" fontWeight="medium" className="truncate flex-1 mr-2">
              {title}
            </Typography>
          </div>
          <div className="w-full overflow-hidden">
            <video src={cleanedUrl} controls className="w-full h-auto max-w-full object-contain" />
          </div>
        </div>
      </div>
    );
  }

  // Sidebar mode: animated play/pause button
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

export type { VideoArtifactProps };
