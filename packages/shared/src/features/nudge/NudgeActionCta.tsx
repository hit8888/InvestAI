import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';

import aiShimmer from '../../assets/ai-shimmer.json';
import { LucideIcon } from '@meaku/saral';
import useDelayedEnable from '@meaku/core/hooks/useDelayedEnable';
import { CommandBarModuleConfigType, CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { setLocalStorageData } from '@meaku/core/utils/storage-utils';
import { RotatingText } from '../../components/RotatingText';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useEffect } from 'react';

const CLOSE_BUTTON_SHOW_DELAY = 2000;

type NudgeActionCtaProps = {
  module: CommandBarModuleConfigType;
  setActiveFeature?: (feature: CommandBarModuleType | null) => void;
  onDismiss: () => void;
};

const NudgeActionCta = ({ module, setActiveFeature, onDismiss }: NudgeActionCtaProps) => {
  const showCloseButton = useDelayedEnable(CLOSE_BUTTON_SHOW_DELAY);
  const { trackEvent } = useCommandBarAnalytics();

  const { header } = module.module_configs?.hover ?? {};

  // Support both string and array of strings for rotating headers
  const headers = Array.isArray(header) ? header : [header].filter(Boolean);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.NUDGE_ACTION_CTA_CLOSE, {
      module_type: module.module_type,
    });
    onDismiss();
  };

  const handleClick = () => {
    handleClose();
    setLocalStorageData({
      [`nudge_action_cta_${module.module_type}`]: true,
    });
    setActiveFeature?.(module.module_type);
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.NUDGE_ACTION_CTA_CLICK, {
      module_type: module.module_type,
    });
  };

  useEffect(() => {
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.NUDGE_ACTION_CTA_LOAD, {
      module_type: module.module_type,
    });
  }, [module.module_type, trackEvent]);

  return (
    <motion.div
      className="fixed top-36 right-4"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="relative flex items-center gap-2 h-10">
        {/* AI Logo */}
        <div className="w-10 h-10 flex-shrink-0 relative">
          <Lottie
            animationData={aiShimmer}
            loop={true}
            className="absolute inset-0 w-full h-full scale-150 origin-center"
          />
        </div>
        {/* CTA Button with Gradient Border */}
        <div className="rounded-[32px] p-[1px] flex-shrink-0 relative bg-[linear-gradient(133deg,rgba(255,148,148,1)_0%,rgba(240,238,124,1)_100%)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1)]">
          <AnimatePresence>
            {showCloseButton && (
              <motion.div
                className="absolute -top-2 -right-0 w-4 h-4 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-full cursor-pointer z-10"
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
          <button
            onClick={handleClick}
            className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-[32px] text-white text-sm font-medium text-center"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary) / 0.85) 0%, hsl(var(--primary)) 100%)',
            }}
          >
            <RotatingText texts={headers} className="text-sm font-medium leading-[1.71]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NudgeActionCta;
