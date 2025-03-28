import Input from '@breakout/design-system/components/layout/input';
import { cn } from '@breakout/design-system/lib/cn';
import { useTypewriter } from '@breakout/design-system/hooks/useTypewriter';

interface EntryPointChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showOrb: boolean;
  placeholderText: string;
  shouldInputAutoFocus: boolean;
}

const EntryPointChatInput = ({
  value,
  onChange,
  showOrb,
  placeholderText,
  shouldInputAutoFocus,
}: EntryPointChatInputProps) => {
  return (
    <Input
      autoFocus={shouldInputAutoFocus}
      value={value}
      onChange={onChange}
      className={cn(
        'h-12 w-full min-w-40 border-none text-gray-900 outline-none ring-0 placeholder:text-blueGray-400 focus:ring-0 md:min-w-80',
        {
          'pl-14': showOrb,
        },
      )}
      placeholder={useTypewriter(placeholderText)}
    />
  );
};

export default EntryPointChatInput;
