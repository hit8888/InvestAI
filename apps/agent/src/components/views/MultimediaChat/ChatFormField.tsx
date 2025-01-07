import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturnType,
} from '@breakout/design-system/components/layout/form';
import { FormFieldType } from '@meaku/core/types/agent';
import Input from '@breakout/design-system/components/layout/input';
import { getInputType } from '../../../utils/form_fields.ts';

interface IChatFormFieldProps {
  form: UseFormReturnType;
  form_field: FormFieldType;
}

const ChatFormField = (props: IChatFormFieldProps) => {
  const { form, form_field } = props;

  return (
    <FormField
      control={form.control}
      name={form_field.field_name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{form_field.label}</FormLabel>
          <FormControl>
            <Input {...field} type={getInputType(form_field.data_type)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ChatFormField;
