import ActiveConvJoinButtonLining from '@breakout/design-system/components/icons/active-conv-join-button-lining';
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
          className="group relative z-50 w-full cursor-pointer rounded-2xl border border-gray-200 
      bg-white p-2 transition-all duration-300 focus:ring-2 focus:ring-primary 
      group-hover:ring-2 group-hover:ring-primary/70"
        >
          <p
            className="relative flex h-14 w-full items-center justify-center rounded-xl 
        border border-primary bg-primary/20 py-1 pl-2 pr-4 transition-all duration-300 
        focus:border-2 focus:border-primary/40 focus:bg-primary/90 
        group-hover:border-2 group-hover:border-primary/40 group-hover:bg-primary/80"
          >
            <ActiveConvJoinButtonLining className="absolute left-0 top-0 h-full w-full text-primary" />
            <span className="flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-primary group-hover:text-white">
              Join Conversation
            </span>
          </p>
        </button>
      )}

      <DialogForTakingAdminDetails isOpen={joinedConvClicked} onClose={handleCloseDialog} />
    </>
  );
};

export default JoinConversationEntryPointInput;
