import CommonArtifactPreview from './CommonArtifactPreview';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';

type IProps = {
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
};

const DemoArtifactPreview = ({ handleSendUserMessage, setDemoPlayingStatus }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const handleDemoPreviewClick = () => {
    handleSendUserMessage({
      message: { content: '', event_type: AgentEventType.DEMO_OPTIONS, event_data: {} },
      message_type: 'EVENT',
    });

    setDemoPlayingStatus(DemoPlayingStatus.STARTED);

    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_STARTED);
  };

  return (
    <div className="my-4 pl-11 pr-6">
      <CommonArtifactPreview
        title="Initiated"
        isFetching={false}
        handleClick={handleDemoPreviewClick}
        artifactType="DEMO"
      />
    </div>
  );
};

export default DemoArtifactPreview;
