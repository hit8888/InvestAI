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
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import AgentDropdown from '../Dropdown/AgentDropdown';
import { FormArtifactMetadataType } from '@meaku/core/types/artifact';
import { CountryCode } from 'libphonenumber-js/core';

interface IChatFormFieldProps {
  form: UseFormReturnType;
  form_field: FormFieldType;
  isArtifactFormFilled: boolean;
  fieldClassName?: string;
  artifactMetadata: FormArtifactMetadataType;
}

// Helper function to generate label with asterisk for required fields
const getLabelWithRequiredIndicator = (label: string, isRequired: boolean): string => {
  return `${label}${isRequired ? '*' : ''}`;
};

const ChatFormField = (props: IChatFormFieldProps) => {
  const { form, form_field, isArtifactFormFilled, fieldClassName } = props;
  const fieldErrorMessage = form.formState.errors[form_field.field_name];

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

  // Handling auto complete for different fields
  const getAutoCompleteValue = (label: string) => {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes('name')) return 'name';
    if (lowerLabel.includes('email')) return 'email';
    if (lowerLabel.includes('phone') || lowerLabel.includes('tel')) return 'tel';
    if (lowerLabel.includes('address')) return 'street-address';
    if (lowerLabel.includes('company') || lowerLabel.includes('organization')) return 'organization';
    if (lowerLabel.includes('job') || lowerLabel.includes('title')) return 'job-title';

    // Default for unknown types
    return 'on';
  };

  const getFieldBasedOnDataType = (field: ControllerRenderProps<FieldValues, string>) => {
    switch (form_field.data_type) {
      case 'phone':
        return (
          <PhoneInputContainer
            isArtifactFormFilled={isArtifactFormFilled}
            phoneLabel={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
            field={field}
            defaultCountry={props.artifactMetadata.country_code as CountryCode}
            className={cn(
              fieldErrorMessage &&
                'border-1 border border-destructive-600 [&>button]:bg-destructive-100 [&>input]:bg-destructive-25 [&_svg]:text-gray-900',
            )}
          />
        );
      case 'picklist':
        return (
          <AgentDropdown
            onCallback={field.onChange}
            className="h-10 rounded-lg p-4 text-base"
            options={form_field.options ?? []}
            placeholderLabel={form_field.label}
            fontToShown="text-sm"
            showTooltipContent
            {...field}
          />
        );
      case 'int':
        return (
          <Input
            readOnly={isArtifactFormFilled}
            {...field}
            value={field.value ?? ''}
            autoComplete={getAutoCompleteValue(form_field.label)}
            className={cn([
              'border border-gray-300 bg-white text-customPrimaryText placeholder:text-gray-400 focus:border-gray-400 focus:ring-0',
              fieldClassName,
              fieldErrorMessage && 'border-1 border border-destructive-600 bg-destructive-25',
            ])}
            placeholder={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
            type="number"
            onKeyDown={handleKeyDown}
            min="0"
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                field.onChange('');
              } else {
                const numValue = parseInt(value, 10);
                field.onChange(isNaN(numValue) ? value : numValue);
              }
            }}
          />
        );
      default:
        return (
          <Input
            readOnly={isArtifactFormFilled}
            {...field}
            value={field.value ?? ''}
            autoComplete={getAutoCompleteValue(form_field.label)}
            autoCorrect="on" // For iOS
            autoCapitalize="words" // For names
            spellCheck="true" // Enable spell checking
            className={cn([
              'border border-gray-300 bg-white text-customPrimaryText placeholder:text-gray-400 focus:border-gray-400 focus:ring-0',
              fieldClassName,
              fieldErrorMessage && 'border-1 border border-destructive-600 bg-destructive-25',
            ])}
            placeholder={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
            type={getInputType(form_field.data_type)}
            onKeyDown={handleKeyDown}
          />
        );
    }
  };

  return (
    <FormField
      control={form.control}
      name={form_field.field_name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col items-start justify-center">
          <div className="flex w-full items-center justify-center gap-2 space-y-0">
            <FormControl>{getFieldBasedOnDataType(field)}</FormControl>
          </div>
          <FormMessage className={cn('font-medium text-destructive-1000', fieldClassName)} />
        </FormItem>
      )}
    />
  );
};

export default ChatFormField;
