import { useLocation } from 'react-router-dom';
import { AppRoutesEnum } from '../utils/constants';

const usePageRouteState = () => {
  const location = useLocation();
  const {
    LEADS,
    LOGIN,
    GOOGLE_SSO_CALLBACK,
    CONVERSATIONS,
    AGENT,
    AGENT_DATA_SOURCES,
    AGENT_WORKFLOW,
    AGENT_BRANDING,
    AGENT_ENTRYPOINTS,
    AGENT_AI_PROMPTS,
    TRAINING,
    TRAINING_PLAYGROUND,
  } = AppRoutesEnum;

  const isDashboardPage = location.pathname === '/';
  const isGoogleSsoCallbackPage = location.pathname.includes(GOOGLE_SSO_CALLBACK);
  const isLoginPage = location.pathname.includes(LOGIN);
  const isLeadsPage = location.pathname.includes(LEADS);
  const isConversationsPage = location.pathname.includes(CONVERSATIONS);
  const isAgentPage = location.pathname.includes(AGENT);
  const isAgentDataSourcesPage = location.pathname.includes(AGENT_DATA_SOURCES);
  const isAgentWorkflowPage = location.pathname.includes(AGENT_WORKFLOW);
  const isAgentBrandingPage = location.pathname.includes(AGENT_BRANDING);
  const isAgentEntrypointsPage = location.pathname.includes(AGENT_ENTRYPOINTS);
  const isAgentAiPromptsPage = location.pathname.includes(AGENT_AI_PROMPTS);
  const isTrainingPage = location.pathname.includes(TRAINING);
  const isTrainingPlaygroundPage = location.pathname.includes(TRAINING_PLAYGROUND);

  const pathURL = location.pathname;

  return {
    isDashboardPage,
    isLoginPage,
    isGoogleSsoCallbackPage,
    isLeadsPage,
    isConversationsPage,
    isAgentPage,
    isAgentDataSourcesPage,
    isAgentWorkflowPage,
    isAgentBrandingPage,
    isAgentEntrypointsPage,
    isAgentAiPromptsPage,
    isTrainingPage,
    isTrainingPlaygroundPage,
    pathURL,
  };
};

export default usePageRouteState;
