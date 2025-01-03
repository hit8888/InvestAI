import { wrapCreateBrowserRouter } from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import LeadsPage from '../pages/LeadsPage';
import ConversationsPage from '../pages/ConversationsPage';
import PlaygroundPage from '../pages/PlaygroundPage';
import ProtectedRoute from '../pages/ProtectedRoutes';
import withPageViewWrapper from '../pages/PageViewWrapper';
import {
  URL_ROUTE_CONVERSATIONS_PAGE,
  URL_ROUTE_LEADS_PAGE,
  URL_ROUTE_LOGIN_PAGE,
  URL_ROUTE_PLAYGROUND_PAGE,
} from '../utils/constants';

const WrapDashboard = withPageViewWrapper(Dashboard);
const WrapLeadsPage = withPageViewWrapper(LeadsPage);
const WrapConversationsPage = withPageViewWrapper(ConversationsPage);
const WrapPlaygroundPage = withPageViewWrapper(PlaygroundPage);

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

const routes = [
  {
    path: '',
    element: <Root />,
    children: [
      {
        path: '',
        element: <ProtectedRoute element={<WrapDashboard />} />,
        children: [],
      },
      {
        path: URL_ROUTE_LOGIN_PAGE,
        element: <LoginPage />,
        children: [],
      },
      {
        path: URL_ROUTE_LEADS_PAGE,
        element: <ProtectedRoute element={<WrapLeadsPage />} />,
        children: [],
      },
      {
        path: URL_ROUTE_CONVERSATIONS_PAGE,
        element: <ProtectedRoute element={<WrapConversationsPage />} />,
        children: [],
      },
      {
        path: URL_ROUTE_PLAYGROUND_PAGE,
        element: <ProtectedRoute element={<WrapPlaygroundPage />} />,
        children: [],
      },
    ],
  },
];

const router = sentryCreateBrowserRouter(routes);

export default router;
