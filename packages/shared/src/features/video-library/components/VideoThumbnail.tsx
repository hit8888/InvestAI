import { useState } from 'react';
import { LucideIcon, Typography, Button } from '@meaku/saral';
import { Video } from '../types';
import { useWatchedVideos } from '../hooks/useWatchedVideos';
import ReactPlayer from 'react-player';

interface VideoThumbnailProps {
  videoId: string;
  getVideoById: (id: string) => Video | undefined;
  getVideoUrl: (video: Video) => string;
  onClick: (videoId: string) => void;
  onWatchNow?: (videoId: string) => void;
  isGlobalLoading?: boolean;
  variant?: 'carousel' | 'recommendation';
  onLater?: () => void;
  widthClass?: string;
  isSelected?: boolean;
}

// Helper function to format duration
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const VideoThumbnail = ({
  videoId,
  getVideoById,
  getVideoUrl,
  onClick,
  onWatchNow,
  isGlobalLoading = false,
  variant = 'carousel',
  onLater,
  widthClass = 'w-1/2',
  isSelected = false,
}: VideoThumbnailProps) => {
  const { isVideoWatched } = useWatchedVideos();
  const isWatched = isVideoWatched(videoId);
  const video = getVideoById(videoId);

  // Handle loading placeholder IDs
  const isPlaceholder = videoId.startsWith('loading-');

  const [duration, setDuration] = useState<number | null>(null);

  // Use cached video URL - only preload when explicitly requested
  // For thumbnails, we don't need full video caching - just metadata preload
  // Only use direct video URL for lightweight thumbnail display

  if (!video && !isPlaceholder) {
    return null;
  }

  // Handle video metadata loaded to get duration
  const handleDuration = (durationInSeconds: number) => {
    if (durationInSeconds && !isNaN(durationInSeconds)) {
      setDuration(durationInSeconds);
    }
  };

  // Show shimmer during global loading or for placeholders (no more video loading for thumbnails)
  const shouldShowShimmer = isPlaceholder || isGlobalLoading;

  if (variant === 'recommendation') {
    return (
      <div className="bg-background shadow-lg rounded-lg flex border shadow-lg p-2 w-[550px] h-40">
        {/* Left Half - Video Preview */}
        <div className="w-1/2 relative">
          {shouldShowShimmer ? (
            /* Shimmer effect for loading state */
            <div className="w-full h-full bg-gradient-to-r from-gray-200 via-white to-gray-200 animate-pulse rounded-[10px]">
              <div className="w-full h-full flex items-center justify-center">
                <LucideIcon name="video" className="h-6 w-6 text-foreground/20 stroke-[1px]" />
              </div>
            </div>
          ) : video?.asset?.public_url ? (
            <>
              <div
                className="absolute inset-0 z-50 h-full w-full cursor-default bg-transparent"
                style={{ pointerEvents: 'auto' }}
              />
              <ReactPlayer
                url={getVideoUrl(video)}
                className="w-full h-full object-cover transition-transform rounded-lg border bg-card shadow-sm"
                muted
                controls={false}
                onDuration={handleDuration}
                width="100%"
                height="100%"
                config={{
                  file: {
                    attributes: {
                      style: { objectFit: 'cover' },
                      preload: 'metadata',
                    },
                  },
                }}
              />
              {/* Duration Pill */}
              {duration && (
                <div className="absolute top-3 left-3 text-foreground bg-background px-1 py-0.5 rounded-md shadow-md border text-[10px] font-medium flex items-center gap-0.5">
                  <LucideIcon name="clock" className="size-3" />
                  {formatDuration(duration)} min
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[10px]">
              <LucideIcon name="video" className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Right Half - Video Title and Actions */}
        <div className="w-1/2 p-3 pb-2 pr-1 flex flex-col items-start justify-between rounded-[10px] h-full">
          <div className="flex-1">
            {shouldShowShimmer ? (
              <>
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </>
            ) : video ? (
              <Typography variant="heading" fontWeight="medium">
                {video?.title || ''}
              </Typography>
            ) : null}
          </div>

          {/* Action Buttons */}
          {!shouldShowShimmer && !isPlaceholder && (
            <div className="flex gap-1 mt-2 gap-4 w-full flex">
              <Button
                hasWipers
                variant="outline"
                size="sm"
                className="text-xs flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onLater?.();
                }}
              >
                Later
              </Button>
              <Button
                hasWipers
                size="sm"
                className="text-xs flex-1"
                onClick={() => !isPlaceholder && onWatchNow?.(videoId)}
                disabled={isPlaceholder}
              >
                Watch now
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Carousel variant (default)
  return (
    <div
      className={`group relative flex-shrink-0 ${widthClass} p-1 ${!isPlaceholder ? 'cursor-pointer' : ''}`}
      onClick={() => !isPlaceholder && onClick(videoId)}
    >
      <div
        className={`rounded-[10px] mb-2 relative flex flex-col h-40 gap-2 p-2 transition-all duration-200 ${
          isSelected ? 'scale-[1.02] bg-blue-50/50' : 'border border-border bg-card hover:scale-[1.01]'
        }`}
      >
        {/* Custom gradient border for selected video */}
        {isSelected && (
          <div
            className="absolute inset-0 rounded-[10px] pointer-events-none"
            style={{
              background:
                'linear-gradient(45deg, rgba(59, 130, 246, 0.2) 0%,rgba(59, 130, 246, 0.4) 50%, rgba(59, 130, 246, 0.8) 100%)',
              padding: '3px',
            }}
          >
            <div className="w-full h-full bg-card rounded-[6px]"></div>
          </div>
        )}
        <div className="flex justify-between items-center relative z-10">
          {shouldShowShimmer || duration === null ? (
            <div className="w-16 h-5 bg-gray-200/50 rounded animate-pulse border"></div>
          ) : duration ? (
            <div className="w-fit bg-background text-[11px] px-1.5 py-0.5 rounded border">
              {formatDuration(duration)} min
            </div>
          ) : null}
        </div>

        {/* Video Preview - Middle */}
        <div className="w-full h-[60px] relative group z-10">
          {shouldShowShimmer ? (
            /* Shimmer effect for loading state */
            <div className="w-full h-full bg-gradient-to-r from-gray-200 via-white to-gray-200 animate-pulse rounded-[10px]">
              <div className="w-full h-full flex items-center justify-center">
                <LucideIcon name="video" className="h-6 w-6 text-foreground/20 stroke-[1px]" />
              </div>
            </div>
          ) : video?.asset?.public_url ? (
            <>
              <ReactPlayer
                url={getVideoUrl(video)}
                className="w-full h-full border object-cover transition-transform rounded-[10px] bg-background"
                muted
                controls={false}
                onDuration={handleDuration}
                width="100%"
                height="100%"
                config={{
                  file: {
                    attributes: {
                      style: { objectFit: 'cover' },
                      preload: 'metadata',
                    },
                  },
                }}
              />
              {/* Play Button Overlay - Always visible with white background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-background shadow-md rounded-full flex items-center justify-center shadow-lg">
                  <LucideIcon name="play" className="size-3 text-foreground fill-foreground" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[10px]">
              <LucideIcon name="video" className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Title - Bottom */}
        <div className="flex-1 flex flex-col justify-between relative z-10">
          {shouldShowShimmer ? (
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
            </div>
          ) : (
            <Typography variant="body-small" fontWeight="normal" className="line-clamp-2">
              {video?.title || ''}
            </Typography>
          )}

          {isWatched && <div className="text-[10px] text-muted-foreground italic">watched</div>}
        </div>
      </div>
    </div>
  );
};
