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
      {ProspectAndCompanyDetails ? (
        <RightSideTabDisplayContainer
          prospect={{
            ...ProspectAndCompanyDetails.prospect,
          }}
          company={{
            ...ProspectAndCompanyDetails.company,
          }}
        />
      ) : null}
    </div>
  );
};

export default ConversationDetailsMultipleTabContainer;
