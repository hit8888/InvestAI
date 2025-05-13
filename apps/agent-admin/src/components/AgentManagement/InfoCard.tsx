import { LucideInfo } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/index';

interface InfoCardProps {
  title: string;
  description: string;
  className?: string;
}

const InfoCard = ({ title, description, className = '' }: InfoCardProps) => {
  return (
    <div
      className={`flex w-full  flex-row items-center justify-center gap-4 rounded-lg border border-gray-200  bg-gray-100 p-2 ${className}`}
    >
      <LucideInfo width={'16px'} height={'16px'} />
      <div className="flex w-full flex-col items-start justify-center gap-2">
        <Typography variant={'caption-12-medium'}>{title}</Typography>
        <Typography variant={'caption-12-normal'} textColor={'textSecondary'}>
          {description}
        </Typography>
      </div>
    </div>
  );
};

export default InfoCard;
