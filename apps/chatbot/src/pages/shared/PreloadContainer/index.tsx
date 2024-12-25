import { FC, ReactElement } from 'react';
import { IAllApiResponsesWithQuery } from '../ApiProvider/types';
import { Loader } from 'lucide-react';
import { AxiosError } from 'axios';

import Custom404 from '@breakout/design-system/components/layout/Custom404';
import useLocalStorageSession from '../../../hooks/useLocalStorageSession';
import { useLocation, useParams } from 'react-router-dom';
import { ChatParams } from '@meaku/core/types/config';
import useConfigDataQuery from '@meaku/core/queries/useConfigDataQuery';
import useInitializeSessionDataQuery from '@meaku/core/queries/useInitializeSessionDataQuery';
import { getBrowserSignature } from '../../../utils/tracking';
import { SessionConfigResponseType } from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import { trackError } from '../../../utils/error.ts';
import { useAreMessagesReadonly, useIsAdmin } from '../../../shared/UrlDerivedDataProvider';

interface Props {
  children: (props: IAllApiResponsesWithQuery) => ReactElement;
}

const PreloadContainer: FC<Props> = ({ children }) => {
  const { pathname = '' } = useLocation();
  const { agentId = '' } = useParams<ChatParams>();
  const { sessionData } = useLocalStorageSession();

  const isDemoURL = pathname.includes('demo');

  const isAdmin = useIsAdmin();
  const isReadOnly = useAreMessagesReadonly();

  const configQuery = useConfigDataQuery({
    agentId,
    queryOptions: { enabled: isReadOnly || !sessionData?.sessionId, retry: 1 },
    //for ReadOnly routes session ID is ignored and config is fetched directly
  });

  const initializeSessionPayload = {
    is_admin: isAdmin,
    session_id: sessionData.sessionId,
    prospect_id: sessionData.prospectId,
    browser_signature: getBrowserSignature(),
  };

  const sessionQuery = useInitializeSessionDataQuery({
    agentId,
    initializeSessionPayload,
    queryOptions: { enabled: !isReadOnly && !!agentId && !!sessionData.sessionId, retry: 1 },
  });

  const firstQueryWithError = [configQuery, sessionQuery].find((query) => query.error);

  if (firstQueryWithError?.error) {
    if (firstQueryWithError.isFetching) {
      return (
        <div className="flex h-screen animate-spin items-center justify-center">
          <Loader />
        </div>
      );
    }

    const internalAPIError = firstQueryWithError.error as AxiosError<Error>;
    trackError(internalAPIError, { action: 'internalAPIError', component: 'PreloadContainer' });

    if (isDemoURL && configQuery?.isError) {
      const errorMessage = (configQuery?.error as AxiosError<{ error: string }>)?.response?.data?.error;
      return <Custom404 errorMessage={errorMessage || 'An unexpected error occurred'} />;
    }
    return null;
  }

  if (configQuery.data || sessionQuery.data) {
    return children({
      unifiedConfigurationResponse: (sessionQuery.data || configQuery.data) as SessionConfigResponseType,
      configQuery,
      sessionQuery,
    });
  }

  return (
    <div className="flex h-screen animate-spin items-center justify-center">
      <Loader />
    </div>
  );
};

export default PreloadContainer;
