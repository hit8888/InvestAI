import DownloadBtnLabelIcon from '@breakout/design-system/components/icons/download-btnlabel-icon';
import ClearAllIcon from '@breakout/design-system/components/icons/clear-all-icon';
import { COMMON_SMALL_ICON_PROPS } from '../../utils/constants';
import { cn } from '@breakout/design-system/lib/cn';

type ExportDownloadButtonProps = {
  id?: string;
  isClearAllBtn?: boolean;
  showIcon?: boolean;
  btnLabel: string;
  onBtnClicked: () => void;
  isDisabled?: boolean;
};

const FooterButton = ({
  id,
  isClearAllBtn = false,
  showIcon = false,
  btnLabel,
  onBtnClicked,
  isDisabled = false,
}: ExportDownloadButtonProps) => {
  return (
    <button
      id={id}
      type="button"
      aria-label="Export Download Button"
      name="export-download-button"
      className={cn(
        `flex items-center justify-center rounded-lg p-3
        transition-colors
        duration-200 hover:bg-primary/10 focus:bg-primary/20
        focus:outline-none`,
        {
          'border-2 border-primary': !isClearAllBtn,
          'cursor-not-allowed': isDisabled,
        },
      )}
      onClick={onBtnClicked}
      disabled={isDisabled}
    >
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-primary">{btnLabel}</p>
        {showIcon ? (
          isClearAllBtn ? (
            <ClearAllIcon {...COMMON_SMALL_ICON_PROPS} />
          ) : (
            <DownloadBtnLabelIcon {...COMMON_SMALL_ICON_PROPS} />
          )
        ) : null}
      </div>
    </button>
  );
};

export default FooterButton;
