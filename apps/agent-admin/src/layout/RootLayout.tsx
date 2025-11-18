import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SidebarV2 from '../components/SidebarV2/SidebarV2';
import usePageRouteState from '../hooks/usePageRouteState';
import { cn } from '@breakout/design-system/lib/cn';
import { SidebarProvider } from '../context/SidebarContext';
import { useAuthInitializer } from '../hooks/useAuthInitializer';
import { AppRoutesEnum } from '../utils/constants';

const RootLayout = () => {
  const { isDashboardPage, isLoginPage, isOAuthCallbackPage, isTableV2Page, isTrainingPlaygroundPreviewPage } =
    usePageRouteState();
  const location = useLocation();
  const { isLoading, shouldRedirectToLogin } = useAuthInitializer();
  const navigate = useNavigate();

  // Redirect to login if tokens are missing and not already on login/OAuth pages
  useEffect(() => {
    if (shouldRedirectToLogin && !isLoginPage && !isOAuthCallbackPage) {
      const currentPath = location.pathname + location.search;
      localStorage.setItem('redirectAfterLogin', JSON.stringify(currentPath));
      navigate(`/${AppRoutesEnum.LOGIN}`, { replace: true });
    }
  }, [shouldRedirectToLogin, isLoginPage, isOAuthCallbackPage, navigate, location.pathname, location.search]);

  const notShowingSidebarCondition =
    !isLoginPage && !isDashboardPage && !isOAuthCallbackPage && !isTrainingPlaygroundPreviewPage;

  if (isLoading) {
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
      <div
        className={cn('flex w-full', {
          'p-0': isTrainingPlaygroundPreviewPage,
        })}
      >
        {notShowingSidebarCondition ? <SidebarV2 /> : null}
        <div
          className={cn({
            'w-full': isLoginPage,
            // Table pages: overflow-hidden (tables handle their own scrolling)
            // Non-table pages: overflow-y-auto (enable vertical scrolling)
            'max-h-screen min-w-0 flex-1 border-l': !isLoginPage,
            'overflow-hidden': !isLoginPage && isTableV2Page,
            'overflow-y-auto': !isLoginPage && !isTableV2Page,
            'max-h-full border-0': isTrainingPlaygroundPreviewPage,
          })}
          style={{
            contain: 'layout style',
          }}
        >
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;
