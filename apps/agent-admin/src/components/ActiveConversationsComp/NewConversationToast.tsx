import toast from 'react-hot-toast';

import NewLeadsToastIcon from './NewLeadsToastIcon';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import { ActiveConversation } from '../../context/ActiveConversationsContext';

interface NewConversationToastProps {
  toastId: string;
  title: string;
  onViewLead: (conversation: ActiveConversation) => void;
  conversation: ActiveConversation;
}

const NewConversationToast = ({ toastId, title, onViewLead, conversation }: NewConversationToastProps) => {
  return (
    <div className="success-toast-shadow flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2">
      <div className="flex flex-1 items-center gap-2">
        <NewLeadsToastIcon />
        <Typography variant="label-14-medium" textColor="default">
          New Potential Lead!
        </Typography>
        <Typography variant="body-14" textColor="gray500" className="max-w-xl flex-1">
          {title}
        </Typography>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="primary"
          onClick={() => {
            onViewLead(conversation);
            toast.dismiss(toastId);
          }}
        >
          View Lead
        </Button>
        <Button variant="secondary" onClick={() => toast.dismiss(toastId)}>
          Dismiss
        </Button>
      </div>
    </div>
  );
};

export default NewConversationToast;
