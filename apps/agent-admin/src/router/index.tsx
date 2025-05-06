import { wrapCreateBrowserRouter } from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';
import Custom404 from '@breakout/design-system/components/layout/Custom404';

import Root from '../layout';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import LeadsPageContainer from '../pages/LeadsPageContainer';
import ConversationsPageContainer from '../pages/ConversationsPageContainer';
import PlaygroundPage from '../pages/PlaygroundPage';
import ProtectedRoute from '../pages/ProtectedRoutes';
import ConversationDetailsPageContainer from '../pages/ConversationDetailsPageContainer';

import { AppRoutesEnum } from '../utils/constants';
import DataSourcesPage from '../pages/DataSourcesPage';
import WorkflowPage from '../pages/WorkflowPage';
import BrandingPage from '../pages/BrandingPage';
import EntryPointsPage from '../pages/EntryPointsPage';

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

const { LOGIN, LEADS, CONVERSATIONS, AGENT } = AppRoutesEnum;

const routes = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <ProtectedRoute element={<Dashboard />} />,
        children: [],
      },
      {
        path: LOGIN,
        element: <LoginPage />,
        children: [],
      },
      {
        path: LEADS,
        element: <ProtectedRoute element={<LeadsPageContainer />} />,
        children: [],
      },
      {
        path: `${LEADS}/:sessionID`, // Dynamic route for individual leads
        element: <ProtectedRoute element={<ConversationDetailsPageContainer isLeadsPage={true} />} />,
      },
      {
        path: CONVERSATIONS,
        element: <ProtectedRoute element={<ConversationsPageContainer />} />,
      },
      {
        path: `${CONVERSATIONS}/:sessionID`, // Dynamic route for individual conversations
        element: <ProtectedRoute element={<ConversationDetailsPageContainer isLeadsPage={false} />} />,
      },
      {
        path: AGENT,
        children: [
          {
            path: 'playground',
            element: <ProtectedRoute element={<PlaygroundPage />} />,
          },
          {
            path: 'data-sources',
            element: <ProtectedRoute element={<DataSourcesPage />} />,
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
            path: 'entrypoints',
            element: <ProtectedRoute element={<EntryPointsPage />} />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Custom404 />,
  },
];

const router = sentryCreateBrowserRouter(routes);

export default router;
