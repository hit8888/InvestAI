export const PROFILE_DATA_FORM_FIELDS = [
  {
    name: 'firstName',
    label: 'First name:',
    placeholder: 'Enter your first name*',
    valueKey: 'firstName',
  },
  {
    name: 'lastName',
    label: 'Last name:',
    placeholder: 'Enter your last name*',
    valueKey: 'lastName',
  },
  {
    name: 'designation',
    label: 'Title:',
    placeholder: 'Enter your designation*',
    valueKey: 'designation',
  },
];

export const PASSWORD_STATE_FIELDS = [
  {
    name: 'newPassword',
    label: 'New Password',
    placeholder: 'Enter your new password',
    valueKey: 'newPassword' as const,
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Confirm your new password',
    valueKey: 'confirmPassword' as const,
  },
] as const;

export type InputFieldContainerProps = {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
