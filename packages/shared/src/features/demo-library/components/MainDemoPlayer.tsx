import { Demo } from '../types';
import { useEffect, useState } from 'react';
import { DemoThumbnail } from './DemoThumbnail';
import { Button } from '@meaku/saral';

interface MainDemoPlayerProps {
  demoId: string | null;
  getDemoById: (id: string) => Demo | undefined;
  getDemoUrl: (demo: Demo) => string;
  onPlayingStateChange?: (isPlaying: boolean) => void;
  isLoading?: boolean;
  wasPlaying?: boolean;
  onDemoSelect?: (demoId: string) => void;
  onWatchNow?: (demoId: string) => void;
  watchedDemos: string[];
  addWatchedDemo: (demoId: string) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export const MainDemoPlayer = ({
  demoId,
  getDemoById,
  getDemoUrl,
  onPlayingStateChange,
  isLoading = false,
  wasPlaying = false,
  onWatchNow,
  watchedDemos,

  addWatchedDemo,
  onFullscreenChange,
}: MainDemoPlayerProps) => {
  const [isIframeLoading, setIsIframeLoading] = useState(false);

  const demo = demoId ? getDemoById(demoId) : null;

  // Use direct demo URL for iframe
  const demoUrl = demo ? getDemoUrl(demo) : null;

  // Reset ended state when demo changes
  useEffect(() => {
    onPlayingStateChange?.(false);
    setIsIframeLoading(false);
  }, [demoId, onPlayingStateChange]);

  // Auto-play new demo if the previous one was playing
  useEffect(() => {
    if (demoUrl && wasPlaying) {
      // For thumbnails, we can mark as playing when the demo is selected
      onPlayingStateChange?.(true);
    }
  }, [demoUrl, wasPlaying, onPlayingStateChange]);

  const handleThumbnailLoad = () => {
    // Mark demo as viewed when thumbnail loads
    if (demoId && !watchedDemos.includes(demoId)) {
      addWatchedDemo(demoId);
    }
    onPlayingStateChange?.(true);
  };

  const handleWatchNow = () => {
    if (demoId) {
      onWatchNow?.(demoId);
      onFullscreenChange?.(true);
    }
  };

  const handlePlayFullscreen = () => {
    if (demoId) {
      setIsIframeLoading(true);
      onWatchNow?.(demoId);
      onFullscreenChange?.(true);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading demo...</div>
      </div>
    );
  }

  if (!demo) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">No demo selected</div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Demo Thumbnail */}
      <DemoThumbnail demo={demo} demoUrl={demoUrl} onLoad={handleThumbnailLoad} onWatchNow={handleWatchNow} />

      {/* Loading Demo Overlay */}
      {isIframeLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-700">Loading Demo...</p>
          </div>
        </div>
      )}

      {/* Hover Card */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-all duration-300`}
      >
        <div
          className={`bg-white rounded-2xl items-center flex flex-col p-4 max-w-[200px] mx-4 shadow-lg transition-all duration-300 transform`}
        >
          <p className="text-sm w-full text-left mb-4 text-muted-foreground">
            Experience how it works in an interactive preview.
          </p>
          <Button hasWipers onClick={handlePlayFullscreen} variant="default" className="px-10 rounded-lg">
            Start Tour
          </Button>
        </div>
      </div>
    </div>
  );
};
