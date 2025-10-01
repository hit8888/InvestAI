import { Dialog, DialogTrigger, DialogContent } from './dialog';
import Typography from '../Typography';
import Button from '../Button';
import DeleteIcon from '../icons/delete-icon';
import { Dispatch, SetStateAction } from 'react';

type DeleteDialogWrapperProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  getTriggerButton: () => React.ReactNode;
  handleDelete: () => void;
  isDeleting: boolean;
  title?: string;
  description?: string;
};

const DeleteDialogWrapper = ({
  isDialogOpen,
  setIsDialogOpen,
  getTriggerButton,
  handleDelete,
  isDeleting,
  title,
  description,
}: DeleteDialogWrapperProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{getTriggerButton()}</DialogTrigger>
      <DialogContent className="data-sources-dialog-shadow flex max-w-md flex-col items-center justify-center gap-14 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col items-center justify-center gap-1 self-stretch">
          <Typography variant={'title-24'} textColor={'textPrimary'} align={'center'}>
            {title || 'Delete selected pages?'}
          </Typography>
          <Typography variant={'body-16'} textColor={'textSecondary'} align={'center'}>
            {description ||
              "You're about to permanently remove the selected pages from your data source. This action cannot be undone."}
          </Typography>
        </div>
        <div className="flex w-full items-center gap-6">
          <Button
            onClick={() => setIsDialogOpen(false)}
            variant="system_secondary"
            disabled={isDeleting}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            buttonStyle={'rightIcon'}
            disabled={isDeleting}
            className="w-full"
          >
            Yes, Delete
            <DeleteIcon width="16" height="16" className="text-white" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialogWrapper;
