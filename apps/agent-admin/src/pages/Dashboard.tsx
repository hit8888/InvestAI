import { useNavigate } from 'react-router-dom';
import CustomFilterDropdown from '../components/tableComp/CustomFilterDropdown';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';

const Dashboard = () => {
  const { userInfo, setTenantIdentifier } = useAuth();
  const navigate = useNavigate();
  const organizationsList = userInfo?.organizations;
  const organizationsOptions = organizationsList
    ?.map((item) => item?.['tenant-name'])
    .filter((name): name is string => !!name) || [''];

  const handleSelectOrganization = (option: string | null) => {
    const orgItem = organizationsList?.find((item) => item?.['tenant-name'] === option);
    if (setTenantIdentifier && orgItem) {
      setTenantIdentifier(orgItem);
    }
    navigate(AppRoutesEnum.LEADS);
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

export default Dashboard;
