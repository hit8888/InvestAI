export interface OverviewDataItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  value: unknown;
  renderFn?: (value: unknown) => React.ReactNode;
}

interface OverviewDataItemsProps {
  title: string;
  dataItems: OverviewDataItem[];
  className?: string;
}

const OverviewDataItems = ({ title, dataItems, className }: OverviewDataItemsProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="my-4 text-lg text-gray-900">{title}</div>
      <div className="flex flex-col">
        {dataItems.map((dataItem) => (
          <div key={dataItem.key} className="flex w-full py-2">
            <div className="flex flex-1 shrink-0 items-center gap-2">
              <div className="flex items-center justify-center rounded-lg bg-primary/10 px-1 py-1">{dataItem.icon}</div>

              <span className="text-medium text-sm text-gray-500">{dataItem.label}</span>
            </div>
            <div className="flex-1 shrink-0 overflow-hidden text-wrap text-sm text-gray-900">
              {dataItem.renderFn ? dataItem.renderFn(dataItem.value) : (dataItem.value as React.ReactNode)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewDataItems;
