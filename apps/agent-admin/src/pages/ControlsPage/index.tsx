import PageContainer from '../../components/AgentManagement/PageContainer';
import { CONTROLS_PAGE_HEADER_DESCRIPTION, CommonControls, ControlsTitleEnum } from './utils';
import SinglePromptTextarea from './SinglePromptTextarea';
import AgentResponseWordCount from './AgentResponseWordCount';
import AgentProductDescription from './AgentProductDescription';
import AgentSupportSystem from './AgentSupportSystem';
import CompanyICPConfig from './CompanyICPConfig';
import useTenantMetadataQuery from '../../queries/query/useTenantMetadataQuery';
import AgentIdealCustomerPersona from './AgentIdealCustomerPersona';

const PageContainerHeader = 'Controls';
const {
  AGENT_PERSONALITY,
  INSTRUCTIONS,
  AGENT_RESPONSE_WORD_COUNT,
  PRODUCT_DESCRIPTION,
  SUPPORT,
  IDEAL_COMPANY_PERSONA,
  IDEAL_CUSTOMER_PERSONA,
} = ControlsTitleEnum;

const ControlsPage = () => {
  // We will get all these below values as its coming from defined constant variable
  const agentPersonality = CommonControls.find((control) => control.title === AGENT_PERSONALITY)!;
  const instructions = CommonControls.find((control) => control.title === INSTRUCTIONS)!;
  const agentResponseWordCount = CommonControls.find((control) => control.title === AGENT_RESPONSE_WORD_COUNT)!;
  const agentProductDescription = CommonControls.find((control) => control.title === PRODUCT_DESCRIPTION)!;
  const agentIdealCustomerPersona = CommonControls.find((control) => control.title === IDEAL_CUSTOMER_PERSONA)!;
  const agentSupportSystem = CommonControls.find((control) => control.title === SUPPORT)!;
  const idealCompanyPersona = CommonControls.find((control) => control.title === IDEAL_COMPANY_PERSONA)!;

  const {
    data: tenantMetadata,
    isLoading: isTenantMetadataLoading,
    error: tenantMetadataError,
  } = useTenantMetadataQuery();

  const { products_and_description, support } = tenantMetadata?.metadata ?? {};
  const commonProps = {
    isLoading: isTenantMetadataLoading,
    error: tenantMetadataError,
  };

  const supportData = {
    email: support?.email || '',
    phone: support?.phone || '',
    website_url: support?.website_url || '',
  };

  return (
    <PageContainer heading={PageContainerHeader} subHeading={CONTROLS_PAGE_HEADER_DESCRIPTION}>
      <SinglePromptTextarea key={AGENT_PERSONALITY} {...agentPersonality} />
      <AgentResponseWordCount {...agentResponseWordCount} />
      <SinglePromptTextarea key={INSTRUCTIONS} {...instructions} />
      <AgentProductDescription
        key={PRODUCT_DESCRIPTION}
        productDescriptions={products_and_description ?? []}
        {...commonProps}
        {...agentProductDescription}
      />
      <AgentIdealCustomerPersona key={IDEAL_CUSTOMER_PERSONA} {...commonProps} {...agentIdealCustomerPersona} />
      <CompanyICPConfig key={IDEAL_COMPANY_PERSONA} {...idealCompanyPersona} />
      <AgentSupportSystem key={SUPPORT} support={supportData} {...commonProps} {...agentSupportSystem} />
    </PageContainer>
  );
};

export default ControlsPage;
