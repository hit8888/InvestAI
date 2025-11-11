import Typography from '../Typography';
import toast, { Toast } from 'react-hot-toast';
import PopupCloseIcon from '../icons/popup-close-icon';
import SpinLoader from './SpinLoader';

type IProps = {
  title: string;
  position?: 'top-center' | 'bottom-center';
  duration?: number;
  toastId?: string;
  onDismiss?: (toastId: string) => void;
};

const LoadingToastMessage = ({ title, position = 'bottom-center', duration, toastId, onDismiss }: IProps) => {
  const getToast = (id: string) => {
    return (
      <div className="success-toast-shadow flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-gray-50 px-2.5 py-1">
        <SpinLoader width={6} height={6} />
        <Typography variant="label-14-medium" textColor="default">
          {title}
        </Typography>
        <button
          onClick={() => {
            onDismiss?.(id);
            toast.dismiss(id);
          }}
          className="ml-2 flex items-center justify-center text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <PopupCloseIcon width="14" height="14" color="currentColor" viewBox="0 0 18 18" />
        </button>
      </div>
    );
  };
  const id = toast.custom((t: Toast) => getToast(t.id), {
    position,
    duration: duration || Infinity, // Loading toasts should persist until dismissed or completed
    id: toastId,
  });
  return id;
};

export default LoadingToastMessage;
