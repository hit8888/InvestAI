import { Control, FieldErrors } from 'react-hook-form';
import Typography from '@breakout/design-system/components/Typography/index';
import Input from '@breakout/design-system/components/layout/input';
import AgentDropdown from '@breakout/design-system/components/Dropdown/AgentDropdown';
import { Controller } from 'react-hook-form';
import { UserRole } from '@neuraltrade/core/types/admin/api';
import { ROLE_OPTIONS } from '../constants';

export type BaseFormValues = {
  first_name: string;
  last_name: string;
  role: UserRole;
  email?: string;
};

interface UserFormFieldsProps {
  control: Control<BaseFormValues>;
  errors: FieldErrors<BaseFormValues>;
  isPending?: boolean;
  emailValue?: string;
  emailDisabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const UserFormFields = ({
  control,
  errors,
  isPending = false,
  emailValue,
  emailDisabled = false,
  onKeyDown,
}: UserFormFieldsProps) => {
  const inputClassName =
    'focus:border-primary-500 h-10 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-primary/20';
  const disabledInputClassName = 'h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500';

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Typography variant="caption-12-medium" textColor="textPrimary">
            First Name
          </Typography>
          <Controller
            control={control}
            name="first_name"
            render={({ field }) => (
              <Input
                {...field}
                id="members-first-name-input"
                placeholder="Enter first name"
                disabled={isPending}
                onKeyDown={onKeyDown}
                className={inputClassName}
              />
            )}
          />
          {errors.first_name && (
            <Typography variant="caption-12-normal" textColor="error">
              {errors.first_name.message as string}
            </Typography>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Typography variant="caption-12-medium" textColor="textPrimary">
            Last Name
          </Typography>
          <Controller
            control={control}
            name="last_name"
            render={({ field }) => (
              <Input
                {...field}
                id="members-last-name-input"
                placeholder="Enter last name"
                disabled={isPending}
                onKeyDown={onKeyDown}
                className={inputClassName}
              />
            )}
          />
          {errors.last_name && (
            <Typography variant="caption-12-normal" textColor="error">
              {errors.last_name.message as string}
            </Typography>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Typography variant="caption-12-medium" textColor="textPrimary">
          Email ID
        </Typography>
        {emailDisabled ? (
          <Input value={emailValue ?? '—'} disabled className={disabledInputClassName} />
        ) : (
          <>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  id="members-email-input"
                  placeholder="name@example.com"
                  disabled={isPending}
                  onKeyDown={onKeyDown}
                  className={inputClassName}
                />
              )}
            />
            {errors.email && (
              <Typography variant="caption-12-normal" textColor="error">
                {errors.email.message as string}
              </Typography>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Typography variant="caption-12-medium" textColor="textPrimary">
          Access
        </Typography>
        <Controller
          control={control}
          name="role"
          render={({ field }) => {
            const selectedOption = ROLE_OPTIONS.find((option) => option.value === field.value);
            return (
              <AgentDropdown
                key={field.value ?? 'role-dropdown'}
                options={ROLE_OPTIONS}
                placeholderLabel="Select access level"
                defaultValue={selectedOption}
                onCallback={(value) => field.onChange(value as UserRole)}
                className="h-10 rounded-lg border border-gray-200 bg-white text-sm text-gray-700"
                dropdownOpenClassName="ring-4 ring-gray-200"
                menuContentAlign="end"
                menuContentSide="bottom"
                menuItemClassName="p-2 text-sm"
                disableTrigger={isPending}
                allowDeselect={false}
                showIcon={false}
              />
            );
          }}
        />
        {errors.role && (
          <Typography variant="caption-12-normal" textColor="error">
            {errors.role.message as string}
          </Typography>
        )}
      </div>
    </>
  );
};

export default UserFormFields;
