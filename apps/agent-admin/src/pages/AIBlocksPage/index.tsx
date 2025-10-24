import withPageViewWrapper from '../PageViewWrapper';
import { Outlet } from 'react-router-dom';

// Container component that renders child routes
const AIBlocksPageContainer = () => {
  return (
    <div className={`relative flex w-full flex-col `}>
      <Outlet />
    </div>
  );
};

export default withPageViewWrapper(AIBlocksPageContainer);
