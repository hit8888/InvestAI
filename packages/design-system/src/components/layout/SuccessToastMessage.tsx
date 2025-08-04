import SuccessToastIcon from '../icons/success-toast-icon';
import Typography from '../Typography';
import toast from 'react-hot-toast';

type IProps = {
  title: string;
  position?: 'top-center' | 'bottom-center';
  duration?: number;
};

const SuccessToastMessage = ({ title, position = 'bottom-center', duration = 3000 }: IProps) => {
  const getToast = () => {
    return (
      <div className="success-toast-shadow flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-gray-50 px-2.5 py-1">
        <SuccessToastIcon width={'18'} height={'18'} className="text-positive-1000" />
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

export default SuccessToastMessage;
