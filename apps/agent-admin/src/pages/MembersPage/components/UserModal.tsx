import { useEffect, useMemo, useRef } from 'react';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@breakout/design-system/components/layout/dialog';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import {
  UserManagementCreateRequest,
  UserManagementCreateRequestSchema,
  UserRole,
  User,
} from '@meaku/core/types/admin/api';
import useCreateUserMutation from '../../../queries/mutation/useCreateUserMutation';
import useUpdateUserMutation from '../../../queries/mutation/useUpdateUserMutation';
import UserFormFields, { BaseFormValues } from './UserFormFields';

const EditUserFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  role: z.enum(['admin', 'read-write', 'read-only']),
});

type EditUserFormValues = z.infer<typeof EditUserFormSchema>;

type UserModalMode = 'create' | 'edit';

interface BaseUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CreateModeProps extends BaseUserModalProps {
  mode: 'create';
}

interface EditModeProps extends BaseUserModalProps {
  mode: 'edit';
  user?: User;
}

type UserModalProps = CreateModeProps | EditModeProps;

const CREATE_DEFAULTS: UserManagementCreateRequest = {
  first_name: '',
  last_name: '',
  email: '',
  role: 'read-only',
};

const EDIT_DEFAULTS: EditUserFormValues = {
  first_name: '',
  last_name: '',
  role: 'read-only',
};

const MODE_COPY: Record<UserModalMode, { title: string; subtitle: string }> = {
  create: {
    title: 'Add Member',
    subtitle: 'Add a new member to your organization and set their access level.',
  },
  edit: {
    title: 'Edit Member',
    subtitle: 'Update member details and their access level.',
  },
};

const UserModal = (props: UserModalProps) => {
  const { mode, isOpen, onClose, onSuccess } = props;
  const isCreateMode = mode === 'create';
  const user = 'user' in props ? props.user : undefined;

  const formRef = useRef<HTMLFormElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserManagementCreateRequest | EditUserFormValues>({
    resolver: zodResolver(
      (isCreateMode ? UserManagementCreateRequestSchema : EditUserFormSchema) as unknown as z.ZodTypeAny,
    ),
    defaultValues: (isCreateMode ? CREATE_DEFAULTS : EDIT_DEFAULTS) as Partial<
      UserManagementCreateRequest | EditUserFormValues
    >,
  });

  const createUserMutation = useCreateUserMutation({
    onSuccess: () => {
      reset(CREATE_DEFAULTS);
      onClose();
      onSuccess?.();
    },
  });

  const updateUserMutation = useUpdateUserMutation({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset(isCreateMode ? CREATE_DEFAULTS : EDIT_DEFAULTS);
    }
  }, [isOpen, reset, isCreateMode]);

  // Populate form with user data when editing
  useEffect(() => {
    if (!isCreateMode && isOpen && user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: (user.role as UserRole) || 'read-only',
      });
    }
  }, [user, reset, isCreateMode, isOpen]);

  const handleOpenChange = (open: boolean) => {
    const activeMutation = isCreateMode ? createUserMutation : updateUserMutation;
    if (!open && !activeMutation.isPending) {
      onClose();
      reset(isCreateMode ? CREATE_DEFAULTS : EDIT_DEFAULTS);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const onSubmit = (formValues: UserManagementCreateRequest | EditUserFormValues) => {
    if (isCreateMode) {
      createUserMutation.mutate(formValues as UserManagementCreateRequest);
      return;
    }

    if (!user?.id) {
      return;
    }

    updateUserMutation.mutate({
      userId: user.id,
      data: formValues as EditUserFormValues,
    });
  };

  const emailDisplay = useMemo(() => (isCreateMode ? undefined : (user?.email ?? '—')), [isCreateMode, user?.email]);
  const activeMutation = isCreateMode ? createUserMutation : updateUserMutation;
  const isSaving = activeMutation.isPending;
  const isSubmitDisabled = isCreateMode ? isSaving : isSaving || !isDirty;

  const { title, subtitle } = MODE_COPY[mode];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg rounded-2xl border border-gray-200 bg-white p-6"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <Typography variant="title-24" textColor="textPrimary">
              {title}
            </Typography>
            <Typography variant="body-14" textColor="gray500">
              {subtitle}
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <UserFormFields
            control={control as unknown as Control<BaseFormValues>}
            errors={errors as FieldErrors<BaseFormValues>}
            isPending={isSaving}
            emailValue={emailDisplay}
            emailDisabled={!isCreateMode}
            onKeyDown={handleKeyDown}
          />

          <DialogFooter className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              id="members-cancel-button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              id="members-save-button"
              type="submit"
              variant="primary"
              disabled={isSubmitDisabled}
              className="w-full sm:w-auto"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
