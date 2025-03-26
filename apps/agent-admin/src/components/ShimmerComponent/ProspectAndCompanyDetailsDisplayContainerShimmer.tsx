import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import SingleProspectAndCompanyItemDataDisplayShimmer from './SingleProspectAndCompanyItemDataDisplayShimmer';

type IProps = {
  prospectItemsCount?: number;
  companyItemsCount?: number;
};

const ProspectAndCompanyDetailsDisplayContainerShimmer = ({
  prospectItemsCount = 3,
  companyItemsCount = 4,
}: IProps) => {
  return (
    <div className="relative w-[35%] justify-stretch self-stretch border-b border-l border-t border-primary/10">
      <div className="hide-scrollbar sticky top-10 flex max-h-screen w-full flex-col items-start overflow-auto">
        {/* Prospect Section */}
        <div className="flex w-full flex-col items-start gap-4 p-4">
          <Skeleton className="h-5 w-24" />
          <div className="flex w-full flex-col items-start self-stretch">
            {Array(prospectItemsCount)
              .fill(0)
              .map((_, index) => (
                <SingleProspectAndCompanyItemDataDisplayShimmer
                  itemIndex={index}
                  key={`prospect-${index}`}
                  itemKey={`prospect-${index}`}
                />
              ))}
          </div>
        </div>

        {/* Company Section */}
        <div className="flex w-full flex-col items-start gap-4 border-t border-primary/10 p-4">
          <Skeleton className="h-5 w-24" />
          <div className="flex w-full flex-col items-start self-stretch">
            {Array(companyItemsCount)
              .fill(0)
              .map((_, index) => (
                <SingleProspectAndCompanyItemDataDisplayShimmer
                  itemIndex={index}
                  key={`company-${index}`}
                  itemKey={`company-${index}`}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectAndCompanyDetailsDisplayContainerShimmer;
