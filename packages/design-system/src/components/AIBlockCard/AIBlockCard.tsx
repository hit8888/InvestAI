import React from 'react';
import { cn } from '../../lib/cn';
import Typography from '../Typography';
import { Badge } from '../layout/badge';
import { Check } from 'lucide-react';

export interface AIBlockCardProps {
  /** The icon element to display */
  icon: React.ReactNode;
  /** The title of the AI block */
  title: string;
  /** The description text */
  description: string;
  /** The status of the block */
  status: 'published' | 'hidden' | 'unpublished';
  /** Optional click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the card is disabled */
  disabled?: boolean;
  separatorColor?: string;
  showImage?: boolean;
}

const getStatusConfig = (status: AIBlockCardProps['status']) => {
  switch (status) {
    case 'published':
      return {
        label: 'Published',
        variant: 'default' as const,
        className: 'bg-positive-100 border-positive-300 text-positive-1000 hover:bg-positive-100',
      };
    case 'unpublished':
      return {
        label: 'Unpublished',
        variant: 'outline' as const,
        className: 'bg-warning-100 text-warning-1000 border-warning-300 hover:bg-warning-100',
      };
    default:
      return {
        label: 'Unknown',
        variant: 'outline' as const,
        className: 'bg-gray-100 text-gray-1000 border-gray-300 hover:bg-gray-100',
      };
  }
};

const AIBlockCard: React.FC<AIBlockCardProps> = ({
  icon,
  title,
  description,
  status,
  onClick,
  className,
  separatorColor,
  disabled = false,
  showImage,
}) => {
  const statusConfig = getStatusConfig(status);
  const isClickable = onClick && !disabled;

  const content = (
    <div
      className={cn(
        'flex w-full items-center gap-4 rounded-b-2xl rounded-t-3xl border border-gray-200 bg-gray-25 p-4 pr-6 transition-all duration-200',
        {
          'cursor-pointer hover:border-gray-300 hover:shadow-md': isClickable,
          'cursor-not-allowed opacity-50': disabled,
          'shadow-sm': !disabled,
        },
        className,
      )}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div className="h-14 w-1 rounded-lg" style={{ backgroundColor: separatorColor }} />
      {showImage ? (
        icon
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white p-4">
          {icon}
        </div>
      )}
      {/* Content */}
      <div className="flex w-full flex-col gap-1">
        {/* Title Row */}
        <div className="flex items-center gap-3">
          <Typography variant="label-16-medium" textColor="black" className="flex-1">
            {title}
          </Typography>
          <Badge className={cn('gap-1 rounded-lg text-xs font-normal', statusConfig.className)}>
            <Check className="h-4 w-4" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Description */}
        <Typography variant="body-14" textColor="gray500" className="leading-relaxed">
          {description}
        </Typography>
      </div>
    </div>
  );

  return content;
};

export default AIBlockCard;
