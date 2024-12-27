import { wrapCreateBrowserRouter } from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import LeadsPage from '../pages/LeadsPage';
import ConversationsPage from '../pages/ConversationsPage';
import PlaygroundPage from '../pages/PlaygroundPage';
import ProtectedRoute from '../pages/protectedRoutes';
import withPageViewWrapper from '../pages/PageViewWrapper';

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
        path: '/login',
        element: <LoginPage />,
        children: [],
      },
      {
        path: '/leads',
        element: <ProtectedRoute element={<WrapLeadsPage />} />,
        children: [],
      },
      {
        path: '/conversations',
        element: <ProtectedRoute element={<WrapConversationsPage />} />,
        children: [],
      },
      {
        path: '/playground',
        element: <ProtectedRoute element={<WrapPlaygroundPage />} />,
        children: [],
      },
    ],
  },
];

const router = sentryCreateBrowserRouter(routes);

export default router;
