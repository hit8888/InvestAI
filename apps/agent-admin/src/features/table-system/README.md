# Generic Table System

A reusable, URL-driven table system for building data tables with filtering, sorting, pagination, and row details.

## ✅ Implementation Status

**COMPLETE** - All core functionality implemented and ready for use.

## 📁 Structure

```
table-system/
├── components/           # UI components
│   ├── GenericTablePage.tsx           # Main entry point ⭐
│   ├── GenericTableContainer.tsx      # Orchestrates all components
│   ├── GenericTable.tsx               # TanStack Table component
│   ├── GenericTableHeader.tsx         # Header with column manager
│   ├── GenericTableFilters.tsx        # Filter orchestration
│   ├── GenericTablePagination.tsx     # Pagination controls
│   ├── GenericRowDrawer.tsx           # Drawer for row details
│   ├── filters/                       # Filter components
│   │   ├── SearchFilter.tsx
│   │   ├── MultiSelectFilter.tsx
│   │   ├── DateRangeFilter.tsx
│   │   ├── DynamicFilter.tsx
│   │   └── FilterChipsList.tsx
│   └── states/                        # State components
│       ├── TableLoadingSkeleton.tsx
│       ├── TableEmptyState.tsx
│       ├── TableErrorState.tsx
│       ├── TableLoadingOverlay.tsx
│       └── ConfigErrorScreen.tsx
├── hooks/                # React hooks
│   ├── useTableUrlState.ts            # URL state management
│   ├── useColumnPreferences.ts        # Column visibility (localStorage)
│   └── useGenericTableState.ts        # Main composition hook ⭐
├── types/                # TypeScript types
│   ├── config.types.ts
│   ├── filter.types.ts
│   ├── column.types.ts
│   ├── table.types.ts
│   └── index.ts
├── utils/                # Utility functions
│   ├── urlStateHelpers.ts             # URL serialization
│   ├── columnHelpers.ts               # Column transformation
│   └── configValidator.ts             # Config validation (Zod)
└── index.ts              # Public exports
```

## 🎯 Features

### ✅ Implemented

- [x] URL-driven state (filters, sort, pagination, search)
- [x] TanStack Table integration
- [x] Dynamic filters (search, multi-select, date-range)
- [x] Server-side sorting (single column)
- [x] Server-side pagination
- [x] Column visibility management (show/hide)
- [x] Row click opens drawer with details
- [x] Loading states (skeleton + overlay)
- [x] Empty states (no data vs no results)
- [x] Error states
- [x] Config validation (Zod)
- [x] Entity metadata support (V1 and V2 formats)
- [x] Filter chips display
- [x] localStorage persistence for column preferences

### ❌ Deferred (Future)

- [ ] Column reordering (drag-and-drop)
- [ ] Column freezing
- [ ] Custom cell renderers (20+ types)
- [ ] Bulk actions & row selection
- [ ] Multi-column sorting
- [ ] Column resizing
- [ ] Keyboard navigation (advanced)

## 🚀 Usage

### Basic Setup

```tsx
// pages/ConversationsV2/ConversationsV2Page.tsx
import { GenericTablePage } from '@/features/table-system';
import { conversationsTableConfig } from './config/conversationsTableConfig';

const ConversationsV2Page = () => {
  return <GenericTablePage config={conversationsTableConfig} />;
};

export default ConversationsV2Page;
```

### Configuration

```tsx
// pages/ConversationsV2/config/conversationsTableConfig.ts
import type { TablePageConfig } from '@/features/table-system';
import { ConversationDrawerContent } from '../components/ConversationDrawerContent';

export const conversationsTableConfig: TablePageConfig = {
  pageKey: 'conversations',
  pageTitle: 'Conversations',

  api: {
    tableData: '/api/conversations/table',
    entityMetadata: '/api/entity-metadata?entity_type=CONVERSATION',
    filterConfig: '/api/conversations/filter-config', // Optional
  },

  pagination: {
    defaultPageSize: 50,
    pageSizeOptions: [20, 50, 100, 200, 500],
  },

  defaultSort: {
    field: 'created_at',
    order: 'desc',
  },

  // Optional: hardcode filters if no API
  filters: [
    {
      id: 'status',
      label: 'Status',
      type: 'multi-select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'resolved', label: 'Resolved' },
      ],
    },
    {
      id: 'created_at',
      label: 'Created Date',
      type: 'date-range',
    },
  ],

  drawer: {
    enabled: true,
    width: '50vw',
    component: ConversationDrawerContent,
    urlParam: 'sessionId',
  },
};
```

### Drawer Content Component

```tsx
// pages/ConversationsV2/components/ConversationDrawerContent.tsx
import type { DrawerContentProps } from '@/features/table-system';

export const ConversationDrawerContent = ({
  data,
  onClose,
  refreshTable
}: DrawerContentProps<ConversationRow>) => {
  return (
    <div className="flex flex-col h-full w-full bg-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Conversation Details</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Your custom content */}
        <pre className="text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};
```

## 📊 URL State Format

The system automatically manages URL parameters:

```
/conversations?
  page=2&
  pageSize=50&
  sortBy=created_at&
  sortOrder=desc&
  status=active,pending&
  dateFrom=2025-01-01&
  dateTo=2025-01-31&
  search=customer%20inquiry&
  sessionId=abc123
```

## 🎨 Customization

### Custom Empty State

```tsx
const CustomEmptyState = () => (
  <div>No conversations found. Start chatting!</div>
);

export const config: TablePageConfig = {
  // ... other config
  emptyState: CustomEmptyState,
};
```

### Custom Error State

```tsx
const CustomErrorState = ({ error }: { error: Error }) => (
  <div>Oops! {error.message}</div>
);

export const config: TablePageConfig = {
  // ... other config
  errorState: CustomErrorState,
};
```

## 🔌 Advanced Usage

### Access Table State Directly

```tsx
import { useGenericTableState } from '@/features/table-system';

const MyCustomComponent = () => {
  const tableState = useGenericTableState(config);

  // Access any state
  console.log(tableState.data);
  console.log(tableState.urlState.filters);
  console.log(tableState.appliedFiltersCount);

  // Call methods
  tableState.refetch();
  tableState.urlState.resetFilters();
};
```

### Build Custom Table

```tsx
import {
  GenericTableContainer,
  GenericTable,
  useGenericTableState,
} from '@/features/table-system';

// Build your own layout
const MyCustomTablePage = () => {
  const tableState = useGenericTableState(config);

  return (
    <div>
      {/* Your custom header */}
      <GenericTable {...tableState} />
      {/* Your custom footer */}
    </div>
  );
};
```

## 🐛 Troubleshooting

### Config Validation Failed

If you see `ConfigErrorScreen`, check browser console for details. Common issues:

- Missing required fields (`pageKey`, `pageTitle`, `api`, etc.)
- Invalid `defaultPageSize` (must be positive number)
- Empty `pageSizeOptions` array

### Drawer Not Opening

- Check `drawer.enabled` is `true`
- Verify `drawer.urlParam` matches URL parameter name
- Ensure row has the key field defined by entity metadata

### Filters Not Working

- Check `filterConfig` is provided (either from API or hardcoded)
- Verify filter `id` matches the field name in your backend
- Check browser network tab for API request payload

## 📝 API Contracts

### Entity Metadata Response

```typescript
{
  "columns": [
    {
      "id": 1,
      "key_name": "session_id",
      "display_name": "Session ID",
      "data_type": "string",
      "is_display": true,
      "table_order": 1,

      // V2 fields (optional)
      "column_type": "PRIMARY",
      "is_row_key": true,
      "is_sortable": false,
      "is_filterable": false,
      "render_config": {
        "cell_type": "TEXT"
      }
    }
  ]
}
```

### Table Data Request

```typescript
POST /api/conversations/table

{
  "filters": [
    { "field": "status", "value": ["active", "pending"] }
  ],
  "sort": [
    { "field": "created_at", "order": "desc" }
  ],
  "page": 1,
  "page_size": 50,
  "search": "query"
}
```

### Table Data Response

```typescript
{
  "results": [...],
  "current_page": 1,
  "page_size": 50,
  "total_pages": 10,
  "total_records": 500
}
```

## 🎯 Next Steps

1. **Build Conversations Page** - First implementation
2. **Add Column Reordering** - Drag-and-drop with a11y
3. **Custom Cell Renderers** - 20+ cell types
4. **Build Remaining Pages** - Leads, Visitors, Link Clicks
5. **Advanced Features** - Bulk actions, export, etc.

## 🏗️ Architecture Decisions

- **URL = Source of Truth** for shareable, bookmarkable states
- **React Query** for data caching and refetching
- **TanStack Table** for table rendering and state management
- **Server-side** sorting, filtering, and pagination
- **Generic** and configuration-driven for maximum reusability
- **Type-safe** with full TypeScript support

---

**Built with:** React 19, TanStack Table v8, React Query, TypeScript, Tailwind CSS, Zod

**Status:** ✅ Production Ready (Core Features)
