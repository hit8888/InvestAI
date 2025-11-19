import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { motion } from 'framer-motion';

const ConversationDetailsLoading = () => {
  return (
    <div className="flex w-full flex-col gap-4 overflow-y-auto">
      {/* Conversation Log Item Skeleton */}
      <motion.div
        className="flex w-full items-start justify-between gap-4 self-stretch rounded-2xl border border-gray-200 bg-gray-25 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.05, ease: 'linear' }}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col overflow-auto bg-gray-25">
            {/* Message skeletons */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="mb-6 flex flex-col gap-3 last:mb-0">
                {/* User message skeleton */}
                <div className="flex justify-end">
                  <div className="flex max-w-[80%] flex-col gap-2 rounded-2xl bg-primary/10 p-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                {/* AI message skeleton */}
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] flex-col gap-2 rounded-2xl bg-white p-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConversationDetailsLoading;
