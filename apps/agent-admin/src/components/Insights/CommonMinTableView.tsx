import Typography from '@breakout/design-system/components/Typography/index';
import TableShimmer from './TableShimmer';
import { cn } from '@breakout/design-system/lib/cn';

type RowData = {
  icon?: React.ReactElement;
  text: string;
  value: string | number;
  rowData: unknown;
};

interface CommonMinTableViewProps {
  title: string;
  description?: string;
  rows?: RowData[];
  columns?: string[];
  isLoading?: boolean;
  onRowClick?: (rowData: unknown) => void;
}

const CommonMinTableView = ({
  title,
  description,
  rows,
  columns = [],
  isLoading,
  onRowClick,
}: CommonMinTableViewProps) => {
  return (
    <div className="flex-1 py-6">
      <div className="mb-6">
        <h1 className="mb-3 text-lg font-semibold text-gray-900">{title}</h1>
        <p className="text-sm leading-relaxed text-gray-500">{description}</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-12 gap-4 px-2 py-2">
            <div className="col-span-9">
              <Typography variant="caption-12-normal" textColor="gray500">
                {columns[0]}
              </Typography>
            </div>
            <div className="col-span-3 text-center">
              <Typography variant="caption-12-normal" textColor="gray500">
                {columns[1]}
              </Typography>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <TableShimmer />
          ) : (
            rows?.map((row, index) => (
              <div
                key={index}
                className={cn(
                  'grid grid-cols-12 gap-4 px-2 py-2 transition-colors hover:bg-gray-50',
                  onRowClick && 'cursor-pointer',
                )}
                onClick={() => onRowClick?.(row.rowData)}
              >
                <div className="col-span-9 flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
                  {row.icon ? (
                    <div className="flex-shrink-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-bluegray-200">
                        {row.icon}
                      </div>
                    </div>
                  ) : null}
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-900">
                    {row.text}
                  </span>
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <span className="text-sm text-gray-900">{row.value}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonMinTableView;
