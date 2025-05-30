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
import WorkflowPage from '../pages/WorkflowPage';
import BrandingPage from '../pages/BrandingPage';
import EntryPointsPage from '../pages/EntryPointsPage';
import InstructionsPage from '../pages/InstructionsPage.tsx';
import DataSourcesContainer from '../pages/DataSourcesPage/DataSourcesContainer';
import RedirectGuard from './RedirectGaurd.tsx';

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

const { LOGIN } = AppRoutesEnum;

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
        path: LOGIN.replace(/\/+$/, ''),
        element: <LoginPage />,
        children: [],
      },
      {
        path: '/:tenantName?',
        element: <RedirectGuard />,
        children: [
          {
            path: 'leads',
            element: <ProtectedRoute element={<LeadsPageContainer />} />,
            children: [],
          },
          {
            path: 'leads/:sessionID',
            element: <ProtectedRoute element={<ConversationDetailsPageContainer isLeadsPage={true} />} />,
          },
          {
            path: 'conversations',
            element: <ProtectedRoute element={<ConversationsPageContainer />} />,
          },
          {
            path: 'conversations/:sessionID',
            element: <ProtectedRoute element={<ConversationDetailsPageContainer isLeadsPage={false} />} />,
          },
          {
            path: 'agent',
            children: [
              {
                path: 'data-sources',
                element: <ProtectedRoute element={<DataSourcesContainer />} />,
              },
              {
                path: 'data-sources/webpages',
                element: <ProtectedRoute element={<DataSourcesContainer />} />,
              },
              {
                path: 'data-sources/documents',
                element: <ProtectedRoute element={<DataSourcesContainer />} />,
              },
              {
                path: 'data-sources/videos',
                element: <ProtectedRoute element={<DataSourcesContainer />} />,
              },
              {
                path: 'data-sources/slides',
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
                path: 'entrypoints',
                element: <ProtectedRoute element={<EntryPointsPage />} />,
              },
              {
                path: 'instructions',
                element: <ProtectedRoute element={<InstructionsPage />} />,
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
            ],
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

const router = sentryCreateBrowserRouter(routes, {
  basename: '/',
});

export default router;
