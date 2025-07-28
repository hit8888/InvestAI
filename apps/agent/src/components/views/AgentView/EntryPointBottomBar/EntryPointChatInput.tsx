import Input from '@breakout/design-system/components/layout/input';
import { cn } from '@breakout/design-system/lib/cn';
import { useTypewriter } from '@breakout/design-system/hooks/useTypewriter';
import { useMessageStore } from '../../../../stores/useMessageStore';

interface EntryPointChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showOrb: boolean;
  placeholderText: string;
  shouldInputAutoFocus: boolean;
  disabled: boolean;
}

const EntryPointChatInput = ({
  value,
  onChange,
  showOrb,
  placeholderText,
  shouldInputAutoFocus,
  disabled,
}: EntryPointChatInputProps) => {
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  return (
    <Input
      autoFocus={shouldInputAutoFocus}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        'h-12 w-full border-none text-gray-900 outline-none ring-0 placeholder:text-blueGray-400 focus:ring-0 ',
        {
          'pl-14': showOrb,
          'md:min-w-80 xs:min-w-40': !hasFirstUserMessageBeenSent,
        },
      )}
      placeholder={useTypewriter(placeholderText)}
    />
  );
};

export default EntryPointChatInput;
