import Button from '@breakout/design-system/components/Button/index';
import { Pencil } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@breakout/design-system/components/Popover/index';
import { useEffect, useState } from 'react';
import { SdrAssignment } from '@meaku/core/types/admin/api';
import SingleAssignRepCell from '../common/SingleAssignRepCell';

type IProps = {
  listValue: SdrAssignment;
  assignRepList: SdrAssignment[];
};

const AssignRepValue = ({ listValue, assignRepList }: IProps) => {
  const [currentRep, setCurrentRep] = useState(listValue);

  useEffect(() => {
    setCurrentRep(listValue);
  }, [listValue]);

  const handleCurrentRep = (value: SdrAssignment) => {
    setCurrentRep(value);

    // TODO: Make API call here to update the rep
  };
  return (
    <div className="flex items-center justify-end gap-4">
      <SingleAssignRepCell listValue={currentRep} />
      {assignRepList.length > 0 ? (
        <AssignRepPopover assignRepList={assignRepList} handleCurrentRep={handleCurrentRep} />
      ) : null}
    </div>
  );
};

type AssignRepPopoverProps = {
  assignRepList: SdrAssignment[];
  handleCurrentRep: (value: SdrAssignment) => void;
};

const AssignRepPopover = ({ assignRepList, handleCurrentRep }: AssignRepPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrentRepAndPopoverOpen = (value: SdrAssignment) => {
    setIsOpen(false);
    handleCurrentRep(value);
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="tertiary" buttonStyle="icon">
          <Pencil className="h-4 w-4 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="text-popover-foreground relative z-50 flex h-96 w-48 flex-1 flex-col overflow-auto rounded-lg border bg-primary-foreground/60 py-2 shadow-md outline-none backdrop-blur-lg"
        align="start"
        side="top"
        sideOffset={10}
        alignOffset={10}
      >
        {assignRepList.map((rep) => (
          <div key={rep.id} className="px-4 py-3 hover:bg-gray-50">
            <SingleAssignRepCell listValue={rep} handleCurrentRep={handleCurrentRepAndPopoverOpen} />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default AssignRepValue;
