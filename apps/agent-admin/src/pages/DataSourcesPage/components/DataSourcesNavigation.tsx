import { useDataSources } from '../../../context/DataSourcesContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList } from '@breakout/design-system/components/shadcn-ui/breadcrumb';
import { BreadcrumbItemComponent } from '../../../components/common/BreadcrumbItemComponent';

const DataSourcesNavigation = () => {
  const { selectedType, toggleDataSourceSelectedType } = useDataSources();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { webPageID, documentID } = useParams();
  const dataSourceID = webPageID || documentID;
  const dataItemView = !!dataSourceID;

  const handleDataSourcesClick = () => {
    toggleDataSourceSelectedType(null);
    const basePath = pathname.split('/knowledge-base')[0] + '/knowledge-base';
    navigate(basePath);
  };

  const handleDataSourceTypeClick = () => {
    if (dataItemView) {
      const dataSourcePath = pathname.replace(/\/\d+$/, '');
      navigate(dataSourcePath);
    }
  };

  // Create breadcrumb items array
  const breadCrumbItems = [];

  // Always add "Knowledge Base"
  breadCrumbItems.push('Agent - Knowledge Base');

  // Add selectedType if it exists
  if (selectedType) {
    breadCrumbItems.push(selectedType);
  }

  // Add dataSourceID if in data item view
  if (dataItemView && dataSourceID) {
    breadCrumbItems.push(dataSourceID);
  }

  // Handle navigation based on breadcrumb item index
  const handleNavigate = (index: number) => {
    if (index === 0) {
      // Navigate to Knowledge Base
      handleDataSourcesClick();
    } else if (index === 1 && selectedType) {
      // Navigate to selectedType view
      handleDataSourceTypeClick();
    }
    // index 2 would be dataSourceID (current item) - no navigation needed
  };

  return (
    <div className="flex flex-1 items-center gap-1">
      <Breadcrumb>
        <BreadcrumbList>
          {breadCrumbItems.map((item, index) => (
            <BreadcrumbItemComponent
              key={`${item}-${index}`}
              item={item}
              isLast={index === breadCrumbItems.length - 1}
              showSeparator={index < breadCrumbItems.length - 1}
              onNavigate={() => handleNavigate(index)}
            />
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default DataSourcesNavigation;
