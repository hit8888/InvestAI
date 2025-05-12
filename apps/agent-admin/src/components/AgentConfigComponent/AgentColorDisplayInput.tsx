import { useState } from 'react';
import Input from '@breakout/design-system/components/layout/input';

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

interface AgentColorDisplayInputProps {
  initialColor?: string | null;
  onColorBlur?: (color: string) => Promise<void> | void;
}

const AgentColorDisplayInput: React.FC<AgentColorDisplayInputProps> = ({ initialColor, onColorBlur }) => {
  const [color, setColor] = useState<string>(initialColor ?? '#000000');
  const [isValid, setIsValid] = useState(true);
  const [showError, setShowError] = useState(false);

  const validateColor = (value: string) => {
    return HEX_COLOR_REGEX.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    const valid = validateColor(newColor);
    setIsValid(valid);
    setShowError(!valid);
  };

  const handleFocus = () => {
    setShowError(false);
  };

  const handleBlur = async () => {
    const valid = validateColor(color);
    setIsValid(valid);
    setShowError(!valid);
    if (valid && onColorBlur) {
      await onColorBlur(color);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-1 items-center gap-4 rounded-lg border border-gray-300 bg-white py-3 pl-2.5 pr-2">
        <div
          className="rounded border border-gray-100"
          style={{
            width: 24,
            height: 24,
            background: isValid ? color : '#E0E0E0',
            transition: 'background 0.2s',
          }}
        />
        <Input
          className={`h-5 w-40 border-none bg-transparent pl-0 text-sm outline-none focus:ring-0 ${isValid ? 'text-gray-800' : 'text-red-500'}`}
          value={color}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={7}
          spellCheck={false}
        />
      </div>
      {showError && (
        <span className="w-52 text-xs text-red-500">Please enter a valid hex color code (e.g. #000000, #000)</span>
      )}
    </div>
  );
};

export default AgentColorDisplayInput;
