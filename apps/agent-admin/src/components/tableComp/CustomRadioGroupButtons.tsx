import { RadioGroup } from '@breakout/design-system/components/shadcn-ui/radio-group';
import RadioButtonWithLabel from './RadioButtonWithLabel';
import { useState } from 'react';
import { SortCategory } from '@meaku/core/types/admin/sort';

interface CustomRadioGroupButtonsProps {
  onCallback: ((value: string) => void) | ((category: SortCategory, value: string) => void);
  radioOptions: Array<{
    value: string;
    label: string;
  }>;
  defaultSelected?: string | null;
  category?: SortCategory;
}

const CustomRadioGroupButtons = ({
  onCallback,
  radioOptions,
  defaultSelected,
  category,
}: CustomRadioGroupButtonsProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(defaultSelected || null);

  const handleRadioOptions = (option: string) => {
    // Toggle selection: if same option is clicked, clear it
    const newValue = option === selectedOption ? null : option;
    setSelectedOption(newValue);
    if (category) {
      (onCallback as (category: SortCategory, value: string | null) => void)(category, newValue);
    } else {
      (onCallback as (value: string | null) => void)(newValue);
    }
  };
  return (
    <RadioGroup
      value={selectedOption || ''}
      onValueChange={handleRadioOptions}
      className="flex flex-col items-start gap-6 self-stretch px-4 py-4"
    >
      {radioOptions.map((option) => (
        <RadioButtonWithLabel
          key={option.value}
          value={option.value}
          radioLabel={option.label}
          isRadioSelected={selectedOption === option.value}
          onClick={() => handleRadioOptions(option.value)}
        />
      ))}
    </RadioGroup>
  );
};

export default CustomRadioGroupButtons;
