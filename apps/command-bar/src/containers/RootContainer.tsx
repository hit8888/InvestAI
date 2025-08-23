import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { defaultQueryClient } from '@meaku/core/queries/defaultQueryClient';
import SettingsContainer, { SettingsContainerProps } from './SettingsContainer';
import PreloadContainer from './PreloadContainer';
import CommandBarAnalyticsProvider from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ShadowRootProvider from '@meaku/shared/containers/ShadowRootProvider';

interface RootContainerProps {
  settings?: SettingsContainerProps;
  hostId: string | null;
  children: React.ReactElement;
}

const RootContainer = ({ settings: propSettings, hostId, children }: RootContainerProps) => {
  return (
    <ShadowRootProvider hostId={hostId}>
      <QueryClientProvider client={defaultQueryClient}>
        <SettingsContainer {...propSettings}>
          {(settings) => (
            <CommandBarAnalyticsProvider
              initialProperties={{
                agent_id: settings.agent_id,
                page_url: settings.parent_url,
              }}
            >
              <PreloadContainer settings={settings}>{children}</PreloadContainer>
            </CommandBarAnalyticsProvider>
          )}
        </SettingsContainer>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </ShadowRootProvider>
  );
};

export default RootContainer;
