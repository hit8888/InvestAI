import { OptionType } from './types';

interface MultiSelectOptionTextBoxProps {
  option: OptionType;
  inputText: string;
  isDisabled?: boolean;
  onTextChange: (text: string) => void;
}

export const MultiSelectOptionTextBox = ({
  option,
  inputText,
  onTextChange,
  isDisabled,
}: MultiSelectOptionTextBoxProps) => {
  return (
    <input
      type="text"
      placeholder={option.placeholder}
      value={inputText}
      onChange={(event) => onTextChange(event?.target.value)}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200 hover:border-gray-400 focus:border-gray-400 focus:bg-gray-50 focus:ring-4 focus:ring-gray-200"
      disabled={isDisabled}
    />
  );
};
