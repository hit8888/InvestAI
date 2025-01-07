import useUnifiedConfigurationResponseManager from '../../../../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { useEffect, useState } from 'react';
import { IWebSocketHandleMessage } from '../../../../hooks/useWebSocketChat';
import { DemoEvent } from '@meaku/core/types/webSocket';
import { ActionButton } from './ActionButton';
import { useMessageStore } from '../../../../stores/useMessageStore';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import useAgentbotAnalytics from '../../../../hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
}

const PreDemoQuestion = ({ handleSendUserMessage }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const setDemoPlayingStatus = useMessageStore((state) => state.setDemoPlayingStatus);

  const [showPreDemoQuestions, setShowPreDemoQuestions] = useState(true);
  const [showDemoTopics, setShowDemoTopics] = useState(false);

  const tenantName = useUnifiedConfigurationResponseManager().getOrgName();

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
