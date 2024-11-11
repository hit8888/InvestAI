import Backdrop from '@breakout/design-system/components/layout/backdrop';
import { lazy, Suspense, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAdminStore } from '../stores/useAdminStore';

const SessionInput = lazy(() => import('../components/views/admin/SessionInput'));
const SessionPlayback = lazy(() => import('../components/views/admin/SessionPlayback'));

const InternalAdmin = () => {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  const Component = useMemo(() => {
    if (isAuthenticated) {
      return SessionPlayback;
    }

    return SessionInput;
  }, [isAuthenticated]);

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
