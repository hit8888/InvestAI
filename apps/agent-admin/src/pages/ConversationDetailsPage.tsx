import { Navigate, useParams } from 'react-router-dom';
import useSessionDetailsQuery from '../queries/query/useSessionDetailsQuery';
import { useSessionStore } from '../stores/useSessionStore';
import { buildPathWithTenantBase } from '../utils/navigation';
import { AppRoutesEnum } from '../utils/constants';
import ConversationDetailsPageSkeleton from '../components/ShimmerComponent/ConversationDetailsPageSkeleton';
import withPageViewWrapper from './PageViewWrapper';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const ConversationDetailsPage = () => {
  const { sessionID } = useParams<string>();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']) ?? '';

  const { isLoading, isError, data } = useSessionDetailsQuery({
    sessionId: sessionID,
  });
  const prospectId = data?.prospect?.prospect_id;

  useEffect(() => {
    if (isError) {
      toast.error('Conversation not found');
    }
  }, [isError]);

  if (isLoading) {
    return <ConversationDetailsPageSkeleton />;
  }

  if (prospectId) {
    const conversationsPath = buildPathWithTenantBase(tenantName, AppRoutesEnum.CONVERSATIONS);
    return <Navigate to={`${conversationsPath}?rowId=${prospectId}`} replace />;
  }

  return <Navigate to={buildPathWithTenantBase(tenantName, AppRoutesEnum.CONVERSATIONS)} replace />;
};

export default withPageViewWrapper(ConversationDetailsPage);
