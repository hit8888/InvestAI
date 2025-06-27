import { useLocation } from 'react-router-dom';
import { AppRoutesEnum, OAUTH_CALLBACK_PAGES } from '../utils/constants';

const usePageRouteState = () => {
  const location = useLocation();
  const {
    LEADS,
    LOGIN,
    CONVERSATIONS,
    AGENT,
    AGENT_DATA_SOURCES,
    AGENT_WORKFLOW,
    AGENT_BRANDING,
    AGENT_ENTRYPOINTS,
    AGENT_AI_PROMPTS,
    TRAINING,
    TRAINING_PLAYGROUND,
    INSIGHTS,
  } = AppRoutesEnum;

  const isDashboardPage = location.pathname === '/';
  const isOAuthCallbackPage = OAUTH_CALLBACK_PAGES.some((path) => location.pathname.includes(path));
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
  const isInsightsPage = location.pathname.includes(INSIGHTS);

  const pathURL = location.pathname;

  return {
    isDashboardPage,
    isLoginPage,
    isOAuthCallbackPage,
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
    isInsightsPage,
    pathURL,
  };
};

export default usePageRouteState;
