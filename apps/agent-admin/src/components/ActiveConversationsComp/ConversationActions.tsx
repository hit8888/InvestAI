import { DrawerClose } from '@breakout/design-system/components/Drawer/index';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import ConversationOverview from './ConversationOverview';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import ExitConversation from './ExitConversation';

interface ConversationActionsProps {
  conversation: ActiveConversation;
}

const ConversationActions = ({ conversation }: ConversationActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <ExitConversation conversation={conversation} />

      <ConversationOverview conversation={conversation} />

      <DrawerClose className="flex items-end">
        <CrossIcon className="h-6 w-6 text-gray-900" />
      </DrawerClose>
    </div>
  );
};

export default ConversationActions;
