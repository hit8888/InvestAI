import DownloadBtnLabelIcon from '@breakout/design-system/components/icons/download-btnlabel-icon';

type ExportDownloadButtonProps = {
  btnLabel: string;
  onDownloadBtnClicked: () => void;
};

const ExportDownloadButton = ({ btnLabel, onDownloadBtnClicked }: ExportDownloadButtonProps) => {
  return (
    <button
      type="button"
      aria-label="export-download-button"
      name="export-download-button"
      className="flex flex-[1_0_0] items-center justify-center rounded-lg border-2 border-[rgb(var(--primary-foreground)/0.24)] bg-primary p-3"
      onClick={onDownloadBtnClicked}
    >
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-white">{btnLabel}</p>
        <DownloadBtnLabelIcon width={'16'} height={'16'} color="white" viewBox="0 0 16 16" />
      </div>
    </button>
  );
};

export default ExportDownloadButton;
