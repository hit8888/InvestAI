import { Demo } from '../types';
import { useState } from 'react';
import { LucideIcon } from '@neuraltrade/saral';

interface DemoThumbnailProps {
  demo: Demo;
  demoUrl: string | null;
  onLoad?: () => void;
  isSelected?: boolean;
  isWatched?: boolean;
  onWatchNow?: () => void;
}

export const DemoThumbnail = ({
  demo,
  onLoad,
  isSelected = false,
  isWatched: _isWatched = false,
  onWatchNow,
}: DemoThumbnailProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);

  const handleThumbnailLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleMouseEnter = () => {
    setShowPlayButton(true);
  };

  const handleMouseLeave = () => {
    setShowPlayButton(false);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onWatchNow?.();
  };

  return (
    <div
      className={`relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Demo thumbnail image */}
      {demo.thumbnail_url ? (
        <img
          src={demo.thumbnail_url}
          alt={demo.title}
          className="w-full h-full object-cover"
          onLoad={handleThumbnailLoad}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-center p-4">
            <div className="text-sm font-medium">{demo.title}</div>
            <div className="text-xs text-gray-400 mt-1">Demo Preview</div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500">Loading demo...</div>
        </div>
      )}

      {/* Play button overlay */}
      {showPlayButton && !isLoading && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center fade-in"
          onClick={handlePlayClick}
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
            <LucideIcon name="play" className="w-4 h-4" fill="currentColor" />
            Play in Fullscreen
          </button>
        </div>
      )}

      {/* Demo title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <h3 className="text-white font-semibold text-sm line-clamp-1">{demo.title}</h3>
      </div>
    </div>
  );
};
