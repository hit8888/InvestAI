import { FC, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Card from '../../components/AgentManagement/Card';
import ResizeTextarea from '@breakout/design-system/components/TextArea/ResizeTextarea';
import InfoCard from '../../components/AgentManagement/InfoCard';
import { getTenantActiveAgentId } from '@meaku/core/utils/index';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { trackError } from '@meaku/core/utils/error';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import NoInfoProvidedSadFaceIcon from '@breakout/design-system/components/icons/no-info-sadface-icon';
import PromptHeader from './PromptHeader';
import { useUpdateCompanyICPConfig } from '../../queries/mutation/useUpdateCompanyICPConfig';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import { useCompanyICPConfig } from '../../queries/query/useCompanyICPConfig';
import { EditIcon, SaveIcon } from 'lucide-react';

interface CompanyICPConfigProps {
  title: string;
  description: string;
  infoTitle: string;
  textareaPlaceholder: string;
}

const CompanyICPConfig: FC<CompanyICPConfigProps> = ({ title, description, infoTitle, textareaPlaceholder }) => {
  const agentId = getTenantActiveAgentId();
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [configValue, setConfigValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');

  // Query to fetch the company ICP config
  const { data: companyIcpData, isLoading, error, refetch: refetchCompanyICPConfig } = useCompanyICPConfig(agentId);

  // Mutation to update the company ICP config
  const updateMutation = useUpdateCompanyICPConfig(agentId);

  // Initialize state when data is loaded
  useEffect(() => {
    if (companyIcpData?.company_icp_config) {
      setConfigValue(companyIcpData.company_icp_config);
      setOriginalValue(companyIcpData.company_icp_config);
    }
  }, [companyIcpData]);

  const handleClickOnEdit = () => {
    setClickedOnEdit(!clickedOnEdit);
  };

  const handleCancelClick = () => {
    setConfigValue(originalValue);
    setClickedOnEdit(false);
  };

  const handleSaveClick = async () => {
    if (configValue === originalValue) {
      setClickedOnEdit(false);
      return;
    }

    try {
      await updateMutation.mutateAsync({
        company_icp_config: configValue,
      });

      toast.success('Company ICP config saved successfully', {
        duration: 3000,
      });

      setOriginalValue(configValue);
      setClickedOnEdit(false);
    } catch (err) {
      trackError(err, {
        action: 'Update Company ICP Config',
        component: 'CompanyICPConfig',
        additionalData: {
          agentId,
          tenantName: getTenantIdentifier()?.['tenant-name'],
          errorMessage: 'Unable to save Company ICP Config',
          payload: configValue,
          error: err,
        },
      });

      toast.error('Error updating company ICP config');
    }
  };

  if (isLoading) {
    return <LoadingState title={title} description={description} />;
  }

  if (error) {
    return (
      <ErrorState
        errorMessage="Error loading Company ICP configuration. Please try again"
        title={title}
        description={description}
        refetch={refetchCompanyICPConfig}
      />
    );
  }

  const hasConfig = configValue.trim().length > 0;

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <PromptHeader title={title} description={description} />
      <Card background={'GRAY25'} border={'GRAY200'}>
        {!clickedOnEdit ? (
          <>
            {hasConfig ? (
              <InfoCard title={infoTitle} description={configValue} />
            ) : (
              <div className="flex w-full items-center justify-start gap-2.5 rounded-lg border border-gray-200 bg-gray-100 p-2">
                <NoInfoProvidedSadFaceIcon className="h-4 w-4 text-gray-500" />
                <Typography textColor="textSecondary" variant="caption-12-normal">
                  No company ICP config added yet
                </Typography>
              </div>
            )}
            <div className="mt-4 flex w-full justify-end">
              <Button
                size="small"
                buttonStyle="rightIcon"
                variant="primary"
                rightIcon={<EditIcon />}
                onClick={handleClickOnEdit}
              >
                Edit
              </Button>
            </div>
          </>
        ) : (
          <>
            <ResizeTextarea
              value={configValue}
              minHeight={125}
              onChange={(e) => setConfigValue(e.target.value)}
              placeholder={textareaPlaceholder}
              className="flex w-full items-center rounded-lg p-2 placeholder:text-gray-400
                focus:border focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <div className="mt-4 flex w-full justify-end">
              <div className="flex gap-4">
                <Button
                  size="small"
                  variant="secondary"
                  buttonStyle="rightIcon"
                  onClick={handleCancelClick}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="primary"
                  buttonStyle="rightIcon"
                  rightIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                  disabled={updateMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CompanyICPConfig;
