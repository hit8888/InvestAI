import { FC, ReactElement } from 'react';
import { IAllApiResponsesWithQuery } from '../ApiProvider/types';
import { Loader } from 'lucide-react';
import { AxiosError } from 'axios';

import useLocalStorageSession from '../../../hooks/useLocalStorageSession';
import { useParams } from 'react-router-dom';
import { ChatParams } from '@meaku/core/types/config';
import useConfigDataQuery from '@meaku/core/queries/useConfigDataQuery';
import useInitializeSessionDataQuery from '@meaku/core/queries/useInitializeSessionDataQuery';
import useIsAdmin from '../../../hooks/useIsAdmin';
import { getBrowserSignature } from '../../../utils/tracking';
import { SessionConfigResponseType } from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import { useInitializeRequestHeaderfromUrl } from '../../../useInitializeRequestHeaderfromUrl';
import { useLocalStorageState } from 'ahooks';
import { trackError } from '../../../utils/error.ts';

interface Props {
  children: (props: IAllApiResponsesWithQuery) => ReactElement;
}

const PreloadContainer: FC<Props> = ({ children }) => {
  const { agentId = '' } = useParams<ChatParams>();
  const { sessionData } = useLocalStorageSession();

  useInitializeRequestHeaderfromUrl();
  const isRequestHeaderSet = useLocalStorageState('x-tenant-name', {
    listenStorageChange: true,
    deserializer: (value) => value,
  });

  const { isAdmin, isReadOnly: isInternalAdminRoute } = useIsAdmin();

  const configQuery = useConfigDataQuery({
    agentId,
    queryOptions: { enabled: isRequestHeaderSet && (isInternalAdminRoute || !sessionData?.sessionId) },
    //for ReadOnly routes session Id is ignored and config is fetched directly
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
    queryOptions: { enabled: isRequestHeaderSet && !isInternalAdminRoute && !!agentId && !!sessionData.sessionId },
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
