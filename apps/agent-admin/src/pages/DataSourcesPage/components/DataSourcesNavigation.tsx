import Typography from '@breakout/design-system/components/Typography/index';
import { useDataSources } from '../../../context/DataSourcesContext';
import { useLocation, useNavigate } from 'react-router-dom';

const DataSourcesNavigation = () => {
  const { selectedType, toggleDataSourceSelectedType } = useDataSources();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = () => {
    toggleDataSourceSelectedType(null);
    const basePath = pathname.split('/data-sources')[0] + '/data-sources';
    navigate(basePath);
  };
  return (
    <div className="flex flex-1 items-center gap-2">
      <Typography tabIndex={0} onClick={handleClick} variant="label-16-medium" className="cursor-pointer text-gray-400">
        Data Sources
      </Typography>
      <Typography variant="label-16-medium" className="text-gray-400">
        /
      </Typography>
      <Typography variant="label-16-medium" className="capitalize">
        {selectedType}
      </Typography>
    </div>
  );
};

export default DataSourcesNavigation;
