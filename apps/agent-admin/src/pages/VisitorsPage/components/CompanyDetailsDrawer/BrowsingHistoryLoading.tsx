import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import ArrowUpIcon from '@breakout/design-system/components/icons/arrow-up-icon';
import { motion } from 'framer-motion';

const BrowsingHistoryLoading = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      {Array.from({ length: 4 }).map((_, index) => {
        const isFirst = index === 0;
        const isLast = index === 3;

        return (
          <motion.div
            key={index}
            className="flex w-full flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05, delay: index * 0.01, ease: 'linear' }}
          >
            {/* Browsed URL Preview Item Skeleton */}
            <div
              className={`relative flex w-full transform flex-col gap-2 self-center overflow-hidden rounded-2xl border-2 ${!isFirst ? 'w-4/5' : ''}`}
            >
              {/* Header with URL */}
              <div className="absolute flex w-full items-center gap-2 bg-black/40 p-2 backdrop-blur">
                <Skeleton className="h-4 w-full max-w-48" />
              </div>

              {/* Screenshot area */}
              <div className="aspect-video w-full bg-gray-100">
                <Skeleton className="h-full w-full" />
              </div>
            </div>

            {/* Arrow between items */}
            {!isLast && (
              <div className="mt-3 flex flex-col items-center">
                <ArrowUpIcon />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BrowsingHistoryLoading;
