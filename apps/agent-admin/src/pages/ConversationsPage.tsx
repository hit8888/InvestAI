import withPageViewWrapper from '../pages/PageViewWrapper';
import ConversationsTableContainer from '../components/ConversationsTableContainer';
import ConversationsWrapper from './ConversationsWrapper';

const ConversationsPage = () => {
  return (
    <ConversationsWrapper>
      <ConversationsTableContainer />
    </ConversationsWrapper>
  );
};

export default withPageViewWrapper(ConversationsPage);
