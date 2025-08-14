import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cva<T extends Record<string, Record<string, string>>>(base: string, variants: T) {
  return function (
    props: {
      [K in keyof T]?: keyof T[K];
    } & { className?: string },
  ) {
    const { className, ...variantProps } = props;
    const variantClasses = Object.entries(variantProps).map(([key, value]) => {
      const variantKey = key as keyof T;
      const variantValue = value as keyof T[typeof variantKey];
      if (value && variants[variantKey] && variants[variantKey][variantValue]) {
        return variants[variantKey][variantValue];
      }
      return '';
    });
    return cn(base, ...variantClasses, className);
  };
}
