import { Button, Icons, Typography } from '@meaku/saral';
import { useSidebarArtifactContext } from '../context/SidebarArtifactContext';
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface ImageArtifactProps {
  title: string;
  url: string;
  alt?: string;
  isLatestMessage?: boolean;
  isExpanded?: boolean;
}

export const ImageArtifact = ({
  title,
  url,
  alt = '',
  isLatestMessage = false,
  isExpanded = false,
}: ImageArtifactProps) => {
  const { openSidebar, closeSidebar, currentImage, isContainerReady } = useSidebarArtifactContext();
  const hasAutoOpened = useRef(false);
  const isMobile = useIsMobile();

  // Auto-open sidebar when component mounts, but only if it's the latest message and container is ready
  // Disable auto-opening when Ask AI is in expanded mode
  useEffect(() => {
    if (
      url &&
      !currentImage &&
      !hasAutoOpened.current &&
      isLatestMessage &&
      isContainerReady &&
      !isExpanded &&
      !isMobile
    ) {
      hasAutoOpened.current = true;
      openSidebar(url, 'SLIDE_IMAGE', title);
    }
  }, [url, title, currentImage, isLatestMessage, isContainerReady, isExpanded, openSidebar, isMobile]);

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
    }
  };

  // Check if this specific image is currently expanded in the sidebar
  const isThisImageExpanded = currentImage?.url === url && currentImage?.isExpanded;

  if (!url) {
    return null;
  }

  // When expanded, render image inline without sidebar functionality
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
            <img src={url} alt={alt || title} className="w-full h-auto max-w-full object-contain" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-end group flex-col border rounded-xl overflow-hidden relative">
        <div className="p-3 bg-primary/10 flex items-center justify-between">
          <Typography variant="body-small" fontWeight="medium" className="max-w-72">
            {title}
          </Typography>
          <Button
            variant={isThisImageExpanded ? 'secondary' : 'default'}
            size="sm"
            onClick={handleButtonClick}
            className="h-6 w-6 p-0 rounded-full"
          >
            <Icons.Maximize2 className="size-3 duration-300" />
          </Button>
        </div>
        <div className="relative" style={{ minWidth: '200px', minHeight: '150px' }}>
          <img
            src={url}
            alt={alt || title}
            className="w-full h-full object-cover border border-4 border-primary/10 rounded-xl rounded-t-none"
          />
          <div
            onClick={handleButtonClick}
            className="absolute bottom-1 top-1 left-1 right-1 rounded-xl  bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer z-10"
          >
            <Icons.Expand className="size-6 duration-300" />
          </div>
          {isThisImageExpanded && (
            <div className="absolute bottom-1 top-1 left-1 right-1 rounded-xl bg-white/20 backdrop-blur-sm opacity-100 transition-all flex items-center justify-center cursor-pointer z-10 flex-col">
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
      </div>
    </div>
  );
};

export type { ImageArtifactProps };
