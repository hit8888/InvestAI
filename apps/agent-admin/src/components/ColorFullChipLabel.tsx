import { cn } from '@breakout/design-system/lib/cn';
import { ConversationChipLabelEnum } from '../utils/constants';

type ChipProps = {
  chipType: string;
  chipLabel: string;
};

const ColorFullChipLabel = ({ chipType, chipLabel }: ChipProps) => {
  const { TOTAL_TRAFFIC, TOTAL_CONVERSATIONS, HIGH_INTENT_CONVERSATIONS, LEAD_GENERATED } = ConversationChipLabelEnum;
  const isTotalTraffic = chipType === TOTAL_TRAFFIC;
  const isTotalConversations = chipType === TOTAL_CONVERSATIONS;
  const isHighIntentConversations = chipType === HIGH_INTENT_CONVERSATIONS;
  const isLeadGenerated = chipType === LEAD_GENERATED;

  // TODOS: Replace the custom colors with tailwind defined colors - Linear task - ( BO-957)
  return (
    <p
      className={cn('flex items-center justify-center rounded-custom-50 px-2 py-1 text-sm font-medium', {
        'bg-bluegray-100 text-bluegray-1000': isTotalTraffic,
        'bg-pink_sec-100 text-pink_sec-1000': isTotalConversations,
        'bg-orange_sec-100 text-orange_sec-1000': isHighIntentConversations,
        'bg-bluelight-100 text-blue_sec-1000': isLeadGenerated,
      })}
    >
      {chipLabel}
    </p>
  );
};

export default ColorFullChipLabel;
