import withPageViewWrapper from '../PageViewWrapper';
import { GenericTablePage } from '../../features/table-system';
import { leadsTableConfig } from './config/leadsTableConfig';

/**
 * LeadsV2BasePage
 * Leads page using generic table system with LEAD entity
 */
const LeadsV2BasePage = () => {
  return <GenericTablePage config={leadsTableConfig as never} />;
};

const LeadsV2Page = withPageViewWrapper(LeadsV2BasePage);
export default LeadsV2Page;
