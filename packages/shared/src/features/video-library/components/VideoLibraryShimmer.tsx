import { Icons } from '@meaku/saral';

export const VideoLibraryShimmer = () => {
  return (
    <div className="h-full flex flex-col p-4">
      {/* Main Video Shimmer */}
      <div className="h-[450px] mb-4 z-50">
        <div className="relative h-full w-full overflow-hidden rounded-lg border border-primary/10 flex flex-col min-h-[400px]">
          {/* Title shimmer */}
          <div className="bg-primary/10 p-2 px-3 flex-shrink-0">
            <div className="h-4 bg-primary/10 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="relative flex-1 min-h-0">
            {/* Video container shimmer */}
            <div className="relative w-full h-full bg-muted/20 rounded-md overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 via-gray-50 to-gray-100 animate-pulse"></div>
              {/* Play icon placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-400 rounded-full ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Carousel Shimmer */}
      <div className="h-[200px] mb-4">
        <div>
          <h4 className="text-sm font-medium text-primary my-5 flex gap-2 items-center">
            <Icons.Sparkles className="h-4 w-4" />
            <span>Video Recommendations for you</span>
          </h4>
          <div className="flex gap-1">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="w-1/4 p-1">
                <div className="bg-card shadow-md rounded-[10px] overflow-hidden mb-2 relative flex flex-col h-40 gap-2 p-2">
                  {/* Duration shimmer */}
                  <div className="w-16 h-5 bg-gray-300 rounded animate-pulse"></div>
                  {/* Video shimmer */}
                  <div className="w-full h-[60px] bg-gray-300 rounded-[10px] animate-pulse"></div>
                  {/* Title shimmer */}
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
          {/* Pagination dots shimmer */}
          <div className="flex justify-center mt-1 gap-2">
            <div className="size-1.5 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="size-1.5 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* CTAs Shimmer */}
      <div className="flex gap-3 px-1 h-12 mt-6">
        <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
