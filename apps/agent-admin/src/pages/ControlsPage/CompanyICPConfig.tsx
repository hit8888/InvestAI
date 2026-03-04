import { FC, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Card from '../../components/AgentManagement/Card';
import ResizeTextarea from '@breakout/design-system/components/TextArea/ResizeTextarea';
import InfoCard from '../../components/AgentManagement/InfoCard';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { trackError } from '@neuraltrade/core/utils/error';
import { useSessionStore } from '../../stores/useSessionStore';
import NoInfoProvidedSadFaceIcon from '@breakout/design-system/components/icons/no-info-sadface-icon';
import PromptHeader from './PromptHeader';
import { useUpdateCompanyICPConfig } from '../../queries/mutation/useUpdateCompanyICPConfig';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import { useCompanyICPConfig } from '../../queries/query/useCompanyICPConfig';
import { EditIcon, SaveIcon, RotateCw } from 'lucide-react';
import { useRecalculateRelevanceScore } from '../../queries/mutation/useRecalculateRelevanceScore';
import { useTaskStatusPolling } from '../../hooks/useTaskStatusPolling';
import { taskPollingService } from '../../services/taskPollingService';
import { taskToastManager } from '../../services/taskToastManager';
import { taskPollingManager } from '@neuraltrade/core/managers/taskPolling/TaskPollingManager';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';

interface CompanyICPConfigProps {
  title: string;
  description: string;
  infoTitle: string;
  textareaPlaceholder: string;
}

const CompanyICPConfig: FC<CompanyICPConfigProps> = ({ title, description, infoTitle, textareaPlaceholder }) => {
  const agentId = useSessionStore((state) => state.activeTenant?.agentId ?? 1);
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [configValue, setConfigValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [taskId, setTaskId] = useState<number | null>(null);

  // Query to fetch the company ICP config
  const { data: companyIcpData, isLoading, error, refetch: refetchCompanyICPConfig } = useCompanyICPConfig(agentId);

  // Mutation to update the company ICP config
  const updateMutation = useUpdateCompanyICPConfig(agentId);

  // Mutation to recalculate relevance score
  const recalculateMutation = useRecalculateRelevanceScore();

  // Polling for task status
  const { taskStatus, isPolling } = useTaskStatusPolling(taskId, taskId !== null);

  // Initialize state when data is loaded
  useEffect(() => {
    if (companyIcpData?.company_icp_config) {
      setConfigValue(companyIcpData.company_icp_config);
      setOriginalValue(companyIcpData.company_icp_config);
    }
  }, [companyIcpData]);

  // Check for active tasks on mount and reconnect
  useEffect(() => {
    // Get active tasks from store (read once, don't subscribe)
    const activeTasks = taskPollingManager.getActiveTasks();

    // Find any active relevance score recalculation tasks
    const activeTaskIds = Object.keys(activeTasks)
      .map((k) => Number(k))
      .filter((id) => {
        const status = activeTasks[id];
        return (
          status &&
          status.task_type === 'RELEVANCE_SCORE_RECALCULATION' &&
          (status.status === 'PENDING' || status.status === 'IN_PROGRESS')
        );
      });

    // If there's an active task, reconnect to it
    if (activeTaskIds.length > 0) {
      const firstActiveTaskId = activeTaskIds[0];
      setTaskId(firstActiveTaskId);
      // Ensure polling and toast management are active
      taskPollingService.startPolling(firstActiveTaskId);
      taskToastManager.startManaging(firstActiveTaskId);
    }
  }, []); // Only run on mount

  // Manage toasts for the current task
  useEffect(() => {
    if (taskId) {
      taskToastManager.startManaging(taskId);
    }

    return () => {
      // Don't stop managing when component unmounts - toasts should continue
      // The toast manager will clean up when task completes or fails
    };
  }, [taskId]);

  const handleClickOnEdit = () => {
    setClickedOnEdit(!clickedOnEdit);
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
          tenantName: useSessionStore.getState().activeTenant?.['tenant-name'],
          errorMessage: 'Unable to save Company ICP Config',
          payload: configValue,
          error: err,
        },
      });

      toast.error('Error updating company ICP config');
    }
  };

  // Clear taskId when task completes or fails
  useEffect(() => {
    if (taskStatus && (taskStatus.status === 'COMPLETED' || taskStatus.status === 'FAILED')) {
      setTaskId(null);
    }
  }, [taskStatus]);

  const handleReRunClick = async () => {
    try {
      const response = await recalculateMutation.mutateAsync();
      const newTaskId = response.task_id;
      setTaskId(newTaskId);

      // Start polling and toast management (will continue even if component unmounts)
      taskPollingService.startPolling(newTaskId);
      taskToastManager.startManaging(newTaskId);

      setConfigValue(originalValue);
      setClickedOnEdit(false);
    } catch (err) {
      trackError(err, {
        action: 'Recalculate Relevance Score',
        component: 'CompanyICPConfig',
        additionalData: {
          agentId,
          tenantName: useSessionStore.getState().activeTenant?.['tenant-name'],
          errorMessage: 'Unable to start relevance score recalculation',
          error: err,
        },
      });

      ErrorToastMessage({
        title: 'Failed to start relevance score recalculation',
        duration: 5000,
      });
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
            <div className="mt-4 flex w-full justify-end gap-4">
              <Button
                size="small"
                variant="system_secondary"
                buttonStyle="rightIcon"
                rightIcon={<RotateCw className="h-4 w-4" />}
                onClick={handleReRunClick}
                disabled={recalculateMutation.isPending || isPolling}
              >
                Re-Run
              </Button>
              <Button
                size="small"
                buttonStyle="rightIcon"
                variant="system"
                rightIcon={<EditIcon />}
                disabled={recalculateMutation.isPending || isPolling}
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
                  variant="system"
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
