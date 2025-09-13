import withPageViewWrapper from '../pages/PageViewWrapper';
import ConversationsWrapper from './ConversationsWrapper';
import VisitorsTable from './VisitorsPage/VisitorsTable';

const ConversationsPage = () => {
  return (
    <ConversationsWrapper>
      <VisitorsTable />
    </ConversationsWrapper>
  );
};

export default withPageViewWrapper(ConversationsPage);
