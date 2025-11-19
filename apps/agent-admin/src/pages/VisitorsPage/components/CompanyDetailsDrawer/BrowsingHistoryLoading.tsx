import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { motion } from 'framer-motion';

const BrowsingHistoryLoading = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="flex w-full flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.05, ease: 'linear' }}
      >
        {/* Browsed URL Preview Item Skeleton */}
        <div className="relative flex min-h-[485px] w-full transform flex-col gap-2 self-center overflow-hidden rounded-2xl border-2">
          {/* Header with URL */}
          <div className="absolute flex w-full items-center gap-2 bg-black/40 p-2 backdrop-blur">
            <Skeleton className="h-4 w-full max-w-48" />
          </div>

          {/* Screenshot area */}
          <div className="aspect-video w-full bg-gray-100">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrowsingHistoryLoading;
