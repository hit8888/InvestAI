import { cn } from '../../lib/cn';
import SuccessToastIcon from '../icons/success-toast-icon';
import Typography from '../Typography';
type IProps = {
  title: string;
  subtitle?: string | '';
  className?: string; // Optional class name for additional styling
  style?: React.CSSProperties; // Optional inline styles for additional styling
  icon?: React.ReactNode; // Optional icon to be displayed before the title and subtitle
  iconClassName?: string; // Optional class name for the icon
  iconStyle?: React.CSSProperties; // Optional inline styles for the icon
};
const SuccessToastMessage = ({ title, subtitle = '', className, style }: IProps) => {
  return (
    <div
      style={style}
      className={cn(
        'success-toast-shadow flex items-center gap-4 rounded-2xl border-2 border-positive-1000 bg-positive-25 p-4',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-positive-200">
        <SuccessToastIcon width={'28'} height={'28'} className="text-positive-1000" />
      </div>
      <div className="flex flex-col items-start justify-center gap-1">
        <Typography variant="label-16-semibold" textColor="default">
          {title}
        </Typography>
        {subtitle?.length > 0 ? (
          <Typography variant="caption-12-normal" textColor="gray500">
            {subtitle}
          </Typography>
        ) : null}
      </div>
    </div>
  );
};

export default SuccessToastMessage;
