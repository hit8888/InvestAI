import Typography from '@breakout/design-system/components/Typography/index';
import TableShimmer from '../common/TableShimmer';
import { cn } from '@breakout/design-system/lib/cn';

type DefaultRowData = {
  text: string;
  value: string | number;
};

type RowData = {
  icon?: React.ReactElement;
  text: string;
  value: string | number;
  rowData: unknown;
};

interface CommonMinTableViewProps {
  title: string;
  description?: string;
  rows?: RowData[] | DefaultRowData[];
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
  const handleRowClick = (row: RowData | DefaultRowData) => {
    if (onRowClick && 'rowData' in row) {
      onRowClick(row.rowData);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 py-6">
      <div className="flex flex-col gap-2">
        <Typography variant="title-18">{title}</Typography>
        <Typography variant="caption-12-normal" textColor="gray500">
          {description}
        </Typography>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
        <div className="border-b border-gray-300 bg-gray-100">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-9 px-2 py-2">
              <Typography variant="caption-12-medium" textColor="gray500">
                {columns[0]}
              </Typography>
            </div>
            <div className="col-span-3 border-l border-gray-300 px-2 py-2 text-center">
              <Typography variant="caption-12-medium" textColor="gray500">
                {columns[1]}
              </Typography>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <TableShimmer />
          ) : rows && rows.length > 0 ? (
            rows.map((row, index) => (
              <div
                key={index}
                className={cn(
                  'grid grid-cols-12 gap-4  transition-colors hover:bg-gray-50',
                  onRowClick && 'cursor-pointer',
                )}
                onClick={() => handleRowClick(row)}
              >
                <div className="col-span-9 flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap px-2 py-2">
                  {'icon' in row && row.icon ? (
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
                <div className="col-span-3 flex items-center justify-center border-l border-gray-200">
                  <span className="text-sm text-gray-900">{row.value}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <Typography variant="body-14" textColor="gray400">
                  No data available
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonMinTableView;
