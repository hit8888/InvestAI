import { SdrAssignment } from '@meaku/core/types/admin/api';
import NoDataFoundIcon from '@breakout/design-system/components/icons/no-data-found-icon';
import Typography from '@breakout/design-system/components/Typography/index';

const SingleAssignRepCell = ({
  listValue,
  handleCurrentRep,
}: {
  listValue: SdrAssignment;
  handleCurrentRep?: (value: SdrAssignment) => void;
}) => {
  if (!listValue)
    return (
      <div className="flex items-center gap-1">
        <NoDataFoundIcon />
        <Typography variant="caption-12-normal" textColor="gray400">
          No data
        </Typography>
      </div>
    );
  const { assigned_user } = listValue;

  if (!assigned_user) return null;
  const { first_name, last_name, profile_picture } = assigned_user;
  const name = [first_name, last_name].filter(Boolean).join(' ');
  const imageUrl = profile_picture;
  const companyUrl = ''; // TODO: For future use if we need to show company url
  return (
    <div className="flex w-full cursor-pointer items-center gap-2" onClick={() => handleCurrentRep?.(listValue)}>
      {imageUrl && imageUrl.length > 0 && <img src={imageUrl} alt="rep" className="h-6 w-6 rounded-full" />}
      <div className="flex w-40 justify-between">
        <p title={name} className="max-w-32 truncate text-sm text-gray-900">
          {name}
        </p>
        {companyUrl.length > 0 && <img src={companyUrl} alt="companyUrl" className="h-4 w-4" />}
      </div>
    </div>
  );
};

export default SingleAssignRepCell;
