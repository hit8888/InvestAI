import { wrapCreateBrowserRouterV6 } from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';
import Custom404 from '@breakout/design-system/components/layout/Custom404';

import RootLayout from '../layout/RootLayout.tsx';
import TenantLayout from '../layout/TenantLayout.tsx';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage/LoginPage.tsx';
import LeadsPageContainer from '../pages/LeadsPageContainer';
import ConversationsV2PageContainer from '../pages/ConversationsV2/ConversationsV2PageContainer';
import LeadsV2PageContainer from '../pages/LeadsV2/LeadsV2PageContainer';
import CompaniesV2PageContainer from '../pages/CompaniesV2/CompaniesV2PageContainer';
import VisitorsV2PageContainer from '../pages/VisitorsV2/VisitorsV2PageContainer';
import IcpV2PageContainer from '../pages/IcpV2/IcpV2PageContainer';
import PlaygroundPage from '../pages/PlaygroundPage/PlaygroundPage.tsx';
import PlaygroundPreviewPage from '../pages/PlaygroundPreviewPage.tsx';
import ProtectedRoute from '../pages/ProtectedRoutes';
import ConversationDetailsPageContainer from '../pages/ConversationDetailsPageContainer';

import { AppRoutesEnum } from '../utils/constants';
import WorkflowPage from '../pages/WorkflowPage';
import BrandingPage from '../pages/BrandingPage';
import ControlsPage from '../pages/ControlsPage';
import EmbeddingScriptsPage from '../pages/EmbeddingScriptsPage';
import DataSourcesContainer from '../pages/DataSourcesPage/DataSourcesContainer';
import AIBlocksPageContainer from '../pages/AIBlocksPage/index.tsx';
import InsightsPageContainer from '../pages/InsightsPageContainer.tsx';
import IntegrationsPage from '../pages/IntegrationsPage/IntegrationsPage.tsx';
import OAuthCallbackPage from '../pages/OAuthCallbackPage.tsx';
import ActiveConversationsPage from '../pages/ActiveConversationsPage/ActiveConversationsPage.tsx';
import CalendarPage from '../pages/CalendarPage/index.tsx';
import AdminProfilePage from '../pages/AdminProfilePage/index.tsx';
import AIBlocksPage from '../pages/AIBlocksPage/AIBlocksPage.tsx';
import DynamicBlockPage from '../pages/AIBlocksPage/DynamicBlockPage.tsx';
import SdrSettingsPage from '../pages/SdrSettingsPage/SdrSettingsPage.tsx';
import ConfigPage from '../pages/ConfigPage/ConfigPage.tsx';
import MembersPage from '../pages/MembersPage/MembersPage.tsx';

const sentryCreateBrowserRouter = wrapCreateBrowserRouterV6(createBrowserRouter);

const { LOGIN } = AppRoutesEnum;

const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: LOGIN.replace(/\/+$/, ''),
        element: <LoginPage />,
        children: [],
      },
      {
        path: '',
        element: <TenantLayout />,
        children: [
          {
            path: '',
            element: <ProtectedRoute element={<Dashboard />} />,
            children: [],
          },
          {
            path: '/:tenantName?',
            children: [
              {
                path: 'conversations',
                element: <ProtectedRoute element={<ConversationsV2PageContainer />} />,
              },
              {
                path: 'conversations/leads',
                element: <ProtectedRoute element={<LeadsV2PageContainer />} />,
              },
              {
                path: 'conversations/link-clicks',
                element: <ProtectedRoute element={<LeadsPageContainer />} />,
              },
              {
                path: 'conversations/leads/:sessionID',
                element: <ProtectedRoute element={<ConversationDetailsPageContainer />} />,
              },
              {
                path: 'conversations/link-clicks/:sessionID',
                element: <ProtectedRoute element={<ConversationDetailsPageContainer />} />,
              },
              {
                path: 'conversations/:sessionID',
                element: <ProtectedRoute element={<ConversationDetailsPageContainer />} />,
              },
              {
                path: 'active-conversations',
                element: <ProtectedRoute element={<ActiveConversationsPage />} />,
              },
              {
                path: 'active-conversations/assigned',
                element: <ProtectedRoute element={<ActiveConversationsPage />} />,
              },
              {
                path: 'active-conversations/pinned',
                element: <ProtectedRoute element={<ActiveConversationsPage />} />,
              },
              {
                path: 'active-conversations/live/:sessionID',
                element: <ProtectedRoute element={<ActiveConversationsPage />} />,
              },
              {
                path: 'agent',
                children: [
                  {
                    path: 'datasets',
                    element: <ProtectedRoute element={<DataSourcesContainer />} />,
                  },
                  {
                    path: 'datasets/webpages/:webPageID?',
                    element: <ProtectedRoute element={<DataSourcesContainer />} />,
                  },
                  {
                    path: 'datasets/documents/:documentID?',
                    element: <ProtectedRoute element={<DataSourcesContainer />} />,
                  },
                  {
                    path: 'datasets/videos',
                    element: <ProtectedRoute element={<DataSourcesContainer />} />,
                  },
                  {
                    path: 'datasets/slides',
                    element: <ProtectedRoute element={<DataSourcesContainer />} />,
                  },
                  {
                    path: 'workflow',
                    element: <ProtectedRoute element={<WorkflowPage />} />,
                  },
                  {
                    path: 'branding',
                    element: <ProtectedRoute element={<BrandingPage />} />,
                  },
                  {
                    path: 'controls',
                    element: <ProtectedRoute element={<ControlsPage />} />,
                  },
                ],
              },
              {
                path: 'training',
                children: [
                  {
                    path: 'playground',
                    element: <ProtectedRoute element={<PlaygroundPage />} />,
                  },
                  {
                    path: 'playground/preview',
                    element: <ProtectedRoute element={<PlaygroundPreviewPage />} />,
                  },
                ],
              },
              {
                path: 'insights',
                element: <ProtectedRoute element={<InsightsPageContainer />} />,
              },
              {
                path: 'accounts',
                element: <ProtectedRoute element={<CompaniesV2PageContainer />} />,
              },
              {
                path: 'contacts',
                element: <ProtectedRoute element={<VisitorsV2PageContainer />} />,
              },
              {
                path: 'icp',
                element: <ProtectedRoute element={<IcpV2PageContainer />} />,
              },
              {
                path: 'blocks',
                element: <ProtectedRoute element={<AIBlocksPageContainer />} />,
                children: [
                  {
                    index: true,
                    element: <ProtectedRoute element={<AIBlocksPage />} />,
                  },
                  {
                    path: ':blockId',
                    element: <ProtectedRoute element={<DynamicBlockPage />} />,
                  },
                ],
              },
              {
                path: 'config',
                element: <ProtectedRoute element={<ConfigPage />} />,
              },
              {
                path: 'settings',
                children: [
                  {
                    path: 'integrations',
                    element: <ProtectedRoute element={<IntegrationsPage />} />,
                  },
                  {
                    path: 'calendar',
                    element: <ProtectedRoute element={<CalendarPage />} />,
                  },
                  {
                    path: 'calendar/add-calendar',
                    element: <ProtectedRoute element={<CalendarPage />} />,
                  },
                  {
                    path: 'profile',
                    element: <ProtectedRoute element={<AdminProfilePage />} />,
                  },
                  {
                    path: 'sdr-settings',
                    element: <ProtectedRoute element={<SdrSettingsPage />} />,
                  },
                  {
                    path: 'members',
                    element: <ProtectedRoute element={<MembersPage />} />,
                  },
                  {
                    path: 'embeddings',
                    element: <ProtectedRoute element={<EmbeddingScriptsPage />} />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/auth/google/callback',
    element: <OAuthCallbackPage />,
    children: [],
  },
  {
    path: '/tenant/integration/oauth2/callback',
    element: <OAuthCallbackPage />,
    children: [],
  },
  {
    path: '*',
    element: <Custom404 />,
  },
];

const router = sentryCreateBrowserRouter(routes, {
  basename: '/',
});

export default router;
