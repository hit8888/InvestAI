import { Radio } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/index';
import OverviewDataItem, { OverviewDataItemProps } from './OverviewDataItem';
import BuyerIntentChip from './BuyerIntentChip';
import { BuyerIntent } from '@meaku/core/types/common';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import { useMessageStore } from '../../hooks/useMessageStore';
import { getHighestIntentScore } from '../../utils/common';

interface AccountSignalsCardProps {
  conversation: ActiveConversation;
}

const AccountSignalsCard = ({ conversation }: AccountSignalsCardProps) => {
  const { messages } = useMessageStore();
  const buyerIntent = getHighestIntentScore(messages).buyer_intent || conversation.buyer_intent;

  const signalDataItems: OverviewDataItemProps[] = [
    {
      label: 'Buyer Intent:',
      value: buyerIntent,
      renderValue: (value: unknown) => <BuyerIntentChip buyerIntent={value as BuyerIntent} />,
    },
  ].filter((item) => !!item.value);

  if (signalDataItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-lg bg-pink-100 p-1.5">
          <Radio size={20} className="text-pink-600" />
        </div>
        <Typography variant="label-14-semibold" textColor="default" as="h3">
          Account Signals
        </Typography>
      </div>
      <div className="border-t border-dashed border-gray-300" />
      <div className="flex flex-col">
        {signalDataItems.map((dataItem) => (
          <OverviewDataItem key={dataItem.label} {...dataItem} />
        ))}
      </div>
    </div>
  );
};

export default AccountSignalsCard;
