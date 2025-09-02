import '@calcom/atoms/globals.min.css';
import { CalProvider } from '@calcom/atoms';
import { ReactNode } from 'react';

type BreakoutCalcomCalendarProps = {
  accessToken?: string;
  calOauthClientId: string;
  calApiUrl: string;
  children: ReactNode;
};

export const BreakoutCalcomCalendar = ({
  accessToken,
  calOauthClientId,
  calApiUrl,
  children,
}: BreakoutCalcomCalendarProps) => {
  return (
    <CalProvider
      accessToken={accessToken}
      clientId={calOauthClientId}
      options={{
        apiUrl: calApiUrl,
      }}
    >
      {/* project uses @types/react@19.0.8, The CalProvider expects @types/react@19.1.9 */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {children as any}
    </CalProvider>
  );
};
