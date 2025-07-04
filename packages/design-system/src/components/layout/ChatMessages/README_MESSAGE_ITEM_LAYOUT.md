# MessageItemLayout Component

A flexible layout component for message items with improved type safety and maintainability.

## Features

### 1. **Type Safety with Enums**

- Uses proper TypeScript enums for all configuration options
- Better IntelliSense and autocomplete support
- Compile-time error checking for invalid values

### 2. **Clean API**

- Intuitive prop names and values
- Consistent naming conventions
- Self-documenting code

### 3. **Better Maintainability**

- Centralized mapping objects for class names
- Easier to add new values or modify existing ones
- Reduced code duplication

## API Reference

### Enums

```typescript
enum Alignment {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

enum Gap {
  SMALL = 2,    // gap-2
  MEDIUM = 4,   // gap-4
}

enum Padding {
  NONE = 'none',                    // pl-0
  INLINE = 'inline',                // pl-11 pr-6
  INLINE_LEFT_ONLY = 'inline-left-only', // pl-11
}

enum Orientation {
  ROW = 'row',
  COLUMN = 'column',
}
```

### Props

| Prop            | Type                              | Default           | Description                   |
| --------------- | --------------------------------- | ----------------- | ----------------------------- |
| `children`      | `React.ReactNode`                 | -                 | Content to render             |
| `className`     | `string`                          | -                 | Additional CSS classes        |
| `elementRef`    | `React.RefObject<HTMLDivElement>` | -                 | Ref for the container element |
| `align`         | `Alignment`                       | `Alignment.LEFT`  | Content alignment             |
| `gap`           | `Gap`                             | `Gap.SMALL`       | Gap between flex items        |
| `paddingInline` | `Padding`                         | `Padding.NONE`    | Inline padding configuration  |
| `orientation`   | `Orientation`                     | `Orientation.ROW` | Flex direction                |

## Alignment Behavior

The alignment behavior depends on the orientation:

- **Row orientation**: Uses `justify-start`, `justify-end`, or `justify-center`
- **Column orientation**: Uses `items-start`, `items-end`, or `justify-center`

## Padding Behavior

The `paddingInline` prop provides three padding options:

- **NONE**: No padding (`pl-0`)
- **INLINE**: Left and right padding for messages that are not the last in conversation (`pl-11 pr-6`)
- **INLINE_LEFT_ONLY**: Only left padding (`pl-11`)

## Usage Examples

### Basic Usage

```tsx
import MessageItemLayout, { Alignment, Gap, Padding, Orientation } from './MessageItemLayout';

// Basic usage with defaults
<MessageItemLayout>
  <div>Content</div>
</MessageItemLayout>

// With all props
<MessageItemLayout
  align={Alignment.CENTER}
  gap={Gap.MEDIUM}
  paddingInline={Padding.INLINE}
  orientation={Orientation.COLUMN}
  className="custom-class"
>
  <div>Content</div>
</MessageItemLayout>
```

### Common Patterns

```tsx
// User message (right-aligned with inline padding)
<MessageItemLayout
  align={Alignment.RIGHT}
  paddingInline={Padding.INLINE}
>
  <div>User message</div>
</MessageItemLayout>

// AI response (left-aligned with inline padding)
<MessageItemLayout
  align={Alignment.LEFT}
  paddingInline={Padding.INLINE}
>
  <div>AI response</div>
</MessageItemLayout>

// Last message in conversation (no right padding)
<MessageItemLayout
  align={Alignment.LEFT}
  paddingInline={Padding.INLINE_LEFT_ONLY}
>
  <div>Last message</div>
</MessageItemLayout>

// Centered content
<MessageItemLayout
  align={Alignment.CENTER}
  gap={Gap.MEDIUM}
>
  <div>Centered content</div>
</MessageItemLayout>

// Column layout
<MessageItemLayout
  orientation={Orientation.COLUMN}
  align={Alignment.CENTER}
  gap={Gap.SMALL}
>
  <div>Top item</div>
  <div>Bottom item</div>
</MessageItemLayout>
```

## CSS Classes Applied

The component applies the following Tailwind CSS classes:

- **Base**: `flex`
- **Alignment**:
  - Row: `justify-start`, `justify-end`, `justify-center`
  - Column: `items-start`, `items-end`, `justify-center`
- **Orientation**: `flex-row`, `flex-col`
- **Padding**:
  - `pl-0` (NONE)
  - `pl-11 pr-6` (INLINE)
  - `pl-11` (INLINE_LEFT_ONLY)
- **Gap**: `gap-2`, `gap-4`

## Benefits

- **Type Safety**: Compile-time checking prevents runtime errors
- **IntelliSense**: Better autocomplete and documentation
- **Maintainability**: Easier to modify and extend
- **Readability**: Self-documenting code with clear intent
- **Performance**: No runtime string comparisons
- **Consistency**: Standardized naming and values
- **Flexibility**: Supports different padding scenarios for conversation flow

## Implementation Details

The component uses a centralized mapping approach for CSS classes:

```typescript
const alignmentClasses = {
  [Alignment.LEFT]: finalOrientation === Orientation.COLUMN ? 'items-start' : 'justify-start',
  [Alignment.RIGHT]: finalOrientation === Orientation.COLUMN ? 'items-end' : 'justify-end',
  [Alignment.CENTER]: 'justify-center',
};

const paddingClasses = {
  [Padding.NONE]: 'pl-0',
  [Padding.INLINE_LEFT_ONLY]: 'pl-11',
  [Padding.INLINE]: 'pl-11 pr-6',
};
```

This approach makes it easy to:

- Add new alignment or padding options
- Modify existing class mappings
- Maintain consistency across the component

## Future Enhancements

- Add more gap and padding options as needed
- Consider adding responsive variants
- Add animation support
- Create preset combinations for common use cases
- Add support for different conversation layouts
