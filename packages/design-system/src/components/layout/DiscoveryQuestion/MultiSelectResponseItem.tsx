import { MultiSelectOptionCheckbox } from './MultiSelectOptionCheckbox';
import { MultiSelectOptionTextBox } from './MultiSelectOptionTextBox';
import { OptionType } from './types';

export const MultiSelectResponseOption = ({
  option,
  isSelected,
  onSelectionChange,
  inputText,
  onTextChange,
}: {
  option: OptionType;
  isSelected: boolean;
  onSelectionChange: (option: OptionType, isSelected: boolean) => void;
  inputText: string;
  onTextChange: (text: string) => void;
}) => {
  switch (option.type) {
    case 'string':
      return <MultiSelectOptionCheckbox option={option} isSelected={isSelected} onCheckboxToggle={onSelectionChange} />;
    case 'text_box':
      return <MultiSelectOptionTextBox option={option} inputText={inputText} onTextChange={onTextChange} />;
    default:
      return null;
  }
};
