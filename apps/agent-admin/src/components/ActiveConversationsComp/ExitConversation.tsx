import { AdminConversationJoinStatus } from '@neuraltrade/core/types/common';
import Button from '@breakout/design-system/components/Button/index';
import { LogOut } from 'lucide-react';
import ExitConversationConfirmDialog from './ExitConversationConfirmDialog';
import { useState } from 'react';

interface ExitConversationProps {
  sessionStatus: AdminConversationJoinStatus;
  onExitConversation: () => void;
}

const ExitConversation = ({ sessionStatus, onExitConversation }: ExitConversationProps) => {
  const [openExitConvConfirm, setOpenExitConvConfirm] = useState(false);

  const handleInitExitConversation = () => {
    setOpenExitConvConfirm(true);
  };

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
        onSubmit={onExitConversation}
        onClose={() => setOpenExitConvConfirm(false)}
      />
    </>
  );
};

export default ExitConversation;
