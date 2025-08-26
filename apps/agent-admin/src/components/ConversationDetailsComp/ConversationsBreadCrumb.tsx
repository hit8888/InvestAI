import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from '@breakout/design-system/components/shadcn-ui/breadcrumb';

import BreadcrumbLeftArrow from '@breakout/design-system/components/icons/breadcrumb-left-arrow';
import Separator from '@breakout/design-system/components/layout/separator';
import ConversationsBreadCrumbShimmer from '../ShimmerComponent/ConversationsBreadCrumbShimmer';
import { BreadcrumbItemComponent } from './BreadcrumbItemComponent';
import useLocationPath from '@meaku/core/hooks/useLocationPath';
import AccessibleDiv from '@breakout/design-system/components/accessibility/AccessibleDiv';
import { CONVERSATION_TABS, isTabActive } from '../ConversationTabs';
import { getDashboardBasicPathURL } from '../../utils/common';

type IProps = {
  isLoading: boolean;
  isDirectAccess: boolean;
};

const ConversationsBreadCrumb = ({ isLoading, isDirectAccess }: IProps) => {
  const navigate = useNavigate();
  const { getConversationPath } = useLocationPath();
  const location = useLocation();
  const { tenantName } = useParams();

  const fromTab = useMemo(() => {
    const currentTab = CONVERSATION_TABS.find((tab) => isTabActive(tab.path, location.pathname));
    return currentTab;
  }, [location.pathname]);

  const breadCrumbItems = useMemo(() => [fromTab?.label || 'All Conversations', 'Prospect'], [fromTab]);

  const handleNavigateBack = useCallback(() => {
    if (isDirectAccess && fromTab) {
      const baseURL = getDashboardBasicPathURL(tenantName ?? '');
      navigate(`${baseURL}${fromTab.path}`);
    } else {
      // If came from table view, go back in history
      navigate(-1);
    }
  }, [fromTab, isDirectAccess, navigate, tenantName]);

  const handleNavigate = () => {
    navigate(getConversationPath(''));
  };

  if (isLoading) {
    return <ConversationsBreadCrumbShimmer />;
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <AccessibleDiv onClick={handleNavigateBack}>
              <BreadcrumbLeftArrow width={'16'} height={'16'} className="text-gray-400" />
            </AccessibleDiv>
          </BreadcrumbItem>
          {breadCrumbItems.map((item, index) => (
            <BreadcrumbItemComponent
              key={`${item}-${index}`}
              item={item}
              isLast={index === breadCrumbItems.length - 1}
              showSeparator={index < breadCrumbItems.length - 1}
              onNavigate={handleNavigate}
            />
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Separator />
    </div>
  );
};

export default ConversationsBreadCrumb;
