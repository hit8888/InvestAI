import { useParams } from 'react-router-dom';
import withPageViewWrapper from '../pages/PageViewWrapper';
import ConversationsBreadCrumb from '../components/ConversationDetailsComp/ConversationsBreadCrumb';
import ConversationDetailsNavigatedHeader from '../components/ConversationDetailsComp/ConversationDetailsNavigatedHeader';
import ConversationDetailsMultipleTabContainer from '../components/ConversationDetailsComp/ConversationDetailsMultipleTabContainer';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';

import { useConversationDetails } from '../context/ConversationDetailsContext';
import useConversationDetailsDataQuery from '../queries/query/useConversationDetailsDataQuery';
import { useEffect, useMemo } from 'react';
import ConversationDetailsDataResponseManager from '../managers/ConversationDetailsDataManager';
import { useQueryOptions } from '../hooks/useQueryOptions';

type IProps = {
  isDirectAccess: boolean;
  handleNavigateBasedOnRoute: () => void;
  isLeadsPage: boolean;
};

const ConversationDetailsPage = ({ isDirectAccess, handleNavigateBasedOnRoute, isLeadsPage }: IProps) => {
  const { conversation, handleSetConversationDetails, handleSetChatHistoryDetails, handleSetFeedbackDetails } =
    useConversationDetails();
  const { sessionID } = useParams<string>();
  const companyName = conversation?.company ?? '';
  // TODOS: NEED To Add handling for CompanyLogoURL
  const navigatedHeaderDynamicValues = {
    companyName,
    sessionID: sessionID || '',
    companyLogoUrl: '',
  };

  // If Multiple Tab is enabled, then we need to show the breadcrumb items as per the tab,
  // Also attaching the tab link to the breadcrumb items
  // These are for particular use case
  const breadCrumbItems = useMemo(() => {
    if (isLeadsPage) {
      return ['Leads', 'Prospect'];
    }
    return ['Conversations', 'Prospect'];
  }, [isLeadsPage]);

  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useConversationDetailsDataQuery({
    sessionID: sessionID || '',
    queryOptions,
  });

  const detailsManager = useMemo(() => {
    if (!data) return null;
    return new ConversationDetailsDataResponseManager(data);
  }, [data]);

  // Fetch and process conversation details when session ID changes or when loading state changes.
  useEffect(() => {
    if (!detailsManager || isLoading) return;

    if (detailsManager.hasError()) {
      console.error('Error in conversation details:', detailsManager.getError());
      return;
    }

    const chatHistoryMessages = detailsManager.getFormattedChatHistory();
    handleSetChatHistoryDetails(chatHistoryMessages);

    const conversationData = detailsManager.getFormattedConversationData();
    handleSetConversationDetails(conversationData);

    const feedbackData = detailsManager.getFeedback();
    handleSetFeedbackDetails(feedbackData);

    return () => {
      // Cleanup code here
      handleSetConversationDetails(null);
      handleSetChatHistoryDetails([]);
      handleSetFeedbackDetails([]);
    };
  }, [isLoading, detailsManager]);

  if (isError || (detailsManager && detailsManager.hasError())) {
    return <ErrorState />;
  }

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-4 self-stretch">
      <div className="sticky top-0 z-10 w-full bg-white pt-2">
        <ConversationsBreadCrumb
          breadCrumbItems={breadCrumbItems}
          isLoading={isLoading}
          handleNavigateBasedOnRoute={handleNavigateBasedOnRoute}
          isDirectAccess={isDirectAccess}
        />
      </div>
      <ConversationDetailsNavigatedHeader isLoading={isLoading} {...navigatedHeaderDynamicValues} />
      <ConversationDetailsMultipleTabContainer isLoading={isLoading} />
    </div>
  );
};

export default withPageViewWrapper(ConversationDetailsPage);
