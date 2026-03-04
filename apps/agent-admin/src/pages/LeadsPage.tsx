import withPageViewWrapper from '../pages/PageViewWrapper';
import LeadsTableContainer from '../components/LeadsTableContainer';

import usePageRouteState from '../hooks/usePageRouteState';
import { LEADS_PAGE, LINK_CLICKS_PAGE } from '@neuraltrade/core/utils/index';
import ConversationsWrapper from './ConversationsWrapper';

const LeadsPage = () => {
  const { isLinkClicksPage } = usePageRouteState();

  return (
    <ConversationsWrapper>
      <LeadsTableContainer
        key={isLinkClicksPage ? LINK_CLICKS_PAGE : LEADS_PAGE}
        pageType={isLinkClicksPage ? LINK_CLICKS_PAGE : LEADS_PAGE}
      />
    </ConversationsWrapper>
  );
};

export default withPageViewWrapper(LeadsPage);
