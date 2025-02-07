import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import Input from '@breakout/design-system/components/layout/input';
import { Slider } from '@breakout/design-system/components/shadcn-ui/slider';
import { FilterType, PageTypeProps } from '@meaku/core/types/admin/filters';
import { useState } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD } from '../../utils/constants';

const UserMessagesCountFilterContent = ({ page }: PageTypeProps) => {
  const { UserMessagesCount } = FilterType;
  const filters = useAllFilterStore();
  const storedMessagesCount = filters[page].userMessagesCount;
  const [value, setValue] = useState<number | ''>(storedMessagesCount);
  const [sliderValue, setSliderValue] = useState([storedMessagesCount]); // Default Slider value

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;

    // Remove non-numeric characters
    if (!/^\d*$/.test(inputVal)) return;

    // Convert to number and enforce range
    const numericValue: number | '' =
      inputVal === '' ? '' : Math.min(USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD, Math.max(0, Number(inputVal)));

    setValue(numericValue);
    setSliderValue([numericValue || 0]); // Sync slider
    filters.setFilter(page, UserMessagesCount, numericValue);
  };

  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue);
    setValue(newValue[0]); // Sync input
    filters.setFilter(page, UserMessagesCount, newValue[0]);
  };

  const clearValue = () => {
    setValue('');
    setSliderValue([0]);
    filters.setFilter(page, UserMessagesCount, 0);
  };

  return (
    <div className="flex w-full flex-col gap-4 px-4 pb-4">
      {/* Input Field */}
      <div className="flex">
        <Input
          className="h-12 min-w-[400px] rounded-lg border border-gray-300 bg-gray-50 py-3"
          onChange={handleInputChange}
          value={value}
          maxLength={3} // Max length to prevent invalid input
          placeholder="Enter number of messages"
        />
        {value !== '' && (
          <button
            type="button"
            aria-label="clear button"
            className="relative right-8 top-0 flex cursor-pointer items-center justify-center"
            onClick={clearValue}
          >
            <CrossIcon width={'20'} height={'20'} className="text-primary" />
          </button>
        )}
      </div>

      {/* Slider */}
      <div className="flex w-full flex-col gap-3">
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          max={USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD}
          step={1}
        />
        <div className="flex w-full items-center justify-between">
          <span>{0}</span>
          <span>{`+${USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD}`}</span>
        </div>
      </div>
    </div>
  );
};

export default UserMessagesCountFilterContent;
