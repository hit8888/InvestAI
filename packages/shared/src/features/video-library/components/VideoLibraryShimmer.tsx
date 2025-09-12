import { Icons } from '@meaku/saral';

export const VideoLibraryShimmer = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Main Video Shimmer */}
      <div className="flex-shrink-0 mb-4 z-50 h-auto">
        <div className="relative w-full overflow-hidden rounded-lg border border-primary/10 flex flex-col min-h-[360px]">
          {/* Title shimmer */}
          <div className="bg-primary/10 p-2 px-3 flex-shrink-0">
            <div className="h-4 bg-primary/10 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="relative flex-1 min-h-0">
            {/* Video container shimmer - takes remaining height after title */}
            <div className="relative w-full h-full bg-black rounded-md overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse"></div>{' '}
            </div>
          </div>
        </div>
      </div>

      {/* Video Carousel Shimmer */}
      <div className="flex-shrink mb-4">
        <div>
          <h4 className="text-sm font-medium text-primary my-1 flex gap-2 items-center">
            <Icons.Sparkles className="h-4 w-4" />
            <span>Video Recommendations for you</span>
          </h4>

          <div className="relative">
            {/* Scrollable container shimmer - matches VideoRecommendations layout */}
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

                  {/* Just Watched label shimmer - randomly show for some items to match real behavior */}
                  {i <= 2 && (
                    <div className="text-center w-full mt-1">
                      <div className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium border rounded-full bg-gray-200 animate-pulse w-16 h-4"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
