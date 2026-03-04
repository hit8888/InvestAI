import { FilterType, PageTypeProps, usageCountFilterValues } from '@neuraltrade/core/types/admin/filters';
import { useState } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD } from '../../utils/constants';
import MessageCountInput from './MessageCountInput';

const UsageCountFilterContent = ({ page }: PageTypeProps) => {
  const { UsageCount } = FilterType;
  const filters = useAllFilterStore();
  const storedUsageCount = filters[page].usageCount;
  const [value, setValue] = useState<usageCountFilterValues>(storedUsageCount);

  const updateFilter = (newValue: usageCountFilterValues) => {
    setValue(newValue);
    filters.setFilter(page, UsageCount, newValue);
  };

  const handleClear = (field: keyof usageCountFilterValues) => {
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

export default UsageCountFilterContent;
