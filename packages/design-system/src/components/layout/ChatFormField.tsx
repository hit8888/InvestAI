import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  UseFormReturnType,
} from '@breakout/design-system/components/layout/form';
import { FormFieldType } from '@meaku/core/types/webSocketData';
import Input from '@breakout/design-system/components/layout/input';
import { getInputType } from '@meaku/core/utils/form_fields';
import PhoneInputContainer from '../PhoneInput';
import { cn } from '../../lib/cn';

interface IChatFormFieldProps {
  form: UseFormReturnType;
  form_field: FormFieldType;
  isArtifactFormFilled: boolean;
  fieldClassName?: string;
}

// Helper function to generate label with asterisk for required fields
const getLabelWithRequiredIndicator = (label: string, isRequired: boolean): string => {
  return `${label}${isRequired ? '*' : ''}`;
};

const ChatFormField = (props: IChatFormFieldProps) => {
  const { form, form_field, isArtifactFormFilled, fieldClassName } = props;

  const isPhoneInputField = form_field.field_name === 'phone';
  const isIntField = form_field.data_type === 'int';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isIntField) {
      // Array of allowed navigation and editing keys
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

      // Prevent input if:
      // 1. Key is '-' or '.'
      // 2. Key is not a number and not in allowedKeys array
      if (e.key === '-' || e.key === '.' || (isNaN(Number(e.key)) && !allowedKeys.includes(e.key))) {
        e.preventDefault();
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name={form_field.field_name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col items-start justify-center">
          <div className="flex w-full items-center justify-center gap-2 space-y-0">
            <FormControl>
              {isPhoneInputField ? (
                <PhoneInputContainer
                  isArtifactFormFilled={isArtifactFormFilled}
                  phoneLabel={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
                  field={field}
                />
              ) : (
                <Input
                  readOnly={isArtifactFormFilled}
                  {...field}
                  autoComplete="off"
                  className={cn(
                    'border border-gray-300 bg-white placeholder:text-gray-400 focus:border-gray-400 focus:ring-0',
                    fieldClassName,
                  )}
                  placeholder={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
                  type={getInputType(form_field.data_type)}
                  onKeyDown={handleKeyDown}
                  min={isIntField ? '0' : undefined}
                />
              )}
            </FormControl>
          </div>
          <FormMessage className={cn('!-mb-16 font-medium text-red-500', fieldClassName)} />
        </FormItem>
      )}
    />
  );
};

export default ChatFormField;
