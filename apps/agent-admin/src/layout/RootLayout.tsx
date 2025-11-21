import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import SidebarV2 from '../components/SidebarV2/SidebarV2';
import usePageRouteState from '../hooks/usePageRouteState';
import { cn } from '@breakout/design-system/lib/cn';
import { SidebarProvider } from '../context/SidebarContext';
import { useAuthInitializer } from '../hooks/useAuthInitializer';
import { AppRoutesEnum } from '../utils/constants';
import { SevakChatWidget } from '../components/SevakChatWidget';
import type { RouteStep } from '@sevak/client';

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

  // Handle sequential navigation from Sevak routes
  useEffect(() => {
    const state = location.state as {
      sevakRoutes?: RouteStep[];
      currentRouteIndex?: number;
      totalRoutes?: number;
    } | null;
    if (!state?.sevakRoutes || state.sevakRoutes.length === 0) {
      // Clear completed routes if navigation is done
      const hasCompletedRoutes = localStorage.getItem('sevakCompletedRoutes');
      if (hasCompletedRoutes && !state?.sevakRoutes) {
        // Navigation completed, keep the completed indices for display
        return;
      }
      return;
    }

    const routes = state.sevakRoutes;
    const currentIndex = state.currentRouteIndex ?? 0;
    const totalRoutes = state.totalRoutes ?? routes.length + currentIndex;
    const nextRoute = routes[0];

    if (!nextRoute.url) {
      return;
    }

    // Mark current route as completed
    const completedIndices = Array.from({ length: currentIndex + 1 }, (_, i) => i);
    localStorage.setItem('sevakCompletedRoutes', JSON.stringify(completedIndices));

    // Trigger storage event for same-tab listeners
    window.dispatchEvent(new Event('storage'));

    // Show toast with description
    if (nextRoute.description) {
      toast.success(nextRoute.description, {
        duration: 5000,
      });
    }

    // Wait 5 seconds, then navigate to next route
    const timeoutId = setTimeout(() => {
      const remainingRoutes = routes.slice(1);
      navigate(nextRoute.url!, {
        state:
          remainingRoutes.length > 0
            ? {
                sevakRoutes: remainingRoutes,
                currentRouteIndex: currentIndex + 1,
                totalRoutes,
              }
            : undefined,
      });
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [location.state, navigate]);

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
      {/* Chat Widget - only show on authenticated pages */}
      {!isLoginPage && !isOAuthCallbackPage && (
        <SevakChatWidget serverUrl={import.meta.env.VITE_SEVAK_SERVER_URL || 'http://localhost:7777'} />
      )}
    </SidebarProvider>
  );
};

export default RootLayout;
