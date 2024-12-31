import { LeadsTableViewProps } from '@meaku/core/types/admin/admin-table';
import { AuthResponse } from '@meaku/core/types/admin/auth';

// Authentication

export const ACCESS_TOKEN_EXPIRATION_TIME = 1; // MINUTES
export const DefaultAuthResponse: AuthResponse = {
  id: 0,
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  is_active: false,
  is_staff: false,
  date_joined: '',
  last_login: '',
  organizations: [], // Assuming an empty array as the default for organizations
};

export const NAV_LINK_ICON_PROPS = {
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
  color: '#4E46DC',
};

export const PAGE_HEADER_TITLE_ICON_PROPS = {
  width: '24',
  height: '25',
  viewBox: '0 0 24 25',
  color: '#4E46DC',
};

export const TABLE_SORT_ICON_PROPS = NAV_LINK_ICON_PROPS;
export const PAGINATION_ARROW_ICONS = NAV_LINK_ICON_PROPS;
export const DROPDOWN_ARROW_ICONS = PAGE_HEADER_TITLE_ICON_PROPS;

export const DEFAULT_USERNAME = 'Kymberly Abestango';
export const ADMIN_DASHBOARD_COMPANY_NAME = 'Breakout Admin';
export const LOGOUT_BUTTON_TITLE = 'Logout';
export const EXPORT_DOWNLOAD_LABEL = 'Download';

// Routes

export const URL_ROUTE_LEADS_PAGE = '/leads';
export const URL_ROUTE_LOGIN_PAGE = '/login';
export const URL_ROUTE_CONVERSATIONS_PAGE = '/conversations';
export const URL_ROUTE_PLAYGROUND_PAGE = '/playground';

export const NAVITEM_LEADS_PAGE = 'Leads';
export const NAVITEM_CONVERSATIONS_PAGE = 'Conversations';
export const NAVITEM_PLAYGROUND_PAGE = 'Playground';

// TABLE Wrapper variables

export const LEADS_TABLE_MOCK_DATA: LeadsTableViewProps[] = [
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

export const DEFAULT_DATA_FOR_LEADS_PAGE = [
  ...LEADS_TABLE_MOCK_DATA,
  ...LEADS_TABLE_MOCK_DATA,
  ...LEADS_TABLE_MOCK_DATA,
];

// Filters
export const FILTER_DEFAULT_OPTIONS = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

export const BY_INTENT_SCORE_FILTER_LABEL = 'By intent score';
export const BY_DATE_RANGE_FILTER_LABEL = 'By date range';
export const BY_LOCATION_FILTER_LABEL = 'By location';
