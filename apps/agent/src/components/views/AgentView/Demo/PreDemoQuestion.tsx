import { useEffect, useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';
import Typography from '@breakout/design-system/components/Typography/index';

interface IProps {
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  isAMessageBeingProcessed: boolean;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
}

const PreDemoQuestion = ({ handleSendUserMessage, isAMessageBeingProcessed, setDemoPlayingStatus }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const preDemoQuestionRef = useElementScrollIntoView<HTMLDivElement>();

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
    <div ref={preDemoQuestionRef} className="max-w-[424px] pb-2 pl-10">
      <div className="mb-4 border-t-2 border-dashed border-gray-300"></div>

      <div className="mt-4 flex flex-col gap-6 rounded-2xl bg-transparent_gray_3 p-4">
        <Typography as="span" variant="label-16-semibold" textColor="textPrimary">
          Would you like to see an interactive demo?
        </Typography>
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
