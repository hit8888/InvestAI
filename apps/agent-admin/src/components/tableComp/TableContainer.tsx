import AllFilters from './AllFilters';
import CustomFilterDropdown from './CustomFilterDropdown';
import CustomTableView from './CustomTableView';
import TablePagination from './TablePagination';
import ExportDownload from './ExportDownload';

import {
  EmailCellValueProps,
  ColumnDefinition,
  LocationCellValueProps,
  TimestampCellValueProps,
  ProductOfInterestCellValueProps,
} from '@meaku/core/types/admin/admin-table';
import {
  BY_DATE_RANGE_FILTER_LABEL,
  BY_INTENT_SCORE_FILTER_LABEL,
  BY_LOCATION_FILTER_LABEL,
  DEFAULT_DATA_FOR_LEADS_PAGE,
  FILTER_DEFAULT_OPTIONS,
  LEADS_TABLE_HEADER_TITLE,
} from '../../utils/constants';

const EmailCellValue: React.FC<EmailCellValueProps> = ({ value }: { value: string }) => {
  return (
    <span title={value} className="w-48 truncate 2xl:w-40">
      {value}
    </span>
  );
};

const LocationCellValue: React.FC<LocationCellValueProps> = ({ value }: { value: string }) => {
  return <span>{value}</span>;
};

const TimestampCellValue: React.FC<TimestampCellValueProps> = ({ value }: { value: string }) => {
  return <span>{value}</span>;
};

const ProductOfInterestCellValue: React.FC<ProductOfInterestCellValueProps> = ({ value }: { value: string }) => {
  return (
    <span title={value} className="w-28 truncate 2xl:w-40">
      {value}
    </span>
  );
};

const columns: ColumnDefinition[] = [
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => <EmailCellValue value={info.getValue()} />,
  },
  {
    accessorKey: 'name',
    id: 'name',
    cell: (info) => <span>{info.getValue()}</span>,
    header: 'Name',
  },
  {
    id: 'company',
    accessorKey: 'company',
    header: 'Company',
    cell: (info) => info.getValue(), // Assuming renderValue is a method of info
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
  },
  {
    id: 'productOfInterest',
    accessorKey: 'productOfInterest',
    header: 'Product Of Interest',
    cell: (info) => <ProductOfInterestCellValue value={info.getValue()} />,
  },
  {
    id: 'timestamp',
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: (info) => <TimestampCellValue value={info.getValue()} />,
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: 'Location',
    cell: (info) => <LocationCellValue value={info.getValue()} />,
  },
];

const TableContainer = () => {
  const totalItems = 200; // Total number of items
  const itemsPerPage = 50; // Items per page

  // Handle page changes
  const handlePageChange = (page: number) => {
    console.log(`Page changed to: ${page}`); // Example action
  };
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <TableViewWrapper />
        <div className="flex items-center justify-end gap-4 self-stretch">
          <TablePagination totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
};

const TableViewWrapper = () => {
  const ByDateRangeOptions = FILTER_DEFAULT_OPTIONS;
  const ByIntentScoreOptions = FILTER_DEFAULT_OPTIONS;
  const ByLocationOptions = FILTER_DEFAULT_OPTIONS;
  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <p className="flex-1 text-2xl font-semibold text-gray-900">{LEADS_TABLE_HEADER_TITLE}</p>
      <div className="flex items-start gap-4">
        <AllFilters />
        <ExportDownload />
        <CustomFilterDropdown options={ByDateRangeOptions} filterLabel={BY_DATE_RANGE_FILTER_LABEL} />
        <CustomFilterDropdown options={ByIntentScoreOptions} filterLabel={BY_INTENT_SCORE_FILTER_LABEL} />
        <CustomFilterDropdown options={ByLocationOptions} filterLabel={BY_LOCATION_FILTER_LABEL} />
      </div>
      <CustomTableView tabularData={DEFAULT_DATA_FOR_LEADS_PAGE} columnHeaderData={columns} />
    </div>
  );
};

export default TableContainer;
