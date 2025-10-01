import Typography from '@breakout/design-system/components/Typography/index';

interface LoadingDialogMessageProps {
  progress?: number;
  message?: string;
}

const LoadingDialogMessage = ({ progress = 0, message }: LoadingDialogMessageProps) => {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 py-8">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full bg-primary transition-all duration-200 ease-in-out" style={{ width: `${progress}%` }} />
      </div>
      <Typography variant="body-16" className="animate-pulse text-center text-customSecondaryText">
        {message}
      </Typography>
    </div>
  );
};

export default LoadingDialogMessage;
