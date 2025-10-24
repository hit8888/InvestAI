import Card from '../../../components/AgentManagement/Card';
import AgentSupportSystem from '../../../pages/ControlsPage/AgentSupportSystem';
import { CommonControls, ControlsTitleEnum } from '../../../pages/ControlsPage/utils';
import useTenantMetadataQuery from '../../../queries/query/useTenantMetadataQuery';

const { SUPPORT } = ControlsTitleEnum;

const AgentSupportSection = () => {
  const agentSupportSystem = CommonControls.find((control) => control.title === SUPPORT)!;

  const {
    data: tenantMetadata,
    isLoading: isTenantMetadataLoading,
    error: tenantMetadataError,
  } = useTenantMetadataQuery();

  const { support } = tenantMetadata?.metadata ?? {};
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
    <Card background="GRAY25" border="GRAY200">
      <AgentSupportSystem key={SUPPORT} support={supportData} {...commonProps} {...agentSupportSystem} />
    </Card>
  );
};

export default AgentSupportSection;
