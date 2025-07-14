import Button from '@breakout/design-system/components/Button/index';
import { XIcon } from 'lucide-react'; //TODO: Expos this for design system
import { CTAConfigType } from '@meaku/core/types/api/configuration_response';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import FeedbackHeader from './FeedbackHeader';
import PoweredByBreakout from './PoweredByBreakout';
import AgentCTA from './AgentCTA';

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
  if (isHidden) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-2 pb-3">
      <AgentCTA
        handleSendMessage={handleSendMessage}
        messages={messages}
        ctaConfig={ctaConfig}
        invertTextColor={invertTextColor}
      />

      <div className="flex flex-1 items-center justify-end gap-4 pr-2">
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
