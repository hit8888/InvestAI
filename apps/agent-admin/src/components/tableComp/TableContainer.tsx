import AllFilters from './AllFilters';
import CustomFilterDropdown from './CustomFilterDropdown';
import CustomTableView from './CustomTableView';

import {
  EmailCellValueProps,
  LeadsTableRowData,
  LeadsTableViewProps,
  LocationCellValueProps,
  TableHeaderColumn,
  TimestampCellValueProps,
} from '@meaku/core/types/admintable';

const defaultData: LeadsTableViewProps[] = [
  {
    email: 'carlos.lopez@globals.com',
    name: 'Carlos Lopez',
    role: 'IT Director',
    company: 'Global Solutions',
    location: '🇪🇸 Madrid, Spain',
    timestamp: '2024-12-08 16:45:00',
    productOfInterest: 'Cloud Integration',
  },
  {
    email: 'emma.jones@techworld.com',
    name: 'Emma Jones',
    role: 'Product Manager',
    company: 'TechWorld',
    location: '🇺🇸 New York, USA',
    timestamp: '2024-12-08 17:00:00',
    productOfInterest: 'AI Solutions',
  },
  {
    email: 'lucas.miller@futuregen.com',
    name: 'Lucas Miller',
    role: 'Lead Developer',
    company: 'FutureGen',
    location: '🇬🇧 London, UK',
    timestamp: '2024-12-08 17:15:00',
    productOfInterest: 'Blockchain Technology',
  },
  {
    email: 'isabella.davis@globalnet.com',
    name: 'Isabella Davis',
    role: 'CEO',
    company: 'GlobalNet',
    location: '🇨🇦 Toronto, Canada',
    timestamp: '2024-12-08 17:30:00',
    productOfInterest: 'Global Connectivity',
  },
  {
    email: 'oliver.smith@cloudworks.com',
    name: 'Oliver Smith',
    role: 'CTO',
    company: 'CloudWorks',
    location: '🇩🇪 Berlin, Germany',
    timestamp: '2024-12-08 17:45:00',
    productOfInterest: 'Cloud Computing',
  },
  {
    email: 'sophia.wilson@dataexperts.com',
    name: 'Sophia Wilson',
    role: 'Data Analyst',
    company: 'DataExperts',
    location: '🇦🇺 Sydney, Australia',
    timestamp: '2024-12-08 18:00:00',
    productOfInterest: 'Big Data Analytics',
  },
  {
    email: 'jackson.brown@innovatech.com',
    name: 'Jackson Brown',
    role: 'Product Manager',
    company: 'InnoVatech',
    location: '🇨🇭 Zurich, Switzerland',
    timestamp: '2024-12-08 18:15:00',
    productOfInterest: 'Tech Innovations',
  },
  {
    email: 'maria.taylor@smartsolutions.com',
    name: 'Maria Taylor',
    role: 'Marketing Lead',
    company: 'SmartSolutions',
    location: '🇪🇸 Barcelona, Spain',
    timestamp: '2024-12-08 18:30:00',
    productOfInterest: 'Smart Devices',
  },
  {
    email: 'daniel.martinez@ecomverse.com',
    name: 'Daniel Martinez',
    role: 'Sales Director',
    company: 'Ecomverse',
    location: '🇫🇷 Paris, France',
    timestamp: '2024-12-08 18:45:00',
    productOfInterest: 'E-commerce Solutions',
  },
  {
    email: 'lily.harris@nextgen.co',
    name: 'Lily Harris',
    role: 'HR Specialist',
    company: 'NextGen Co',
    location: '🇯🇵 Tokyo, Japan',
    timestamp: '2024-12-08 19:00:00',
    productOfInterest: 'Talent Management Software',
  },
];

const EmailCellValue: React.FC<EmailCellValueProps> = ({ value }: { value: string }) => {
  return <span className="w-[158px] truncate">{value}</span>;
};
const LocationCellValue: React.FC<LocationCellValueProps> = ({ value }: { value: string }) => {
  return <span>{value}</span>;
};
const TimestampCellValue: React.FC<TimestampCellValueProps> = ({ value }: { value: string }) => {
  return <span>{value}</span>;
};

const columns: TableHeaderColumn<LeadsTableRowData>[] = [
  {
    accessor: 'email',
    header: 'Email',
    cell: (info) => <EmailCellValue value={info.getValue()} />,
  },
  {
    accessor: (row) => row.name,
    id: 'name',
    cell: (info) => <strong>{info.getValue()}</strong>,
    header: 'Name',
  },
  {
    accessor: 'company',
    header: () => 'Company',
    cell: (info) => info.getValue(), // Assuming renderValue is a method of info
  },
  {
    accessor: 'role',
    header: 'Role',
  },
  {
    accessor: 'productOfInterest',
    header: 'Product Of Interest',
  },
  {
    accessor: 'timestamp',
    header: 'Timestamp',
    cell: (info) => <TimestampCellValue value={info.getValue()} />,
  },
  {
    accessor: 'location',
    header: 'Location',
    cell: (info) => <LocationCellValue value={info.getValue()} />,
  },
];

const TableContainer = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <TableViewWrapper />
        <TablePagination />
      </div>
    </div>
  );
};

const TableViewWrapper = () => {
  const FilterNameOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const ConvertedOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const HighIntentOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const ShortestSessionOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  return (
    <div className="flex h-[547px] flex-col items-start gap-4 self-stretch">
      <div className="flex items-center gap-6 self-stretch">
        <p className="flex-1 font-inter text-[24px] font-semibold leading-normal tracking-[0.24px] text-[#101828]">
          {'Table of leads'}
        </p>
        <div className="flex items-start gap-4">
          <div className="flex items-start gap-2">
            <CustomFilterDropdown options={FilterNameOptions} filterLabel="Filter Name" />
            <CustomFilterDropdown options={ConvertedOptions} filterLabel="Converted" />
            <CustomFilterDropdown options={HighIntentOptions} filterLabel="High intent (80-100)" />
            <CustomFilterDropdown options={ShortestSessionOptions} filterLabel="Shortest session" />
          </div>
          <AllFilters />
        </div>
      </div>
      <CustomTableView tabularData={defaultData} columnHeaderData={columns} />
    </div>
  );
};

const TablePagination = () => {
  return <div className="flex items-center justify-end gap-4 self-stretch"></div>;
};

export default TableContainer;
