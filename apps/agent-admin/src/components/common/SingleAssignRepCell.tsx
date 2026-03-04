import { SdrAssignment } from '@neuraltrade/core/types/admin/api';
import NoDataFoundIcon from '@breakout/design-system/components/icons/no-data-found-icon';
import Typography from '@breakout/design-system/components/Typography/index';
import { ROUTING_TYPE_LOGO_MAP } from '../../utils/constants';
import { cn } from '@breakout/design-system/lib/cn';

type SingleAssignRepCellProps = {
  listValue: SdrAssignment;
  handleCurrentRep?: (value: SdrAssignment) => void;
  sdrNameClassName?: string;
};

const SingleAssignRepCell = ({ listValue, handleCurrentRep, sdrNameClassName }: SingleAssignRepCellProps) => {
  if (!listValue)
    return (
      <div className="flex items-center gap-1">
        <NoDataFoundIcon />
        <Typography variant="caption-12-normal" textColor="gray400">
          Unassigned
        </Typography>
      </div>
    );
  const { assigned_user, routing_source } = listValue;
  const companyLogo = ROUTING_TYPE_LOGO_MAP[routing_source as keyof typeof ROUTING_TYPE_LOGO_MAP];

  if (!assigned_user) return null;
  const { full_name, profile_picture } = assigned_user;
  return (
    <div className="flex w-full items-center gap-2" onClick={() => handleCurrentRep?.(listValue)}>
      {profile_picture && profile_picture.length > 0 && (
        <img src={profile_picture} alt="rep" className="h-5 w-5 rounded-full" />
      )}
      <div className="flex w-full items-center gap-2">
        <p title={full_name || ''} className={cn('max-w-32 truncate text-sm text-gray-900', sdrNameClassName)}>
          {full_name}
        </p>
        {companyLogo && <img src={companyLogo} alt="company" className="h-4 w-4 rounded-full" />}
      </div>
    </div>
  );
};

export default SingleAssignRepCell;
