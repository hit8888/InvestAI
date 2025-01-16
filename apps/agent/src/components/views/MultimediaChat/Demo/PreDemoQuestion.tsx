import { useEffect, useState } from 'react';
import { DemoEvent, IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import { ActionButton } from './ActionButton';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';

interface IProps {
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  isAMessageBeingProcessed: boolean;
  tenantName: string;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
}

const PreDemoQuestion = ({
  handleSendUserMessage,
  isAMessageBeingProcessed,
  tenantName,
  setDemoPlayingStatus,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const [showPreDemoQuestions, setShowPreDemoQuestions] = useState(true);
  const [showDemoTopics, setShowDemoTopics] = useState(false);

  useEffect(() => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_OPTION_AVAILABLE);
  }, []);

  if (!showPreDemoQuestions || isAMessageBeingProcessed) {
    return null;
  }

  return (
    <div className="pl-10 pr-16">
      <div className="mb-4 border-t-2 border-dashed border-primary"></div>
      <span className="font-medium">
        Would you like to explore specific features of the {tenantName} product that might interest you?
      </span>

      <div className="mt-4 flex flex-col gap-4 pr-4">
        <ActionButton
          buttonText="Yes, lets do that!"
          onClick={() => {
            handleSendUserMessage({ message: '', eventType: DemoEvent.DEMO_OPTIONS, eventData: {} });
            setShowDemoTopics(true);
            setDemoPlayingStatus(DemoPlayingStatus.STARTED);
            trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_STARTED);
          }}
          isClicked={showDemoTopics}
        />
        <ActionButton
          buttonText="Not for now."
          onClick={() => {
            setShowPreDemoQuestions(false);
            trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_IGNORED);
          }}
          isDisabled={showDemoTopics}
        />
      </div>
    </div>
  );
};

export { PreDemoQuestion };
