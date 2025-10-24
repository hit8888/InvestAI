import { useLocation } from 'react-router-dom';
import { AppRoutesEnum, OAUTH_CALLBACK_PAGES } from '../utils/constants';

const usePageRouteState = () => {
  const location = useLocation();
  const {
    ACTIVE_LEADS,
    LINK_CLICKS,
    LOGIN,
    CONVERSATIONS,
    AGENT_KNOWLEDGE_BASE,
    AGENT_WORKFLOW,
    AGENT_BRANDING,
    AGENT_ENTRYPOINTS,
    AGENT_CONTROLS,
    TRAINING_PLAYGROUND,
    TRAINING_PLAYGROUND_PREVIEW,
    INSIGHTS,
  } = AppRoutesEnum;

  const isDashboardPage = location.pathname === '/';
  const isOAuthCallbackPage = OAUTH_CALLBACK_PAGES.some((path) => location.pathname.includes(path));
  const isLoginPage = location.pathname.includes(LOGIN);
  const isLeadsPage = location.pathname.includes(ACTIVE_LEADS);
  const isLinkClicksPage = location.pathname.includes(LINK_CLICKS);
  const isConversationsPage = location.pathname.includes(CONVERSATIONS);
  const isAgentKnowledgeBasePage = location.pathname.includes(AGENT_KNOWLEDGE_BASE);
  const isAgentWorkflowPage = location.pathname.includes(AGENT_WORKFLOW);
  const isAgentBrandingPage = location.pathname.includes(AGENT_BRANDING);
  const isAgentEntrypointsPage = location.pathname.includes(AGENT_ENTRYPOINTS);
  const isAgentControlsPage = location.pathname.includes(AGENT_CONTROLS);
  const isTrainingPlaygroundPage = location.pathname.includes(TRAINING_PLAYGROUND);
  const isTrainingPlaygroundPreviewPage = location.pathname.includes(TRAINING_PLAYGROUND_PREVIEW);
  const isInsightsPage = location.pathname.includes(INSIGHTS);

  const isAgentPage = location.pathname.match(/\/agent\/?$/) !== null;
  const isTrainingPage = location.pathname.match(/\/training\/?$/) !== null;
  const isAIBlocksPage = location.pathname.match(/\/ai-blocks\/?$/) !== null;

  // Detect V2 table pages that handle their own scrolling
  // Use exact matches or trailing slash matches to avoid matching detail pages
  const isTableV2Page =
    location.pathname.match(/\/conversations\/?$/) !== null || // ConversationsV2 (exact match)
    location.pathname.match(/\/conversations\/leads\/?$/) !== null || // LeadsV2 (exact match)
    location.pathname.match(/\/companies\/?$/) !== null || // CompaniesV2 (exact match)
    location.pathname.match(/\/visitors\/?$/) !== null || // VisitorsV2 (exact match)
    location.pathname.match(/\/icp\/?$/) !== null; // IcpV2 (exact match)

  const pathURL = location.pathname + location.search;

  return {
    isDashboardPage,
    isLoginPage,
    isOAuthCallbackPage,
    isLeadsPage,
    isConversationsPage,
    isLinkClicksPage,
    isAgentPage,
    isAgentKnowledgeBasePage,
    isAgentWorkflowPage,
    isAgentBrandingPage,
    isAgentEntrypointsPage,
    isAgentControlsPage,
    isTrainingPage,
    isTrainingPlaygroundPage,
    isTrainingPlaygroundPreviewPage,
    isInsightsPage,
    isTableV2Page,
    isAIBlocksPage,
    pathURL,
  };
};

export default usePageRouteState;
