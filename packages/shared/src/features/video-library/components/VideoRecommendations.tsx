import { useRef, useState, useEffect } from 'react';
import { LucideIcon, TooltipProvider } from '@meaku/saral';
import { Video } from '../types';
import { VideoAvatar } from './VideoAvatar';

interface VideoRecommendationsProps {
  videoIds: string[];
  selectedVideoId: string | null;
  getVideoById: (id: string) => Video | undefined;
  getVideoUrl: (video: Video) => string;
  onVideoSelect: (videoId: string) => void;
  isLoading?: boolean;
  isVideoWatched: (videoId: string) => boolean;
}

export const VideoRecommendations = ({
  videoIds,
  selectedVideoId,
  getVideoById,
  getVideoUrl,
  onVideoSelect,
  isLoading = false,
  isVideoWatched,
}: VideoRecommendationsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  // Check if we can scroll
  const checkScrollability = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollPrev(scrollLeft > 0);
      setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll to next avatar
  const scrollNext = () => {
    if (containerRef.current) {
      const containerWidth = 110; // 90px container + 20px gap
      containerRef.current.scrollBy({
        left: containerWidth,
        behavior: 'smooth',
      });
    }
  };

  // Scroll to previous avatar
  const scrollPrev = () => {
    if (containerRef.current) {
      const containerWidth = 110; // 90px container + 20px gap
      containerRef.current.scrollBy({
        left: -containerWidth,
        behavior: 'smooth',
      });
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    if (containerRef.current) {
      checkScrollability();
    }
  };

  useEffect(() => {
    checkScrollability();
  }, [videoIds, isLoading]);

  // Always show recommendations section, even if no videos available
  return (
    <TooltipProvider>
      <div>
        <h4 className="text-sm font-medium text-primary my-5 flex gap-2 items-center">
          <LucideIcon name="sparkles" className="h-4 w-4" />
          <span>Video Recommendations for you</span>
        </h4>

        <div className="relative">
          {/* Show shimmer when loading */}
          {isLoading ? (
            <div className="flex py-2 mt-8" style={{ gap: '20px' }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex flex-col items-center space-y-2 cursor-pointer min-w-[85px] flex-shrink-0">
                  {/* Avatar Container Shimmer - matches VideoAvatar exactly */}
                  <div className="relative flex justify-center">
                    {/* Story-like border with primary color shimmer */}
                    <div className="w-[70px] h-[70px] rounded-full bg-primary/20 animate-pulse p-0.5">
                      <div className="w-full h-full rounded-full bg-white p-0.5 relative">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-r from-gray-200 via-white to-gray-200 animate-pulse">
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Video title label shimmer - matches VideoAvatar title layout */}
                  <div className="text-center w-full">
                    <div className="h-[2.5rem] flex items-center justify-center">
                      <div className="space-y-1 w-full px-1">
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !videoIds.length ? (
            <div className="flex justify-center py-8">
              <div className="text-center text-muted-foreground">
                <LucideIcon name="video" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recommendations available</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Avatars container */}
              <div
                ref={containerRef}
                className="flex py-2 mt-8"
                onScroll={handleScroll}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  width: '100%', // Full width to start from left and end at right
                  gap: '20px',
                  overflowX: 'auto', // Horizontal scrolling
                  overflowY: 'visible', // Allow tooltips to escape vertically
                }}
              >
                {videoIds.map((videoId: string) => (
                  <VideoAvatar
                    key={videoId}
                    videoId={videoId}
                    getVideoById={getVideoById}
                    getVideoUrl={getVideoUrl}
                    onClick={onVideoSelect}
                    isSelected={videoId === selectedVideoId}
                    isWatched={isVideoWatched(videoId)}
                  />
                ))}
              </div>

              {/* Next button - only show if we can scroll */}
              {canScrollNext && (
                <button
                  onClick={scrollNext}
                  className="absolute right-0 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 z-10"
                  style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginTop: '-20px',
                  }}
                  aria-label="Next video"
                >
                  <LucideIcon name="chevron-right" className="h-4 w-4 text-gray-600" />
                </button>
              )}

              {/* Previous button - only show if we can scroll */}
              {canScrollPrev && (
                <button
                  onClick={scrollPrev}
                  className="absolute left-0 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 z-10"
                  style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginTop: '-20px', // Account for the py-2 padding on the container
                  }}
                  aria-label="Previous video"
                >
                  <LucideIcon name="chevron-left" className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
