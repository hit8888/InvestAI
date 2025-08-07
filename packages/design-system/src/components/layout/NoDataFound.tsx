import NoDataFoundImage from '../../../assets/no_data_found.png';
import { cn } from '../../lib/cn';
import Typography from '../Typography';

type NoDataFoundProps = {
  title: string;
  description?: string;
  className?: string;
};

const NoDataFound = ({ title, description, className }: NoDataFoundProps) => {
  return (
    <div className={cn('flex w-full flex-col items-center justify-center gap-4', className)}>
      <img src={NoDataFoundImage} alt="no-data-found-image" width={300} height={300} />
      <Typography variant="title-18">{title}</Typography>
      {description && (
        <Typography className="max-w-sm text-center" variant="body-16" textColor="gray500">
          {description}
        </Typography>
      )}
    </div>
  );
};

export default NoDataFound;
