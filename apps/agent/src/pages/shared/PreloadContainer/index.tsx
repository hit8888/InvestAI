import { FC, ReactElement } from 'react';
import { AxiosError } from 'axios';

import Custom404 from '@breakout/design-system/components/layout/Custom404';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import { useLocation, useParams } from 'react-router-dom';
import { AgentParams, OrbStatusEnum } from '@meaku/core/types/config';
import useConfigDataQuery from '@meaku/core/queries/useConfigDataQuery';
import useInitializeSessionDataQuery from '@meaku/core/queries/useInitializeSessionDataQuery';
import { getBrowserSignature } from '../../../utils/tracking.ts';
import { trackError } from '../../../utils/error.ts';
import { useAreMessagesReadonly, useIsAdmin } from '@meaku/core/contexts/UrlDerivedDataProvider';
import { useSetDistinctIdOnAppMount } from '../../../hooks/useSetDistinctIdOnAppMount.ts';
import { IAllApiResponsesWithQuery } from '@meaku/core/types/types';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import SpinLoader from '@breakout/design-system/components/layout/SpinLoader';
import { InitializationPayload } from '@meaku/core/types/api/session_init_request';
import { useWidgetMode } from '@meaku/core/contexts/WidgetModeProvider';
import { cn } from '@breakout/design-system/lib/cn';
import AgentShimmer from '../../../components/views/AgentView/AgentShimmer';
import Orb from '@breakout/design-system/components/Orb/index';
import Button from '@breakout/design-system/components/layout/button';

interface Props {
  children: (props: IAllApiResponsesWithQuery) => ReactElement;
}

const PreloadContainer: FC<Props> = ({ children }) => {
  const { pathname = '' } = useLocation();
  const { agentId = '' } = useParams<AgentParams>();
  const { sessionData } = useLocalStorageSession();

  const { getParam } = useUrlParams();
  const is_test = getParam('is_test') === 'true';
  const test_type = getParam('test_type') ?? undefined;

  const isDemoURL = pathname.includes('demo');

  const isAdmin = useIsAdmin();
  const isReadOnly = useAreMessagesReadonly();

  const configQuery = useConfigDataQuery({
    agentId,
    queryOptions: { enabled: true },
  });

  useSetDistinctIdOnAppMount();

  const { mode } = useWidgetMode();

  const initializeSessionPayload: InitializationPayload = {
    is_admin: isAdmin,
    session_id: sessionData.sessionId,
    prospect_id: sessionData.prospectId,
    browser_signature: getBrowserSignature(),
    is_test,
    test_type: test_type as 'automated' | 'manual' | undefined,
  };

  //test build
  const sessionQuery = useInitializeSessionDataQuery({
    agentId,
    initializeSessionPayload,
    queryOptions: { enabled: !isReadOnly && !!agentId && !!sessionData.sessionId, retry: 1 },
  });

  const firstQueryWithError = [configQuery, sessionQuery].find((query) => query.error);

  const handleRetry = () => {
    if (firstQueryWithError) {
      firstQueryWithError.refetch();
    }
  };

  if (firstQueryWithError?.error) {
    if (firstQueryWithError.isFetching) {
      return (
        <div className="flex h-screen animate-spin items-center justify-center">
          <SpinLoader />
        </div>
      );
    }

    const internalAPIError = firstQueryWithError.error as AxiosError<Error>;
    trackError(internalAPIError, { action: 'internalAPIError', component: 'PreloadContainer' });

    if (isDemoURL && configQuery?.isError) {
      return <Custom404 />;
    }

    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-700">Something went wrong. Please try again.</p>
        <Button onClick={handleRetry}>Reload</Button>
      </div>
    );
  }

  if (configQuery.data) {
    return children({
      configurationApiResponse: configQuery.data,
      sessionApiResponse: sessionQuery.data ?? null,
      configQuery,
      sessionQuery,
    });
  }

  if (mode === 'bottomBar') {
    return (
      <div className="flex h-screen animate-spin items-center justify-center">
        <Orb color="#E6E6FA" state={OrbStatusEnum.waiting} />
      </div>
    );
  }
  return (
    <div className={cn('mx-0 mt-0 flex h-[100vh] w-[100vw] justify-center rounded-3xl font-inter')}>
      <AgentShimmer />
    </div>
  );
};

export default PreloadContainer;
