import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Cta, Nudge as NudgeType } from '@meaku/core/types/api/configuration_response';
import useNudgePollingQuery from '../../network/http/queries/useNudgeQuery';
import type { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import useDelayedEnable from '@meaku/core/hooks/useDelayedEnable';
import { useMouseDismissible } from './hooks/useMouseDismissible';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import { useWsClient } from '../../hooks/useWsClient';
import NudgeHeader from './components/NudgeHeader';
import NudgeBody from './components/NudgeBody';
import useShowNudgeBody from './hooks/useShowNudgeBody';
import useSound from '@meaku/core/hooks/useSound';
import bannerSound from '../../assets/banner-sound.mp3';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { cn } from '@meaku/saral';

interface NudgeProps {
  activeFeature: CommandBarModuleType | null;
  onClose?: () => void;
  setActiveFeature?: (feature: CommandBarModuleType | null) => void;
}

const DEFAULT_POLLING_FREQUENCY_MS = 30 * 1000;
const DEFAULT_MAX_POLLING_COUNT = 0;
const DEFAULT_DISPLAY_DURATION = 10 * 1000;

const Nudge = ({ activeFeature, onClose, setActiveFeature }: NudgeProps) => {
  const isMobile = useIsMobile();
  const { config, settings } = useCommandBarStore();
  const { sendUserMessage } = useWsClient();
  const { nudge: nudgeConfig, nudge_data: nudgeData } = config.command_bar ?? {};
  const { trackEvent } = useCommandBarAnalytics();
  const [nudgeToShow, setNudgeToShow] = useState<NudgeType | null>(nudgeData ?? null);

  const {
    polling_enabled,
    max_polling_count = DEFAULT_MAX_POLLING_COUNT,
    polling_frequency_ms = DEFAULT_POLLING_FREQUENCY_MS,
  } = nudgeConfig ?? {};
  const {
    main_body_text = '',
    ctas,
    assets,
    display_duration = DEFAULT_DISPLAY_DURATION,
    header_text: raw_header_text = '',
  } = nudgeToShow ?? {};
  const header_text = isMobile ? '' : raw_header_text;

  const showNudgeBody = useShowNudgeBody(!!nudgeToShow, !!header_text);
  const { play } = useSound(bannerSound, 0.2);

  const { isMouseOver, setIsMouseOver, handleDismiss } = useMouseDismissible({
    displayDuration: nudgeToShow?.display_duration,
    onDismiss: useCallback(() => {
      setNudgeToShow(null);
      onClose?.();
    }, [onClose]),
  });

  const isNudgePollingEnabled = useDelayedEnable(polling_enabled ? polling_frequency_ms + display_duration : Infinity);

  useNudgePollingQuery(
    {
      agentId: settings.agent_id,
      prospect_id: config.prospect_id,
      session_id: config.session_id,
      nudge_disabled: !!activeFeature,
      parent_url: settings.parent_url,
    },
    {
      enabled: isNudgePollingEnabled && !isMouseOver,
      refetchInterval: (query) => {
        if (query.state.error) {
          return false;
        }

        if (query.state.dataUpdateCount >= max_polling_count) {
          return false;
        }

        return polling_frequency_ms;
      },
    },
  );

  // Group assets by alignment
  const topAssets = assets?.filter((asset) => asset.alignment === 'TOP') || [];
  const bottomAssets = assets?.filter((asset) => asset.alignment === 'BOTTOM') || [];

  const handleClick = useCallback(
    (button: Cta) => {
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.NUDGE_CLICK);
      setNudgeToShow(null);

      if (nudgeToShow?.associated_module) {
        setActiveFeature?.(nudgeToShow.associated_module);
      }

      if (button.metadata?.event_data?.content) {
        sendUserMessage(button.metadata.event_data.content);
      }
    },
    [setActiveFeature, nudgeToShow, sendUserMessage, trackEvent],
  );

  const handleNudgeLoad = useCallback(
    (nudge?: NudgeType | null) => {
      if (!nudge) return;

      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.NUDGE_LOAD);
      setNudgeToShow(nudge);
      play();
    },
    [trackEvent, play],
  );

  useEffect(() => {
    if (activeFeature) return;

    handleNudgeLoad(nudgeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNudgeLoad, nudgeData]);

  useEffect(() => {
    if (activeFeature) {
      handleDismiss();
    }
  }, [activeFeature, handleDismiss]);

  return (
    <AnimatePresence mode="wait">
      {nudgeToShow && (
        <motion.div
          key={nudgeToShow.id}
          className={cn('w-80 relative', {
            'max-w-[calc(100vw-104px)]': isMobile, // 16px (left gap) + 56px (action width) + 16px (gap) + 16px (right gap)
          })}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
        >
          <div className="flex flex-col justify-center gap-4">
            <NudgeHeader content={header_text} displayDuration={display_duration} onDismiss={handleDismiss} />

            {showNudgeBody && (
              <NudgeBody
                content={main_body_text}
                displayDuration={display_duration}
                headerPresent={!!header_text}
                topAssets={topAssets}
                bottomAssets={bottomAssets}
                ctas={ctas}
                onCtaClick={handleClick}
                onDismiss={handleDismiss}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Nudge;
