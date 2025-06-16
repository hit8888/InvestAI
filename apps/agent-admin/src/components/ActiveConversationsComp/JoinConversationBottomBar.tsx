import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';
import AdminChatInput from './AdminChatInput';
import JoinConversationButton from './JoinConversationButton';
import useSound from '@meaku/core/hooks/useSound';
import popupsound from '../../assets/popup-sound.mp4';
import { useEffect } from 'react';

type JoinConversationBottomBarProps = {
  sessionStatus: AdminConversationJoinStatus;
  onJoinButtonClick: () => void;
  onSendMessage: (message: string) => void;
  onAIResponseGenerationRequest: () => void;
};

const JoinConversationBottomBar = ({
  sessionStatus,
  onJoinButtonClick,
  onSendMessage,
  onAIResponseGenerationRequest,
}: JoinConversationBottomBarProps) => {
  const baseVolume = 0.5;
  const { play } = useSound(popupsound, baseVolume);

  useEffect(() => {
    if (sessionStatus === AdminConversationJoinStatus.JOINED) {
      play();
    }
  }, [sessionStatus, play]);

  const renderContent = (sessionStatus: AdminConversationJoinStatus) => {
    switch (sessionStatus) {
      case AdminConversationJoinStatus.PENDING:
        return <PendingJoinConversation />;
      case AdminConversationJoinStatus.JOINED:
        return (
          <AdminChatInput onSendMessage={onSendMessage} onAIResponseGenerationRequest={onAIResponseGenerationRequest} />
        );
      case AdminConversationJoinStatus.DENIED:
        return <JoinConversationDenied />;
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
