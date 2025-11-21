import { useNavigate } from 'react-router-dom';
import withPageViewWrapper from '../pages/PageViewWrapper';
import CustomFilterDropdown from '@breakout/design-system/components/Dropdown/CustomFilterDropdown';
import { useSessionStore } from '../stores/useSessionStore';
import toast from 'react-hot-toast';
import { buildPathWithTenantBase } from '../utils/navigation';
import { DEFAULT_ROUTE } from '../utils/constants';

const Dashboard = () => {
  const userInfo = useSessionStore((state) => state.userInfo);
  const navigate = useNavigate();
  const organizationsList = userInfo?.organizations;
  const organizationsOptions =
    organizationsList?.map((item) => item?.name).filter((name): name is string => !!name) || [];

  const handleSelectOrganization = async (option: string | null) => {
    const orgItem = organizationsList?.find((item) => item?.name === option);
    if (orgItem) {
      const tenantName = orgItem['tenant-name'] ?? '';
      navigate(buildPathWithTenantBase(tenantName, DEFAULT_ROUTE), { replace: true });
    } else {
      toast.error('Organization not found');
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-start">
      <div className="flex w-96 flex-col justify-center gap-6 pt-24">
        <div className="w-full text-center text-4xl font-semibold text-primary">Dashboard</div>
        <CustomFilterDropdown
          id="dashboard-organization-dropdown"
          options={organizationsOptions}
          filterLabel="Select Organization"
          onCallback={handleSelectOrganization}
        />
      </div>
    </div>
  );
};

export default withPageViewWrapper(Dashboard);
