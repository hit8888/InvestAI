import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import Card from '../AgentManagement/Card';
import PageContainer from '../AgentManagement/PageContainer';

type AdminProfilePageShimmerProps = {
  numberOfFormFields?: number;
};

const AdminProfilePageShimmer = ({ numberOfFormFields = 4 }: AdminProfilePageShimmerProps) => {
  return (
    <PageContainer className="gap-6" heading="Profile Settings" containerClassName="gap-6">
      {/* Profile Picture Shimmer */}
      <Card>
        <div className="flex items-center gap-6 self-stretch">
          {/* Profile Image Shimmer */}
          <Skeleton className="h-[84px] w-[84px] rounded-full" />

          {/* Profile Picture Content Shimmer */}
          <div className="flex flex-1 flex-col items-start justify-center gap-4">
            <div className="flex flex-col items-start gap-2">
              <Skeleton className="h-5 w-28" /> {/* Profile picture label */}
              <Skeleton className="h-3 w-64" /> {/* Description text */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32 rounded-lg" /> {/* Upload button */}
              <Skeleton className="h-9 w-24 rounded-lg" /> {/* Delete button */}
            </div>
          </div>
        </div>
      </Card>

      {/* Form Fields Shimmer */}
      {Array.from({ length: numberOfFormFields }).map((_, index) => (
        <Card key={`form-field-${index}`}>
          <div className="flex w-full flex-col items-start gap-2">
            <Skeleton className="h-5 w-20" /> {/* Field label */}
            <Skeleton className="h-12 w-full rounded-lg" /> {/* Input field */}
          </div>
        </Card>
      ))}

      {/* Save Button and Password Section Shimmer */}
      <div className="flex w-full flex-col gap-8">
        <div className="flex w-full justify-end">
          <Skeleton className="h-10 w-28 rounded-lg" /> {/* Save Details button */}
        </div>

        {/* Password Section Shimmer */}
        <Card className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-6 w-6 rounded" /> {/* Account password icon */}
            <Skeleton className="h-5 w-32" /> {/* Account Password text */}
          </div>
          <Skeleton className="h-9 w-28 rounded-lg" /> {/* Reset Password button */}
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminProfilePageShimmer;
