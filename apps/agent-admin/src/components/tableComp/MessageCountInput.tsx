import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import Input from '@breakout/design-system/components/layout/input';

interface MessageCountInputProps {
  value: number;
  onChange: (value: number) => void;
  onClear: () => void;
  defaultValue: number;
  maxValue?: number;
  label: string;
}

const MessageCountInput = ({ value, onChange, onClear, defaultValue, maxValue, label }: MessageCountInputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    if (!/^\d*$/.test(inputVal)) return;

    const numericValue: number = inputVal === '' ? 0 : Number(inputVal);
    const validValue = maxValue
      ? Math.min(maxValue, Math.max(0, numericValue))
      : Math.max(0, numericValue >= 100 ? 0 : numericValue);

    onChange(validValue);
  };

  return (
    <div className="flex w-full flex-col items-start gap-1">
      <span className="pl-4 text-xs font-medium text-primary">{label}</span>
      <div className="flex">
        <Input
          className="h-12 min-w-[180px] rounded-lg border border-gray-300 bg-gray-50 py-3"
          onChange={handleInputChange}
          value={value}
          maxLength={3}
          placeholder="Enter number of messages"
        />
        {value !== defaultValue && (
          <button
            type="button"
            aria-label="clear button"
            className="relative right-8 top-0 flex cursor-pointer items-center justify-center"
            onClick={onClear}
          >
            <CrossIcon width={'20'} height={'20'} className="text-primary" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageCountInput;
