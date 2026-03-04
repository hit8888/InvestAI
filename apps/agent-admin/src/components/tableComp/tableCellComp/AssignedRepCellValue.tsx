import { SdrAssignment } from '@neuraltrade/core/types/admin/api';
import SingleAssignRepCell from '../../../components/common/SingleAssignRepCell';

const AssignedRepCellValue = ({ value }: { value: SdrAssignment }) => {
  return <SingleAssignRepCell listValue={value} />;
};

export default AssignedRepCellValue;
