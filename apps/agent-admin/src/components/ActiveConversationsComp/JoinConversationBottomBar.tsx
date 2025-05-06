import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { WebSocketTextMessage } from '../../hooks/useJoinConversationWebSocket';
import { JoinConversationStatus } from '../../stores/useJoinConversationStore';
import AdminChatInput from './AdminChatInput';
import JoinConversationButton from './JoinConversationButton';

type JoinConversationBottomBarProps = {
  sessionStatus: JoinConversationStatus;
  onSendMessage: (message: WebSocketTextMessage) => void;
  onJoinButtonClick: () => void;
};

const JoinConversationBottomBar = ({
  sessionStatus,
  onSendMessage,
  onJoinButtonClick,
}: JoinConversationBottomBarProps) => {
  const renderContent = (sessionStatus: JoinConversationStatus) => {
    switch (sessionStatus) {
      case JoinConversationStatus.PENDING:
        return <PendingJoinConversation />;
      case JoinConversationStatus.JOINED:
        return <AdminChatInput onSendMessage={onSendMessage} />;
      case JoinConversationStatus.DENIED:
        return <JoinConversationDenied />;
      case JoinConversationStatus.EXIT:
        return null;
      default:
        return <JoinConversationButton onJoinConversationClick={onJoinButtonClick} />;
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white px-1 py-1">
      <div className="w-full rounded-2xl border border-gray-300 bg-white p-3">{renderContent(sessionStatus)}</div>
    </div>
  );
};

const PendingJoinConversation = () => {
  return (
    <div className="flex gap-3 text-customSecondaryText">
      <div className="animate-spin">
        <LoaderCircle />
      </div>
      <span>Your request to join the conversation has been sent — waiting for the user to approve it.</span>
    </div>
  );
};

const JoinConversationDenied = () => {
  return (
    <div className="flex gap-3 text-warning-1000">
      <TriangleAlert />

      <span>User currently do not need human support.</span>
    </div>
  );
};

export default JoinConversationBottomBar;
