import r2wc from '@r2wc/react-to-web-component';
import type { ComponentType } from 'react';

import RootContainer from '../containers/RootContainer';
import type { SettingsContainerProps } from '../containers/SettingsContainer';

export function createWc(WrappedComponent: ComponentType, hostId: string) {
  return r2wc(
    (props: SettingsContainerProps) => {
      return (
        <RootContainer settings={props} hostId={hostId}>
          <WrappedComponent />
        </RootContainer>
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
        isAdmin: 'boolean',
        isTest: 'boolean',
        queryParams: 'json',
        position: 'string',
        rootZindex: 'string',
        rootBottomOffset: 'string',
        rootRightOffset: 'string',
        feedbackEnabled: 'boolean',
      },
      shadow: 'open',
    },
  );
}
