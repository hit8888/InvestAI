import { LucideIcon } from '@meaku/saral';

export const VideoLibraryEmptyState = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <LucideIcon name="video" className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-sm">No videos available</p>
      </div>
    </div>
  );
};
