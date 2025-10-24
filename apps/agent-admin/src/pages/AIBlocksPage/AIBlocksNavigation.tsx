import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList } from '@breakout/design-system/components/shadcn-ui/breadcrumb';
import { BreadcrumbItemComponent } from '../../components/common/BreadcrumbItemComponent';

// Utility function to build breadcrumb items from pathname
const buildBreadcrumbItems = (blockCategory: string): string[] => {
  const items: string[] = [];
  items.push('AI Blocks');
  items.push(blockCategory.split('_').join(' ').toLowerCase());

  return items;
};

// Utility function to get navigation path
const getNavigationPath = (pathname: string): string => {
  const basePath = pathname.split('/ai-blocks')[0];
  return `${basePath}/ai-blocks`;
};

const AIBlocksNavigation = ({ blockCategory }: { blockCategory: string }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const breadcrumbItems = buildBreadcrumbItems(blockCategory);

  const handleNavigate = (index: number) => {
    if (index === 0) {
      const navigationPath = getNavigationPath(pathname);
      navigate(navigationPath);
    }
  };

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-20 flex flex-1 items-center gap-1 bg-white py-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItemComponent
              key={`${item}-${index}`}
              item={item}
              isLast={index === breadcrumbItems.length - 1}
              showSeparator={index < breadcrumbItems.length - 1}
              onNavigate={() => handleNavigate(index)}
            />
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AIBlocksNavigation;
