import { useState } from 'react';

import RightSideTabDisplayContainer from './RightSideTabDisplayContainer';
import MultipleTabSelectContainer from './MultipleTabSelectContainer';

import { ConversationDetailsTabsValueEnum } from '../../utils/constants';
import { useConversationDetails } from '../../context/ConversationDetailsContext';

const ConversationDetailsMultipleTabContainer = () => {
  const [currentTab, setCurrentTab] = useState(ConversationDetailsTabsValueEnum.LOG_TAB);
  const { ProspectAndCompanyDetails } = useConversationDetails();

  const handleTabClick = (tabValue: ConversationDetailsTabsValueEnum) => {
    setCurrentTab(tabValue);
  };

  return (
    <div className="flex w-full flex-1 items-start self-stretch">
      <MultipleTabSelectContainer currentTab={currentTab} handleTabClick={handleTabClick} />
      <RightSideTabDisplayContainer
        prospect={{
          name: ProspectAndCompanyDetails?.prospect?.name || '',
          email: ProspectAndCompanyDetails?.prospect?.email || '',
          location: ProspectAndCompanyDetails?.prospect?.location || '',
        }}
        company={{
          name: ProspectAndCompanyDetails?.company?.name || '',
          logoUrl: ProspectAndCompanyDetails?.company?.logoUrl,
          location: ProspectAndCompanyDetails?.company?.location || '',
          revenue: ProspectAndCompanyDetails?.company?.revenue || '',
          employees: ProspectAndCompanyDetails?.company?.employees || '',
          domain: ProspectAndCompanyDetails?.company?.domain || '',
          foundationDate: ProspectAndCompanyDetails?.company?.foundationDate || '',
        }}
      />
    </div>
  );
};

export default ConversationDetailsMultipleTabContainer;
