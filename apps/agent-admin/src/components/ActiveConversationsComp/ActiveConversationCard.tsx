import { useState } from 'react';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import { ChipWithIcon } from '@breakout/design-system/components/ChipWithIcon';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
// import ConversationBasicAndBuyerIntentLabelContainer from './ConversationBasicAndBuyerIntentLabelContainer';
// import ConversationSessionDetailsContainer from './ConversationSessionDetailsContainer';
// import ConversationUserLastInputContainer from './ConversationUserLastInputContainer';
import JoinConversationDrawerContainerFlow from './JoinConversationDrawerContainerFlow';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { useAuth } from '../../context/AuthProvider';
import BuyerIntentChip from './BuyerIntentChip';

const ActiveConversationCard = ({ conversation }: { conversation: ActiveConversation }) => {
  const {
    session_id,
    company,
    lastMessage,
    buyerIntent,
    prospect: {
      name,
      country,
      company_demographics: { company_logo_url },
    },
  } = conversation;

  const [isOpen, setIsOpen] = useState(false);
  const { setHasJoinedConversation, setAdminDisplayName } = useJoinConversationStore();
  const { userInfo } = useAuth();
  const adminName = userInfo?.username || '';
  const countryFlagUrl = country ? findFlagUrlByCountryName(country) : '';

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
        className="cursor-pointer rounded-xl border border-gray-200 bg-white p-2 hover:border-[rgb(184,181,241)] hover:shadow-md"
        onClick={handleOpenJoinConversationDrawer}
      >
        <div className="flex items-start">
          <div className="flex-1 overflow-hidden">
            {name ? (
              <div className="px-2 text-xs font-medium text-bluegray-1000">{name}:</div>
            ) : (
              <div className="px-2 text-xs font-medium text-gray-500">User:</div>
            )}

            <div className="mt-1 h-6 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-sm text-customPrimaryText">
              {lastMessage}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <BuyerIntentChip buyerIntent={buyerIntent} />
              <ChipWithIcon name={country} iconUrl={countryFlagUrl} />
              <ChipWithIcon name={company} iconUrl={company_logo_url} />
            </div>
          </div>
        </div>
      </div>
      {/* <div
        className="active-conversation-card-shadow flex min-h-27 flex-1 cursor-pointer flex-col items-start gap-4 rounded-3xl border border-primary/10 bg-white p-4 
        transition-all duration-300 hover:scale-[102%] hover:shadow-lg hover:shadow-primary/20 hover:ring-2 hover:ring-primary/60"
        onClick={handleOpenJoinConversationDrawer}
      >
        <div className="flex flex-col items-start justify-center gap-4 self-stretch">
          <ConversationBasicAndBuyerIntentLabelContainer
            companyLogoUrl={company_logo_url}
            companyName={company_name}
            userName={name}
            buyerIntentLabel={'high'}
          />
          <ConversationSessionDetailsContainer sessionDuration={duration} messageCount={messageCount} />
        </div>
        <ConversationUserLastInputContainer
          isTyping={isTyping}
          isActive={isActive}
          timePassedAfterInactive={timePassedAfterInactive}
          userLastInput={lastInput}
        />
      </div> */}
      <JoinConversationDrawerContainerFlow
        sessionId={session_id}
        buyerIntentLabel={'high'}
        // isOpen={openJoinConversationDrawer}
        isOpen={isOpen}
        handleCloseJoinConversationDrawer={handleCloseJoinConversationDrawer}
      />
    </>
  );
};

export default ActiveConversationCard;
