import Button from '@breakout/design-system/components/layout/button';
import { XIcon } from 'lucide-react'; //TODO: Expos this for design system
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager.ts';
import { useMemo } from 'react';
import useChatbotAnalytics from '../../../hooks/useChatbotAnalytics.tsx';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  handleSendMessage: (message: string) => void;
  handleCloseChat?: () => void;
  isHidden?: boolean;
}

const ChatHeader = ({ handleSendMessage, handleCloseChat, isHidden }: IProps) => {
  const { trackChatbotEvent } = useChatbotAnalytics();

  const ctaConfig = useUnifiedConfigurationResponseManager().getCTAConfig();

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
    handleSendMessage(ctaMessage);
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.CTA_BUTTON_CLICKED, { ctaMessage, ctaText });
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b border-white/10 p-2 shadow-sm ">
      <div>
        <div className="rounded-md bg-primary/60 p-[2px]">
          <Button
            size="sm"
            onClick={handlePrimaryCta}
            className="bg-transparent !bg-gradient-to-r !from-primary/70 !to-primary/40 text-white"
          >
            {ctaText}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!!handleCloseChat && (
          <Button size="icon" className="bg-transparent p-0" onClick={handleCloseChat}>
            <XIcon className="text-primary" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
