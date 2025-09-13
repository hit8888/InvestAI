import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

const LoadingContent = () => {
  return (
    <div className="flex h-full flex-col gap-2">
      {/* Company Info Section Shimmer */}
      <div className="rounded-lg border border-gray-100 p-4">
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Employees Section Shimmer */}
      <div className="rounded-lg border border-gray-100 p-4">
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-4 w-36" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* See All Details Button Shimmer */}
      <div className="flex justify-end">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Browsing & Conversation Summary Shimmer */}
      <div className="rounded-lg border border-gray-100 p-4">
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
};

export default LoadingContent;
