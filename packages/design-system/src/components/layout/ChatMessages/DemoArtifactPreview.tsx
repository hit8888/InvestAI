import CommonArtifactPreview from './CommonArtifactPreview';
import { DemoPlayingStatus } from '@neuraltrade/core/types/common';
import ANALYTICS_EVENT_NAMES from '@neuraltrade/core/constants/analytics';
import useAgentbotAnalytics from '@neuraltrade/core/hooks/useAgentbotAnalytics';
import { AgentEventType, WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import MessageItemLayout, { Padding } from './MessageItemLayout';

type IProps = {
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  showDemoArtifactPreview: boolean;
};

const DemoArtifactPreview = ({ handleSendUserMessage, setDemoPlayingStatus, showDemoArtifactPreview }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const handleDemoPreviewClick = () => {
    handleSendUserMessage({
      message: { content: '', event_type: AgentEventType.DEMO_OPTIONS, event_data: {} },
      message_type: 'EVENT',
    });

    setDemoPlayingStatus(DemoPlayingStatus.STARTED);

    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_STARTED);
  };

  if (!showDemoArtifactPreview) return null;

  return (
    <MessageItemLayout paddingInline={Padding.INLINE}>
      <CommonArtifactPreview
        title="Initiated"
        isFetching={false}
        handleClick={handleDemoPreviewClick}
        artifactType="DEMO"
      />
    </MessageItemLayout>
  );
};

export default DemoArtifactPreview;
