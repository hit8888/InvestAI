import { Dialog, DialogContent } from '@breakout/design-system/components/layout/dialog';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';

type ExitConversationConfirmDialogProps = {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

const ExitConversationConfirmDialog = ({ isOpen, onSubmit, onClose }: ExitConversationConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl border border-gray-300 bg-white p-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Typography variant="title-18" textColor="textPrimary" align="center">
              Leave Conversation?
            </Typography>
            <Typography variant="body-14" textColor="gray500" align="center">
              You’re about to leave. The user will stay in the chat with the AI assistant. Proceed?
            </Typography>
          </div>
        </div>
        <div className="mt-6 flex w-full justify-between gap-4">
          <Button
            className="w-full flex-1 border-2 border-gray-600 bg-transparent text-gray-600 hover:bg-gray-100 focus:bg-white"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="w-full flex-1 bg-destructive-1000 ring-2 ring-gray-200 hover:bg-destructive-1000"
            onClick={onSubmit}
          >
            Leave Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitConversationConfirmDialog;
