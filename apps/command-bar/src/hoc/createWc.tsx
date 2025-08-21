import r2wc from '@r2wc/react-to-web-component';
import type { ComponentType } from 'react';

import RootContainer from '../containers/RootContainer';
import type { SettingsContainerProps } from '../containers/SettingsContainer';
import ShadowRootProvider from '@meaku/shared/containers/ShadowRootProvider';

export function createWc(WrappedComponent: ComponentType, rootNodeId: string) {
  return r2wc(
    (props: SettingsContainerProps) => {
      return (
        <ShadowRootProvider rootNodeId={rootNodeId}>
          <RootContainer settings={props}>
            <WrappedComponent />
          </RootContainer>
        </ShadowRootProvider>
      );
    },
    {
      props: {
        agentId: 'string',
        tenantId: 'string',
        visible: 'boolean',
        message: 'string',
        startTime: 'string',
        endTime: 'string',
        sessionId: 'string',
        browsedUrls: 'string',
        bc: 'boolean',
        parentUrl: 'string',
      },
      shadow: 'open',
    },
  );
}
