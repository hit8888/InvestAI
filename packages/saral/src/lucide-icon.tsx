import { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof dynamicIconImports;
}

// Create a stable cache of lazy-loaded icons
const iconCache = new Map<string, React.LazyExoticComponent<React.ForwardRefExoticComponent<LucideProps>>>();

const getLazyIcon = (name: keyof typeof dynamicIconImports) => {
  let icon = iconCache.get(name);

  if (!icon) {
    icon = lazy(dynamicIconImports[name]);
    iconCache.set(name, icon);
  }
  return icon;
};

const DEFAULT_STROKE_WIDTH = 1.5;

const LucideIcon = ({ name, ...props }: IconProps) => {
  const LazyIcon = getLazyIcon(name);

  return (
    <Suspense fallback={null}>
      <LazyIcon strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />
    </Suspense>
  );
};

export default LucideIcon;
