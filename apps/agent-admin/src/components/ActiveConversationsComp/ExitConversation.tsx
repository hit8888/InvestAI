import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';
import Button from '@breakout/design-system/components/Button/index';
import { LogOut } from 'lucide-react';
import ExitConversationConfirmDialog from './ExitConversationConfirmDialog';
import { useState } from 'react';
import { ActiveConversation } from '../../context/ActiveConversationsContext';

const ExitConversation = ({ conversation }: { conversation: ActiveConversation }) => {
  const { sessionsStatus, setCurrentConversation, updateSessionStatus } = useJoinConversationStore();
  const [openExitConvConfirm, setOpenExitConvConfirm] = useState(false);

  const handleInitExitConversation = () => {
    setOpenExitConvConfirm(true);
  };

  const handleExitConversation = () => {
    updateSessionStatus(conversation.session_id, AdminConversationJoinStatus.EXIT);
    setCurrentConversation(null);
  };

  const sessionStatus = sessionsStatus[conversation.session_id];

  return (
    <>
      {sessionStatus === AdminConversationJoinStatus.JOINED ? (
        <Button
          className="flex gap-2 border border-destructive-1000 bg-white px-3 py-1.5 text-sm text-destructive-1000 hover:bg-destructive-100"
          onClick={handleInitExitConversation}
        >
          <span>Exit Conversation</span>
          <LogOut size={16} />
        </Button>
      ) : null}

      <ExitConversationConfirmDialog
        isOpen={openExitConvConfirm}
        onSubmit={handleExitConversation}
        onClose={() => setOpenExitConvConfirm(false)}
      />
    </>
  );
};

export default ExitConversation;
