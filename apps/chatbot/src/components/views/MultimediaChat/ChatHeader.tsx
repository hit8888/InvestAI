import Button from '@breakout/design-system/components/layout/button';
import { ArrowLeftIcon, XIcon } from 'lucide-react'; //TODO: Expos this for design system
import { useArtifactStore } from '../../../stores/useArtifactStore.ts';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager.ts';
import { useMemo } from 'react';
import useChatbotAnalytics from '../../../hooks/useChatbotAnalytics.tsx';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  handleSendMessage: (message: string) => void;
  handleCloseChat?: () => void;
  handleFinishDemo: () => void;
}

const ChatHeader = (props: IProps) => {
  const { handleSendMessage, handleFinishDemo, handleCloseChat } = props;
  const { trackChatbotEvent } = useChatbotAnalytics();

  const isArtifactMaximized = useArtifactStore((state) => state.isArtifactMaximized);
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

  return (
    <div className="flex items-center justify-between border-b border-white/10 p-2 shadow-sm ">
      <div>
        {isArtifactMaximized ? (
          <Button
            size="sm"
            onClick={handleFinishDemo}
            className="flex items-center justify-center gap-2 border-2 border-primary/80 !bg-transparent text-primary/80 hover:!bg-primary/80 hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Finish Demo</span>
          </Button>
        ) : (
          <div className="rounded-md bg-primary/60 p-[2px]">
            <Button
              size="sm"
              onClick={handlePrimaryCta}
              className="bg-transparent !bg-gradient-to-r !from-primary/70 !to-primary/40 text-white"
            >
              {ctaText}
            </Button>
          </div>
        )}
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
