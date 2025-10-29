import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { motion } from 'framer-motion';

const ConversationDetailsLoading = () => {
  return (
    <div className="flex w-[calc(50vw-4rem)] flex-col gap-4 overflow-y-auto">
      {/* Summary Items Skeleton */}
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          className="flex w-full max-w-full items-start justify-between gap-4 self-stretch overflow-auto rounded-2xl border border-gray-200 bg-primary/2.5 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: index * 0.01, ease: 'linear' }}
        >
          <div className="flex w-[50%] items-center justify-center gap-2">
            {/* Icon skeleton */}
            <div className="flex items-center justify-center rounded-lg bg-primary/10 p-1">
              <Skeleton className="h-4 w-4" />
            </div>
            {/* Label skeleton */}
            <Skeleton className="h-4 w-20 flex-1" />
          </div>

          {/* Value skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-4 w-32" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ConversationDetailsLoading;
