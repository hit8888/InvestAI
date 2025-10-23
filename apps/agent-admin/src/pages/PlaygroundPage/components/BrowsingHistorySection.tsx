import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import Button from '@breakout/design-system/components/Button/index';
import Input from '@breakout/design-system/components/layout/input';
import { FormControl, FormField, FormItem } from '@breakout/design-system/components/layout/form';
import { Plus, Trash2 } from 'lucide-react';
import { SettingsFormData } from '../PlaygroundPage';

interface BrowsingHistorySectionProps {
  form: UseFormReturn<SettingsFormData>;
}

const BrowsingHistorySection: React.FC<BrowsingHistorySectionProps> = ({ form }) => {
  const {
    fields: browsingHistoryFields,
    append: appendBrowsingHistory,
    remove: removeBrowsingHistory,
  } = useFieldArray({
    control: form.control,
    name: 'browsingHistory',
  });

  const addBrowsingHistory = () => {
    const nextOrder = Math.max(...browsingHistoryFields.map((f) => f.order), 0) + 1;
    appendBrowsingHistory({
      id: Date.now().toString(),
      url: '',
      order: nextOrder,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">Browsing History</span>
        </div>
      </div>

      <div className="space-y-3">
        {browsingHistoryFields.map((field, index) => (
          <div key={field.id} className="flex items-center">
            <FormField
              control={form.control}
              name={`browsingHistory.${index}.url`}
              render={({ field: urlField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded bg-gray-100">
                        <span className="text-xs font-medium text-gray-400">{field.order}</span>
                      </div>
                      <Input
                        {...urlField}
                        className="h-11 border-gray-300 pl-10 pr-10 focus:border-gray-400 focus:ring-0"
                        placeholder="Enter URL"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="system_tertiary"
              size="small"
              onClick={() => removeBrowsingHistory(index)}
              className="p-2"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="system_tertiary"
          size="small"
          onClick={addBrowsingHistory}
          className="gap-1 justify-self-center"
        >
          Add more
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BrowsingHistorySection;
