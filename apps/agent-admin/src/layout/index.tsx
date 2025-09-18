import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SidebarComponent/Sidebar';
import usePageRouteState from '../hooks/usePageRouteState';
import useAuthHandler from '../hooks/useAuthHandler';
import { cn } from '@breakout/design-system/lib/cn';
import { SidebarProvider } from '../context/SidebarContext';

const Root = () => {
  const { isDashboardPage, isLoginPage, isOAuthCallbackPage } = usePageRouteState();
  const { initialized } = useAuthHandler();

  const notShowingSidebarCondition = !isLoginPage && !isDashboardPage && !isOAuthCallbackPage;

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-20 w-20">
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/20 p-3">
              <img src="/logo-white.svg" height={54} width={54} className="h-full w-full" />
            </div>
            <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full bg-primary/15"></div>
            <div className="h-18 w-18 absolute inset-1 animate-pulse rounded-full bg-primary/10"></div>
          </div>
        </div>
      </div>
    );
  }

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
