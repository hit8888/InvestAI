import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { cn } from '../../lib/cn.ts';
import { Badge } from './badge.tsx';

interface IBadgeSelectOptionProps<TFieldValues extends FieldValues, TFieldName extends Path<TFieldValues>> {
  field: ControllerRenderProps<TFieldValues, TFieldName>;
  children?: React.ReactNode;
  className?: string;
}

const BadgeSelectOption = <TFieldValues extends FieldValues, TFieldName extends Path<TFieldValues>>(
  props: IBadgeSelectOptionProps<TFieldValues, TFieldName>,
) => {
  const { field, children, className, ...restProps } = props;
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full cursor-pointer border-2 border-primary/60 px-4 py-2 font-inter',
        field.value === children
          ? 'bg-primary text-primary-foreground'
          : 'text-primary hover:bg-primary/10',
        { className },
      )}
      onClick={() => field.onChange(children)}
      {...restProps}
    >
      {children}
    </Badge>
  );
};

interface IBadgeSelectProps {
  children?: React.ReactNode[];
  className?: string;
}

const BadgeSelect = (props: IBadgeSelectProps) => {
  const { children, className, ...restProps } = props;
  return (
    <div className={cn('flex flex-wrap justify-center gap-2', { className })} {...restProps}>
      {children}
    </div>
  );
};

export { BadgeSelect, BadgeSelectOption };
