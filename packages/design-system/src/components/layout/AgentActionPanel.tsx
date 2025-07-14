import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import AgentInput from './AgentInput';
import AgentCTA from './AgentCTA';
import { CTAConfigType } from '@meaku/core/types/api/configuration_response';
import { cn } from '../../lib/cn';

interface IProps {
  handleSendMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  disableMessageSend: boolean;
  messages: WebSocketMessage[];
  isCollapsible: boolean;
  invertTextColor?: boolean;
  ctaConfig?: CTAConfigType;
}

const AgentActionPanel = ({
  handleSendMessage,
  disableMessageSend,
  messages,
  isCollapsible,
  invertTextColor,
  ctaConfig,
}: IProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(['flex w-full flex-col items-start gap-2', isMobile && 'p-2 pt-4 shadow-2xl'])}>
      <AgentCTA
        handleSendMessage={handleSendMessage}
        messages={messages}
        ctaConfig={ctaConfig}
        invertTextColor={invertTextColor}
        isMobile={isMobile}
        isHidden={!isMobile}
      />
      <AgentInput
        handleSendMessage={(message) => handleSendMessage({ message: { content: message }, message_type: 'TEXT' })}
        disableMessageSend={disableMessageSend}
        messages={messages}
        isCollapsible={isCollapsible}
        invertTextColor={invertTextColor}
      />
    </div>
  );
};

export default AgentActionPanel;
