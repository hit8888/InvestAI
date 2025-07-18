import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';

import Custom404 from '@breakout/design-system/components/layout/Custom404';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import { useParams } from 'react-router-dom';
import { AgentParams, OrbStatusEnum } from '@meaku/core/types/config';
import useConfigDataQuery from '@meaku/core/queries/useConfigDataQuery';
import useInitializeSessionDataQuery from '@meaku/core/queries/useInitializeSessionDataQuery';
import { getBrowserSignature } from '../../../utils/tracking.ts';
import { trackError } from '../../../utils/error.ts';
import { useAreMessagesReadonly, useIsAdmin } from '@meaku/core/contexts/UrlDerivedDataProvider';
import { useSetDistinctIdOnAppMount } from '@meaku/core/hooks/useSetDistinctIdOnAppMount';
import { IAllApiResponsesWithQuery } from '@meaku/core/types/types';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';
import SpinLoader from '@breakout/design-system/components/layout/SpinLoader';
import { InitializationPayload } from '@meaku/core/types/api/session_init_request';
import { useWidgetMode, WidgetMode } from '@meaku/core/contexts/WidgetModeProvider';
import { cn } from '@breakout/design-system/lib/cn';
import AgentShimmer from '../../../components/views/AgentView/AgentShimmer';
import Orb from '@breakout/design-system/components/Orb/index';
import Button from '@breakout/design-system/components/Button/index';
import { useAppEventsHook } from '@meaku/core/hooks/useAppEventsHook';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { jsonSafeParse } from '@meaku/core/utils/index';
import { getFontElement } from './font-helper.ts';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { DeviceType } from '@meaku/core/types/common';

interface Props {
  children: (props: IAllApiResponsesWithQuery) => ReactElement;
}

const PARENT_URL_TIMEOUT = 2;

const PreloadContainerContent: FC<Props> = ({ children }) => {
  const { agentId = '' } = useParams<AgentParams>();
  const { sessionData } = useLocalStorageSession();
  const isMobile = useIsMobile();
  const [parentUrl, setParentURL] = useState<string | undefined>(undefined);
  const [waitingForParentUrl, setWaitingForParentUrl] = useState(true);

  const { getParam, setParam } = useUrlParams();
  const isAdmin = useIsAdmin();
  const is_test = getParam('is_test') === 'true' || isAdmin;
  const test_type = getParam('test_type') ?? undefined;
  const parentUrlParam = getParam('parent_url');
  const { data: browsedUrls } = jsonSafeParse(getParam('browsed_urls') ?? '');
  const deviceType = isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP;

  const setIsInitApiSuccess = useMessageStore((state) => state.setIsInitApiSuccess);

  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const isReadOnly = useAreMessagesReadonly();

  const handleEvents = async (event: MessageEvent) => {
    const { type, payload } = event.data;
    if (type === 'INIT') {
      setParentURL(payload.url);
      setWaitingForParentUrl(false);
      return;
    } else if (type === 'URL_TRACKING_UPDATE') {
      const browsed_urls = JSON.stringify(payload.browsed_urls);
      setParam('browsed_urls', browsed_urls);
      return;
    }
  };

  useAppEventsHook(handleEvents);

  // Set a timeout to stop waiting for parentUrl after PARENT_URL_TIMEOUT
  useEffect(() => {
    const timer = setTimeout(() => {
      if (parentUrl) {
        console.log('Parent URL found');
        setWaitingForParentUrl(false);
      } else if (!parentUrl && waitingForParentUrl) {
        setWaitingForParentUrl(false);
      }
    }, PARENT_URL_TIMEOUT);

    return () => clearTimeout(timer);
  }, [waitingForParentUrl]);

  const parentUrlValue = useMemo(() => {
    if (parentUrlParam) return decodeURIComponent(parentUrlParam);

    // If parentUrlParam is not available, check if parent_url parameter exists in parentUrl
    if (parentUrl) {
      try {
        const url = new URL(parentUrl);
        const parentUrlFromParam = url.searchParams.get('parent_url');
        if (parentUrlFromParam) {
          return decodeURIComponent(parentUrlFromParam);
        }
      } catch (error) {
        console.warn('Invalid URL format in parentUrl:', error, parentUrl);
      }
    }

    return parentUrl || window.location.href;
  }, [parentUrlParam, parentUrl]);

  const configQuery = useConfigDataQuery({
    agentId,
    parentUrl: parentUrlValue,
    queryOptions: { enabled: !waitingForParentUrl },
  });

  useEffect(() => {
    if (!is_test && configQuery.error) {
      const error = configQuery.error as AxiosError;
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.BOTTOM_BAR_CONFIG_FAILURE, {
        error_code: error.code,
        error_message: error.message,
        error_type: 'config_api_error',
        agent_id: agentId,
        parent_url: parentUrl,
        mode,
      });
    }
  }, [configQuery.error]);

  useEffect(() => {
    const fontLinkElement = getFontElement(configQuery.data);

    if (!fontLinkElement) return;

    document.head.appendChild(fontLinkElement);

    return () => {
      document.head.removeChild(fontLinkElement);
      document.body.style.fontFamily = '';
    };
  }, [configQuery.data?.style_config?.font_config]);

  useSetDistinctIdOnAppMount();

  const { mode } = useWidgetMode();

  const initializeSessionPayload: InitializationPayload = {
    is_admin: isAdmin,
    device_type: deviceType,
    session_id: sessionData.sessionId,
    prospect_id: sessionData.prospectId,
    browser_signature: getBrowserSignature(),
    is_test,
    test_type: test_type as 'automated' | 'manual' | undefined,
    referrer: document.referrer,
    parent_url: parentUrlValue,
    experiment_tag: configQuery.data?.experiment_tag ?? null,
    ...(browsedUrls && { browsed_urls: browsedUrls }),
    ...(mode && { agent_modal: mode }),
  };

  //test build
  const sessionQuery = useInitializeSessionDataQuery({
    agentId,
    initializeSessionPayload,
    queryOptions: {
      enabled: !isReadOnly && !!agentId && !!sessionData.sessionId && !waitingForParentUrl,
    },
  });

  // set isInitApiSuccess to true when the session data is fetched from the server
  useEffect(() => {
    if (sessionQuery.isSuccess) {
      setIsInitApiSuccess(true);
    } else {
      setIsInitApiSuccess(false);
    }
  }, [sessionQuery.isSuccess]);

  useEffect(() => {
    if (!is_test && sessionQuery.error) {
      const error = sessionQuery.error as AxiosError;
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.BOTTOM_BAR_SESSION_FAILURE, {
        error_code: error.code,
        error_message: error.message,
        error_type: 'session_init_api_error',
        agent_id: agentId,
        session_id: sessionData.sessionId,
        prospect_id: sessionData.prospectId,
        mode,
      });
    }
  }, [sessionQuery.error]);

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

    if (!is_test && !firstQueryWithError.isFetching) {
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.BOTTOM_BAR_LOAD_FAILURE, {
        error_type: 'api_initialization_error',
        error_message: internalAPIError.message,
        error_code: internalAPIError.code,
        is_admin: isAdmin,
        agent_id: agentId,
        mode,
        failed_query: configQuery.error ? 'config' : 'session_init',
        parent_url: parentUrl,
        session_id: sessionData.sessionId,
        prospect_id: sessionData.prospectId,
      });
    }

    if (isAdmin && configQuery?.isError) {
      return <Custom404 />;
    }

    if (isAdmin) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <p className="text-gray-700">Something went wrong. Please try again.</p>
          <Button onClick={handleRetry}>Reload</Button>
        </div>
      );
    }

    return null;
  }

  if (configQuery.data) {
    return children({
      configurationApiResponse: configQuery.data,
      sessionApiResponse: sessionQuery.data ?? null,
      configQuery,
      sessionQuery,
    });
  }

  if (mode === WidgetMode.BOTTOM_BAR) {
    return (
      <div className="flex h-[90vh] items-end justify-center pb-8 lg:h-screen">
        <div className="flex animate-spin items-center justify-center">
          <Orb color="#E6E6FA" style={{ width: '48px', height: '48px' }} state={OrbStatusEnum.waiting} />
        </div>
      </div>
    );
  }
  return (
    <div className={cn('mx-0 mt-0 flex h-[100vh] w-[100vw] justify-center rounded-3xl')}>
      <AgentShimmer />
    </div>
  );
};

const PreloadContainer: FC<Props> = ({ children }) => {
  return <PreloadContainerContent children={children} />;
};

export default PreloadContainer;
