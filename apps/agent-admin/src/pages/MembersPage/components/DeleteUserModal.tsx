import DeleteDialogWrapper from '@breakout/design-system/components/layout/DeleteDialogWrapper';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import useDeleteUserMutation from '../../../queries/mutation/useDeleteUserMutation';
import { User } from '@meaku/core/types/admin/api';

interface DeleteUserModalProps {
  isOpen: boolean;
  user?: User;
  onClose: () => void;
  onSuccess?: () => void;
}

const DeleteUserModal = ({ isOpen, user, onClose, onSuccess }: DeleteUserModalProps) => {
  const { mutate, isPending } = useDeleteUserMutation({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const description = useMemo(() => {
    if (user) {
      const displayName = user.full_name || user.email || 'this member';
      return `You're about to delete ${displayName} from your dashboard. This action cannot be undone.`;
    }
    return "You're about to delete a member added to your dashboard. This action cannot be undone.";
  }, [user]);

  const handleDelete = () => {
    if (!user?.id || isPending) {
      return;
    }

    mutate({ userId: user.id });
  };

  const handleOpenChange: Dispatch<SetStateAction<boolean>> = (value) => {
    const nextOpen = typeof value === 'function' ? value(isOpen) : value;
    if (!nextOpen && !isPending) {
      onClose();
    }
  };

  return (
    <DeleteDialogWrapper
      isDialogOpen={isOpen}
      setIsDialogOpen={handleOpenChange}
      getTriggerButton={() => <span />}
      handleDelete={handleDelete}
      isDeleting={isPending}
      title="Delete Member?"
      description={description}
    />
  );
};

export default DeleteUserModal;
