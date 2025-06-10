import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SidebarComponent/Sidebar';
import usePageRouteState from '../hooks/usePageRouteState';
import useAuthHandler from '../hooks/useAuthHandler';
import { cn } from '@breakout/design-system/lib/cn';

const Root = () => {
  const { isDashboardPage, isLoginPage, isGoogleSsoCallbackPage } = usePageRouteState();
  useAuthHandler();

  const notShowingSidebarCondition = !isLoginPage && !isDashboardPage && !isGoogleSsoCallbackPage;

  return (
    <div className="flex w-full">
      {notShowingSidebarCondition ? <Sidebar /> : null}
      <div
        className={cn({
          'w-full': isLoginPage,
          'flex-1': !isLoginPage,
        })}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
