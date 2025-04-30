import { useState } from 'react';
import { findFlagUrlByCountryName } from 'country-flags-svg';
import ChipWithIcon from '@breakout/design-system/components/ChipWithIcon/ChipWithIcon';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import JoinConversationDrawer from './JoinConversationDrawer';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import BuyerIntentChip from './BuyerIntentChip';

const ActiveConversationCard = ({ conversation }: { conversation: ActiveConversation }) => {
  const {
    company,
    lastMessage,
    buyerIntent,
    prospect: {
      name,
      country,
      company_demographics: { company_logo_url },
    },
  } = conversation;

  const [openJoinConversationDrawer, setOpenJoinConversationDrawer] = useState(false);
  const { setHasJoinedConversation } = useJoinConversationStore();
  const countryFlagUrl = country ? findFlagUrlByCountryName(country) : '';

  const handleOpenJoinConversationDrawer = () => {
    setOpenJoinConversationDrawer(true);
  };

  const handleCloseJoinConversationDrawer = () => {
    setOpenJoinConversationDrawer(false);
    setHasJoinedConversation(false);
  };

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
      <JoinConversationDrawer
        conversation={conversation}
        isOpen={openJoinConversationDrawer}
        onClose={handleCloseJoinConversationDrawer}
      />
    </>
  );
};

export default ActiveConversationCard;
