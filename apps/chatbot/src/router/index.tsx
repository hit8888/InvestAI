import { wrapCreateBrowserRouter } from "@sentry/react";
import { createBrowserRouter } from "react-router-dom";
import Chat from "../pages/Chat";
import Demo from "../pages/Demo";

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

const router = sentryCreateBrowserRouter([
  {
    path: "/",
    element: <>👋</>,
  },
  {
    path: "/org/:orgId/agent/:agentId",
    element: <Chat />,
  },
  {
    path: "/demo/org/:orgId/agent/:agentId",
    element: <Demo />,
  },
]);

export default router;
