import RadioClickedIcon from '@breakout/design-system/components/icons/radio-clicked-icon';
import RadioDefaultIcon from '@breakout/design-system/components/icons/radio-default-icon';
import { COMMON_ICON_PROPS } from '../../utils/constants';

import { RadioGroupItem } from '@breakout/design-system/components/shadcn-ui/radio-group';
import { cn } from '@breakout/design-system/lib/cn';

type RadioButtonWithLabelProps = {
  radioLabel: string;
  isRadioSelected: boolean;
  value: string;
  onClick: () => void;
};

// the RadioIndicator only renders when the radio is selected
// (that's its default behavior from Radix UI).
const RadioButtonWithLabel = ({ radioLabel, isRadioSelected, value, onClick }: RadioButtonWithLabelProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="relative flex items-center">
        <RadioGroupItem
          value={value}
          id={value}
          checked={isRadioSelected}
          className={cn('!h-6 !w-6 !border-0 !p-0 !shadow-none', 'cursor-pointer hover:!bg-transparent')}
          onClick={onClick}
        >
          {isRadioSelected ? <RadioClickedIcon {...COMMON_ICON_PROPS} /> : <RadioDefaultIcon {...COMMON_ICON_PROPS} />}
        </RadioGroupItem>
      </div>
      <label htmlFor={value} className="cursor-pointer text-base font-normal text-gray-900">
        {radioLabel}
      </label>
    </div>
  );
};

export default RadioButtonWithLabel;
