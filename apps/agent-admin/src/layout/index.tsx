import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useSidebarAndPageState from '../hooks/useSidebarAndPageState';
import useAuthHandler from '../hooks/useAuthHandler';

const Root = () => {
  const { isLoginPage } = useSidebarAndPageState();
  useAuthHandler();

  return (
    <div className="flex w-full">
      {!isLoginPage ? <Sidebar /> : null}
      <div className={`${isLoginPage ? 'w-full' : 'flex-1'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
