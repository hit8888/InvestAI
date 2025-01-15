import { useParams } from 'react-router-dom';
import withPageViewWrapper from '../pages/PageViewWrapper';
import ConversationsBreadCrumb from '../components/ConversationDetailsComp/ConversationsBreadCrumb';
import ConversationDetailsNavigatedHeader from '../components/ConversationDetailsComp/ConversationDetailsNavigatedHeader';
import ConversationDetailsMultipleTabContainer from '../components/ConversationDetailsComp/ConversationDetailsMultipleTabContainer';

import { useConversationDetails } from '../context/ConversationDetailsContext';
import { useAuth } from '../context/AuthProvider';
import useConversationDetailsDataQuery from '../queries/query/useConversationDetailsDataQuery';
import { useEffect, useMemo } from 'react';
import ConversationDetailsDataResponseManager from '../managers/ConversationDetailsDataManager';
import { ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { Message } from '@meaku/core/types/agent';

const ConversationDetailsPage = () => {
  const { conversation, handleSetConversationDetails, handleSetChatHistoryDetails } = useConversationDetails();
  const { sessionID } = useParams<string>();
  const companyName = conversation?.company ?? '';
  const navigatedHeaderDynamicValues = {
    companyName,
    sessionID: sessionID || '',
  };
  const { getTenantIdentifier } = useAuth();

  const tenantName = getTenantIdentifier()?.['tenant-name'];
  const isAdminRole = getTenantIdentifier()?.['role'] === 'admin';

  const { data, isLoading, isError } = useConversationDetailsDataQuery({
    sessionID: sessionID || '',
    tenantName: tenantName || '',
    queryOptions: {
      enabled: !!tenantName,
    },
  });

  const detailsManager = useMemo(() => {
    if (!data) return null;

    return new ConversationDetailsDataResponseManager(data);
  }, [data]);

  // Fetch and process conversation details when session ID changes or when loading state changes.
  useEffect(() => {
    if (!detailsManager || isLoading) return;

    try {
      const conversationData = detailsManager.getFormattedConversationData() ?? {};
      handleSetConversationDetails(conversationData as ConversationsTableDisplayContent);

      const chatHistoryMessages =
        detailsManager.getFormattedChatHistory({
          isAdmin: isAdminRole,
          isReadOnly: false,
        }) ?? [];
      handleSetChatHistoryDetails(chatHistoryMessages as Message[]);
    } catch (error) {
      console.error('Error while processing conversation details', error);
    }

    return () => {
      // Cleanup code here
      handleSetConversationDetails(null);
      handleSetChatHistoryDetails(null);
    };
  }, [isLoading]);

  if (isError) {
    console.error('Error while fetching conversation details');
    return null;
  }
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-4 self-stretch">
      <ConversationsBreadCrumb />
      {isLoading ? (
        <p className="w-full text-center text-2xl font-semibold text-gray-900">Loading...</p>
      ) : (
        <>
          <ConversationDetailsNavigatedHeader {...navigatedHeaderDynamicValues} />
          <ConversationDetailsMultipleTabContainer />
        </>
      )}
    </div>
  );
};

export default withPageViewWrapper(ConversationDetailsPage);
