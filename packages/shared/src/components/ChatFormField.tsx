import { cn, FormControl, FormField, FormItem, FormMessage, Input, UseFormReturnType } from '@meaku/saral';
import { FormFieldType } from '../utils/types';
import { getInputType } from '../utils/chat-utils';
import PhoneInputContainer from './PhoneInput';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import AgentDropdown from './Dropdown/AgentDropdown';
import { FormArtifactMetadataType } from '../utils/artifact';
import { CountryCode } from 'libphonenumber-js/core';
import PlacesAutocomplete, { PlaceData } from './PlacesAutocomplete';

interface IChatFormFieldProps {
  form: UseFormReturnType;
  form_field: FormFieldType;
  isArtifactFormFilled: boolean;
  fieldClassName?: string;
  artifactMetadata: FormArtifactMetadataType;
  onBlur?: () => void;
}

// Helper function to generate label with asterisk for required fields
const getLabelWithRequiredIndicator = (label: string, isRequired: boolean): string => {
  return `${label}${isRequired ? '*' : ''}`;
};

const ChatFormField = (props: IChatFormFieldProps) => {
  const { form, form_field, isArtifactFormFilled, fieldClassName, onBlur } = props;
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

  const handleBlur = (field: ControllerRenderProps<FieldValues, string>) => {
    field?.onBlur();
    onBlur?.();
  };

  const getFieldBasedOnDataType = (field: ControllerRenderProps<FieldValues, string>) => {
    switch (form_field.data_type) {
      case 'google_place':
        return (
          <PlacesAutocomplete
            placeholder={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
            defaultValue={field.value ?? ''}
            disabled={isArtifactFormFilled}
            className={cn(
              'text-customPrimaryText border border-gray-300 bg-white placeholder:text-gray-400 focus:border-gray-400 focus:ring-0',
              fieldClassName,
              fieldErrorMessage && 'border border-destructive-600 bg-destructive-25',
            )}
            onPlaceSelect={(place: PlaceData | null) => {
              field.onChange(place?.description || '');
            }}
            onBlur={() => handleBlur(field)}
          />
        );
      case 'phone':
        return (
          <PhoneInputContainer
            isArtifactFormFilled={isArtifactFormFilled}
            phoneLabel={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
            defaultCountry={props.artifactMetadata?.country_code as CountryCode}
            className={cn(
              'text-customPrimaryText rounded-lg placeholder:text-gray-400 focus:ring-0 border-0',
              !fieldErrorMessage &&
                'bg-gray-100 [&_.PhoneInputInput]:bg-gray-100 [&_button]:bg-gray-100 [&_button]:rounded-l-lg',
              fieldErrorMessage &&
                'bg-destructive-25 [&_.PhoneInputInput]:bg-destructive-25 [&_button]:bg-destructive-25 [&_button]:rounded-l-lg [&_svg]:text-gray-900',
            )}
            {...field}
            onBlur={() => handleBlur(field)}
          />
        );
      case 'picklist':
        return (
          <AgentDropdown
            onCallback={field.onChange}
            className={cn('h-10 rounded-lg p-4 text-base text-sm border-0 px-2', {
              'bg-gray-100': !fieldErrorMessage,
              'bg-destructive-25': fieldErrorMessage,
            })}
            options={form_field.options ?? []}
            placeholderLabel={form_field.label}
            showTooltipContent
            {...field}
            onBlur={() => handleBlur(field)}
          />
        );
      case 'int':
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
              'text-customPrimaryText border border-gray-300 bg-white placeholder:text-gray-400 focus:border-gray-400 focus:ring-0',
              fieldClassName,
              fieldErrorMessage && 'border border-destructive-600 bg-destructive-25',
            ])}
            placeholder={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
            type="number"
            onKeyDown={handleKeyDown}
            min="0"
            onBlur={() => handleBlur(field)}
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
              'text-customPrimaryText border border-gray-300 bg-white placeholder:text-gray-400 focus:border-gray-400 focus:ring-0',
              fieldClassName,
              fieldErrorMessage && 'border border-destructive-600 bg-destructive-25',
            ])}
            placeholder={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
            type={getInputType(form_field.data_type)}
            onKeyDown={handleKeyDown}
            onBlur={() => handleBlur(field)}
          />
        );
    }
  };

  return (
    <FormField
      control={form.control}
      name={form_field.field_name}
      render={({ field }: { field: ControllerRenderProps<FieldValues, string> }) => (
        <FormItem className="flex w-full flex-col items-start justify-center">
          <div className="flex w-full items-center justify-center gap-2 space-y-0">
            <FormControl>{getFieldBasedOnDataType(field)}</FormControl>
          </div>
          <FormMessage className={cn('pl-0 font-medium text-destructive-1000')} />
        </FormItem>
      )}
    />
  );
};

export default ChatFormField;
