import { FC, ReactElement, useCallback } from 'react';
import AgentWithWhiteLabelConfig from './AgentPageContent';
import PreloadContainer from '../shared/PreloadContainer';
import { ApiProvider } from '../shared/ApiProvider';
import ErrorBoundary from '../../components/ErrorBoundary';
import UrlDerivedDataProvider from '@meaku/core/contexts/UrlDerivedDataProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useParams } from 'react-router-dom';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { useWidgetMode } from '@meaku/core/contexts/WidgetModeProvider';

const AgentPage: FC = () => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const { mode } = useWidgetMode();
  const { agentId } = useParams();

  const handleError = useCallback(
    (error: Error, errorInfo: { componentStack: string }) => {
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.BOTTOM_BAR_LOAD_FAILURE, {
        error_type: 'component_error',
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
        mode,
        agent_id: agentId,
        component: 'AgentPage',
      });
    },
    [mode, agentId, trackAgentbotEvent],
  );

  return (
    <ErrorBoundary mode={mode} agentId={agentId} onError={handleError}>
      <UrlDerivedDataProvider>
        <PreloadContainer>
          {(props): ReactElement => (
            <ApiProvider {...props}>
              <AgentWithWhiteLabelConfig />
            </ApiProvider>
          )}
        </PreloadContainer>
      </UrlDerivedDataProvider>
    </ErrorBoundary>
  );
};

export default AgentPage;
