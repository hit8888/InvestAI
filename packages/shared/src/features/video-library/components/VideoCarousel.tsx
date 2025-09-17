import { useRef } from 'react';
import { LucideIcon } from '@meaku/saral';
import { useCarousel } from '../../../hooks/useCarousel';
import { VideoThumbnail } from './VideoThumbnail';
import { Video } from '../types';

interface VideoCarouselProps {
  videoIds: string[];
  selectedVideoId: string | null;
  getVideoById: (id: string) => Video | undefined;
  getVideoUrl: (video: Video) => string;
  onVideoSelect: (videoId: string) => void;
  onWatchNow?: (videoId: string) => void;
  isLoading?: boolean;
  videosPerRow?: number;
}

export const VideoCarousel = ({
  videoIds,
  selectedVideoId,
  getVideoById,
  getVideoUrl,
  onVideoSelect,
  onWatchNow,
  isLoading = false,
  videosPerRow = 4,
}: VideoCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Include all videos in the carousel (don't filter out the main video)
  const allVideoIds = videoIds;

  // Use the enhanced carousel hook with page-based navigation
  const { onNext, onPrev, goToPage, canGoNext, canGoPrev, totalPages, currentPage } = useCarousel({
    totalItems: allVideoIds.length,
    itemsPerView: videosPerRow,
    initialIndex: 0,
    pageBased: true, // Enable page-based navigation
  });

  // Calculate intelligent scroll amount based on remaining content
  const calculateTranslateX = () => {
    if (currentPage === 0) return 0;

    // Calculate how many videos are in the current page
    const currentPageStartIndex = currentPage * videosPerRow;
    const currentPageVideoCount = Math.min(videosPerRow, allVideoIds.length - currentPageStartIndex);

    // If current page has full videos (4), scroll by full page
    if (currentPageVideoCount === videosPerRow) {
      return -(currentPage * 100);
    }

    // If current page has fewer videos, calculate partial scroll
    // Scroll by the percentage of videos in the current page
    const scrollPercentage = (currentPageVideoCount / videosPerRow) * 100;
    return -(currentPage * 100) + (100 - scrollPercentage);
  };

  const translateX = calculateTranslateX();

  // Always show recommendations section, even if no videos available

  return (
    <div>
      <h4 className="text-sm font-medium text-primary my-5 flex gap-2 items-center">
        <LucideIcon name="sparkles" className="h-4 w-4" />
        <span>Video Recommendations for you</span>
      </h4>

      <div className="relative overflow-hidden">
        {/* Carousel Container */}
        {!isLoading && allVideoIds.length === 0 ? (
          <>
            <div className="flex">
              {/* First placeholder - takes exactly same space as VideoThumbnail */}
              <div className="w-full p-1">
                <div className="bg-muted/20 p-2 rounded-[10px] border-2 border-dashed border-muted mb-2 relative flex h-24">
                  <div className="w-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <LucideIcon name="video" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recommendations available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Empty pagination dots space to match carousel exactly */}
            <div className="flex justify-center mt-1 gap-2">
              <div className="size-1.5 rounded-full bg-gray-200 opacity-80"></div>
              <div className="size-1.5 rounded-full bg-gray-200 opacity-80"></div>
            </div>
          </>
        ) : (
          <div
            ref={carouselRef}
            className="flex transition-transform duration-[800ms] ease-in-out"
            style={{
              transform: `translateX(${translateX}%)`,
            }}
          >
            {/* Render videos in pages */}
            {Array.from({ length: totalPages }, (_, pageIndex) => {
              const pageVideos = allVideoIds.slice(pageIndex * videosPerRow, (pageIndex + 1) * videosPerRow);
              const isLastPage = pageIndex === totalPages - 1;
              const hasIncompletePage = pageVideos.length < videosPerRow;

              return (
                <div key={pageIndex} className="w-full flex-shrink-0 flex">
                  {pageVideos.map((videoId: string) => (
                    <VideoThumbnail
                      key={videoId}
                      videoId={videoId}
                      getVideoById={getVideoById}
                      getVideoUrl={getVideoUrl}
                      onClick={onVideoSelect}
                      onWatchNow={onWatchNow}
                      isGlobalLoading={isLoading}
                      widthClass={`w-1/${videosPerRow}`}
                      isSelected={videoId === selectedVideoId}
                    />
                  ))}
                  {/* Fill remaining space on incomplete last page to prevent white space */}
                  {isLastPage && hasIncompletePage && <div className="flex-1"></div>}
                </div>
              );
            })}
          </div>
        )}

        {/* Navigation Arrows */}
        {!isLoading && totalPages > 1 && (
          <>
            {canGoPrev && (
              <button
                onClick={onPrev}
                className={`absolute left-3 top-1/2 -translate-y-1/2 -translate-x-2 border border-gray-200 rounded-full p-1.5 shadow-md transition-all duration-200 hover:scale-110 z-10 ${
                  !canGoPrev
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white/90 hover:bg-white text-gray-600'
                }`}
                aria-label="Previous video"
              >
                <LucideIcon name="chevron-left" className="h-4 w-4" />
              </button>
            )}
            {canGoNext && (
              <button
                onClick={onNext}
                className={`absolute right-3 top-1/2 -translate-y-1/2 translate-x-2 border border-gray-200 rounded-full p-1.5 shadow-md transition-all duration-200 hover:scale-110 z-10 ${
                  !canGoNext
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white/90 hover:bg-white text-gray-600'
                }`}
                aria-label="Next video"
              >
                <LucideIcon name="chevron-right" className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-1 gap-2">
          {Array.from({ length: totalPages }, (_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => goToPage(pageIndex)}
              className={`size-1.5 rounded-full transition-all duration-200 ${
                currentPage === pageIndex ? 'bg-primary scale-[1.8]' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${pageIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
