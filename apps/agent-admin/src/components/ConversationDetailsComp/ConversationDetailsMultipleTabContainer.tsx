import { useState } from 'react';

import ProspectAndCompanyDetailsDisplayContainer from './ProspectAndCompanyDetailsDisplayContainer';
import MultipleTabSelectContainer from './MultipleTabSelectContainer';

import { ConversationDetailsTabsValueEnum } from '../../utils/constants';
import { useConversationDetails } from '../../context/ConversationDetailsContext';
import ProspectAndCompanyDetailsDisplayContainerShimmer from '../ShimmerComponent/ProspectAndCompanyDetailsDisplayContainerShimmer';
import useAdminEventAnalytics from '@meaku/core/hooks/useAdminEventAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

type IProps = {
  isLoading: boolean;
  isLeadsPage: boolean;
};

const ConversationDetailsMultipleTabContainer = ({ isLoading, isLeadsPage }: IProps) => {
  const [currentTab, setCurrentTab] = useState(ConversationDetailsTabsValueEnum.SUMMARY_TAB);
  const { prospectAndCompanyDetails, conversation } = useConversationDetails();
  const { trackAdminEvent } = useAdminEventAnalytics();

  const handleTabClick = (tabValue: ConversationDetailsTabsValueEnum) => {
    const eventName = isLeadsPage
      ? ANALYTICS_EVENT_NAMES.LEAD_DETAILS_PAGE_TAB_CLICKED
      : ANALYTICS_EVENT_NAMES.CONVERSATION_DETAILS_PAGE_TAB_CLICKED;

    trackAdminEvent(eventName, {
      tab_name: tabValue,
      session_id: conversation?.session_id,
    });
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
