import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import Button from '@breakout/design-system/components/Button/index';
import Input from '@breakout/design-system/components/layout/input';
import { FormControl, FormField, FormItem, FormLabel } from '@breakout/design-system/components/layout/form';
import { Plus, Trash2 } from 'lucide-react';
import { SettingsFormData } from '../PlaygroundPage';

interface UtmParametersSectionProps {
  form: UseFormReturn<SettingsFormData>;
}

const UtmParametersSection: React.FC<UtmParametersSectionProps> = ({ form }) => {
  const {
    fields: utmFields,
    append: appendUtm,
    remove: removeUtm,
  } = useFieldArray({
    control: form.control,
    name: 'utmParameters',
  });

  const addUtmParameter = () => {
    appendUtm({
      id: Date.now().toString(),
      key: '',
      value: '',
    });
  };

  return (
    <div className="space-y-3">
      <FormLabel className="text-sm font-medium text-gray-900">UTM Parameters</FormLabel>

      <div className="space-y-3">
        {utmFields.map((field, index) => (
          <div key={field.id} className="flex items-center">
            <FormField
              control={form.control}
              name={`utmParameters.${index}.key`}
              render={({ field: keyField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...keyField}
                      id={`playground-utm-${index}-key-input`}
                      className="h-11 border-gray-300 focus:border-gray-400 focus:ring-0"
                      placeholder="Parameter key"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`utmParameters.${index}.value`}
              render={({ field: valueField }) => (
                <FormItem className="ml-3 flex-1">
                  <FormControl>
                    <Input
                      {...valueField}
                      id={`playground-utm-${index}-value-input`}
                      className="h-11 border-gray-300 focus:border-gray-400 focus:ring-0"
                      placeholder="Parameter value"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              id={`playground-utm-${index}-delete-button`}
              type="button"
              variant="system_tertiary"
              size="small"
              onClick={() => removeUtm(index)}
              className="p-2"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}

        <Button
          id="playground-utm-add-button"
          type="button"
          variant="system_tertiary"
          size="small"
          onClick={addUtmParameter}
          className="gap-1 justify-self-center"
        >
          {utmFields.length < 1 ? 'Add' : 'Add more'}
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UtmParametersSection;
