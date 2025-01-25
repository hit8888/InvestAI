import { cn } from '@breakout/design-system/lib/cn';
import FooterButton from './FooterButton';

type IProps = {
  primaryBtnLabel?: string;
  secondaryBtnLabel: string;
  onPrimaryBtnClicked?: () => void;
  onSecondaryBtnClicked: () => void;
  isSecondaryBtnClearAll?: boolean;
  isDisabled?: boolean;
};
const CustomFooterWithButtons = ({
  isDisabled,
  primaryBtnLabel,
  secondaryBtnLabel,
  onPrimaryBtnClicked,
  onSecondaryBtnClicked,
  isSecondaryBtnClearAll = false,
}: IProps) => {
  const areTwoBtns = !!primaryBtnLabel && !!onPrimaryBtnClicked;
  return (
    <div
      className={cn('flex items-start justify-end self-stretch border-t border-solid border-gray-200 p-4', {
        'justify-between': areTwoBtns,
        'opacity-50': isDisabled,
      })}
    >
      {areTwoBtns && (
        <FooterButton
          showIcon={areTwoBtns}
          isClearAllBtn={areTwoBtns}
          btnLabel={primaryBtnLabel}
          onBtnClicked={onPrimaryBtnClicked}
          isDisabled={isDisabled}
        />
      )}
      <FooterButton
        showIcon={!areTwoBtns}
        isClearAllBtn={isSecondaryBtnClearAll}
        btnLabel={secondaryBtnLabel}
        onBtnClicked={onSecondaryBtnClicked}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default CustomFooterWithButtons;
