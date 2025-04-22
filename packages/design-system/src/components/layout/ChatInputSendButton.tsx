import SendIcon from '@breakout/design-system/components/icons/send';
import Button from '../Button';
import { cn } from '@breakout/design-system/lib/cn';

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
  if (!showButton) return null;

  return (
    <Button
      buttonStyle="icon"
      variant={invertTextColor ? 'inverted_primary' : 'primary'}
      className={cn('', btnClassName, {
        'disabled:pointer-events-auto disabled:cursor-pointer': disabled,
      })}
      type={btnType}
      onClick={onClick}
      disabled={disabled}
    >
      <SendIcon
        className={cn('text-primary-foreground', {
          'text-black': invertTextColor,
        })}
      />
    </Button>
  );
};

export default ChatInputSendButton;
