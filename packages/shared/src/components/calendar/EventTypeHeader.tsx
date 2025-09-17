import { Button, LucideIcon } from '@meaku/saral';

interface EventTypeHeaderProps {
  onBack: () => void;
  title: string;
  description: string;
}

const EventTypeHeader = ({ onBack, title, description }: EventTypeHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={onBack} className="rounded-lg gap-2">
        <LucideIcon name="arrow-left" className="h-4 w-4" />
        Back
      </Button>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default EventTypeHeader;
