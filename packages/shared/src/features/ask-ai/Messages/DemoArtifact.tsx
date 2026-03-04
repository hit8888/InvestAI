import { useState } from 'react';
import { FullscreenDemoPlayer } from '../../demo-library/components/FullscreenDemoPlayer';
import { DemoArtifactData } from '../../../types/message';
import { Button } from '@neuraltrade/saral';

interface DemoArtifactProps {
  data: DemoArtifactData;
}

/**
 * DemoArtifact component that displays a demo preview
 * Shows a thumbnail with always-visible "Start Tour" button overlay
 * When clicked, opens the demo in fullscreen modal
 */
export const DemoArtifact = ({ data }: DemoArtifactProps) => {
  const { title, demo_url, thumbnail_url } = data.content;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(!!thumbnail_url);

  const handleThumbnailLoad = () => {
    setIsLoading(false);
  };

  const handleStartTour = () => {
    setIsFullscreen(true);
  };

  const startTourButton = (
    <Button hasWipers onClick={handleStartTour} variant="default" className="px-10 rounded-lg">
      Start Tour
    </Button>
  );

  return (
    <>
      <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {/* Thumbnail Image */}
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover"
            onLoad={handleThumbnailLoad}
            onError={handleThumbnailLoad}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/15 to-primary/30 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-sm font-medium text-foreground mb-4">{title}</div>
              {startTourButton}
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-500">Loading demo...</div>
          </div>
        )}

        {/* CTA Overlay with Start Tour Button - only show when we have a thumbnail */}
        {!isLoading && thumbnail_url && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-all duration-300 rounded-lg">
            {startTourButton}
          </div>
        )}

        {/* Demo Title Overlay - only show when we have a thumbnail */}
        {!isLoading && thumbnail_url && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="text-white font-semibold text-sm line-clamp-1">{title}</h3>
          </div>
        )}
      </div>

      {/* Fullscreen Demo Player */}
      {isFullscreen && (
        <FullscreenDemoPlayer
          demoUrl={demo_url}
          demoTitle={title}
          onClose={() => {
            setIsFullscreen(false);
          }}
        />
      )}
    </>
  );
};

export type { DemoArtifactProps };
