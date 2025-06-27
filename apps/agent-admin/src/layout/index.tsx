import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SidebarComponent/Sidebar';
import usePageRouteState from '../hooks/usePageRouteState';
import useAuthHandler from '../hooks/useAuthHandler';
import { cn } from '@breakout/design-system/lib/cn';
import { SidebarProvider } from '../context/SidebarContext';

const Root = () => {
  const { isDashboardPage, isLoginPage, isOAuthCallbackPage } = usePageRouteState();
  useAuthHandler();

  const notShowingSidebarCondition = !isLoginPage && !isDashboardPage && !isOAuthCallbackPage;

  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
};

export default Root;
