import { useLocation } from 'react-router-dom';

import NoDataFound from '@breakout/design-system/components/layout/NoDataFound';
import { useSessionStore } from '../../stores/useSessionStore';

const NoActiveConversationsFound = () => {
  const location = useLocation();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  const normalizedPath = tenantName ? location.pathname.replace(`/${tenantName}`, '') : location.pathname;
  let title: string;
  let description: string;

  if (normalizedPath.includes('/assigned')) {
    title = 'No Assigned Conversations';
    description = "You don't have any assigned conversations at the moment.";
  } else if (normalizedPath.includes('/pinned')) {
    title = 'No Pinned Conversations';
    description = 'No conversations are pinned yet. Pin important conversations to keep them easily accessible.';
  } else {
    title = 'No Live Visitors yet';
    description = 'No website visitor is having a conversation right now. Time to get more traffic.';
  }

  return <NoDataFound className="min-h-[80vh]" title={title} description={description} />;
};

export default NoActiveConversationsFound;
