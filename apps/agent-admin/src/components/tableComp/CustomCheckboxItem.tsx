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
          // Prevent the checkbox from handling its own events
          // We want the parent div to handle all interactions
          onCheckedChange={() => {}}
        />
      </div>
    );
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCheckboxToggle(valueForToggle);
  };

  return (
    <div
      key={key}
      // Handle both click (physical press) and touch events (tap to click)
      onClick={handleInteraction}
      onTouchEnd={handleInteraction}
      // Handle mouse down for immediate feedback
      onMouseDown={(e) => {
        // Only prevent default for mouse down, don't trigger the toggle here
        e.preventDefault();
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
