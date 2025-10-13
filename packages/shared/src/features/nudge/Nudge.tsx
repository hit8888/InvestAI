import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Cta, Nudge as NudgeType } from '@meaku/core/types/api/configuration_response';
import useNudgePollingQuery from '../../network/http/queries/useNudgeQuery';
import type { CommandBarModuleType, NudgeAssetType } from '@meaku/core/types/api/configuration_response';
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
import ScrollTriggeredNudge from './components/ScrollTriggeredNudge';
import useScrollTriggeredNudge from './hooks/useScrollTriggeredNudge';

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
  const [nudgeToShow, setNudgeToShow] = useState<NudgeType | null>(null);
  const { isEnabled: isScrollTriggeredNudgeEnabled, disable: disableScrollTriggeredNudge } = useScrollTriggeredNudge();

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
    displayDuration: nudgeToShow ? display_duration : 0,
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
      enabled: isNudgePollingEnabled && !isMouseOver && !isScrollTriggeredNudgeEnabled,
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
  const { topAssets, bottomAssets } = (Array.isArray(assets) ? assets : []).reduce(
    (acc: { topAssets: NudgeAssetType[]; bottomAssets: NudgeAssetType[] }, asset) => {
      if (asset.alignment === 'TOP') {
        acc.topAssets.push(asset);
      } else if (asset.alignment === 'BOTTOM') {
        acc.bottomAssets.push(asset);
      }
      return acc;
    },
    { topAssets: [], bottomAssets: [] },
  );

  const handleCtaClick = useCallback(
    (button: Cta) => {
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.NUDGE_CLICK, {
        nudge_id: nudgeToShow?.nudge_id,
      });
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

  const handleNudgeClick = useCallback(() => {
    if (ctas && ctas.length === 1) {
      handleCtaClick(ctas[0]);
    }
  }, [ctas, handleCtaClick]);

  const handleNudgeLoad = useCallback(
    (nudge?: NudgeType | null) => {
      if (!nudge) return;

      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.NUDGE_LOAD, {
        nudge_id: nudge.nudge_id,
      });
      setNudgeToShow(nudge);
      play();
    },
    [trackEvent, play],
  );

  useEffect(() => {
    if (activeFeature || isScrollTriggeredNudgeEnabled) return;

    handleNudgeLoad(nudgeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nudgeData]);

  useEffect(() => {
    if (isScrollTriggeredNudgeEnabled) {
      setNudgeToShow(null);
    }
  }, [isScrollTriggeredNudgeEnabled]);

  useEffect(() => {
    if (activeFeature) {
      handleDismiss();
      disableScrollTriggeredNudge();
    }
  }, [activeFeature, handleDismiss, disableScrollTriggeredNudge]);

  if (isScrollTriggeredNudgeEnabled) {
    return (
      <AnimatePresence mode="wait">
        <ScrollTriggeredNudge
          setActiveFeature={setActiveFeature}
          sendUserMessage={sendUserMessage}
          onDisable={disableScrollTriggeredNudge}
        />
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {nudgeToShow && (
        <motion.div
          key={nudgeToShow.nudge_id}
          className={cn('w-80 relative', {
            'max-w-[calc(100vw-104px)]': isMobile, // 16px (left gap) + 56px (action width) + 16px (gap) + 16px (right gap)
            'cursor-pointer': ctas?.length === 1,
          })}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
          onClick={handleNudgeClick}
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
                onCtaClick={handleCtaClick}
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
