import { FilterType, PageTypeProps, userMessagesCountFilterValues } from '@neuraltrade/core/types/admin/filters';
import { useState } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD } from '../../utils/constants';
import MessageCountInput from './MessageCountInput';

const UserMessagesCountFilterContent = ({ page }: PageTypeProps) => {
  const { UserMessagesCount } = FilterType;
  const filters = useAllFilterStore();
  const storedMessagesCount = filters[page].userMessagesCount;
  const [value, setValue] = useState<userMessagesCountFilterValues>(storedMessagesCount);

  const updateFilter = (newValue: userMessagesCountFilterValues) => {
    setValue(newValue);
    filters.setFilter(page, UserMessagesCount, newValue);
  };

  const handleClear = (field: keyof userMessagesCountFilterValues) => {
    updateFilter({ ...value, [field]: field === 'minCount' ? 0 : 100 });
  };

  return (
    <div className="flex w-full gap-4 px-4 pb-4">
      <MessageCountInput
        value={value.minCount}
        onChange={(minCount) => updateFilter({ ...value, minCount })}
        onClear={() => handleClear('minCount')}
        defaultValue={0}
        label="From"
      />
      <MessageCountInput
        value={value.maxCount}
        onChange={(maxCount) => updateFilter({ ...value, maxCount })}
        onClear={() => handleClear('maxCount')}
        defaultValue={100}
        label="To"
        maxValue={USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD}
      />
    </div>
  );
};

export default UserMessagesCountFilterContent;
