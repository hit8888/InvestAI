import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from '@breakout/design-system/components/shadcn-ui/breadcrumb';

import BreadcrumbLeftArrow from '@breakout/design-system/components/icons/breadcrumb-left-arrow';
import Separator from '@breakout/design-system/components/layout/separator';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { BreadcrumbItemComponent } from './BreadcrumbItemComponent';

type IProps = {
  isLoading: boolean;
  breadCrumbItems: string[];
  handleNavigateBasedOnRoute: () => void;
  isDirectAccess: boolean;
};

const ConversationsBreadCrumb = ({
  isLoading,
  handleNavigateBasedOnRoute,
  isDirectAccess,
  breadCrumbItems,
}: IProps) => {
  const navigate = useNavigate();

  const handleNavigateBack = useCallback(() => {
    if (isDirectAccess) {
      handleNavigateBasedOnRoute();
    } else {
      // If came from table view, go back in history
      navigate(-1);
    }
  }, [navigate, isDirectAccess]);

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <div onClick={handleNavigateBack} className="cursor-pointer" role="button" tabIndex={0}>
              {isLoading ? (
                <Skeleton className="h-6 w-6" />
              ) : (
                <BreadcrumbLeftArrow width={'16'} height={'16'} className="text-gray-400" />
              )}
            </div>
          </BreadcrumbItem>
          {breadCrumbItems.map((item, index) => (
            <BreadcrumbItemComponent
              key={item}
              item={item}
              isLoading={isLoading}
              isLast={index === breadCrumbItems.length - 1}
              showSeparator={index < breadCrumbItems.length - 1}
              onNavigate={handleNavigateBack}
            />
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Separator />
    </div>
  );
};

export default ConversationsBreadCrumb;
