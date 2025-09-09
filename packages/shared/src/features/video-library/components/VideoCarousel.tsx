import { useRef } from 'react';
import { Icons } from '@meaku/saral';
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

  // Filter out the currently selected main video from the carousel
  const filteredVideoIds = videoIds.filter((videoId) => videoId !== selectedVideoId);

  // Use the enhanced carousel hook with page-based navigation
  const { onNext, onPrev, goToPage, canGoNext, canGoPrev, totalPages, currentPage } = useCarousel({
    totalItems: filteredVideoIds.length,
    itemsPerView: videosPerRow,
    initialIndex: 0,
    pageBased: true, // Enable page-based navigation
  });

  // Calculate translateX for page-based navigation
  const translateX = -(currentPage * 100); // Move by 100% for each page

  // Always show recommendations section, even if no videos available

  return (
    <div>
      <h4 className="text-sm font-medium text-primary my-5 flex gap-2 items-center">
        <Icons.Sparkles className="h-4 w-4" />
        <span>Video Recommendations for you</span>
      </h4>

      <div className="relative overflow-hidden">
        {/* Carousel Container */}
        {!isLoading && filteredVideoIds.length === 0 ? (
          <>
            <div className="flex">
              {/* First placeholder - takes exactly same space as VideoThumbnail */}
              <div className="w-full p-1">
                <div className="bg-muted/20 p-2 rounded-[10px] border-2 border-dashed border-muted mb-2 relative flex h-24">
                  <div className="w-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Icons.Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
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
            {Array.from({ length: totalPages }, (_, pageIndex) => (
              <div key={pageIndex} className="w-full flex-shrink-0 flex">
                {filteredVideoIds
                  .slice(pageIndex * videosPerRow, (pageIndex + 1) * videosPerRow)
                  .map((videoId: string) => (
                    <VideoThumbnail
                      key={videoId}
                      videoId={videoId}
                      getVideoById={getVideoById}
                      getVideoUrl={getVideoUrl}
                      onClick={onVideoSelect}
                      onWatchNow={onWatchNow}
                      isGlobalLoading={isLoading}
                      widthClass={`w-1/${videosPerRow}`}
                    />
                  ))}
              </div>
            ))}
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
                <Icons.ChevronLeft className="h-4 w-4" />
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
                <Icons.ChevronRight className="h-4 w-4" />
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
