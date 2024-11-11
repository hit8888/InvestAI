import { wrapCreateBrowserRouter } from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';
import Chat from '../pages/Chat';
import InternalAdmin from '../pages/InternalAdmin/';
import FeedbackAdmin from '../pages/FeedbackAdmin';

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

const router = sentryCreateBrowserRouter([
  {
    path: '/',
    element: <>👋</>,
  },
  {
    path: '/org/:orgName/agent/:agentId',
    element: <Chat />,
  },
  {
    path: '/demo/org/:orgName/agent/:agentId',
    element: <FeedbackAdmin />,
  },
  {
    path: '/internal-admin-use/org/:orgName/agent/:agentId',
    element: <InternalAdmin />,
  },
]);

export default router;
