import { cn } from '../../lib/cn';
import SuccessToastIcon from '../icons/success-toast-icon';

type IProps = {
  title: string;
  subtitle?: string | '';
  className?: string; // Optional class name for additional styling
  style?: React.CSSProperties; // Optional inline styles for additional styling
  icon?: React.ReactNode; // Optional icon to be displayed before the title and subtitle
  iconClassName?: string; // Optional class name for the icon
  iconStyle?: React.CSSProperties; // Optional inline styles for the icon
}
const SuccessToastMessage = ({
  title,
  subtitle = '',
  className, 
  style,
}: IProps) => {
  return (
    <div style={style} className={cn('flex items-center p-4 gap-4 rounded-2xl border-2 border-positive-1000 bg-positive-25 success-toast-shadow', className)}>
      <div className="bg-positive-200 flex h-12 w-12 items-center justify-center rounded-xl">
        <SuccessToastIcon width={'28'} height={'28'} className="text-positive-1000" />
      </div>
      <div className='flex flex-col items-start justify-center gap-1'>
        <p className='text-base font-semibold text-gray-900'>{title}</p>
        {subtitle?.length > 0 ? <p className='text-xs font-normal text-gray-500'>{subtitle}</p>: null}
      </div>
    </div>
  );
};

export default SuccessToastMessage;
