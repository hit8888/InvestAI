import Backdrop from '@breakout/design-system/components/layout/backdrop';
import { lazy, Suspense, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDebugStore } from '../../stores/useDebugStore';
import { withWhiteLabelConfig } from '../withWhiteLabelConfig';

const SessionInput = lazy(() => import('../../components/views/admin/SessionInput'));
const SessionPlayback = lazy(() => import('../../components/views/admin/SessionPlayback'));

const InternalAdmin = () => {
  const sessionId = useDebugStore((state) => state.sessionId); //Should this also be part of localStorage

  const Component = useMemo(() => {
    if (sessionId) {
      return SessionPlayback;
    }

    return SessionInput;
  }, [sessionId]);

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

const InternalAdminWithWithWhiteLabelConfig = withWhiteLabelConfig(InternalAdmin);
export default InternalAdminWithWithWhiteLabelConfig;
