import { Switch } from '@breakout/design-system/components/layout/switch';

type IProps = {
  isSelected: boolean;
  handleSingleCheckboxToggle: (value: string) => void;
};

const SelectAllToggleButton = ({ isSelected, handleSingleCheckboxToggle }: IProps) => {
  const handleSwitchChange = (value: boolean) => {
    if (value) {
      handleSingleCheckboxToggle('select-all');
    } else {
      handleSingleCheckboxToggle('');
    }
  };

  return (
    <div className="flex w-full items-center justify-between border-b border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <span className="text-2xl">🌍</span>
        <span className="text-lg text-gray-900">Select all</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <Switch
          checked={isSelected}
          onCheckedChange={handleSwitchChange}
          className="transition-colors data-[state=unchecked]:border-gray-200 data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-100"
        />
      </div>
    </div>
  );
};

export default SelectAllToggleButton;
