import Button from '@breakout/design-system/components/Button/index';
import { XIcon } from 'lucide-react'; //TODO: Expos this for design system
import { useMemo } from 'react';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { CTAConfigType } from '@meaku/core/types/api/configuration_response';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import FeedbackHeader from './FeedbackHeader';
import { checkIfCTAButtonDisabled } from '@meaku/core/utils/messageUtils';
import PoweredByBreakout from './PoweredByBreakout';

interface IProps {
  messages: WebSocketMessage[];
  handleSendMessage: (message: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  handleCloseAgent?: () => void;
  isHidden?: boolean;
  ctaConfig?: CTAConfigType;
  isCollapsible: boolean;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  showFeedbackHeader: boolean;
  invertTextColor?: boolean;
}

const AgentHeader = ({
  handleSendMessage,
  messages,
  handleCloseAgent,
  isHidden,
  ctaConfig,
  isCollapsible,
  setActiveArtifact,
  showFeedbackHeader,
  invertTextColor,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const isCTAButtonDisabled = checkIfCTAButtonDisabled(messages);

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
      <Button
        variant={invertTextColor ? 'inverted_primary' : 'primary'}
        onClick={handlePrimaryCta}
        data-testid="contact-sales-btn"
        disabled={isCTAButtonDisabled}
      >
        {ctaText}
      </Button>

      <div className="flex items-center justify-center gap-4 pr-2">
        <PoweredByBreakout />
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
            <XIcon className="text-gray-400" />
          </Button>
        )}
        {showFeedbackHeader ? <FeedbackHeader setActiveArtifact={setActiveArtifact} /> : null}
      </div>
    </div>
  );
};

export default AgentHeader;
