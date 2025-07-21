import { wrapCreateBrowserRouterV6 } from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';
import AgentPage from '../pages/AgentPage';
import Custom404 from '@breakout/design-system/components/layout/Custom404';
import FeedbackAdmin from '../pages/FeedbackAdmin';

const sentryCreateBrowserRouter = wrapCreateBrowserRouterV6(createBrowserRouter);

const router = sentryCreateBrowserRouter([
  {
    path: '/',
    element: <>👋</>,
  },
  {
    path: '/org/:orgName/agent/:agentId',
    element: <AgentPage />,
  },
  {
    path: '/demo/org/:orgName/agent/:agentId',
    element: <FeedbackAdmin />,
  },
  {
    path: '*',
    element: <Custom404 />,
  },
]);

export default router;
