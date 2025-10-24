import AgentProductDescription from '../ControlsPage/AgentProductDescription';
import CompanyICPConfig from '../ControlsPage/CompanyICPConfig';
import useTenantMetadataQuery from '../../queries/query/useTenantMetadataQuery';
import AgentIdealCustomerPersona from '../ControlsPage/AgentIdealCustomerPersona';
import { CommonControls, ControlsTitleEnum } from '../ControlsPage/utils';

const { PRODUCT_DESCRIPTION, IDEAL_COMPANY_PERSONA, IDEAL_CUSTOMER_PERSONA } = ControlsTitleEnum;

const AgentControlsSection = () => {
  // We will get all these below values as its coming from defined constant variable
  const agentProductDescription = CommonControls.find((control) => control.title === PRODUCT_DESCRIPTION)!;
  const agentIdealCustomerPersona = CommonControls.find((control) => control.title === IDEAL_CUSTOMER_PERSONA)!;
  const idealCompanyPersona = CommonControls.find((control) => control.title === IDEAL_COMPANY_PERSONA)!;

  const {
    data: tenantMetadata,
    isLoading: isTenantMetadataLoading,
    error: tenantMetadataError,
  } = useTenantMetadataQuery();

  const { products_and_description } = tenantMetadata?.metadata ?? {};
  const commonProps = {
    isLoading: isTenantMetadataLoading,
    error: tenantMetadataError,
  };

  return (
    <>
      <AgentProductDescription
        key={PRODUCT_DESCRIPTION}
        productDescriptions={products_and_description ?? []}
        {...commonProps}
        {...agentProductDescription}
      />
      <AgentIdealCustomerPersona key={IDEAL_CUSTOMER_PERSONA} {...commonProps} {...agentIdealCustomerPersona} />
      <CompanyICPConfig key={IDEAL_COMPANY_PERSONA} {...idealCompanyPersona} />
    </>
  );
};

export default AgentControlsSection;
