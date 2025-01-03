import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useSidebarAndPageState from '../hooks/useSidebarAndPageState';
import useAuthHandler from '../hooks/useAuthHandler';
import { cn } from '@breakout/design-system/lib/cn';

const Root = () => {
  const { isLoginPage } = useSidebarAndPageState();
  useAuthHandler();

  return (
    <div className="flex w-full">
      {!isLoginPage ? <Sidebar /> : null}
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
