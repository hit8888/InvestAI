import withPageViewWrapper from '../PageViewWrapper';
import { GenericTablePage } from '../../features/table-system';
import { companiesTableConfig } from './config/companiesTableConfig';

/**
 * CompaniesV2BasePage
 * Companies page using generic table system with COMPANY entity
 */
const CompaniesV2BasePage = () => {
  return <GenericTablePage config={companiesTableConfig as never} />;
};

const CompaniesV2Page = withPageViewWrapper(CompaniesV2BasePage);
export default CompaniesV2Page;
