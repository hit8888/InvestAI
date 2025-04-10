import { useEffect, useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';

interface IProps {
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
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
    handleSendUserMessage({
      message: { content: '', event_type: AgentEventType.DEMO_OPTIONS, event_data: {} },
      message_type: 'EVENT',
    });
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
          Would you like to see an interactive demo?
        </span>
        <div className="flex justify-between">
          <Button onClick={handleNotForNowButtonClick} disabled={showDemoTopics} variant="system_tertiary">
            Not for now
          </Button>
          <Button onClick={handleYesLetsDoItButtonClick}>Yes, lets do that!</Button>
        </div>
      </div>
    </div>
  );
};

export { PreDemoQuestion };
