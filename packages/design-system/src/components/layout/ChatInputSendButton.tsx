import SendIcon from '@breakout/design-system/components/icons/send';
import Button from './button';
import { cn } from '@breakout/design-system/lib/cn';

interface SendButtonProps {
  showButton: boolean;
  btnType?: 'submit' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  btnClassName?: string;
}

const ChatInputSendButton = ({ showButton, onClick, btnType = 'button', disabled, btnClassName }: SendButtonProps) => {
  if (!showButton) return null;

  return (
    <Button size="icon" className={cn('', btnClassName)} type={btnType} onClick={onClick} disabled={disabled}>
      <SendIcon className="text-primary-foreground" />
    </Button>
  );
};

export default ChatInputSendButton;
