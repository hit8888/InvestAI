import Typography from '@breakout/design-system/components/Typography/index';
import { useDataSources } from '../../../context/DataSourcesContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { cn } from '@breakout/design-system/lib/cn';

const DataSourcesNavigation = () => {
  const { selectedType, toggleDataSourceSelectedType } = useDataSources();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { webPageID, documentID } = useParams();
  const dataSourceID = webPageID || documentID;
  const dataItemView = !!dataSourceID;

  const handleDataSourcesClick = () => {
    toggleDataSourceSelectedType(null);
    const basePath = pathname.split('/data-sources')[0] + '/data-sources';
    navigate(basePath);
  };

  const handleDataSourceTypeClick = () => {
    if (dataItemView) {
      const dataSourcePath = pathname.replace(/\/\d+$/, '');
      navigate(dataSourcePath);
    }
  };

  return (
    <div className="flex flex-1 items-center gap-2">
      <Typography
        tabIndex={0}
        onClick={handleDataSourcesClick}
        variant="label-16-medium"
        className="cursor-pointer text-gray-400"
      >
        Data Sources
      </Typography>
      <Typography variant="label-16-medium" className="text-gray-400">
        /
      </Typography>
      <Typography
        variant="label-16-medium"
        onClick={handleDataSourceTypeClick}
        className={cn('capitalize', {
          'cursor-pointer text-gray-400': dataItemView,
        })}
      >
        {selectedType}
      </Typography>
      {dataItemView ? (
        <>
          <Typography variant="label-16-medium" className="text-gray-400">
            /
          </Typography>
          <Typography variant="label-16-medium" className="capitalize">
            {dataSourceID}
          </Typography>
        </>
      ) : null}
    </div>
  );
};

export default DataSourcesNavigation;
