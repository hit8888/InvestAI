// import { useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import ContactCard from './ContactCard';
import { Employee } from './types';
import { Search } from 'lucide-react';
import SpinnerIcon from '@breakout/design-system/components/icons/spinner';

type IcpSectionProps = {
  prospect?: Employee;
  icps: Employee[];
  isLoading: boolean;
  onFetchIcpList: () => void;
  onGenerateEmail: (employee: Employee) => void;
  selectedEmployee?: Employee | null;
};

const IcpSection = ({
  prospect,
  icps,
  isLoading,
  onFetchIcpList,
  onGenerateEmail,
  selectedEmployee,
}: IcpSectionProps) => {
  // const [showAll, setShowAll] = useState(false);

  if (!prospect) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {/* Branches */}
      <div className="flex w-9 flex-col items-center"></div>

      {/* Employee Cards */}
      <div className="flex flex-1 flex-col gap-2.5">
        {/* Main employee card */}
        {prospect?.name && (
          <ContactCard
            employee={prospect}
            showGenerateEmailButton={!!prospect?.session_id}
            onGenerateEmail={onGenerateEmail}
            disableEmailButton={selectedEmployee?.prospect_id === prospect.prospect_id}
          />
        )}

        {/* Other employee cards */}
        {icps.map((employee) => (
          <ContactCard
            showGenerateEmailButton
            key={employee.icp_id}
            employee={employee}
            onGenerateEmail={onGenerateEmail}
            disableEmailButton={selectedEmployee?.icp_id === employee.icp_id}
          />
        ))}

        {/* Show More button */}
        {/* {icps.length > 2 && !showAll && (
          <div className="flex justify-center pt-4">
            <Button variant="secondary" size="small" onClick={() => setShowAll(true)}>
              Show More
            </Button>
          </div>
        )} */}

        {icps.length === 0 && (
          <Button
            variant="secondary"
            size="small"
            className="w-fit self-center"
            onClick={onFetchIcpList}
            rightIcon={isLoading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          >
            Find More ICPs
          </Button>
        )}
      </div>
    </div>
  );
};

export default IcpSection;
