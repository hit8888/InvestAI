import { useEffect, useState } from 'react';
import { SdrAssignment } from '@meaku/core/types/admin/api';
import SingleAssignRepCell from '../common/SingleAssignRepCell';
import useAssignSdrMutation from '../../queries/mutation/useAssignSdrMutation';
import toast from 'react-hot-toast';
import AssignRepPopover from './AssignRepPopover';
import { trackError } from '@meaku/core/utils/error';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

type IProps = {
  listValue: SdrAssignment;
  prospectId: string | null | undefined;
};

const AssignRepValue = ({ listValue, prospectId }: IProps) => {
  const [currentRep, setCurrentRep] = useState(listValue);

  // Mutation for assigning SDR
  const assignSdrMutation = useAssignSdrMutation({
    onSuccess: (data) => {
      toast.success('SDR assigned successfully');
      // Update the current rep with the response data
      setCurrentRep({
        id: data.id,
        assigned_user: data.assigned_user,
        assignment_type: data.assignment_type,
        assignment_timestamp: data.assignment_timestamp,
        assigned_by_user: data.assigned_by_user,
        routing_rule: null,
        routing_source: null,
        created_on: null,
        updated_on: null,
      });
    },
    onError: (error) => {
      toast.error('Failed to assign SDR. Please try again.');
      trackError(error, {
        action: 'Assign SDR Api call',
        component: 'AssignRepValue function',
        additionalData: {
          prospectId,
          tenantName: getTenantFromLocalStorage(),
          errorMessage: 'Unable to assign SDR',
        },
      });
    },
  });

  useEffect(() => {
    setCurrentRep(listValue);
  }, [listValue]);

  const handleCurrentRep = (value: SdrAssignment) => {
    const assignedUserId = value.assigned_user?.id;

    if (!prospectId) {
      toast.error('Prospect ID not found');
      return;
    }

    if (!assignedUserId) {
      toast.error('User ID not found');
      return;
    }

    // Make API call to assign SDR
    assignSdrMutation.mutate({
      data: {
        prospect_id: prospectId,
        assigned_user_id: assignedUserId,
      },
    });
  };
  return (
    <div className="flex items-center justify-end gap-2">
      <SingleAssignRepCell listValue={currentRep} />
      <AssignRepPopover handleCurrentRep={handleCurrentRep} isLoading={assignSdrMutation.isPending} />
    </div>
  );
};

export default AssignRepValue;
