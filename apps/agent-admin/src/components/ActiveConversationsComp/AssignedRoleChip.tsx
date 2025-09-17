import SingleAssignRepCell from '../common/SingleAssignRepCell';
import { SdrAssignment } from '@meaku/core/types/admin/api';

interface AssignedRoleChipProps {
  sdrAssignment: SdrAssignment | null;
}

const AssignedRoleChip = ({ sdrAssignment }: AssignedRoleChipProps) => {
  if (!sdrAssignment) return null;
  return (
    <div className="flex items-center gap-1.5 overflow-hidden rounded-full bg-gray-200 py-1 pl-1 pr-2">
      <SingleAssignRepCell sdrNameClassName="text-gray-500" listValue={sdrAssignment} />
    </div>
  );
};

export default AssignedRoleChip;
