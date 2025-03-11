import { useState } from 'react';
import { ActiveConversationCard } from '../../context/ActiveConversationsContext';
import ConversationBasicAndBuyerIntentLabelContainer from './ConversationBasicAndBuyerIntentLabelContainer';
import ConversationSessionDetailsContainer from './ConversationSessionDetailsContainer';
import ConversationUserLastInputContainer from './ConversationUserLastInputContainer';
import JoinConversationDrawerContainerFlow from './JoinConversationDrawerContainerFlow';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { useAuth } from '../../context/AuthProvider';

const SingleActiveConversation = ({ card }: { card: ActiveConversationCard }) => {
  const {
    sessionId,
    companyLogoUrl,
    companyName,
    userName,
    buyerIntentLabel,
    duration,
    messageCount,
    isTyping,
    isActive,
    timePassedAfterInactive,
    lastInput,
  } = card;

  const [isOpen, setIsOpen] = useState(false);
  const { setHasJoinedConversation, setAdminDisplayName } = useJoinConversationStore();
  const { userInfo } = useAuth();
  const adminName = userInfo?.username || '';

  const handleOpenJoinConversationDrawer = () => {
    setIsOpen(true);
    setAdminDisplayName(adminName);
  };

  const handleCloseJoinConversationDrawer = () => {
    setIsOpen(false);
    setHasJoinedConversation(false);
    setAdminDisplayName('');
  };

  // const openJoinConversationDrawer = isOpen && isActive;
  return (
    <>
      <div
        className="active-conversation-card-shadow flex min-h-64 flex-1 cursor-pointer flex-col items-start gap-4 rounded-3xl border border-primary/10 bg-white p-4 
        transition-all duration-300 hover:scale-[102%] hover:shadow-lg hover:shadow-primary/20 hover:ring-2 hover:ring-primary/60"
        onClick={handleOpenJoinConversationDrawer}
      >
        <div className="flex flex-col items-start justify-center gap-4 self-stretch">
          <ConversationBasicAndBuyerIntentLabelContainer
            companyLogoUrl={companyLogoUrl}
            companyName={companyName}
            userName={userName}
            buyerIntentLabel={buyerIntentLabel}
          />
          <ConversationSessionDetailsContainer sessionDuration={duration} messageCount={messageCount} />
        </div>
        <ConversationUserLastInputContainer
          isTyping={isTyping}
          isActive={isActive}
          timePassedAfterInactive={timePassedAfterInactive}
          userLastInput={lastInput}
        />
      </div>
      <JoinConversationDrawerContainerFlow
        sessionId={sessionId}
        buyerIntentLabel={buyerIntentLabel}
        // isOpen={openJoinConversationDrawer}
        isOpen={isOpen}
        handleCloseJoinConversationDrawer={handleCloseJoinConversationDrawer}
      />
    </>
  );
};

export default SingleActiveConversation;
