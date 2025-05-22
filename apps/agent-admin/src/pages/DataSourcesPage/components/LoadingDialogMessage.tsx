import Typography from '@breakout/design-system/components/Typography/index';
import { useDataSources } from '../../../context/DataSourcesContext';
import { DIALOG_LOADING_MESSAGE_MAPPED_OBJECT } from '../constants';

interface LoadingDialogMessageProps {
  progress?: number;
}

const LoadingDialogMessage = ({ progress = 0 }: LoadingDialogMessageProps) => {
  const { selectedType } = useDataSources();
  const loadingMessage =
    DIALOG_LOADING_MESSAGE_MAPPED_OBJECT[selectedType as keyof typeof DIALOG_LOADING_MESSAGE_MAPPED_OBJECT];

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 py-8">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full bg-primary transition-all duration-200 ease-in-out" style={{ width: `${progress}%` }} />
      </div>
      <Typography variant="body-16" className="animate-pulse text-center text-customSecondaryText">
        {loadingMessage}
      </Typography>
    </div>
  );
};

export default LoadingDialogMessage;
