import { lazy, Suspense, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import useAdminUserEmail from '../../hooks/useAdminUserEmail';
import { withWhiteLabelConfig } from '../withWhiteLabelConfig';

const Welcome = lazy(() => import('../../components/views/admin/Welcome'));
const Feedback = lazy(() => import('../../components/views/admin/Feedback'));

const FeedbackAdmin = () => {
  const { userEmail } = useAdminUserEmail();

  const Component = useMemo(() => {
    if (userEmail) {
      return Feedback;
    }

    return Welcome;
  }, [userEmail]);

  return (
    <div>
      <Suspense fallback={<></>}>
        <Component />
      </Suspense>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

const FeedbackAdminWithLabelConfig = withWhiteLabelConfig(FeedbackAdmin);
export default FeedbackAdminWithLabelConfig;
