import { findFlagUrlByCountryName } from 'country-flags-svg';
import ChipWithIcon from '@breakout/design-system/components/ChipWithIcon/ChipWithIcon';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import BuyerIntentChip from './BuyerIntentChip';

interface ActiveConversationCardProps {
  conversation: ActiveConversation;
  onCardClick: (conversation: ActiveConversation) => void;
}

const ActiveConversationCard = ({ conversation, onCardClick }: ActiveConversationCardProps) => {
  const {
    last_user_message,
    buyer_intent,
    prospect: { name, company, country, company_demographics },
  } = conversation;

  const countryFlagUrl = country ? findFlagUrlByCountryName(country) : '';

  return (
    <>
      <div
        className="cursor-pointer rounded-xl border border-gray-200 bg-white p-2 hover:border-[rgb(184,181,241)] hover:shadow-md"
        onClick={() => onCardClick(conversation)}
      >
        <div className="flex items-start">
          <div className="flex-1 overflow-hidden">
            {name ? (
              <div className="px-2 text-xs font-medium text-bluegray-1000">{name}</div>
            ) : (
              <div className="px-2 text-xs font-medium text-gray-500">User</div>
            )}

            <div className="mt-1 h-6 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-sm text-customPrimaryText">
              {last_user_message}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <BuyerIntentChip buyerIntent={buyer_intent} />
              <ChipWithIcon name={country} iconUrl={countryFlagUrl} />
              <ChipWithIcon name={company} iconUrl={company_demographics?.company_logo_url} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActiveConversationCard;
