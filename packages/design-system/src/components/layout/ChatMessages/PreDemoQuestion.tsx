import { useEffect, useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import { DemoPlayingStatus } from '@neuraltrade/core/types/common';
import ANALYTICS_EVENT_NAMES from '@neuraltrade/core/constants/analytics';
import useAgentbotAnalytics from '@neuraltrade/core/hooks/useAgentbotAnalytics';
import { AgentEventType, WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import Typography from '@breakout/design-system/components/Typography/index';
import MessageItemLayout, {
  Padding,
  Orientation,
} from '@breakout/design-system/components/layout/ChatMessages/MessageItemLayout';

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
    <MessageItemLayout paddingInline={Padding.INLINE} orientation={Orientation.COLUMN}>
      <div className="w-full border-t-2 border-dashed border-gray-300 pt-4">
        <div className="flex flex-col gap-6 rounded-2xl bg-transparent_gray_3 p-4">
          <Typography as="span" variant="label-16-semibold" textColor="textPrimary">
            Would you like to see an interactive demo?
          </Typography>
          <div className="flex justify-between">
            <Button onClick={handleNotForNowButtonClick} disabled={showDemoTopics} variant="system_tertiary">
              Not for now
            </Button>
            <Button disabled={showDemoTopics} onClick={handleYesLetsDoItButtonClick}>
              Yes, lets do that!
            </Button>
          </div>
        </div>
      </div>
    </MessageItemLayout>
  );
};

export default PreDemoQuestion;
