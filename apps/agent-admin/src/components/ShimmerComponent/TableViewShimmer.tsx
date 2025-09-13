import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { cn } from '@breakout/design-system/lib/cn';

const TableViewShimmer = ({ rowCount = 10, columnCount = 6 }) => {
  const columns = Array(columnCount).fill(0);
  const rows = Array(rowCount).fill(0);

  const columnWidth = `w-1/${columnCount}`;

  return (
    <div className={`relative w-full overflow-x-auto`}>
      <table className="w-full">
        <thead className="w-full">
          <tr className="w-full">
            {columns.map((_, index) => (
              <th key={`header-${index}`} className={`${columnWidth} px-4 py-3`}>
                <Skeleton className="h-3 w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="w-full">
          {rows.map((_, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={cn('w-full border-b border-gray-200', {
                'bg-white': rowIndex % 2 === 0,
                'bg-gray-25': rowIndex % 2 !== 0,
              })}
            >
              {columns.map((_, colIndex) => (
                <td
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={cn(`${columnWidth} px-4 py-4`, {
                    'border-r border-gray-200': colIndex !== columns.length - 1,
                  })}
                >
                  <Skeleton
                    className={cn('h-6 w-1/2', {
                      'w-[90%]': rowIndex % 2 !== 0,
                    })}
                  />
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
