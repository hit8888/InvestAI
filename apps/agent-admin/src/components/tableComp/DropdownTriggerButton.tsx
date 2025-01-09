import { JSX, RefObject } from 'react';
import DropdownIcon from '@breakout/design-system/components/icons/dropdown-icon';
import { DROPDOWN_ARROW_ICONS } from '../../utils/constants';
import { cn } from '@breakout/design-system/lib/cn';

type IProps = {
  btnLabel: string | JSX.Element;
  btnRef?: RefObject<HTMLButtonElement | null>;
  onToggleDropdown: () => void;
  staticValue?: string;
  btnID?: string;
  isDropdownOpen: boolean;
};

const DropdownTriggerButton = ({
  btnRef,
  btnLabel,
  btnID = 'dropdown-trigger-button',
  staticValue,
  isDropdownOpen,
  onToggleDropdown,
}: IProps) => {
  const isTypeOfBtnLabelString = typeof btnLabel === 'string';
  return (
    <button
      type="button"
      ref={btnRef}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg 
        border border-primary/20 bg-primary/2.5 p-2 text-sm font-semibold text-gray-500 shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-primary/60"
      id={btnID}
      onClick={onToggleDropdown} // Toggle dropdown visibility
      aria-expanded={isDropdownOpen ? 'true' : 'false'}
      aria-label={btnID}
    >
      {btnLabel}
      {staticValue ? <span className="font-normal">{staticValue}</span> : null}
      {isTypeOfBtnLabelString ? (
        <span
          className={cn('h-5 w-5', {
            'rotate-0': !isDropdownOpen,
            'translate-x-1 translate-y-1 rotate-180': isDropdownOpen,
          })}
        >
          <DropdownIcon {...DROPDOWN_ARROW_ICONS} />
        </span>
      ) : null}
    </button>
  );
};

export default DropdownTriggerButton;
