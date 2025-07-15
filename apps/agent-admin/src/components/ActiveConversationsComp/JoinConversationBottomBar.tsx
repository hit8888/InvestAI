import { TriangleAlert } from 'lucide-react';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';
import AdminChatInput, { ExitButton, JoinButtons } from './AdminChatInput';
import Typography from '@breakout/design-system/components/Typography/index';
import { SendAdminMessageFn } from '../../hooks/useAdminConversationWebSocket';

type JoinConversationBottomBarProps = {
  sessionStatus: AdminConversationJoinStatus;
  onJoinButtonClick: () => void;
  onSendMessage: SendAdminMessageFn;
  onAIResponseGenerationRequest: () => void;
  onExit: () => void;
  onClose: () => void;
};

const JoinConversationBottomBar = ({
  sessionStatus,
  onJoinButtonClick,
  onSendMessage,
  onAIResponseGenerationRequest,
  onExit,
  onClose,
}: JoinConversationBottomBarProps) => {
  const renderContent = (sessionStatus: AdminConversationJoinStatus) => {
    switch (sessionStatus) {
      case AdminConversationJoinStatus.JOINED:
        return (
          <AdminChatInput onSendMessage={onSendMessage} onAIResponseGenerationRequest={onAIResponseGenerationRequest}>
            <ExitButton onExit={onExit} />
          </AdminChatInput>
        );
      case AdminConversationJoinStatus.DENIED:
        return <JoinConversationDenied />;
      default:
        return (
          <AdminChatInput
            disabled
            onSendMessage={onSendMessage}
            onAIResponseGenerationRequest={onAIResponseGenerationRequest}
          >
            <JoinButtons status={sessionStatus} onJoin={onJoinButtonClick} onClose={onClose} />
          </AdminChatInput>
        );
    }
  };

  return renderContent(sessionStatus);
};

const JoinConversationDenied = () => {
  return (
    <div className="flex gap-3 text-warning-1000">
      <TriangleAlert />
      <Typography variant="body-14" textColor="error" as="span">
        User currently do not need human support.
      </Typography>
    </div>
  );
};

export default JoinConversationBottomBar;
