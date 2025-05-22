import { cn } from '@breakout/design-system/lib/cn';
import { ReactNode } from 'react';

type BackgroundVariant = 'GRAY10' | 'GRAY25' | 'GRAY50' | 'GRAY100' | 'WHITE' | 'TRANSPARENT';
type BorderVariant = 'NONE' | 'GRAY100' | 'GRAY200' | 'GRAY300' | 'PRIMARY';

interface CardProps {
  children?: ReactNode;
  className?: string;
  background?: BackgroundVariant;
  border?: BorderVariant;
}

const backgroundStyles: Record<BackgroundVariant, string> = {
  GRAY10: 'bg-gray-10',
  GRAY25: 'bg-gray-25',
  GRAY50: 'bg-gray-50',
  GRAY100: 'bg-gray-100',
  WHITE: 'bg-white',
  TRANSPARENT: 'bg-transparent',
};

const borderStyles: Record<BorderVariant, string> = {
  NONE: 'border-none',
  GRAY100: 'border border-gray-100',
  GRAY200: 'border border-gray-200',
  GRAY300: 'border border-gray-300',
  PRIMARY: 'border border-primary-300',
};

const Card = ({ children, className = '', background = 'GRAY25', border = 'GRAY200' }: CardProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-start gap-6 rounded-2xl p-6 pt-4',
        backgroundStyles[background],
        borderStyles[border],
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
