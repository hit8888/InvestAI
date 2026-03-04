import { BuyerIntent } from '@neuraltrade/core/types/common';

const buyerIntentText: Record<BuyerIntent, string> = {
  HIGH: 'High Intent',
  MEDIUM: 'Medium Intent',
  LOW: 'Low Intent',
};

const buyerIntentClasses: Record<BuyerIntent, string> = {
  HIGH: 'bg-pink_sec-50 text-pink_sec-1000',
  MEDIUM: 'bg-orange_sec-50 text-orange_sec-900',
  LOW: 'bg-gray-50 text-bluegray-1000',
};

const BuyerIntentChip = ({ buyerIntent }: { buyerIntent: BuyerIntent }) => {
  return (
    <div className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${buyerIntentClasses[buyerIntent]}`}>
      {buyerIntentText[buyerIntent]}
    </div>
  );
};

export default BuyerIntentChip;
