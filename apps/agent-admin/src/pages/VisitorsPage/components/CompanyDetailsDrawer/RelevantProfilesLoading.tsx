import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { motion } from 'framer-motion';

const RelevantProfilesLoading = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-3.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: index * 0.01, ease: 'linear' }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar skeleton */}
            <div className="relative h-8 w-8 flex-shrink-0">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* Name and title skeleton */}
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                {/* Button skeleton */}
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RelevantProfilesLoading;
