import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

const AgentShimmer = () => {
  return (
    <div className="custom-blur flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-primary/20 p-2">
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-primary-foreground/60">
        {/* Header Shimmer */}
        <Skeleton className="h-14" />
        {/* Content Grid */}
        <div className="grid h-full flex-1 grid-cols-3 gap-2 p-2">
          {/* Messages Section */}
          <div className="col-span-1 flex flex-col gap-3">
            {/* AI Message */}
            <div className="flex gap-4 p-6 pl-0">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" /> {/* Orb/Bot indicator */}
              <Skeleton className="h-20 flex-1" /> {/* Message content */}
            </div>

            {/* User Message */}
            <div className="ml-11 flex justify-end pr-6">
              <Skeleton className="h-12 w-3/4 rounded-2xl" />
            </div>

            {/* AI Message with data sources */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 p-6 pl-0">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <Skeleton className="h-16 flex-1" />
              </div>
              <div className="pl-11">
                <Skeleton className="h-4 w-1/3" /> {/* Data sources/timestamp */}
              </div>
            </div>
          </div>

          {/* Artifact Section */}
          <Skeleton className="col-span-2" />
        </div>

        {/* Input Shimmer */}
        <Skeleton className="mx-2 mb-2 h-12" />
      </div>
    </div>
  );
};

export default AgentShimmer;
