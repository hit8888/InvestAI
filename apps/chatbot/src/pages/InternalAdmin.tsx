import Backdrop from "@breakout/design-system/components/layout/backdrop";
import { lazy, Suspense, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import useConfigData from "../hooks/query/useConfigDataQuery";
import { useAdminStore } from "../stores/useAdminStore";

const SessionInput = lazy(
  () => import("../components/views/admin/SessionInput"),
);
const SessionPlayback = lazy(
  () => import("../components/views/admin/SessionPlayback"),
);

const InternalAdmin = () => {
  const {
    data: config,
    isError: isConfigFetchError,
    error: configError,
  } = useConfigData({ forceFetch: true });

  const isError = isConfigFetchError;
  const renderUI = Boolean(config);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  const Component = useMemo(() => {
    if (isAuthenticated) {
      return SessionPlayback;
    }

    return SessionInput;
  }, [isAuthenticated]);

  if (isError) {
    return (
      <div>
        <div>
          <h3>Config Error</h3>
          <pre>{JSON.stringify(configError, null, 2)}</pre>
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

export default InternalAdmin;
