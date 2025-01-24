import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@breakout/design-system/components/shadcn-ui/breadcrumb';

import BreadcrumbLeftArrow from '@breakout/design-system/components/icons/breadcrumb-left-arrow';
import Separator from '@breakout/design-system/components/layout/separator';
import { AppRoutesEnum } from '../../utils/constants';

const ConversationsBreadCrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDirectAccess = useMemo(() => {
    // Check if we have any state from the previous route
    return !location.state?.from;
  }, [location.state]);

  const handleNavigateBack = useCallback(() => {
    if (isDirectAccess) {
      // If directly accessed, go to conversations page
      navigate(AppRoutesEnum.CONVERSATIONS);
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
              <BreadcrumbLeftArrow width={'16'} height={'16'} className="text-gray-400" />
            </div>
          </BreadcrumbItem>
          <BreadcrumbItem className="cursor-pointer text-base font-medium text-gray-400">
            <div onClick={handleNavigateBack} role="button" tabIndex={0}>
              Conversations
            </div>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-base font-medium text-gray-400">/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base font-semibold text-primary">Prospect</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator />
    </div>
  );
};

export default ConversationsBreadCrumb;
