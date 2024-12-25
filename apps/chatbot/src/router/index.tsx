import { wrapCreateBrowserRouter } from '@sentry/react';
import { createBrowserRouter } from 'react-router-dom';
import Chat from '../pages/Chat';
import Custom404 from '@breakout/design-system/components/layout/Custom404';
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
    path: '*',
    element: <Custom404 errorMessage={'An unexpected error occurred'} />,
  },
]);

export default router;
