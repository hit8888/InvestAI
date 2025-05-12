import { cn } from '../../lib/cn';
import ErrorToastIcon from '../icons/source-toast-error-icon';
import Typography from '../Typography';
type IProps = {
  title: string;
};
const ErrorToastMessage = ({ title }: IProps) => {
  return (
    <div
      className={cn(
        'success-toast-shadow flex items-center gap-4 rounded-xl border border-gray-300 bg-gray-50 px-2.5 py-1',
      )}
    >
      <ErrorToastIcon width={'18'} height={'18'} className="text-destructive-1000" />
      <Typography variant="label-14-medium" textColor="default">
        {title}
      </Typography>
    </div>
  );
};

export default ErrorToastMessage;
