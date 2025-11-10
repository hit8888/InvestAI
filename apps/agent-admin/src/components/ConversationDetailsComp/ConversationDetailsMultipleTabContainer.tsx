import { useState } from 'react';

import ProspectAndCompanyDetailsDisplayContainer from './ProspectAndCompanyDetailsDisplayContainer';
import MultipleTabSelectContainer from './MultipleTabSelectContainer';

import { ConversationDetailsTabsValueEnum } from '../../utils/constants';
import { useConversationDetails } from '../../context/ConversationDetailsContext';
import ProspectAndCompanyDetailsDisplayContainerShimmer from '../ShimmerComponent/ProspectAndCompanyDetailsDisplayContainerShimmer';

type IProps = {
  isLoading: boolean;
  isLeadsPage: boolean;
};

const ConversationDetailsMultipleTabContainer = ({ isLoading }: IProps) => {
  const [currentTab, setCurrentTab] = useState(ConversationDetailsTabsValueEnum.SUMMARY_TAB);
  const { prospectAndCompanyDetails } = useConversationDetails();

  const handleTabClick = (tabValue: ConversationDetailsTabsValueEnum) => {
    setCurrentTab(tabValue);
  };

  return (
    <div className="flex w-full max-w-full flex-1 items-start self-stretch">
      <MultipleTabSelectContainer currentTab={currentTab} handleTabClick={handleTabClick} isLoading={isLoading} />
      {isLoading ? (
        <ProspectAndCompanyDetailsDisplayContainerShimmer />
      ) : prospectAndCompanyDetails ? (
        <ProspectAndCompanyDetailsDisplayContainer
          prospect={{
            ...prospectAndCompanyDetails.prospect,
          }}
          company={{
            ...prospectAndCompanyDetails.company,
          }}
        />
      ) : null}
    </div>
  );
};

export default ConversationDetailsMultipleTabContainer;
