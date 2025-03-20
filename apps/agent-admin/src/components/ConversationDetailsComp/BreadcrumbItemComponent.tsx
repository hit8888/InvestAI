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
  const role = !isLast ? 'button' : undefined;
  const tabIndex = !isLast ? 0 : undefined;
  return (
    <>
      <BreadcrumbItem
        className={cn(`text-base font-medium`, {
          'font-semibold text-primary': isLast,
          'cursor-pointer  text-gray-400': !isLast,
        })}
      >
        <div onClick={handleClick} role={role} tabIndex={tabIndex}>
          {isLast ? <BreadcrumbPage className="font-semibold text-primary">{item}</BreadcrumbPage> : item}
        </div>
      </BreadcrumbItem>
      {showSeparator && <BreadcrumbSeparator className="text-base font-medium text-gray-400">/</BreadcrumbSeparator>}
    </>
  );
};
