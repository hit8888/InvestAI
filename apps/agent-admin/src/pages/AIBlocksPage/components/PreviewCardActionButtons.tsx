import Button from '@breakout/design-system/components/Button/index';
import { Minimize2, X } from 'lucide-react';

const PreviewCardActionButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="system_tertiary" buttonStyle="icon" className="rounded-full bg-[#E5E8EB]">
        <Minimize2 />
      </Button>
      <Button variant="system_tertiary" buttonStyle="icon" className="rounded-full bg-[#E5E8EB]">
        <X />
      </Button>
    </div>
  );
};

export default PreviewCardActionButtons;
