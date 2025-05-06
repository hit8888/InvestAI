import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@breakout/design-system/components/layout/dialog';
import Button from '@breakout/design-system/components/Button/index';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import Input from '@breakout/design-system/components/layout/input';
import { getUserNameFromLocalStorage } from '../../utils/common';
import { useEffect } from 'react';

type AdminDetailsDialogProps = {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

const AdminDetailsDialog = ({ isOpen, onSubmit, onClose }: AdminDetailsDialogProps) => {
  const { adminDisplayName, adminJobTitle, setAdminDisplayName, setAdminJobTitle } = useJoinConversationStore();

  useEffect(() => {
    const userName = getUserNameFromLocalStorage();
    setAdminDisplayName(userName);
  }, [setAdminDisplayName]);

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  const handleAdminDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminDisplayName(e.target.value);
  };

  const handleAdminJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminJobTitle(e.target.value);
  };

  if (!isOpen) return null;

  const disableSubmit = !adminDisplayName;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="pointer-events-none top-[3.8rem] z-[1000] mx-2 mb-2 rounded-3xl bg-black/30" />
      <DialogTitle className="sr-only"></DialogTitle>

      <DialogContent className="join-conversation-dialog-admin-details-shadow z-[1000] w-[420px] rounded-2xl border border-gray-300 bg-white p-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <p className="text-center text-2xl font-semibold text-gray-900">Join Conversation</p>
            <p className="text-base text-gray-500">
              You’ll join as <span className="font-medium text-gray-900">{adminDisplayName}</span>. Update your name
              below if needed.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-2">
              <span className="text-xs font-medium text-primary">
                Display Name<span className="text-destructive-1000">*</span>
              </span>
              <Input placeholder="enter your name" value={adminDisplayName} onChange={handleAdminDisplayNameChange} />
            </div>
            <div className="flex w-full flex-col gap-2">
              <span className="text-xs font-medium text-primary">Job Title</span>
              <Input placeholder="enter job title" value={adminJobTitle} onChange={handleAdminJobTitleChange} />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between gap-4">
          <Button
            className="w-full flex-1 border-2 border-gray-600 bg-transparent text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="w-full flex-1 bg-gray-600 ring ring-2 ring-gray-200"
            onClick={handleSubmit}
            disabled={disableSubmit}
          >
            Join
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDetailsDialog;
