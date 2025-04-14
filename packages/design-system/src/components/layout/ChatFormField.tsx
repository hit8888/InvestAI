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

interface IChatFormFieldProps {
  form: UseFormReturnType;
  form_field: FormFieldType;
  isArtifactFormFilled: boolean;
}

// Helper function to generate label with asterisk for required fields
const getLabelWithRequiredIndicator = (label: string, isRequired: boolean): string => {
  return `${label}${isRequired ? '*' : ''}`;
};

const ChatFormField = (props: IChatFormFieldProps) => {
  const { form, form_field, isArtifactFormFilled } = props;

  const isPhoneInputField = form_field.field_name === 'phone';

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
                  className="border border-gray-300 bg-white placeholder:text-gray-400 focus:border-gray-400 focus:ring-0"
                  placeholder={getLabelWithRequiredIndicator(form_field.label, form_field.is_required)}
                  type={getInputType(form_field.data_type)}
                />
              )}
            </FormControl>
          </div>
          <FormMessage className="font-medium text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default ChatFormField;
