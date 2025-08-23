import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Cta, Nudge as NudgeType } from '@meaku/core/types/api/configuration_response';
import useNudgeQuery from '../../network/http/queries/useNudgeQuery';
import type { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import useDelayedQuery from '@meaku/core/hooks/useDelayedQuery';
import { useMouseDismissible } from './hooks/useMouseDismissible';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import { useWsClient } from '../../hooks/useWsClient';
import NudgeHeader from './components/NudgeHeader';
import NudgeBody from './components/NudgeBody';
import useShowNudgeBody from './hooks/useShowNudgeBody';

interface NudgeProps {
  activeFeature: CommandBarModuleType | null;
  onClose?: () => void;
  setActiveFeature?: (feature: CommandBarModuleType | null) => void;
}

const Nudge = ({ activeFeature, onClose, setActiveFeature }: NudgeProps) => {
  const { config, settings } = useCommandBarStore();
  const { sendUserMessage } = useWsClient();
  const { nudge: nudgeConfig, nudge_data: initialNudge } = config.command_bar ?? {};
  const { trackEvent } = useCommandBarAnalytics();
  const [nudgeToShow, setNudgeToShow] = useState<NudgeType | null>(initialNudge ?? null);
  const showNudgeBody = useShowNudgeBody(!!nudgeToShow, !!nudgeToShow?.header_text);

  const { isMouseOver, setIsMouseOver, handleDismiss } = useMouseDismissible({
    displayDuration: nudgeToShow?.display_duration,
    onDismiss: useCallback(() => {
      setNudgeToShow(null);
      onClose?.();
    }, [onClose]),
  });

  const isQueryEnabled = useDelayedQuery(
    (nudgeConfig?.polling_frequency_ms ?? 0) + (initialNudge?.display_duration ?? 0),
  );

  const nudgeQuery = useNudgeQuery(
    {
      agentId: settings.agent_id,
      prospect_id: config.prospect_id!,
      session_id: config.session_id,
      nudge_disabled: !!activeFeature,
      parent_url: settings.parent_url,
    },
    {
      enabled: isQueryEnabled && !isMouseOver && !!config.prospect_id,
      refetchInterval: (query) => {
        if (query.state.error) {
          return false;
        }

        if (query.state.dataUpdateCount >= (nudgeConfig?.max_polling_count ?? 0)) {
          return false;
        }
        return nudgeConfig?.polling_enabled ? nudgeConfig.polling_frequency_ms : false;
      },
    },
  );

  const { main_body_text = '', ctas, assets, header_text = '', display_duration } = nudgeToShow ?? {};

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
    },
    [trackEvent],
  );

  useEffect(() => {
    if (activeFeature) return;

    handleNudgeLoad(nudgeQuery.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNudgeLoad, nudgeQuery.data]);

  useEffect(() => {
    if (activeFeature) return;

    handleNudgeLoad(initialNudge);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNudgeLoad, initialNudge]);

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
          className="w-80 relative"
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
