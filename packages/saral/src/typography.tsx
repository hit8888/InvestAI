import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from './index';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      // Heading variants
      'heading-xl': 'text-[20px] leading-[24px]',
      heading: 'text-[16px] leading-[20px]',

      // Body text variants
      body: 'text-[14px] leading-[22px]',
      'body-medium': 'text-[14px] leading-[22px]',
      'body-semibold': 'text-[14px] leading-[22px]',
      'body-small': 'text-[12px] leading-[16px]',
    },
    fontWeight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    variant: 'body',
    fontWeight: 'normal',
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof typographyVariants> {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

const Typography = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, variant, fontWeight, as: Component = 'p', ...props }, ref) => {
    const variantClasses = typographyVariants({ variant, fontWeight });

    return (
      <Component className={cn(variantClasses, className)} ref={ref} {...props}>
        {children}
      </Component>
    );
  },
);

Typography.displayName = 'Typography';

export default Typography;
