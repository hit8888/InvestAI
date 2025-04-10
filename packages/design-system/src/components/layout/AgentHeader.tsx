import Button from '@breakout/design-system/components/layout/button';
import { XIcon } from 'lucide-react'; //TODO: Expos this for design system
import { useMemo } from 'react';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { CTAConfigType } from '@meaku/core/types/api/configuration_response';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';

interface IProps {
  handleSendMessage: (message: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  handleCloseAgent?: () => void;
  isHidden?: boolean;
  ctaConfig?: CTAConfigType;
  isCollapsible: boolean;
}

const AgentHeader = ({ handleSendMessage, handleCloseAgent, isHidden, ctaConfig, isCollapsible }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const ctaText = useMemo(() => {
    if (ctaConfig?.text) {
      return ctaConfig.text;
    }
    return 'Contact Sales';
  }, [ctaConfig]);

  const ctaMessage = useMemo(() => {
    if (ctaConfig?.message) {
      return ctaConfig.message;
    }

    return 'I want to book a demo for the product.';
  }, [ctaConfig]);

  const handlePrimaryCta = () => {
    if (ctaConfig?.url) {
      window.open(ctaConfig.url, '_blank');
      handleSendMessage({
        message: {
          content: '',
          event_type: 'PRIMARY_GOAL_COMPLETED',
          event_data: { url: ctaConfig.url },
        },
        message_type: 'EVENT',
      });
    } else {
      handleSendMessage({
        message: {
          content: ctaMessage,
          event_type: 'PRIMARY_GOAL_CTA_CLICKED',
          event_data: {},
        },
        message_type: 'EVENT',
      });
    }
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CTA_BUTTON_CLICKED, { ctaMessage, ctaText });
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-2">
      <div>
        <div className="rounded-md bg-primary/60 p-[2px]">
          <Button
            size="sm"
            onClick={handlePrimaryCta}
            className="bg-transparent !bg-gradient-to-r !from-primary/70 !to-primary/40 text-white"
            data-testid="contact-sales-btn"
          >
            {ctaText}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!!handleCloseAgent && isCollapsible && (
          <Button
            size="icon"
            className="bg-transparent p-0"
            onClick={() => {
              // Send message to parent to close overlay
              window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*');
              // Also call the original close handler
              handleCloseAgent();
            }}
          >
            <XIcon className="text-primary" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AgentHeader;
