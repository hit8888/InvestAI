import type { FC, ReactElement } from 'react';
import { useEffect } from 'react';
import { useShadowRoot } from '@neuraltrade/shared/containers/ShadowRootProvider';
import { useCommandBarStore } from '@neuraltrade/shared/stores/useCommandBarStore';
import useBrandCoverImage from '../hooks/useBrandCoverImage';
import useStyleConfig from '../hooks/useStyleConfig';

export type StylingContainerProps = {
  children: ReactElement;
};

// This is for development purposes only, in production shadow root will be the only root
const FALLBACK_ROOT = typeof document !== 'undefined' ? document.documentElement : null;

const StylingContainer: FC<StylingContainerProps> = ({ children }) => {
  const { settings, config } = useCommandBarStore();
  const { root: shadowRoot } = useShadowRoot();

  const root = (shadowRoot?.host as HTMLElement) || FALLBACK_ROOT;

  useBrandCoverImage(settings.tenant_id, settings.bc);

  useStyleConfig({ styleConfig: config?.style_config });

  useEffect(() => {
    const styleOverrides: { [key: string]: string | undefined | null } = {
      '--z-root': settings.root_zindex,
      '--breakout-command-bar-bottom': settings.root_bottom_offset,
      '--breakout-command-bar-right': settings.root_right_offset,
    };

    for (const [property, value] of Object.entries(styleOverrides)) {
      if (value != null) {
        root.style.setProperty(property, value);
      }
    }
  }, [settings.root_zindex, settings.root_bottom_offset, settings.root_right_offset, root]);

  return children;
};

export default StylingContainer;
