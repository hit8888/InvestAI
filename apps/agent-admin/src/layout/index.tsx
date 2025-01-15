import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import usePageRouteState from '../hooks/usePageRouteState';
import useAuthHandler from '../hooks/useAuthHandler';
import { cn } from '@breakout/design-system/lib/cn';
import usePageFocusAndVisibility from '../hooks/usePageFocusAndVisibility';

const Root = () => {
  const { isDashboardPage, isLoginPage } = usePageRouteState();
  const { refreshTokens } = useAuthHandler();
  useAuthHandler();

  const notShowingSidebarCondition = !isLoginPage && !isDashboardPage;
  const accessTokenExpiry = parseInt(localStorage.getItem('accessTokenExpiry') || '0');

  // NEED TO validate the refresh token if user is not focused on the website page
  const handleRefreshTokenValidityCgheck = () => {
    if (Date.now() > accessTokenExpiry) {
      refreshTokens();
    }
  };

  usePageFocusAndVisibility(handleRefreshTokenValidityCgheck);

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
