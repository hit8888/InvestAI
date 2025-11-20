import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import { X } from 'lucide-react';
import { cn } from '@breakout/design-system/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';

const LeftSideContentContainer = ({
  headerTitle,
  visible,
  children,
  onClose,
  maxWidth,
}: {
  headerTitle: string;
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) => {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={cn(
            'absolute right-[calc(100%+1rem)] top-1/2 flex max-h-[max(75vh,756px)] -translate-y-1/2 select-text flex-col gap-3 rounded-2xl bg-white',
            maxWidth ? 'w-full' : 'w-full min-w-[35vw]',
          )}
          style={maxWidth ? { maxWidth } : undefined}
        >
          <div className="flex items-center gap-2 border-b border-gray-200 p-4">
            <AiSparklesIcon className="size-6 text-gray-900" />
            <span className="text-sm font-medium text-gray-900">{headerTitle}</span>
            <button onClick={onClose} className="ml-auto">
              <X className="size-4" />
            </button>
          </div>
          <div className="overflow-y-auto px-4 pb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeftSideContentContainer;
