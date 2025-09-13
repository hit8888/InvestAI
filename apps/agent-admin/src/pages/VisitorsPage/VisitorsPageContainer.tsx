import ErrorBoundary from '@breakout/design-system/shared/ErrorBoundary';
import { EntityMetadataProvider } from '../../context/EntityMetadataContext';
import { COMMON_SMALL_ICON_PROPS, VISITOR_LABEL_UPPERCASE } from '../../utils/constants';
import VisitorsTable from './VisitorsTable';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import CustomPageHeader from '../../components/CustomPageHeader';
import withPageViewWrapper from '../PageViewWrapper';

const VisitorsPageContainer = () => {
  return (
    <ErrorBoundary>
      <EntityMetadataProvider pageType={VISITOR_LABEL_UPPERCASE}>
        <CustomPageHeader
          headerTitle="Visitor List"
          headerIcon={<PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
          className="sticky top-0 z-10 bg-white p-4"
        />
        <VisitorsTable />
      </EntityMetadataProvider>
    </ErrorBoundary>
  );
};

const WrappedVisitorsPage = withPageViewWrapper(VisitorsPageContainer, 'p-0 gap-0');
export default WrappedVisitorsPage;
