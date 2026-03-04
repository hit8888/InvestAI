import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { defaultQueryClient } from '@neuraltrade/core/queries/defaultQueryClient';
import SettingsContainer, { SettingsContainerProps } from './SettingsContainer';
import StylingContainer from './StylingContainer';
import PreloadContainer from './PreloadContainer';
import CommandBarAnalyticsProvider from '@neuraltrade/core/contexts/CommandBarAnalyticsProvider';
import ShadowRootProvider from '@neuraltrade/shared/containers/ShadowRootProvider';
import DeviceManagerProvider from '@neuraltrade/core/contexts/DeviceManagerProvider';
import SentryErrorBoundary from './SentryErrorBoundary';
import FeatureProvider from '@neuraltrade/shared/containers/FeatureProvider';

interface RootContainerProps {
  settings?: SettingsContainerProps;
  hostId: string | null;
  children: React.ReactElement;
}

const RootContainer = ({ settings: propSettings, hostId, children }: RootContainerProps) => {
  return (
    <SentryErrorBoundary hostId={hostId} tenantId={propSettings?.tenantId}>
      <DeviceManagerProvider>
        <ShadowRootProvider hostId={hostId} fallbackRootId="breakout-root">
          <QueryClientProvider client={defaultQueryClient}>
            <SettingsContainer {...propSettings}>
              {(settings) =>
                settings.agent_id && settings.tenant_id ? (
                  <CommandBarAnalyticsProvider
                    enabled={!settings.is_test}
                    initialProperties={{
                      agent_id: settings.agent_id,
                      page_url: settings.parent_url,
                    }}
                  >
                    <PreloadContainer settings={settings}>
                      <FeatureProvider>
                        <StylingContainer>{children}</StylingContainer>
                      </FeatureProvider>
                    </PreloadContainer>
                  </CommandBarAnalyticsProvider>
                ) : null
              }
            </SettingsContainer>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          </QueryClientProvider>
        </ShadowRootProvider>
      </DeviceManagerProvider>
    </SentryErrorBoundary>
  );
};

export default RootContainer;
