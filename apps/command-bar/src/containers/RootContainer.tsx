import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { defaultQueryClient } from '@meaku/core/queries/defaultQueryClient';
import SettingsContainer, { SettingsContainerProps } from './SettingsContainer';
import PreloadContainer from './PreloadContainer';
import CommandBarAnalyticsProvider from '@meaku/core/contexts/CommandBarAnalyticsProvider';

interface RootContainerProps {
  settings?: SettingsContainerProps;
  children: React.ReactElement;
}

const RootContainer = ({ settings: propSettings, children }: RootContainerProps) => {
  return (
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
  );
};

export default RootContainer;
