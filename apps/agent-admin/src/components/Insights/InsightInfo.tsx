import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import Typography from '@breakout/design-system/components/Typography/index';

interface InsightInfoProps {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  isLoading?: boolean;
}

const InsightInfo = ({ icon, label, value, isLoading }: InsightInfoProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-primary/10 p-2">{icon}</div>
      <div className="flex flex-col items-start">
        <Typography variant="caption-12-normal" textColor="gray500">
          {label}
        </Typography>
        {isLoading ? (
          <Skeleton className="mt-1 h-4 w-20" />
        ) : (
          <div className="flex items-center whitespace-nowrap text-sm font-semibold text-gray-900">{value}</div>
        )}
      </div>
    </div>
  );
};

export default InsightInfo;
