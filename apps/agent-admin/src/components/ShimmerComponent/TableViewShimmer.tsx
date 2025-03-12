import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { cn } from '@breakout/design-system/lib/cn';

const TableViewShimmer = ({ rowCount = 5, columnCount = 4 }) => {
  const columns = Array(columnCount).fill(0);
  const rows = Array(rowCount).fill(0);

  return (
    <div className={`relative w-full overflow-x-auto`}>
      <table className="w-full">
        <thead className="w-full">
          <tr className="flex w-full border-b border-t border-primary/40 bg-[#DCDAF8]">
            {columns.map((_, index) => (
              <th
                key={`header-${index}`}
                className={cn('flex-1 px-4 py-3', {
                  'border-r border-primary/40': index !== columns.length - 1,
                })}
              >
                <Skeleton className="h-6 w-full bg-primary/30" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((_, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={cn('flex w-full border-b border-gray-200', {
                'bg-white': rowIndex % 2 === 0,
                'bg-gray-25': rowIndex % 2 !== 0,
              })}
            >
              {columns.map((_, colIndex) => (
                <td
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={cn('flex-1 px-4 py-4', {
                    'border-r border-gray-200': colIndex !== columns.length - 1,
                  })}
                >
                  <Skeleton className="h-6 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableViewShimmer;
