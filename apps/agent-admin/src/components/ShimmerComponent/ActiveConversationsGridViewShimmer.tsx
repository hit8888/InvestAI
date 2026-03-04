import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { BuyerIntent } from '@neuraltrade/core/types/common';

const ActiveConversationsGridViewShimmer = () => {
  const columns = [BuyerIntent.LOW, BuyerIntent.MEDIUM, BuyerIntent.HIGH];

  return (
    <div className="grid h-full min-h-[80vh] grid-cols-3 gap-4">
      {columns.map((intent) => (
        <div key={intent} className="flex h-full flex-col gap-4 rounded-2xl bg-gray-50/50 p-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <Skeleton className="h-6 w-24" />
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>

                  <Skeleton className="h-12 w-full" />

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveConversationsGridViewShimmer;
