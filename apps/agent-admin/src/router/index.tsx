import { wrapCreateBrowserRouter } from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';
import Custom404 from '@breakout/design-system/components/layout/Custom404';

import Root from '../layout';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import LeadsPage from '../pages/LeadsPage';
import ConversationsPage from '../pages/ConversationsPage';
import PlaygroundPage from '../pages/PlaygroundPage';
import ProtectedRoute from '../pages/ProtectedRoutes';
import withPageViewWrapper from '../pages/PageViewWrapper';

import { AppRoutesEnum } from '../utils/constants';

//TODO: Move to a separate file(Fixes eslint(react-refresh/only-export-components))
const WrapDashboard = withPageViewWrapper(Dashboard);
const WrapLeadsPage = withPageViewWrapper(LeadsPage);
const WrapConversationsPage = withPageViewWrapper(ConversationsPage);
const WrapPlaygroundPage = withPageViewWrapper(PlaygroundPage);

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

const { LOGIN, LEADS, CONVERSATIONS, PLAYGROUND } = AppRoutesEnum;

const routes = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <ProtectedRoute element={<WrapDashboard />} />,
        children: [],
      },
      {
        path: LOGIN,
        element: <LoginPage />,
        children: [],
      },
      {
        path: LEADS,
        element: <ProtectedRoute element={<WrapLeadsPage />} />,
        children: [],
      },
      {
        path: CONVERSATIONS,
        element: <ProtectedRoute element={<WrapConversationsPage />} />,
        children: [],
      },
      {
        path: PLAYGROUND,
        element: <ProtectedRoute element={<WrapPlaygroundPage />} />,
        children: [],
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
