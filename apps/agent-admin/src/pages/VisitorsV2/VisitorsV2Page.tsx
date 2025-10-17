import withPageViewWrapper from '../PageViewWrapper';
import { GenericTablePage } from '../../features/table-system';
import { visitorsTableConfig } from './config/visitorsTableConfig';

/**
 * VisitorsV2BasePage
 * All Visitors page using generic table system with VISITOR entity
 */
const VisitorsV2BasePage = () => {
  return <GenericTablePage config={visitorsTableConfig as never} />;
};

const VisitorsV2Page = withPageViewWrapper(VisitorsV2BasePage);
export default VisitorsV2Page;
