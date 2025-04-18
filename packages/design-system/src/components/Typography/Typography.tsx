import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import './index.css';

export const typographyVariants = cva('typography', {
  variants: {
    variant: {
      // Title variants
      'title-24': 'typography--title-24',
      'title-18': 'typography--title-18',

      // Body variants
      'body-16': 'typography--body-16',
      'body-14': 'typography--body-14',

      // Label variants
      'label-16-medium': 'typography--label-16-medium',
      'label-16-semibold': 'typography--label-16-semibold',
      'label-14-medium': 'typography--label-14-medium',
      'label-14-medium-italic': 'typography--label-14-medium-italic',
      'label-14-semibold': 'typography--label-14-semibold',

      // Caption variants
      'caption-12-normal': 'typography--caption-12-normal',
      'caption-12-medium': 'typography--caption-12-medium',
      'caption-12-semibold': 'typography--caption-12-semibold',
      'caption-10-normal': 'typography--caption-10-normal',
      'caption-10-medium': 'typography--caption-10-medium',
    },
    textColor: {
      default: 'typography--color-default',
      primary: 'typography--color-primary',
      gray400: 'typography--color-gray400',
      gray500: 'typography--color-gray500',
      white: 'typography--color-white',
      error: 'typography--color-error',
      error600: 'typography--color-error600',
      textPrimary: 'typography--color-textPrimary',
      textSecondary: 'typography--color-textSecondary',
    },
    align: {
      left: 'typography--align-left',
      center: 'typography--align-center',
      right: 'typography--align-right',
      justify: 'typography--align-justify',
      inherit: '',
    },
    noWrap: {
      true: 'typography--no-wrap',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body-16',
    textColor: 'default',
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
