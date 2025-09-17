import ErrorToastIcon from '../icons/source-toast-error-icon';
import Typography from '../Typography';
import toast from 'react-hot-toast';

type IProps = {
  title: string;
  position?: 'top-center' | 'bottom-center';
  duration?: number;
};

const ErrorToastMessage = ({ title, position = 'bottom-center', duration = 5000 }: IProps) => {
  const getToast = () => {
    return (
      <div className="success-toast-shadow flex items-center gap-4 rounded-xl border border-gray-300 bg-gray-50 px-2.5 py-1">
        <ErrorToastIcon width={'18'} height={'18'} className="text-destructive-1000" />
        <Typography variant="label-14-medium" textColor="default">
          {title}
        </Typography>
      </div>
    );
  };
  return toast.custom(getToast(), {
    position,
    duration,
  });
};

export default ErrorToastMessage;
