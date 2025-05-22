import { MultiSelectOptionCheckbox } from './MultiSelectOptionCheckbox';
import { MultiSelectOptionTextBox } from './MultiSelectOptionTextBox';
import { OptionType } from './types';

interface MultiSelectResponseOptionProps {
  option: OptionType;
  isSelected: boolean;
  onSelectionChange: (option: OptionType, isSelected: boolean) => void;
  inputText: string;
  onTextChange: (text: string) => void;
  disabled?: boolean;
}

export const MultiSelectResponseOption = ({
  option,
  isSelected,
  onSelectionChange,
  inputText,
  onTextChange,
  disabled,
}: MultiSelectResponseOptionProps) => {
  switch (option.type) {
    case 'string':
      return (
        <MultiSelectOptionCheckbox
          option={option}
          isSelected={isSelected}
          onCheckboxToggle={onSelectionChange}
          isDisabled={disabled}
        />
      );
    case 'text_box':
      return (
        <MultiSelectOptionTextBox
          option={option}
          inputText={inputText}
          onTextChange={onTextChange}
          isDisabled={disabled}
        />
      );
    default:
      return null;
  }
};
