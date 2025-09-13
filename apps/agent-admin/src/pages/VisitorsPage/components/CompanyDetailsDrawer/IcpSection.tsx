// import { useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import ContactCard from './ContactCard';
import useIcpDetailsQuery from '../../../../queries/query/useIcpDetails';
import { CompanyData, Employee } from './types';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useReachoutEmail from '../../../../queries/mutation/useReachoutEmail';
import SpinnerIcon from '@breakout/design-system/components/icons/spinner';

type IcpSectionProps = {
  companyData: CompanyData;
};

const IcpSection = ({ companyData }: IcpSectionProps) => {
  const { name, prospect } = companyData;
  // const [showAll, setShowAll] = useState(false);

  const {
    data: icpDetails,
    isSuccess: isIcpDetailsSuccess,
    isLoading: isIcpDetailsLoading,
    refetch,
  } = useIcpDetailsQuery({ companyName: name }, { enabled: false });
  const icps: Employee[] =
    icpDetails?.contacts?.map?.((icp) => ({
      id: icp.id.toString(),
      name: icp.name,
      title: icp.title,
      email: icp.email,
      avatar: undefined,
      linkedin: icp.linkedin_url,
    })) || [];

  const {
    mutate,
    isPending: isReachoutEmailPending,
    data: reachoutEmailData,
  } = useReachoutEmail({
    onError: () => {
      toast.error('Failed to generate reachout email.');
    },
  });

  const handleGenerateEmail = () => {
    mutate({ session_id: companyData?.session_id });
  };

  return (
    <div className="flex gap-2">
      {/* Branches */}
      <div className="flex w-9 flex-col items-center"></div>

      {/* Employee Cards */}
      <div className="flex flex-1 flex-col gap-2.5">
        {/* Main employee card (large) */}
        {prospect?.name && (
          <ContactCard
            employee={prospect}
            variant="large"
            onGenerateEmail={handleGenerateEmail}
            emailData={reachoutEmailData}
            emailDataLoading={isReachoutEmailPending}
            showGenerateEmailButton={!!companyData?.session_id}
          />
        )}

        {/* Other employee cards (small) */}
        {icps.map((employee) => (
          <ContactCard key={employee.id} employee={employee} variant="small" />
        ))}

        {/* Show More button */}
        {/* {icps.length > 2 && !showAll && (
          <div className="flex justify-center pt-4">
            <Button variant="secondary" size="small" onClick={() => setShowAll(true)}>
              Show More
            </Button>
          </div>
        )} */}

        {!isIcpDetailsSuccess && (
          <Button
            variant="secondary"
            size="small"
            className="w-fit self-center"
            onClick={() => refetch()}
            rightIcon={
              isIcpDetailsLoading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />
            }
          >
            Find More ICPs
          </Button>
        )}
      </div>
    </div>
  );
};

export default IcpSection;
