import { cn } from '@breakout/design-system/lib/cn';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { lazy, Suspense, useMemo } from 'react';

interface IProps extends LucideProps {
  icon: keyof typeof dynamicIconImports;
  fallbackIcon?: keyof typeof dynamicIconImports;
}

const DynamicIcon = (props: IProps) => {
  const { icon, fallbackIcon = 'circle-help', className, ...restProps } = props;

  const IconComponent = useMemo(() => {
    try {
      if (icon in dynamicIconImports) {
        return lazy(dynamicIconImports[icon]);
      }

      const nearestIconKey = Object.keys(dynamicIconImports).find((key) =>
        key.includes(icon),
      ) as keyof typeof dynamicIconImports;

      return lazy(dynamicIconImports[nearestIconKey || fallbackIcon]);
    } catch (error) {
      console.error(`Error loading icon "${icon}":`, error);
      return lazy(dynamicIconImports[fallbackIcon]);
    }
  }, [icon, fallbackIcon]);

  return IconComponent ? (
    <Suspense fallback={<div className="h-10 w-10 animate-pulse rounded bg-gray-200" />}>
      <IconComponent
        className={cn(className)}
        {...(restProps as React.SVGProps<SVGSVGElement> & {
          ref?: React.Ref<SVGSVGElement>;
        })}
      />
    </Suspense>
  ) : null;
};

export default DynamicIcon;
