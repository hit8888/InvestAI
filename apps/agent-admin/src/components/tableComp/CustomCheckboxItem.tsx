import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import {
  isOptionChecked,
  getToggleValue,
  getOptionKey,
  type CheckboxValue,
  type CheckboxOption,
} from '../../utils/checkboxUtils';

interface CheckboxItemProps {
  option: CheckboxOption;
  selectedCheckboxes: CheckboxValue[];
  handleCheckboxToggle: (value: CheckboxValue) => void;
  checkboxPosition?: 'left' | 'right';
  renderLabel?: (label: string, value?: CheckboxValue) => React.ReactNode;
}

const CustomCheckboxItem = ({
  option,
  selectedCheckboxes,
  handleCheckboxToggle,
  checkboxPosition = 'left', // 'left' or 'right'
  renderLabel = (label) => <p className="text-base font-normal text-gray-900">{label}</p>,
}: CheckboxItemProps) => {
  const isChecked = isOptionChecked(option, selectedCheckboxes);
  const valueForToggle = getToggleValue(option);
  const key = getOptionKey(option);

  const getCheckboxContainer = () => {
    return (
      <div className="cursor-pointer">
        <Checkbox
          haveBlackBackground={false}
          checked={isChecked}
          onChange={() => handleCheckboxToggle(valueForToggle)}
        />
      </div>
    );
  };

  return (
    <div
      key={key}
      onClick={(e) => {
        e.stopPropagation();
        handleCheckboxToggle(valueForToggle);
      }}
      className={`flex w-full flex-1 cursor-pointer items-center gap-4 self-stretch p-4 hover:bg-primary/5 ${
        checkboxPosition === 'right' ? 'justify-between' : ''
      }`}
    >
      {checkboxPosition === 'left' && getCheckboxContainer()}

      {renderLabel('label' in option ? option.label : '', valueForToggle)}

      {checkboxPosition === 'right' && getCheckboxContainer()}
    </div>
  );
};

export default CustomCheckboxItem;
