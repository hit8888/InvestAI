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
import ConversationDetailsPage from '../pages/ConversationDetailsPage';

import { AppRoutesEnum } from '../utils/constants';

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

const { LOGIN, LEADS, CONVERSATIONS, PLAYGROUND } = AppRoutesEnum;

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
        element: <ProtectedRoute element={<LeadsPage />} />,
        children: [],
      },
      {
        path: CONVERSATIONS,
        element: <ProtectedRoute element={<ConversationsPage />} />,
      },
      {
        path: `${CONVERSATIONS}/:sessionID`, // Dynamic route for individual conversations
        element: <ProtectedRoute element={<ConversationDetailsPage />} />,
      },
      {
        path: PLAYGROUND,
        element: <ProtectedRoute element={<PlaygroundPage />} />,
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
