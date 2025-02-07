import { cn } from '@breakout/design-system/lib/cn';
import FooterButton from './FooterButton';

type IProps = {
  primaryBtnLabel: string;
  onPrimaryBtnClicked: () => void;
  isPrimaryBtnClearAll?: boolean;
  isDisabled?: boolean;
};
const CustomFooterWithButtons = ({
  isDisabled,
  primaryBtnLabel,
  onPrimaryBtnClicked,
  isPrimaryBtnClearAll = false,
}: IProps) => {
  return (
    <div
      className={cn('flex items-start justify-start self-stretch border-t border-solid border-gray-200 p-4', {
        'opacity-50': isDisabled,
      })}
    >
      <FooterButton
        showIcon={true}
        isClearAllBtn={isPrimaryBtnClearAll}
        btnLabel={primaryBtnLabel}
        onBtnClicked={onPrimaryBtnClicked}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default CustomFooterWithButtons;
