# @meaku/saral

A modern React design system package based on shadcn/ui components. This package provides reusable UI components that can be imported into any app in the monorepo.

## Features

- **Tree-shakable**: Import only what you need
- **TypeScript**: Full TypeScript support
- **Tailwind CSS**: Built with Tailwind CSS for consistent styling
- **Variants**: Components support multiple variants and sizes
- **Icons**: Comprehensive icon library
- **Utilities**: Helper functions for styling

## Installation

This package is part of the monorepo and can be used by other apps in the workspace.

## Usage

### Importing Components

```tsx
// Import specific components
import { Button } from '@meaku/saral';
import { Popover, PopoverTrigger, PopoverContent } from '@meaku/saral';

// Import icons
import { MessageCircle, Phone, Settings } from '@meaku/saral';

// Import utilities
import { cn, cva } from '@meaku/saral';
```

### Using the Button Component

```tsx
import { Button } from '@meaku/saral';

function MyComponent() {
  return (
    <div>
      <Button variant="default" size="default">
        Click me
      </Button>

      <Button variant="action" size="icon">
        <MessageCircle />
      </Button>
    </div>
  );
}
```

### Using the Popover Component

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@meaku/saral';
import { Settings } from '@meaku/saral';

function MyComponent() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Settings</h4>
            <p className="text-sm text-muted-foreground">Configure your preferences here.</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Available Variants

- `default`: Primary button style
- `destructive`: Red button for destructive actions
- `outline`: Outlined button style
- `secondary`: Secondary button style
- `ghost`: Ghost button style
- `link`: Link-style button
- `action`: Special action button with blue styling

### Available Sizes

- `default`: Standard button size
- `sm`: Small button
- `lg`: Large button
- `icon`: Square button for icons

### Using Icons

```tsx
import { MessageCircle, Phone, Settings } from '@meaku/saral';

function MyComponent() {
  return (
    <div>
      <MessageCircle size={24} />
      <Phone size={20} className="text-blue-500" />
      <Settings />
    </div>
  );
}
```

### Using Utilities

```tsx
import { cn, cva } from '@meaku/saral';

// Merge class names
const className = cn('base-class', 'another-class', 'conditional-class');

// Create variant functions
const buttonVariants = cva('base-button-classes', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      lg: 'px-4 py-2 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'sm',
  },
});
```

## Development

### Building the Package

```bash
pnpm build
```

### Watching for Changes

```bash
pnpm watch
```

### Type Checking

```bash
pnpm type-check
```

## Available Icons

The package includes all Lucide React icons. You can import any icon from the library:

```tsx
import {
  MessageCircle,
  Phone,
  Settings,
  Home,
  User,
  Search,
  Plus,
  X,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  Check,
  AlertCircle,
  Info,
  Warning,
  Heart,
  Star,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  // ... and many more
} from '@meaku/saral';
```

For a complete list of available icons, visit [Lucide React](https://lucide.dev/icons/).

## Contributing

When adding new components:

1. Create the component in `src/`
2. Export it from `src/index.ts`
3. Add types to the component file
4. Update this README with usage examples
5. Build and test the package

## License

MIT
