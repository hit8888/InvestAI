import { motion } from 'framer-motion';
import { KatyIcon, Markdown } from '@meaku/saral';
import NudgeTimeoutLoader from './NudgeTimeoutLoader';
import NudgeDismissButton from './NudgeDismissButton';

interface NudgeHeaderProps {
  content: string;
  displayDuration?: number;
  onDismiss: () => void;
}

const NudgeHeader = ({ content, displayDuration, onDismiss }: NudgeHeaderProps) => {
  if (!content) return null;

  return (
    <motion.div
      className="bg-background rounded-3xl shadow-elevation-md relative"
      layout="position"
      initial={{ opacity: 0, x: 20, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{
        duration: 0.9,
        ease: [0.175, 0.885, 0.32, 1.275],
        delay: 0.2,
        layout: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] },
      }}
    >
      <motion.div
        className="flex gap-4 items-center p-5 overflow-hidden rounded-3xl relative"
        initial={{ clipPath: 'inset(0 0 0 100% round 24px)' }}
        animate={{ clipPath: 'inset(0 0 0 0 round 24px)' }}
        transition={{ duration: 0.9, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        {displayDuration && displayDuration > 0 && <NudgeTimeoutLoader duration={displayDuration} />}
        <div className="relative">
          <KatyIcon width={48} height={48} />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center bg-background rounded-full border border-base-foreground">
            <span className="text-xs">👋</span>
          </div>
        </div>
        <div className="text-gray-600 text-sm/6 font-medium">
          <Markdown markdown={content} />
        </div>
      </motion.div>
      <NudgeDismissButton onClick={onDismiss} />
    </motion.div>
  );
};

export default NudgeHeader;
