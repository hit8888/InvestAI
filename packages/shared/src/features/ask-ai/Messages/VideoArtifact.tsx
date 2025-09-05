import { Button, Icons } from '@meaku/saral';
import { useSidebarArtifactContext } from '../context/SidebarArtifactContext';
import { useEffect, useRef } from 'react';
import { Typography } from '@meaku/saral';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface VideoArtifactProps {
  title: string;
  url: string;
  isLatestMessage?: boolean;
  isExpanded?: boolean;
}

const cleanUrl = (url: string): string => {
  return url.replace(/^@+/, '');
};

export const VideoArtifact = ({ title, url, isLatestMessage = false, isExpanded = false }: VideoArtifactProps) => {
  const { currentVideo, openSidebar, toggleVideoPlayPause, isContainerReady, sideBarArtifact } =
    useSidebarArtifactContext();
  const hasAutoOpened = useRef(false);
  const isMobile = useIsMobile();
  const cleanedUrl = cleanUrl(url);

  // Check if this specific video is currently open and playing
  const isThisVideoPlaying =
    currentVideo?.url === cleanedUrl && currentVideo?.isPlaying && sideBarArtifact?.artifactType === 'VIDEO';

  // Auto-open sidebar when component mounts, but only if it's the latest message and container is ready
  // Disable auto-opening when Ask AI is in expanded mode
  useEffect(() => {
    if (cleanedUrl && !hasAutoOpened.current && isLatestMessage && isContainerReady && !isExpanded && !isMobile) {
      hasAutoOpened.current = true;
      openSidebar(cleanedUrl, 'VIDEO', title, false);
    }
  }, [cleanedUrl, title, isLatestMessage, isContainerReady, isExpanded, openSidebar, isMobile]);

  const handleButtonClick = () => {
    // Disable sidebar functionality when Ask AI is in expanded mode
    if (isExpanded) {
      return;
    }

    if (currentVideo?.url === cleanedUrl) {
      // If this video is currently open, toggle play/pause
      toggleVideoPlayPause();
      openSidebar(cleanedUrl, 'VIDEO', title, !currentVideo?.isPlaying);
    } else {
      // If this video is not open, open sidebar and start playing
      openSidebar(cleanedUrl, 'VIDEO', title, true);
    }
  };

  const buttonClasses = isThisVideoPlaying
    ? 'h-7 rounded-2 gap-1 pr-3 !bg-primary/15 !border !text-foreground'
    : 'h-7 rounded-full gap-1 pr-3 pl-0 py-4';

  if (!cleanedUrl) {
    return null;
  }

  // When expanded, render video inline without sidebar functionality
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

  // Normal sidebar mode - render play button
  return (
    <div className="w-full">
      <Button
        className={`${buttonClasses} transition-all duration-300 min-w-[120px] min-h-[28px]`}
        onClick={handleButtonClick}
      >
        {isThisVideoPlaying ? (
          <Icons.Pause className="size-4 fill-primary stroke-0" />
        ) : (
          <div className="rounded-full bg-background p-1">
            <Icons.Play className="size-2.5 fill-foreground" />
          </div>
        )}
        {isThisVideoPlaying ? 'Video Playing' : 'Play Video'}
      </Button>
    </div>
  );
};

export type { VideoArtifactProps };
