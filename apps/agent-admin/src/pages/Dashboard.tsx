import { useNavigate } from 'react-router-dom';
import withPageViewWrapper from '../pages/PageViewWrapper';
import CustomFilterDropdown from '@breakout/design-system/components/Dropdown/CustomFilterDropdown';
import { useAuth } from '../context/AuthProvider';
import { setupTenantAndAgent } from '../utils/apiCalls';
import toast from 'react-hot-toast';
import { getDashboardBasicPathURL } from '../utils/common';
import { DEFAULT_ROUTE } from '../utils/constants';

const Dashboard = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const organizationsList = userInfo?.organizations;
  const organizationsOptions =
    organizationsList?.map((item) => item?.name).filter((name): name is string => !!name) || [];

  const handleSelectOrganization = async (option: string | null) => {
    const orgItem = organizationsList?.find((item) => item?.name === option);
    if (orgItem) {
      await setupTenantAndAgent(orgItem);
      const basicPathURL = getDashboardBasicPathURL(orgItem['tenant-name'] ?? '');
      navigate(`${basicPathURL}/${DEFAULT_ROUTE}`);
    } else {
      toast.error('Organization not found');
      navigate('/');
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-96 flex-col justify-center gap-6 pt-24">
        <div className="w-full text-center text-4xl font-semibold text-primary">Dashboard</div>
        <CustomFilterDropdown
          options={organizationsOptions}
          filterLabel="Select Organization"
          onCallback={handleSelectOrganization}
        />
      </div>
    </div>
  );
};

export default withPageViewWrapper(Dashboard);
