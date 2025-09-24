import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { cn } from '../../lib/cn';

type PopoverWrapperProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  showPositionArrow?: boolean;
  isOpen: boolean;
  contentClassname?: string;
  alignOffset?: number;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PopoverWrapper = ({
  trigger,
  children,
  showPositionArrow = false,
  isOpen,
  setIsOpen,
  contentClassname,
  alignOffset = -10,
  align = 'start',
  side = 'right',
}: PopoverWrapperProps) => {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className="focus:ring-none hover:bg-transparent focus:bg-transparent focus:bg-none focus-visible:outline-none active:outline-none"
        asChild
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'multi-select-dropdown-shadow relative z-50 min-w-[16rem] max-w-[20rem] rounded-lg bg-white p-0',
          contentClassname,
        )}
        side={side}
        sideOffset={showPositionArrow ? 40 : 24}
        alignOffset={alignOffset}
        align={align}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {showPositionArrow ? <DropdownPositionArrowIcon className="absolute -left-3 top-6 z-[99]" /> : null}
        {children}
      </PopoverContent>
    </Popover>
  );
};

type Props = React.SVGProps<SVGSVGElement>;

const DropdownPositionArrowIcon = ({ className = '' }: Props) => {
  return (
    <svg className={cn('', className)} xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18">
      <path
        d="M1 10.7321C-0.333333 9.96225 -0.333333 8.03775 1 7.26795L13 0.339746C14.3333 -0.430054 16 0.532197 16 2.0718L16 15.9282C16 17.4678 14.3333 18.4301 13 17.6603L1 10.7321Z"
        fill="white"
      />
    </svg>
  );
};

export default PopoverWrapper;
