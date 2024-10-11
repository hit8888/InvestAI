import Backdrop from "@meaku/ui/components/layout/backdrop";
import { lazy, Suspense, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import useConfigData from "../hooks/query/useConfigData";
import { useAdminStore } from "../stores/useAdminStore";

const SessionInput = lazy(
  () => import("../components/views/admin/SessionInput"),
);
const SessionPlayback = lazy(
  () => import("../components/views/admin/SessionPlayback"),
);

const InternalAdmin = () => {
  const { data: config, isError, error } = useConfigData();

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
        <h3>Config Error</h3>
        <pre>{JSON.stringify(error, null, 2)}</pre>
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

export default InternalAdmin;
