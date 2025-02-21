const AgentShimmer = () => {
  return (
    <div className="custom-blur flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-primary/20 p-2">
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg bg-primary-foreground/60">
        {/* Header Shimmer */}
        <div className="h-14 w-full animate-pulse rounded-t-lg bg-gray-200/20" />

        {/* Content Grid */}
        <div className="grid h-full flex-1 grid-cols-3 gap-2 p-2">
          {/* Messages Section */}
          <div className="col-span-1 flex flex-col gap-3">
            <div className="h-24 animate-pulse rounded-lg bg-gray-200/20" />
            <div className="h-24 animate-pulse rounded-lg bg-gray-200/20" />
            <div className="h-24 animate-pulse rounded-lg bg-gray-200/20" />
          </div>

          {/* Artifact Section */}
          <div className="col-span-2 animate-pulse rounded-lg bg-gray-200/20" />
        </div>

        {/* Input Shimmer */}
        <div className="mx-2 mb-2 h-12 animate-pulse rounded-lg bg-gray-200/20" />
      </div>
    </div>
  );
};

export default AgentShimmer;
