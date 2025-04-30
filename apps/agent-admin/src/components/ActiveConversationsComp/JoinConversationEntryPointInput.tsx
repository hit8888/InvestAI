import { useState } from 'react';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import DialogForTakingAdminDetails from './DialogForTakingAdminDetails';
import InputBarAfterAdminJoinConversation from './InputBarAfterAdminJoinConversation';

const JoinConversationEntryPointInput = () => {
  const [joinedConvClicked, setJoinedConvClicked] = useState(false);
  const { hasJoinedConversation } = useJoinConversationStore();

  const handleJoinConversation = () => {
    setJoinedConvClicked(true);
  };

  const handleCloseDialog = () => {
    setJoinedConvClicked(false);
  };

  return (
    <>
      {hasJoinedConversation ? (
        <InputBarAfterAdminJoinConversation />
      ) : (
        <button
          onClick={handleJoinConversation}
          className="rounded-lg border border-primary bg-primary px-3 py-1 text-sm font-semibold text-white ring ring-primary/50"
        >
          Join Conversation
        </button>
      )}

      <DialogForTakingAdminDetails isOpen={joinedConvClicked} onClose={handleCloseDialog} />
    </>
  );
};

export default JoinConversationEntryPointInput;
