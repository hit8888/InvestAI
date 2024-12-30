import { wrapCreateBrowserRouter } from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import LeadsPage from '../pages/LeadsPage';
import ConversationsPage from '../pages/ConversationsPage';
import PlaygroundPage from '../pages/PlaygroundPage';

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

const router = sentryCreateBrowserRouter([
  {
    path: '',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Dashboard />,
        children: [],
      },
      {
        path: '/login',
        element: <LoginPage />,
        children: [],
      },
      {
        path: '/leads',
        element: <LeadsPage />,
        children: [],
      },
      {
        path: '/conversations',
        element: <ConversationsPage />,
        children: [],
      },
      {
        path: '/playground',
        element: <PlaygroundPage />,
        children: [],
      },
    ],
  },
]);

export default router;
