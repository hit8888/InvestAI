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
import DynamicIcon from '../icons/DynamicIcon';
import DemoFormEmailFieldIcon from '../icons/demoform-email-icon';
import DemoFormNameFieldIcon from '../icons/demoform-name-icon';
import { cn } from '../../lib/cn';

interface IChatFormFieldProps {
  form: UseFormReturnType;
  form_field: FormFieldType;
}

const ChatFormField = (props: IChatFormFieldProps) => {
  const { form, form_field } = props;

  const isPhoneInputField = form_field.field_name === 'phone_number';

  const getIconBasedOnField = () => {
    switch (form_field.field_name) {
      case 'phone_number':
        return <DynamicIcon icon="phone" className="h-3.5 w-3.5 text-primary/60" />;
      case 'email':
        return <DemoFormEmailFieldIcon className="h-3.5 w-3.5 text-primary/60" />;
      case 'name':
        return <DemoFormNameFieldIcon className="h-3.5 w-3.5 text-primary/60" />;
      default:
        return <DynamicIcon icon="check" className="h-3.5 w-3.5 text-primary/60" />;
    }
  };

  return (
    <FormField
      control={form.control}
      name={form_field.field_name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-center gap-2 space-y-0">
          <div className="flex items-center rounded-lg bg-primary/20 p-1">{getIconBasedOnField()}</div>
          <FormControl>
            <div className="relative">
              {isPhoneInputField ? (
                <PhoneInputContainer phoneLabel={form_field.label} field={field} />
              ) : (
                <Input
                  {...field}
                  className="border border-primary/30 bg-white placeholder:text-gray-400 focus:border-2 focus:border-primary/40 focus:ring-0"
                  placeholder={form_field.label}
                  type={getInputType(form_field.data_type)}
                />
              )}
              {form_field.is_required && (
                <span
                  className={cn(
                    'absolute right-[calc(100%-12px)] top-3.5 text-[10px] font-medium text-destructive-1000',
                    {
                      'right-[calc(100%-68px)]': isPhoneInputField,
                    },
                  )}
                >
                  *
                </span>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ChatFormField;
