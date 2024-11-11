import Backdrop from "@breakout/design-system/components/layout/backdrop";
import { lazy, Suspense, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import useAdminUserEmail from "../../hooks/useAdminUserEmail";
import { withWhiteLabelConfig } from "../withWhiteLabelConfig";


const Welcome = lazy(() => import("../../components/views/admin/Welcome"));
const Feedback = lazy(() => import("../../components/views/admin/Feedback"));

const FeedbackAdmin = () => {
  const { userEmail } = useAdminUserEmail();

  const Component = useMemo(() => {
    if (userEmail) {
      return Feedback;
    }

    return Welcome;
  }, [userEmail]);

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



const FeedbackAdminWithLabelConfig = withWhiteLabelConfig(FeedbackAdmin);
export default FeedbackAdminWithLabelConfig;