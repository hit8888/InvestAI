import { Checkbox } from '@breakout/design-system/components/Checkbox/index';

interface Option {
  value: string;
  label: string;
}

interface CheckboxItemProps {
  option: Option;
  selectedCheckboxes: string[];
  handleCheckboxToggle: (value: string) => void;
  checkboxPosition?: 'left' | 'right';
  renderLabel?: (label: string) => React.ReactNode;
}

const CustomCheckboxItem = ({
  option,
  selectedCheckboxes,
  handleCheckboxToggle,
  checkboxPosition = 'left', // 'left' or 'right'
  renderLabel = (label) => <p className="text-base font-normal text-gray-900">{label}</p>,
}: CheckboxItemProps) => {
  const isChecked = selectedCheckboxes.includes(option.value);

  const getCheckboxContainer = () => {
    return (
      <div className="cursor-pointer">
        <Checkbox checked={isChecked} onChange={() => handleCheckboxToggle(option.value)} />
      </div>
    );
  };

  return (
    <div
      key={option.value}
      onClick={(e) => {
        e.stopPropagation();
        handleCheckboxToggle(option.value);
      }}
      className={`flex w-full flex-1 cursor-pointer items-center gap-4 self-stretch p-4 hover:bg-primary/5 ${
        checkboxPosition === 'right' ? 'justify-between' : ''
      }`}
    >
      {checkboxPosition === 'left' && getCheckboxContainer()}

      {renderLabel(option.label)}

      {checkboxPosition === 'right' && getCheckboxContainer()}
    </div>
  );
};

export default CustomCheckboxItem;
