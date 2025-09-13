export type OverviewDataItemProps = {
  label: string;
  icon?: React.ReactNode;
  value?: string | number;
  renderValue?: (value?: number | string) => React.ReactNode;
};

const OverviewDataItem = ({ label, icon, value, renderValue }: OverviewDataItemProps) => {
  const showLeftSide = icon || label;
  const showRightSide = value || renderValue;

  return (
    <div className="flex w-full items-center gap-4 py-2">
      {showLeftSide ? (
        <div className="flex flex-1 shrink-0 items-center gap-2">
          {icon && <div className="flex items-center justify-center rounded-lg bg-primary/10 px-1 py-1">{icon}</div>}
          <span className="text-medium text-sm text-gray-500">{label}</span>
        </div>
      ) : null}
      {showRightSide ? (
        <div className="overflow-hidden text-wrap text-sm text-gray-900">
          {renderValue ? renderValue(value) : (value as React.ReactNode)}
        </div>
      ) : null}
    </div>
  );
};

export default OverviewDataItem;
