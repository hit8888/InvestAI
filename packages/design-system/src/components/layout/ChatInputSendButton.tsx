import SendIcon from '@breakout/design-system/components/icons/send';
import Button from '../Button';
import { cn } from '@breakout/design-system/lib/cn';
import { useIsMobile } from '@neuraltrade/core/contexts/DeviceManagerProvider';
import { useMemo } from 'react';

interface SendButtonProps {
  showButton: boolean;
  btnType?: 'submit' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  btnClassName?: string;
  invertTextColor?: boolean;
}

const ChatInputSendButton = ({
  showButton,
  onClick,
  btnType = 'button',
  disabled,
  btnClassName,
  invertTextColor,
}: SendButtonProps) => {
  const isMobile = useIsMobile();

  const getButtonVariant = useMemo(() => {
    if (isMobile) return 'tertiary';
    if (invertTextColor) return 'inverted_primary';
    return 'primary';
  }, [isMobile, invertTextColor]);

  if (!showButton) return null;

  return (
    <Button
      buttonStyle="icon"
      variant={getButtonVariant}
      className={cn([btnClassName, disabled && 'disabled:pointer-events-auto disabled:cursor-pointer'])}
      type={btnType}
      onClick={onClick}
      disabled={disabled}
    >
      <SendIcon
        className={cn(['text-primary-foreground', invertTextColor && 'text-black', isMobile && 'text-primary'])}
      />
    </Button>
  );
};

export default ChatInputSendButton;
