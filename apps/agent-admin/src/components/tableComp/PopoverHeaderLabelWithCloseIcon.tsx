import { PopoverClose } from '@breakout/design-system/components/Popover/index';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import { COMMON_ICON_PROPS } from '../../utils/constants';

type IProps = {
  headerLabel: string;
  onClose?: () => void;
};
const PopoverHeaderLabelWithCloseIcon = ({ headerLabel, onClose }: IProps) => {
  return (
    <div className="flex w-full items-start justify-between px-4 py-3">
      <p className="text-lg font-semibold text-gray-900">{headerLabel}</p>
      <PopoverClose onClick={onClose}>
        <CrossIcon className="cursor-pointer" {...COMMON_ICON_PROPS} />
      </PopoverClose>
    </div>
  );
};

export default PopoverHeaderLabelWithCloseIcon;
