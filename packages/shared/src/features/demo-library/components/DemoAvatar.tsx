import { useState, useEffect, useLayoutEffect, useRef, memo } from 'react';
import { Demo } from '../types';
import { LucideIcon, Typography } from '@meaku/saral';
import BlackTooltip from '../../../components/BlackTooltip';

// Global cache to track loaded demos across all component instances
const globalLoadedDemos = new Set<string>();

interface DemoAvatarProps {
  demo: Demo;
  demoUrl: string;
  isSelected?: boolean;
  isWatched?: boolean;
  onSelect: () => void;
}

const DemoAvatarComponent = ({ demo, isSelected = false, onSelect }: DemoAvatarProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);

  // Check if this demo has been loaded globally
  const demoKey = `${demo.id}-${demo.thumbnail_url}`;
  const hasBeenLoaded = globalLoadedDemos.has(demoKey);

  // Only reset loading state if we haven't loaded this demo before
  useEffect(() => {
    if (!hasBeenLoaded) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [demo.id, demo.thumbnail_url, hasBeenLoaded]);

  // Handle demo thumbnail load
  const handleThumbnailLoad = () => {
    globalLoadedDemos.add(demoKey);
    setIsLoading(false);
  };

  // Handle thumbnail load error
  const handleThumbnailError = () => {
    globalLoadedDemos.add(demoKey);
    setIsLoading(false);
  };

  // Handle case where there's no thumbnail URL
  useEffect(() => {
    if (!demo.thumbnail_url) {
      globalLoadedDemos.add(demoKey);
      setIsLoading(false);
    }
  }, [demo.thumbnail_url, demo.id, demoKey]);

  // Add timeout fallback to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      globalLoadedDemos.add(demoKey);
      setIsLoading(false);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [demo.id, demo.thumbnail_url, demoKey]);

  // Check if title is truncated using useLayoutEffect for synchronous DOM measurements
  useLayoutEffect(() => {
    const element = titleRef.current;
    if (element && demo.title) {
      const isTruncated = element.scrollHeight > element.clientHeight;
      setIsTitleTruncated(isTruncated);
    }
  }, [demo.title, isLoading]); // Re-check when title changes or loading completes

  const avatarContent = (
    <div className={`group relative cursor-pointer`} onClick={onSelect}>
      <div
        className={`rounded-[10px] mb-2 relative flex flex-col h-32 gap-2 p-2 transition-all duration-200 ${
          isSelected ? 'bg-blue-50/50' : 'bg-card'
        }`}
      >
        {/* Border space for both selected and unselected demos */}
        <div
          className="absolute inset-0 rounded-[10px] pointer-events-none transition-all"
          style={{
            background: isSelected
              ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.2) 0%,rgba(59, 130, 246, 0.4) 50%, rgba(59, 130, 246, 0.8) 100%)'
              : 'transparent',
            padding: '3px',
          }}
        >
          <div className="w-full h-full bg-card rounded-[6px]"></div>
        </div>

        {/* Demo Preview - Middle */}
        <div className="w-full h-[60px] relative group z-10">
          {isLoading ? (
            /* Shimmer effect for loading state */
            <div className="w-full h-full bg-gradient-to-r border from-transparent via-white to-transparent animate-pulse rounded-[10px]" />
          ) : demo.thumbnail_url ? (
            <img
              src={demo.thumbnail_url}
              alt={demo.title}
              className="w-full h-full border object-cover transition-transform rounded-[10px] bg-background"
              onLoad={handleThumbnailLoad}
              onError={handleThumbnailError}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              loading="lazy"
              decoding="async"
              key={`${demo.id}-${demo.thumbnail_url}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[10px]">
              <LucideIcon name="play-circle" className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Title - Bottom */}
        <div className="flex-1 flex flex-col justify-between relative z-10">
          <Typography ref={titleRef} variant="body-small" fontWeight="normal" className="line-clamp-2 cursor-default">
            {demo.title || ''}
          </Typography>
        </div>
      </div>
    </div>
  );

  // Wrap with tooltip if title is truncated

  if (demo.title && isTitleTruncated) {
    return (
      <BlackTooltip content={demo.title} side="top" usePortal={true}>
        {avatarContent}
      </BlackTooltip>
    );
  }

  return avatarContent;
};

// Memoize the component to prevent unnecessary re-renders and image refetching
export const DemoAvatar = memo(DemoAvatarComponent);
