import { Typography, Button, Icons } from '@meaku/saral';
import { useSidebarArtifactContext } from '../context/SidebarArtifactContext';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import { BaseArtifact } from '../components/BaseArtifact';
import { BaseArtifactProps } from '../types/artifact.types';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface ImageArtifactProps extends BaseArtifactProps {
  alt?: string;
}

export const ImageArtifact = ({
  title,
  url,
  alt = '',
  isLatestMessage = false,
  isExpanded = false,
}: ImageArtifactProps) => {
  const { openSidebar, closeSidebar, setCurrentVideo, isContainerReady, sideBarArtifact, imageOpenState } =
    useSidebarArtifactContext();

  const hasAutoOpened = useRef(false);
  const isMobile = useIsMobile();

  const handleVideoPlayingWhenNewImageComesUp = useCallback(() => {
    // if current video is playing and new image comes up or click on image artifact, stop playing the video
    setCurrentVideo((current) => {
      if (current?.isPlaying) {
        return { ...current, isPlaying: false };
      }
      return current;
    });
  }, [setCurrentVideo]);

  // Auto-open sidebar when component mounts, but only if it's the latest message and container is ready
  // Disable auto-opening when Ask AI is in expanded mode
  useEffect(() => {
    if (url && !hasAutoOpened.current && isLatestMessage && isContainerReady && !isExpanded && !isMobile) {
      hasAutoOpened.current = true;
      openSidebar(url, 'SLIDE_IMAGE', title);
      handleVideoPlayingWhenNewImageComesUp();
    }
  }, [
    url,
    title,
    isLatestMessage,
    isContainerReady,
    isExpanded,
    openSidebar,
    isMobile,
    handleVideoPlayingWhenNewImageComesUp,
  ]);

  const handleButtonClick = () => {
    // Disable sidebar functionality when Ask AI is in expanded mode
    if (isExpanded) {
      return;
    }

    if (isThisImageExpanded) {
      // If image is already expanded, close the sidebar
      closeSidebar();
    } else {
      // If image is not expanded, open the sidebar
      openSidebar(url, 'SLIDE_IMAGE', title);
      handleVideoPlayingWhenNewImageComesUp();
    }
  };

  // Check if this specific image is currently expanded in the sidebar
  const isThisImageExpanded = useMemo(() => {
    if (imageOpenState?.url !== url || sideBarArtifact?.artifactType !== 'SLIDE_IMAGE') {
      return false;
    }
    return imageOpenState.isOpen;
  }, [imageOpenState?.url, imageOpenState?.isOpen, url, sideBarArtifact?.artifactType]);

  if (!url) {
    return null;
  }

  const expandedContent = <img src={url} alt={alt || title} className="w-full h-auto max-w-full object-contain" />;

  const headerActions = (
    <Button variant="outline" size="sm" onClick={handleButtonClick} className="h-6 w-6 p-0 rounded-full">
      {isThisImageExpanded ? (
        <Icons.Minimize2 className="size-3 duration-300" />
      ) : (
        <Icons.Maximize2 className="size-3 duration-300" />
      )}
    </Button>
  );

  return (
    <BaseArtifact
      title={title}
      url={url}
      isExpanded={isExpanded}
      expandedContent={expandedContent}
      headerActions={headerActions}
    >
      <div className="relative" style={{ minWidth: '200px', minHeight: '150px' }}>
        <img
          src={url}
          alt={alt || title}
          className="w-full h-full object-cover border border-4 border-primary/10 rounded-b-xl"
        />
        {!isExpanded && !isThisImageExpanded && (
          <div
            onClick={handleButtonClick}
            className="absolute top-[4px] left-[4px] right-[4px] bottom-[4px] bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer z-10 rounded-b-lg"
          >
            <Icons.Expand className="size-6 duration-300" />
          </div>
        )}
        {isThisImageExpanded && !isExpanded && (
          <div className="absolute top-[4px] left-[4px] right-[4px] bottom-[4px] bg-white/20 backdrop-blur-sm opacity-100 transition-all flex items-center justify-center cursor-pointer z-10 flex-col rounded-b-lg">
            <div className="flex flex-col gap-2 bg-background rounded-xl p-2 pr-3 border">
              <Typography variant="body-small" fontWeight="medium" className="text-accent">
                Currently Viewing in
                <br />
                <Typography as="span" className="text-foreground" variant="body-small" fontWeight="medium">
                  Expanded Mode
                </Typography>
              </Typography>
              <Button variant="default_active" size="sm" onClick={handleButtonClick} className="h-8 w-full">
                Return
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseArtifact>
  );
};

export type { ImageArtifactProps };
