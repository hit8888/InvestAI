import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import Button from '@breakout/design-system/components/Button/index';
import Input from '@breakout/design-system/components/layout/input';
import { FormControl, FormField, FormItem, FormLabel } from '@breakout/design-system/components/layout/form';
import { Plus, Trash2 } from 'lucide-react';
import ArcArrowHeadIcon from '@breakout/design-system/components/icons/arc-arrow-head-icon';
import ArcVerticalIcon from '@breakout/design-system/components/icons/arc-vertical-icon';
import ArcCircleHeadIcon from '@breakout/design-system/components/icons/arc-circle-head-icon';
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
    <div className="ml-2 mt-5">
      <FormLabel className="ml-7 text-xs font-medium text-gray-500">Previously visited pages</FormLabel>
      {browsingHistoryFields.map((field, index) => (
        <div className="relative duration-300 animate-in fade-in slide-in-from-bottom-2" key={field.id}>
          {index === 0 && (
            <ArcArrowHeadIcon
              className="absolute -left-0.5 -top-11 duration-300 animate-in fade-in zoom-in-50"
              width={6}
              height={6}
            />
          )}
          <ArcVerticalIcon className="absolute -top-10 left-0 duration-500 animate-in fade-in" width={17} height={64} />
          <ArcCircleHeadIcon
            className="absolute left-4 top-5 delay-75 duration-300 animate-in fade-in zoom-in-75"
            width={6}
            height={6}
          />
          <div className="ml-6 flex items-center pb-3">
            <FormField
              control={form.control}
              name={`browsingHistory.${index}.url`}
              render={({ field: urlField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded bg-gray-100">
                        <span className="text-xs font-medium text-gray-400">
                          {browsingHistoryFields.length - index}
                        </span>
                      </div>
                      <Input
                        {...urlField}
                        id={`playground-browsing-history-${index}-url-input`}
                        className="h-11 border-gray-300 pl-10 pr-10 focus:border-gray-400 focus:ring-0"
                        placeholder="Enter URL"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              id={`playground-browsing-history-${index}-delete-button`}
              type="button"
              variant="system_tertiary"
              size="small"
              onClick={() => removeBrowsingHistory(index)}
              className="p-2"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        id="playground-browsing-history-add-button"
        type="button"
        variant="system_tertiary"
        size="small"
        onClick={addBrowsingHistory}
        className="mt-3 gap-1 justify-self-center"
      >
        {browsingHistoryFields.length < 1 ? 'Add' : 'Add more'}
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BrowsingHistorySection;
