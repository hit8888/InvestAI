import Backdrop from "@meaku/ui/components/layout/backdrop";
import { lazy, Suspense, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import useInitializeSessionData from "../hooks/query/useInitializeSessionData";
import useAdminUserEmail from "../hooks/useAdminUserEmail";

const Welcome = lazy(() => import("../components/views/admin/Welcome"));
const Feedback = lazy(() => import("../components/views/admin/Feedback"));

const FeedbackAdmin = () => {
  const { userEmail } = useAdminUserEmail();
  const { session, isError, isFetching } = useInitializeSessionData();

  const Component = useMemo(() => {
    if (userEmail) {
      return Feedback;
    }

    return Welcome;
  }, [userEmail]);

  if (isError || isFetching) {
    return <></>;
  }

  if (!session) {
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

export default FeedbackAdmin;
