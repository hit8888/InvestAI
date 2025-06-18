import Typography from '@breakout/design-system/components/Typography/index';
import ExampleInfoIcon from '@breakout/design-system/components/icons/example-info-icon';
import { ComponentType } from 'react';

interface InfoCardProps {
  title: string;
  description: string;
  className?: string;
  icon?: ComponentType<{ width: string; height: string }>;
}

const InfoCard = ({ title, description, className = '', icon }: InfoCardProps) => {
  const IconComponent = icon || ExampleInfoIcon;
  const classname = icon ? 'text-gray-500' : '';
  return (
    <div
      className={`flex w-full  flex-row items-center justify-center gap-4 rounded-lg border border-gray-200  bg-gray-100 p-2 ${className}`}
    >
      <IconComponent width={'16px'} height={'16px'} className={classname} />
      <div className="flex w-full flex-col items-start justify-center gap-0.5">
        <Typography variant={'caption-12-medium'}>{title}</Typography>
        <Typography variant={'caption-12-normal'} textColor={'textSecondary'}>
          {description}
        </Typography>
      </div>
    </div>
  );
};

export default InfoCard;
