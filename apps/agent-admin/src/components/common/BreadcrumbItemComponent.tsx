import Button from '@breakout/design-system/components/Button/index';
import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@breakout/design-system/components/shadcn-ui/breadcrumb';
import { cn } from '@breakout/design-system/lib/cn';

interface BreadcrumbItemComponentProps {
  item: string;
  isLast: boolean;
  showSeparator: boolean;
  onNavigate?: () => void;
}

export const BreadcrumbItemComponent = ({ item, isLast, showSeparator, onNavigate }: BreadcrumbItemComponentProps) => {
  const handleClick = () => {
    if (!isLast && onNavigate) {
      onNavigate();
    }
  };
  return (
    <>
      <BreadcrumbItem
        className={cn(`text-base font-medium`, {
          'font-semibold text-primary': isLast,
          'cursor-pointer  text-gray-400': !isLast,
        })}
      >
        {isLast ? (
          <BreadcrumbPage className="text-2xl font-semibold capitalize text-system">{item}</BreadcrumbPage>
        ) : (
          <Button
            className="p-0 text-2xl font-medium capitalize text-gray-400 hover:bg-transparent"
            variant="system_tertiary"
            onClick={handleClick}
          >
            {item}
          </Button>
        )}
      </BreadcrumbItem>
      {showSeparator && <BreadcrumbSeparator className="text-2xl font-medium text-gray-400">/</BreadcrumbSeparator>}
    </>
  );
};
