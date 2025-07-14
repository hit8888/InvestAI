import Button from '@breakout/design-system/components/Button/index';
import { useCallback, useMemo } from 'react';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { CTAConfigType } from '@meaku/core/types/api/configuration_response';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { checkIfCTAButtonDisabled, checkIfCTAButtonShown } from '@meaku/core/utils/messageUtils';

interface IProps {
  messages: WebSocketMessage[];
  handleSendMessage: (message: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  isHidden?: boolean;
  ctaConfig?: CTAConfigType;
  invertTextColor?: boolean;
  isMobile?: boolean;
}

const AgentCTA = ({ handleSendMessage, messages, isHidden, ctaConfig, invertTextColor, isMobile }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

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

  if (isHidden || !shouldCTAButtonShow) {
    return null;
  }

  return (
    <Button
      variant={isMobile ? 'secondary' : invertTextColor ? 'inverted_primary' : 'primary'}
      onClick={handlePrimaryCta}
      data-testid="contact-sales-btn"
      disabled={isCTAButtonDisabled}
    >
      {ctaText}
    </Button>
  );
};

export default AgentCTA;
