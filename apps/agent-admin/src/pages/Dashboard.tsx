import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex w-full">
      <div className="flex-1 p-[20px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
