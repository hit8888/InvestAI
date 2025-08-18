import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Cta, Nudge as NudgeType } from '@meaku/core/types/api/configuration_response';
import { Button, Icons, KatyIcon, Markdown } from '@meaku/saral';
import useNudgeQuery from '../../network/http/queries/useNudgeQuery';
import type { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import useDelayedQuery from '@meaku/core/hooks/useDelayedQuery';
import NudgeTimeoutLoader from './components/NudgeTimeoutLoader';
import NudgeAsset from './components/NudgeAsset';
import { useMouseDismissible } from './hooks/useMouseDismissible';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useCommandBarStore } from '../../stores/useCommandBarStore';
import { useWsClient } from '../../hooks/useWsClient';

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

  const handleNudgeClose = useCallback(() => {
    setNudgeToShow(null);
    onClose?.();
  }, [onClose]);

  const { isMouseOver, setIsMouseOver } = useMouseDismissible({
    displayDuration: nudgeToShow?.display_duration,
    onDismiss: handleNudgeClose,
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

  useEffect(() => {
    const nudge = nudgeQuery.data ?? initialNudge;

    if (nudge && !activeFeature) {
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.NUDGE_LOAD);
      setNudgeToShow(nudge);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nudgeQuery.data, initialNudge]);

  useEffect(() => {
    if (activeFeature) {
      handleNudgeClose();
    }
  }, [activeFeature, handleNudgeClose]);

  return (
    <AnimatePresence mode="wait">
      {nudgeToShow && (
        <motion.div
          className="w-80 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
        >
          <div className="flex flex-col justify-center gap-4">
            {header_text && (
              <motion.div
                className="flex gap-4 items-center bg-background rounded-3xl border p-5 shadow-elevation-md relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.175, 0.885, 0.32, 1.275],
                  delay: 0.5,
                }}
              >
                {display_duration && display_duration > 0 && <NudgeTimeoutLoader duration={display_duration} />}
                <div className="relative">
                  <KatyIcon width={48} height={48} />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center bg-background rounded-full border border-base-foreground">
                    <span className="text-xs">👋</span>
                  </div>
                </div>
                <div className="text-gray-600 text-sm/6 font-medium">
                  <Markdown markdown={header_text} />
                </div>
              </motion.div>
            )}

            <motion.div
              className="flex flex-col gap-4 bg-background rounded-3xl border p-5 shadow-elevation-md relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.175, 0.885, 0.32, 1.275],
                delay: header_text ? 0.1 : 0.1,
              }}
            >
              {display_duration && display_duration > 0 && !header_text && (
                <NudgeTimeoutLoader duration={display_duration} />
              )}

              {/* Top aligned assets */}
              {topAssets.length > 0 && (
                <div className="grid gap-4">
                  {topAssets.map((asset, index) => (
                    <NudgeAsset key={index} asset={asset} />
                  ))}
                </div>
              )}

              <div className="text-gray-600 text-sm/6">
                <Markdown markdown={main_body_text} />
              </div>

              {/* Bottom aligned assets */}
              {bottomAssets.length > 0 && (
                <div className="grid gap-4">
                  {bottomAssets.map((asset, index) => (
                    <NudgeAsset key={index} asset={asset} />
                  ))}
                </div>
              )}

              {ctas && ctas.length > 0 && (
                <div className="flex flex-col gap-2">
                  {ctas.map((button, index) => (
                    <Button
                      key={index}
                      variant={index === 0 ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => handleClick(button)}
                    >
                      {button.text}
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
          <motion.button
            onClick={() => {
              handleNudgeClose();
              setIsMouseOver(false);
            }}
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center cursor-pointer bg-base-foreground rounded-full"
            aria-label="Close"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
              delay: header_text ? 0.8 : 0.4,
            }}
          >
            <Icons.X className="w-3 h-3" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Nudge;
