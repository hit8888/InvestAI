import { useEffect, useState } from 'react';
import { DemoEvent, IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import { ActionButton } from './ActionButton';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import HappySmirkIcon from '@breakout/design-system/components/icons/happy-smirk';

interface IProps {
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  isAMessageBeingProcessed: boolean;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
}

const PreDemoQuestion = ({ handleSendUserMessage, isAMessageBeingProcessed, setDemoPlayingStatus }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const [showPreDemoQuestions, setShowPreDemoQuestions] = useState(true);
  const [showDemoTopics, setShowDemoTopics] = useState(false);

  useEffect(() => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_OPTION_AVAILABLE);
  }, []);

  const handleNotForNowButtonClick = () => {
    setShowPreDemoQuestions(false);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_IGNORED);
  };

  const handleYesLetsDoItButtonClick = () => {
    handleSendUserMessage({ message: '', eventType: DemoEvent.DEMO_OPTIONS, eventData: {} });
    setShowDemoTopics(true);
    setDemoPlayingStatus(DemoPlayingStatus.STARTED);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_STARTED);
  };

  if (!showPreDemoQuestions || isAMessageBeingProcessed) {
    return null;
  }

  return (
    <div className="pb-2 pl-10">
      <div className="mb-4 border-t-2 border-dashed border-primary/30"></div>

      <div className="mt-4 flex flex-col gap-6 rounded-2xl bg-[rgb(var(--primary)/0.18)] p-4">
        <span className="text-base font-semibold text-customPrimaryText">
          Would you like to see a demo of the product ?
        </span>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleNotForNowButtonClick}
            className="cursor-pointer rounded-lg p-3 text-sm font-semibold text-primary/60 hover:bg-primary/50 hover:text-white disabled:cursor-not-allowed"
            disabled={showDemoTopics}
          >
            Not for now
          </button>
          <ActionButton buttonText="Yes, lets do that!" onClick={handleYesLetsDoItButtonClick}>
            <HappySmirkIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export { PreDemoQuestion };
