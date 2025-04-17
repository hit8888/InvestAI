import Button from '@breakout/design-system/components/Button/index';
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

  const ctaUrl = ctaConfig?.url;

  const handlePrimaryCta = () => {
    if (ctaUrl) {
      window.open(ctaUrl, '_blank');
    }
    handleSendMessage({
      message: {
        content: ctaUrl ? '' : ctaMessage,
        event_type: 'PRIMARY_GOAL_CTA_CLICKED',
        event_data: { url: ctaUrl },
      },
      message_type: 'EVENT',
    });
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.CTA_BUTTON_CLICKED, { ctaMessage, ctaText });
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-2 pb-3">
      <div>
        <Button variant="primary" onClick={handlePrimaryCta} data-testid="contact-sales-btn">
          {ctaText}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {!!handleCloseAgent && isCollapsible && (
          <Button
            buttonStyle="icon"
            variant="system_tertiary"
            className="bg-transparent p-0"
            onClick={() => {
              // Send message to parent to close overlay
              window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*');
              // Also call the original close handler
              handleCloseAgent();
            }}
          >
            <XIcon className="text-system" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AgentHeader;
