import useUsersListQuery from '../../queries/query/useUsersListQuery';
import Button from '@breakout/design-system/components/Button/index';
import { Pencil } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@breakout/design-system/components/Popover/index';
import { useState, useMemo } from 'react';
import { SdrAssignment, User } from '@neuraltrade/core/types/admin/api';
import SingleAssignRepCell from '../common/SingleAssignRepCell';

type AssignRepPopoverProps = {
  handleCurrentRep: (value: SdrAssignment) => void;
  isLoading?: boolean;
};

const AssignRepPopover = ({ handleCurrentRep, isLoading = false }: AssignRepPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch users list for the dropdown
  const { data: usersList, isLoading: isUsersListLoading } = useUsersListQuery();

  // Convert users list to SdrAssignment format for the dropdown
  const assignRepList: SdrAssignment[] = useMemo(() => {
    if (!usersList) return [];

    return usersList.results.map((user: User) => ({
      id: null,
      assigned_user: {
        ...user,
        department: null,
      },
      assignment_type: null,
      assignment_timestamp: null,
      assigned_by_user: null,
      routing_rule: null,
      routing_source: null,
      created_on: null,
      updated_on: null,
    }));
  }, [usersList]);

  const handleCurrentRepAndPopoverOpen = (value: SdrAssignment) => {
    if (isLoading || isUsersListLoading) return; // Prevent interaction while loading
    setIsOpen(false);
    handleCurrentRep(value);
  };

  if (!assignRepList.length) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="tertiary" buttonStyle="icon" disabled={isLoading}>
          <Pencil className={`h-4 w-4 ${isLoading ? 'text-gray-400' : 'text-primary'}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="text-popover-foreground relative z-[1001] flex h-48 w-48 flex-1 flex-col overflow-auto rounded-lg border bg-primary-foreground/60 py-2 shadow-md outline-none backdrop-blur-lg"
        align="end"
        side="bottom"
        sideOffset={10}
        alignOffset={10}
      >
        {assignRepList.map((rep) => (
          <div
            key={rep.assigned_user?.id || rep.id}
            className={`px-4 py-3 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}
          >
            <SingleAssignRepCell listValue={rep} handleCurrentRep={handleCurrentRepAndPopoverOpen} />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default AssignRepPopover;
