import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../lib/cn';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      // Title variants
      'title-24': 'text-2xl font-semibold leading-8',
      'title-18': 'text-lg font-semibold leading-7',

      // Body variants
      'body-16': 'text-base font-normal leading-6',
      'body-14': 'text-sm font-normal leading-5',

      // Label variants
      'label-16-medium': 'text-base font-medium leading-6',
      'label-16-semibold': 'text-base font-semibold leading-6',
      'label-14-medium': 'text-sm font-medium leading-5',
      'label-14-medium-italic': 'text-sm font-medium italic leading-5',
      'label-14-semibold': 'text-sm font-semibold leading-4.5',

      // Caption variants
      'caption-12-normal': 'text-xs font-normal leading-4.5',
      'caption-12-medium': 'text-xs font-medium leading-4.5',
      'caption-12-semibold': 'text-xs font-semibold leading-4.5',
      'caption-10-normal': 'text-[10px] font-normal leading-4 tracking-[1%]',
      'caption-10-medium': 'text-[10px] font-medium leading-4 tracking-[1%]',
    },
    textColor: {
      default: 'text-gray-900',
      primary: 'text-primary',
      gray400: 'text-gray-400',
      gray500: 'text-gray-500',
      white: 'text-white',
      error: 'text-destructive-1000',
      error600: 'text-destructive-600',
      textPrimary: 'text-customPrimaryText',
      textSecondary: 'text-customSecondaryText',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
      inherit: '',
    },
    noWrap: {
      true: 'whitespace-nowrap overflow-hidden text-ellipsis',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body-16',
    textColor: 'textPrimary',
    align: 'inherit',
    noWrap: false,
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof typographyVariants> {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

const Typography = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, variant, textColor, align, noWrap, as: Component = 'p', ...props }, ref) => {
    const variantClasses = typographyVariants({ variant, textColor, align, noWrap });

    return (
      <Component className={cn(variantClasses, className)} ref={ref} {...props}>
        {children}
      </Component>
    );
  },
);

Typography.displayName = 'Typography';

export default Typography;
