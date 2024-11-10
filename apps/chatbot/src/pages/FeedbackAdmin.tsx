import Backdrop from "@breakout/design-system/components/layout/backdrop";
import { lazy, Suspense, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import useAdminUserEmail from "../hooks/useAdminUserEmail";
import useConfigDataQuery from "@meaku/core/queries/useConfigDataQuery";
import useInitializeSessionDataQuery from "@meaku/core/queries/useInitializeSessionDataQuery";

const Welcome = lazy(() => import("../components/views/admin/Welcome"));
const Feedback = lazy(() => import("../components/views/admin/Feedback"));

const FeedbackAdmin = () => {
  const { userEmail } = useAdminUserEmail();
  const {
    data: config,
    isError: isConfigFetchError,
    error: configError,
  } = useConfigDataQuery();
  const {
    session,
    isError: isInitializationError,
    error: initializationError,
  } = useInitializeSessionDataQuery();

  const isError = isConfigFetchError || isInitializationError;
  const renderUI = Boolean(config ?? session);

  const Component = useMemo(() => {
    if (userEmail) {
      return Feedback;
    }

    return Welcome;
  }, [userEmail]);

  if (isError) {
    return (
      <div>
        <div>
          <h3>Config Error</h3>
          <pre>{JSON.stringify(configError, null, 2)}</pre>
        </div>
        <div>
          <h3>Initialization Error</h3>
          <pre>{JSON.stringify(initializationError, null, 2)}</pre>
        </div>
      </div>
    );
  }

  if (!renderUI) {
    return <></>;
  }

  return (
    <div className="h-screen">
      <Backdrop className="flex items-center justify-center">
        <div className="flex h-4/5 w-11/12 max-w-7xl flex-col overflow-hidden rounded-xl bg-white lg:w-10/12 xl:w-9/12">
          <Suspense fallback={<></>}>
            <Component />
          </Suspense>
        </div>
      </Backdrop>

      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default FeedbackAdmin;
