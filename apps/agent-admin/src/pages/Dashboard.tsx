import { useNavigate } from 'react-router-dom';
import withPageViewWrapper from '../pages/PageViewWrapper';
import CustomFilterDropdown from '../components/tableComp/CustomFilterDropdown';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';
import { setTenantIdentifier } from '@meaku/core/utils/index';

const Dashboard = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const organizationsList = userInfo?.organizations;
  // Regex pattern to match the first word character (letter, number, or underscore)
  const firstCharRegex = /^\w/;
  const organizationsOptions = organizationsList
    // Convert to lowercase and capitalize first letter
    // ^\w matches the first word character at the start of the string
    // The replacement function converts that character to uppercase
    ?.map((item) => item?.name?.toLowerCase().replace(firstCharRegex, (c) => c.toUpperCase()))
    .filter((name): name is string => !!name)
    .sort() || [''];

  const handleSelectOrganization = (option: string | null) => {
    const orgItem = organizationsList?.find((item) => item?.name === option);
    if (orgItem) {
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

export default withPageViewWrapper(Dashboard);
