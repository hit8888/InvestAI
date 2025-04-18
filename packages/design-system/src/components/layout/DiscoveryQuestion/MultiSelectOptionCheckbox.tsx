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
  const labelClassNames = isSelected ? 'border-gray-400 ring-4 ring-gray-200' : '';
  const checkBoxClassNames = isSelected ? '' : 'border-gray-400';

  return (
    <label
      className={`flex w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white p-[10px] px-4 transition-all duration-200 hover:border-gray-400 hover:bg-gray-25 ${labelClassNames}`}
    >
      <Checkbox
        checked={isSelected}
        className={`flex h-4 w-4 items-center justify-center border-gray-900 hover:border-gray-900 ${checkBoxClassNames}`}
        onCheckedChange={() => onCheckboxToggle(option, !isSelected)}
      />
      <span className="ml-2 text-sm font-medium text-customPrimaryText">{option.value}</span>
    </label>
  );
};
