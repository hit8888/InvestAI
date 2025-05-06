import { useLocation } from 'react-router-dom';
import { AppRoutesEnum } from '../utils/constants';

const usePageRouteState = () => {
  const location = useLocation();
  const {
    LEADS,
    LOGIN,
    CONVERSATIONS,
    AGENT,
    AGENT_PLAYGROUND,
    AGENT_DATA_SOURCES,
    AGENT_WORKFLOW,
    AGENT_BRANDING,
    AGENT_ENTRYPOINTS,
  } = AppRoutesEnum;

  const isDashboardPage = location.pathname === '/';
  const isLoginPage = location.pathname.includes(LOGIN);
  const isLeadsPage = location.pathname.includes(LEADS);
  const isConversationsPage = location.pathname.includes(CONVERSATIONS);
  const isAgentPage = location.pathname.includes(AGENT);
  const isAgentPlaygroundPage = location.pathname.includes(AGENT_PLAYGROUND);
  const isAgentDataSourcesPage = location.pathname.includes(AGENT_DATA_SOURCES);
  const isAgentWorkflowPage = location.pathname.includes(AGENT_WORKFLOW);
  const isAgentBrandingPage = location.pathname.includes(AGENT_BRANDING);
  const isAgentEntrypointsPage = location.pathname.includes(AGENT_ENTRYPOINTS);

  const pathURL = location.pathname;

  return {
    isDashboardPage,
    isLoginPage,
    isLeadsPage,
    isConversationsPage,
    isAgentPage,
    isAgentPlaygroundPage,
    isAgentDataSourcesPage,
    isAgentWorkflowPage,
    isAgentBrandingPage,
    isAgentEntrypointsPage,
    pathURL,
  };
};

export default usePageRouteState;
