import Button from '@breakout/design-system/components/Button/index';
import { useCallback, useMemo } from 'react';
import useAgentbotAnalytics from '@neuraltrade/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@neuraltrade/core/constants/analytics';
import { CTAConfigType } from '@neuraltrade/core/types/api/configuration_response';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { checkIfCTAButtonDisabled, checkIfCTAButtonShown } from '@neuraltrade/core/utils/messageUtils';
import { useIsMobile } from '@neuraltrade/core/contexts/DeviceManagerProvider';

interface IProps {
  messages: WebSocketMessage[];
  handleSendMessage: (message: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  isHidden?: boolean;
  ctaConfig?: CTAConfigType;
  invertTextColor?: boolean;
}

const AgentCTA = ({ handleSendMessage, messages, isHidden, ctaConfig, invertTextColor }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const isMobile = useIsMobile();
  const isCTAButtonDisabled = checkIfCTAButtonDisabled(messages);
  const shouldCTAButtonShow = checkIfCTAButtonShown(messages);

  const ctaText = useMemo(() => ctaConfig?.text || 'Contact Sales', [ctaConfig]);

  const ctaMessage = useMemo(() => ctaConfig?.message || 'I want to book a demo for the product.', [ctaConfig]);

  const ctaUrl = ctaConfig?.url;

  const handlePrimaryCta = useCallback(() => {
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
  }, [ctaUrl, ctaMessage, ctaText, handleSendMessage, trackAgentbotEvent]);

  if (isHidden || (!shouldCTAButtonShow && isMobile)) {
    return null;
  }

  return (
    <Button
      variant={invertTextColor ? 'inverted_secondary' : 'secondary'}
      onClick={handlePrimaryCta}
      data-testid="contact-sales-btn"
      disabled={isCTAButtonDisabled}
    >
      {ctaText}
    </Button>
  );
};

export default AgentCTA;
