import { useState, useEffect, useRef } from 'react';
import { LucideIcon } from '@meaku/saral';
import { Video } from '../types';
import BlackTooltip from '../../../components/BlackTooltip';

interface VideoAvatarProps {
  videoId: string;
  getVideoById: (id: string) => Video | undefined;
  getVideoUrl: (video: Video) => string;
  onClick: (videoId: string) => void;
  isSelected?: boolean;
  isWatched?: boolean;
}

export const VideoAvatar = ({
  videoId,
  getVideoById,
  getVideoUrl,
  onClick,
  isSelected = false,
  isWatched = false,
}: VideoAvatarProps) => {
  const video = getVideoById(videoId);
  const [videoFrameLoaded, setVideoFrameLoaded] = useState(false);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);

  // Handle loading placeholder IDs
  const isPlaceholder = videoId.startsWith('loading-');

  // Check if title is truncated
  useEffect(() => {
    if (titleRef.current && video?.title) {
      const element = titleRef.current;
      setIsTitleTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [video?.title]);

  if (!video && !isPlaceholder) {
    return null;
  }

  const handleClick = () => {
    if (!isPlaceholder) {
      onClick(videoId);
    }
  };

  // Handle video frame loaded for fallback thumbnail
  const handleVideoFrameLoaded = () => {
    setVideoFrameLoaded(true);
  };

  const avatarContent = (
    <div className="flex flex-col items-center space-y-2 cursor-pointer min-w-[85px] group" onClick={handleClick}>
      {/* Avatar Container */}
      <div className="relative flex justify-center">
        {/* Story-like border with primary color */}
        <div
          className={`w-[70px] h-[70px] rounded-full transition-all duration-200 bg-primary p-0.5 ${isSelected ? 'shadow-lg shadow-black/20' : ''}`}
        >
          <div className="w-full h-full rounded-full bg-white p-0.5 relative">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
              {isPlaceholder ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-200 via-white to-gray-200 animate-pulse rounded-full">
                  <LucideIcon name="video" className="h-6 w-6 text-foreground/20" />
                </div>
              ) : video?.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title || 'Video thumbnail'}
                  className="w-full h-full object-cover"
                  style={{ objectFit: 'cover' }}
                />
              ) : video?.asset?.public_url ? (
                <div className="relative w-full h-full">
                  {/* Hidden video element to capture first frame */}
                  <video
                    src={getVideoUrl(video)}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                    controls={false}
                    onLoadedData={handleVideoFrameLoaded}
                    style={{
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      opacity: videoFrameLoaded ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                  {/* Fallback icon while video loads */}
                  {!videoFrameLoaded && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-200 via-white to-gray-200 animate-pulse rounded-full">
                      <LucideIcon name="video" className="h-6 w-6 text-foreground/20" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-200 via-white to-gray-200 animate-pulse rounded-full">
                  <LucideIcon name="video" className="h-6 w-6 text-foreground/20" />
                </div>
              )}
            </div>

            {/* Watched overlay with blurred effect and tick - positioned inside the white container */}
            {!isPlaceholder && isWatched && (
              <div className="absolute inset-0 w-full h-full rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                <div
                  className="w-6 h-6 rounded-full bg-white"
                  style={{
                    mask: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.9834 24.9834C19.6108 24.9834 24.9834 19.6108 24.9834 12.9834C24.9834 6.35598 19.6108 0.983398 12.9834 0.983398C6.35598 0.983398 0.983398 6.35598 0.983398 12.9834C0.983398 19.6108 6.35598 24.9834 12.9834 24.9834ZM17.8839 11.3C18.427 10.8026 18.464 9.95924 17.9667 9.4162C17.4693 8.87315 16.6259 8.83611 16.0829 9.33346L11.1601 13.842L9.88394 12.6732C9.34089 12.1759 8.49749 12.2129 8.00013 12.756C7.50278 13.299 7.53982 14.1424 8.08286 14.6398L10.2596 16.6333C10.7692 17.1001 11.551 17.1001 12.0606 16.6333L17.8839 11.3Z' fill='black'/%3E%3C/svg%3E\") center/contain no-repeat",
                    WebkitMask:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.9834 24.9834C19.6108 24.9834 24.9834 19.6108 24.9834 12.9834C24.9834 6.35598 19.6108 0.983398 12.9834 0.983398C6.35598 0.983398 0.983398 6.35598 0.983398 12.9834C0.983398 19.6108 6.35598 24.9834 12.9834 24.9834ZM17.8839 11.3C18.427 10.8026 18.464 9.95924 17.9667 9.4162C17.4693 8.87315 16.6259 8.83611 16.0829 9.33346L11.1601 13.842L9.88394 12.6732C9.34089 12.1759 8.49749 12.2129 8.00013 12.756C7.50278 13.299 7.53982 14.1424 8.08286 14.6398L10.2596 16.6333C10.7692 17.1001 11.551 17.1001 12.0606 16.6333L17.8839 11.3Z' fill='black'/%3E%3C/svg%3E\") center/contain no-repeat",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video title label */}
      <div className="text-center w-full">
        <div className="h-[2.5rem] flex items-center justify-center">
          {!isPlaceholder && video?.title && isTitleTruncated ? (
            <BlackTooltip content={video.title} side="top" usePortal={true}>
              <p
                ref={titleRef}
                className={`text-xs font-medium leading-tight line-clamp-2  ${isSelected ? 'text-primary' : 'text-foreground'}`}
              >
                {video.title}
              </p>
            </BlackTooltip>
          ) : (
            <p
              ref={titleRef}
              className={`text-xs font-medium leading-tight line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}
            >
              {isPlaceholder ? 'Loading...' : video?.title || 'Untitled'}
            </p>
          )}
        </div>
      </div>

      {/* Just Watched label - positioned separately to avoid squishing content above */}
      {!isPlaceholder && isWatched && (
        <div className="text-center w-full mt-1">
          <div className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-primary border border-primary bg-[#F2F1FF] rounded-full">
            Just Watched
          </div>
        </div>
      )}
    </div>
  );

  return avatarContent;
};
