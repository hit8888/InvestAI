import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@breakout/design-system/components/layout/dialog';
import Button from '@breakout/design-system/components/Button/index';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import Input from '@breakout/design-system/components/layout/input';
import ActiveConvJoinAdminDetailsIcon from '@breakout/design-system/components/icons/active-conv-join-admin-details-icon';

type DialogForTakingAdminDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DialogForTakingAdminDetails = ({ isOpen, onClose }: DialogForTakingAdminDetailsProps) => {
  const { setHasJoinedConversation, setAdminDisplayName, adminDisplayName } = useJoinConversationStore();

  const handleSubmit = () => {
    setHasJoinedConversation(true);
    onClose();
  };

  const handleAdminDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminDisplayName(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="pointer-events-none z-[1000] rounded-3xl bg-[radial-gradient(93.9%_93.9%_at_50%_50%,rgba(255,255,255,0)_0%,#CAC7F5_100%)]" />
      <DialogTitle className="sr-only"></DialogTitle>

      <DialogContent className="join-conversation-dialog-admin-details-shadow fixed left-1/2 top-1/2 z-[1000] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-300 bg-white p-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center rounded-2xl bg-primary/10 p-2">
              <ActiveConvJoinAdminDetailsIcon className="h-6 w-6 text-primary/60" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-center text-2xl font-semibold text-gray-900">Join Conversation</p>
              <p className="text-base text-gray-500">
                You’ll join as <span className="font-medium text-gray-900">Alex Carter</span>. Update your name below if
                needed.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <span className="pl-4 text-xs font-medium text-primary">
              Display Name<span className="text-destructive-1000"> *</span>
            </span>
            <Input placeholder="Enter your name" value={adminDisplayName} onChange={handleAdminDisplayNameChange} />
          </div>
        </div>
        <div className="flex w-full justify-between gap-4">
          <Button className="w-full flex-1 border-2 border-primary bg-transparent text-primary" onClick={onClose}>
            Cancel
          </Button>
          <Button className="w-full flex-1" onClick={handleSubmit} disabled={!adminDisplayName}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForTakingAdminDetails;
