import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Root = () => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 p-[20px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
