import Backdrop from "@meaku/ui/components/layout/backdrop";
import { lazy, Suspense, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import useConfigData from "../hooks/query/useConfigData";
import useInitializeSessionData from "../hooks/query/useInitializeSessionData";
import useAdminUserEmail from "../hooks/useAdminUserEmail";

const Welcome = lazy(() => import("../components/views/admin/Welcome"));
const Feedback = lazy(() => import("../components/views/admin/Feedback"));

const Admin = () => {
  const { userEmail } = useAdminUserEmail();
  const {
    data: config,
    isError: isConfigFetchError,
    error: configError,
  } = useConfigData();
  const {
    session,
    isError: isInitializationError,
    error: initializationError,
  } = useInitializeSessionData();

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
    <div className="ui-h-screen">
      <Backdrop className="ui-flex ui-items-center ui-justify-center">
        <div className="ui-flex ui-h-4/5 ui-w-11/12 ui-max-w-7xl ui-flex-col ui-overflow-hidden ui-rounded-xl ui-bg-white lg:ui-w-10/12 xl:ui-w-9/12">
          <Suspense fallback={<></>}>
            <Component />
          </Suspense>
        </div>
      </Backdrop>

      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default Admin;
