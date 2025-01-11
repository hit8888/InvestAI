import { useState } from 'react';

import RightSideTabDisplayContainer from './RightSideTabDisplayContainer';
import MultipleTabSelectContainer from './MultipleTabSelectContainer';

import { ConversationDetailsTabsValueEnum } from '../../utils/constants';

const prospect = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  location: '🇺🇸 New York, USA',
};

const company = {
  name: 'Acme Corp',
  logoUrl: 'https://via.placeholder.com/50', // Replace with actual logo URL
  location: '🇦🇺 Sydney, Australia',
  revenue: '$1.5M - $3M annually',
  employees: '156 - 200 employees',
  domain: 'acmecorp.com',
  foundationDate: 'January 15, 2008',
};

const ConversationDetailsMultipleTabContainer = () => {
  const [currentTab, setCurrentTab] = useState(ConversationDetailsTabsValueEnum.LOG_TAB);

  const handleTabClick = (tabValue: ConversationDetailsTabsValueEnum) => {
    setCurrentTab(tabValue);
  };
  return (
    <div className="flex w-full flex-1 items-start self-stretch">
      <MultipleTabSelectContainer currentTab={currentTab} handleTabClick={handleTabClick} />
      <RightSideTabDisplayContainer prospect={prospect} company={company} />
    </div>
  );
};

export default ConversationDetailsMultipleTabContainer;
