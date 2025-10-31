import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';

import aiShimmer from '../../assets/ai-shimmer.json';
import { LucideIcon } from '@meaku/saral';
import useDelayedEnable from '@meaku/core/hooks/useDelayedEnable';
import { useMemo, useState } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useCommandBarStore } from '../../stores';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { setLocalStorageData } from '@meaku/core/utils/storage-utils';

const CLOSE_BUTTON_SHOW_DELAY = 2000;

type NudgeBannerProps = {
  activeFeature: CommandBarModuleType | null;
  onClick: (module: CommandBarModuleType) => void;
};

const NudgeBanner = ({ activeFeature, onClick }: NudgeBannerProps) => {
  const { config } = useCommandBarStore();
  const enabledModule = useMemo(
    () => config.command_bar?.modules.find((m) => m.module_configs.hover?.enabled),
    [config.command_bar?.modules],
  );
  const { header, sub_header } = enabledModule?.module_configs?.hover ?? {};
  const [isDismissed, setIsDismissed] = useState(false);

  const { thresholdReachCount } = useScrollProgress(10);
  const showCloseButton = useDelayedEnable(CLOSE_BUTTON_SHOW_DELAY);

  const isVisible =
    !!enabledModule && !isDismissed && thresholdReachCount > 0 && activeFeature !== enabledModule?.module_type;

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsDismissed(true);
  };

  const handleClick = () => {
    handleClose();

    if (enabledModule?.module_type) {
      setLocalStorageData({
        auto_summarize: true,
      });
      onClick(enabledModule?.module_type);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-36 right-0"
          onClick={handleClick}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <motion.div
            className="pointer-events-none h-14 w-56 absolute top-0 right-0 inset-0 z-behind-content rounded-[40px] opacity-75 blur-[40px]"
            style={{
              scale: 1.1,
            }}
            animate={{
              background: [
                'conic-gradient(from 0deg, #c4b5fd, #f9a8d4, #fed7aa, #c4b5fd)',
                'conic-gradient(from 360deg, #c4b5fd, #f9a8d4, #fed7aa, #c4b5fd)',
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <div className="cursor-pointer relative z-root flex justify-center items-center gap-2 bg-white rounded-tl-full rounded-bl-full p-2 border-primary/20 border-t border-l border-b">
            <AnimatePresence>
              {showCloseButton && (
                <motion.div
                  className="absolute -top-2 left-3 w-4 h-4 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-full cursor-pointer z-10"
                  onClick={handleClose}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  <LucideIcon name="x" className="size-3 text-gray-400" />
                </motion.div>
              )}
            </AnimatePresence>
            <Lottie animationData={aiShimmer} loop={true} className="size-10" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold">{header}</span>
              <span className="text-xs">{sub_header}</span>
            </div>
            <LucideIcon name="chevron-down" className="size-5" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NudgeBanner;
