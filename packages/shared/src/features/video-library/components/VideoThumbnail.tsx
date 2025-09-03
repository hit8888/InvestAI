import { useState } from 'react';
import { Icons, Typography, Button } from '@meaku/saral';
import { Video } from '../types';
import { useWatchedVideos } from '../hooks/useWatchedVideos';

interface VideoThumbnailProps {
  videoId: string;
  getVideoById: (id: string) => Video | undefined;
  getVideoUrl: (video: Video) => string;
  onClick: (videoId: string) => void;
  onWatchNow?: (videoId: string) => void;
  isGlobalLoading?: boolean;
  variant?: 'carousel' | 'recommendation';
  onLater?: () => void;
}

export const VideoThumbnail = ({
  videoId,
  getVideoById,
  getVideoUrl,
  onClick,
  onWatchNow,
  isGlobalLoading = false,
  variant = 'carousel',
  onLater,
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

  // Helper function to format duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle video metadata loaded to get duration
  const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = event.currentTarget;
    if (videoElement.duration && !isNaN(videoElement.duration)) {
      setDuration(videoElement.duration);
    }
  };

  // Show shimmer during global loading or for placeholders (no more video loading for thumbnails)
  const shouldShowShimmer = isPlaceholder || isGlobalLoading;

  if (variant === 'recommendation') {
    return (
      <div className="bg-background shadow-lg rounded-lg flex border shadow-lg p-1.5 w-[550px] h-40">
        {/* Left Half - Video Preview */}
        <div className="w-1/2 relative">
          {shouldShowShimmer ? (
            /* Shimmer effect for loading state */
            <div className="w-full h-full bg-gradient-to-r from-gray-200 via-white to-gray-200 animate-pulse rounded-[10px]">
              <div className="w-full h-full flex items-center justify-center">
                <Icons.Video className="h-6 w-6 text-foreground/20 stroke-[1px]" />
              </div>
            </div>
          ) : video?.asset?.public_url ? (
            <>
              <video
                src={getVideoUrl(video)}
                className="w-full h-full object-cover transition-transform rounded-[10px] bg-background"
                preload="metadata"
                muted
                controls={false}
                onLoadedMetadata={handleLoadedMetadata}
              />
              {/* Duration Pill */}
              {duration && (
                <div className="absolute top-3 left-3 text-foreground bg-background px-1 py-0.5 rounded-md shadow-md border text-[10px] font-medium flex items-center gap-0.5">
                  <Icons.Clock className="size-3" />
                  {formatDuration(duration)} min
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[10px]">
              <Icons.Video className="h-6 w-6 text-muted-foreground/50" />
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
              <Typography variant="body-small" fontWeight="medium">
                {video?.title || ''}
              </Typography>
            ) : null}
          </div>

          {/* Action Buttons */}
          {!shouldShowShimmer && !isPlaceholder && (
            <div className="flex gap-1 mt-2 gap-4 w-full flex">
              <Button
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
      className={`group relative flex-shrink-0 w-1/2 p-1 ${!isPlaceholder ? 'cursor-pointer' : ''}`}
      onClick={() => !isPlaceholder && onClick(videoId)}
    >
      <div className="bg-background p-2 bg-card shadow-md rounded-[10px] overflow-hidden mb-2 relative flex h-24">
        {/* Left Half - Video Preview */}
        <div className="w-1/2 relative group">
          {shouldShowShimmer ? (
            /* Shimmer effect for loading state */
            <div className="w-full h-full bg-gradient-to-r from-gray-200 via-white to-gray-200 animate-pulse rounded-[10px]">
              <div className="w-full h-full flex items-center justify-center">
                <Icons.Video className="h-6 w-6 text-foreground/20 stroke-[1px]" />
              </div>
            </div>
          ) : video?.asset?.public_url ? (
            <>
              <video
                src={getVideoUrl(video)}
                className="w-full h-full object-cover transition-transform rounded-[10px] bg-background"
                preload="metadata"
                muted
                controls={false}
                onLoadedMetadata={handleLoadedMetadata}
              />
              {/* Play Button Overlay - Always visible with white background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-background shadow-md rounded-full flex items-center justify-center shadow-lg">
                  <Icons.Play className="size-3 text-foreground fill-foreground" />
                </div>
              </div>
              {/* Duration Pill */}
              {duration && (
                <div className="absolute top-0.5 left-0.5 text-foreground bg-background px-1 py-0.5 rounded-md shadow-md border text-[10px] font-medium flex items-center gap-0.5">
                  <Icons.Clock className="size-3" />
                  {formatDuration(duration)} min
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[10px]">
              <Icons.Video className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Right Half - Video Title */}
        <div className="w-1/2 p-3 flex items-center rounded-[10px] rounded-l-none">
          <div className="w-full">
            {shouldShowShimmer ? (
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
                <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              <Typography variant="body-small" fontWeight="medium">
                {video?.title || ''}
              </Typography>
            )}

            {isWatched && (
              <div className="text-[10px] text-muted-foreground absolute top-2 right-2 italic">watched</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
