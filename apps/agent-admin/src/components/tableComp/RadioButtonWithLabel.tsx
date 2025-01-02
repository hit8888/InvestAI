import RadioClickedIcon from '@breakout/design-system/components/icons/radio-clicked-icon';
import RadioDefaultIcon from '@breakout/design-system/components/icons/radio-default-icon';
import { EXPORT_DOWNLOAD_ICONS } from '../../utils/constants';

type RadioButtonWithLabelProps = {
  radioLabel: string;
  isRadioSelected: boolean;
  onRadioClicked: () => void;
};

const RadioButtonWithLabel = ({ radioLabel, isRadioSelected, onRadioClicked }: RadioButtonWithLabelProps) => {
  return (
    <div className="flex items-start gap-4" onClick={onRadioClicked}>
      {isRadioSelected ? (
        <RadioClickedIcon {...EXPORT_DOWNLOAD_ICONS} />
      ) : (
        <RadioDefaultIcon {...EXPORT_DOWNLOAD_ICONS} />
      )}
      <p className="cursor-pointer text-base font-normal text-gray-900">{radioLabel}</p>
    </div>
  );
};

export default RadioButtonWithLabel;
