import { lazy, Suspense, Component, ReactNode } from 'react';
import { LucideProps, Image } from 'lucide-react';
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

// Simple error boundary for icon loading failures
interface IconErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  size?: string | number;
}

interface IconErrorBoundaryState {
  hasError: boolean;
}

class IconErrorBoundary extends Component<IconErrorBoundaryProps, IconErrorBoundaryState> {
  constructor(props: IconErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): IconErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Icon loading failed:', error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback: use the imported Image icon with faded opacity
      return <Image size={this.props.size} strokeWidth={DEFAULT_STROKE_WIDTH} opacity={0.2} />;
    }

    return this.props.children;
  }
}

const IconLoader = ({ name, ...props }: IconProps) => {
  const LazyIcon = getLazyIcon(name);
  return <LazyIcon strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />;
};

const LucideIcon = ({ name, ...props }: IconProps) => {
  return (
    <IconErrorBoundary size={props.size}>
      <Suspense fallback={null}>
        <IconLoader name={name} {...props} />
      </Suspense>
    </IconErrorBoundary>
  );
};

export default LucideIcon;
