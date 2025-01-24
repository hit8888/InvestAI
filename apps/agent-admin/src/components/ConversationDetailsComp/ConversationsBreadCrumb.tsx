import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@breakout/design-system/components/shadcn-ui/breadcrumb';

import BreadcrumbLeftArrow from '@breakout/design-system/components/icons/breadcrumb-left-arrow';
import Separator from '@breakout/design-system/components/layout/separator';
import { AppRoutesEnum } from '../../utils/constants';

const ConversationsBreadCrumb = () => {
  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={AppRoutesEnum.CONVERSATIONS}>
              <BreadcrumbLeftArrow width={'16'} height={'16'} className="text-gray-400" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem className="cursor-pointer text-base font-medium text-gray-400">
            <BreadcrumbLink href={AppRoutesEnum.CONVERSATIONS}>Conversations</BreadcrumbLink>
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
