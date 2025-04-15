import { Checkbox } from '../../Checkbox';
import { OptionType } from './types';

export const MultiSelectOptionCheckbox = ({
  option,
  isSelected,
  onCheckboxToggle,
}: {
  option: OptionType;
  isSelected: boolean;
  onCheckboxToggle: (option: OptionType, isSelected: boolean) => void;
}) => {
  const labelClassNames = isSelected ? 'border-gray-400 ring-4 ring-gray-300' : '';

  return (
    <label
      className={`flex w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 transition-all duration-200 hover:border-gray-400 ${labelClassNames}`}
    >
      <Checkbox checked={isSelected} onCheckedChange={() => onCheckboxToggle(option, !isSelected)} />
      <span className="ml-2">{option.value}</span>
    </label>
  );
};
