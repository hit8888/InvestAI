import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="w-full text-center text-4xl text-primary">Dashboard</div>
      <div className="flex-1 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
