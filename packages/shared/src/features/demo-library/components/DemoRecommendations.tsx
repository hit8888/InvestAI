import { useMemo, memo, useCallback } from 'react';
import { LucideIcon, TooltipProvider } from '@neuraltrade/saral';
import { useCarousel } from '../../../hooks/useCarousel';
import { Demo } from '../types';
import { DemoAvatar } from './DemoAvatar';

interface DemoRecommendationsProps {
  demoIds: string[];
  selectedDemoId: string | null;
  getDemoById: (id: string) => Demo | undefined;
  getDemoUrl: (demo: Demo) => string;
  onDemoSelect: (demoId: string) => void;
  isLoading?: boolean;
  isDemoWatched: (demoId: string) => boolean;
}

const DemoRecommendationsComponent = ({
  demoIds,
  selectedDemoId,
  getDemoById,
  getDemoUrl,
  onDemoSelect,
  isLoading = false,
  isDemoWatched,
}: DemoRecommendationsProps) => {
  // Always use 4-column layout
  const { columns, itemsPerPage } = useMemo(() => {
    return {
      columns: 4,
      itemsPerPage: 4,
    };
  }, []);

  // Memoize the onSelect handler to prevent unnecessary re-renders
  const handleDemoSelect = useCallback(
    (demoId: string) => {
      onDemoSelect(demoId);
    },
    [onDemoSelect],
  );

  // Use the carousel hook for item-based navigation
  const { onNext, onPrev, canGoNext, canGoPrev, currentIndex } = useCarousel({
    totalItems: demoIds.length,
    itemsPerView: 1, // Move one item at a time
    initialIndex: 0,
    pageBased: false, // Enable item-based navigation (one item at a time)
    itemsPerPage: itemsPerPage, // Pass the actual number of items displayed
  });

  // Always show recommendations section, even if no demos available
  return (
    <TooltipProvider>
      <div>
        <h4 className="text-sm font-medium text-primary my-5 flex gap-2 items-center">
          <LucideIcon name="sparkles" className="h-4 w-4" />
          <span>Demo Recommendations for you</span>
        </h4>

        <div className="relative">
          {/* Show shimmer when loading */}
          {isLoading ? (
            <div className={`grid py-2 gap-4 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {Array.from({ length: columns }, (_, i) => (
                <div key={i} className="p-1">
                  <div className="rounded-[10px] mb-2 relative flex flex-col h-32 gap-2 p-2 bg-card">
                    {/* Demo Preview Shimmer - Same as DemoAvatar */}
                    <div className="w-full h-[60px] relative">
                      <div className="w-full h-full bg-gradient-to-r border from-transparent via-white to-transparent animate-pulse rounded-[10px]" />
                    </div>
                    {/* Title Shimmer - Same as DemoAvatar */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !demoIds.length ? (
            <div className="flex justify-center py-8">
              <div className="text-center text-muted-foreground">
                <LucideIcon name="play-circle" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recommendations available</p>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden">
              {/* Demo items carousel */}
              <div
                className="flex p-2 gap-4 transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
              >
                {/* Render all possible positions */}
                {Array.from({ length: Math.ceil(demoIds.length / itemsPerPage) }, (_, pageIndex) => {
                  const startIndex = pageIndex * itemsPerPage;
                  const pageItems = demoIds.slice(startIndex, startIndex + itemsPerPage);

                  return (
                    <div
                      key={pageIndex}
                      className={`flex gap-4 w-full flex-shrink-0 ${columns === 2 ? 'justify-start' : 'justify-between'}`}
                    >
                      {pageItems.map((demoId: string) => {
                        const demo = getDemoById(demoId);
                        if (!demo) return null;

                        return (
                          <div
                            key={demoId}
                            className={`${columns === 2 ? 'w-[calc(50%-0.5rem)]' : 'w-[calc(25%-0.75rem)]'}`}
                          >
                            <DemoAvatar
                              demo={demo}
                              demoUrl={getDemoUrl(demo)}
                              isSelected={demoId === selectedDemoId}
                              isWatched={isDemoWatched(demoId)}
                              onSelect={() => handleDemoSelect(demoId)}
                            />
                          </div>
                        );
                      })}
                      {/* Fill remaining space if page has fewer items */}
                      {pageItems.length < itemsPerPage &&
                        Array.from({ length: itemsPerPage - pageItems.length }, (_, i) => (
                          <div
                            key={`empty-${i}`}
                            className={`${columns === 2 ? 'w-[calc(50%-0.5rem)]' : 'w-[calc(25%-0.75rem)]'}`}
                          />
                        ))}
                    </div>
                  );
                })}
              </div>

              {/* Navigation buttons - only show if there are more items than can be displayed */}
              {demoIds.length > itemsPerPage && (
                <>
                  {/* Next button - only show if we can go next */}
                  {canGoNext && (
                    <button
                      onClick={onNext}
                      className="absolute right-0 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 z-10"
                      style={{
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginTop: '-20px',
                      }}
                      aria-label="Next page"
                    >
                      <LucideIcon name="chevron-right" className="h-4 w-4 text-gray-600" />
                    </button>
                  )}

                  {/* Previous button - only show if we can go previous */}
                  {canGoPrev && (
                    <button
                      onClick={onPrev}
                      className="absolute left-0 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 z-10"
                      style={{
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginTop: '-20px',
                      }}
                      aria-label="Previous page"
                    >
                      <LucideIcon name="chevron-left" className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const DemoRecommendations = memo(DemoRecommendationsComponent);
