# Breakout Agent Web Component

A modern, self-contained web component that provides AI-powered floating action buttons with theme support and optimized CSS.

## 🚀 Features

- **Self-contained web component** - No external dependencies required
- **Optimized CSS extraction** - Only includes used Tailwind classes for minimal bundle size
- **Theme support** - Light and dark themes with easy switching
- **Position control** - Configurable positioning (bottom-right, bottom-left, top-right, top-left)
- **Shadow DOM** - Completely isolated styles, no CSS pollution
- **TypeScript support** - Full type safety and IntelliSense
- **Framer Motion animations** - Smooth, performant animations

## 📦 Installation

### For Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open test page
open test-web-component.html
```

### For Production

```bash
# Build optimized web component
pnpm build

# The output will be in dist/breakout-agent.js
```

## 🎯 Usage

### Basic Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <!-- Include the web component -->
    <script src="dist/breakout-agent.js"></script>

    <!-- Use the component -->
    <breakout-agent></breakout-agent>
  </body>
</html>
```

### Advanced Usage with Controls

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <script src="dist/breakout-agent.js"></script>

    <breakout-agent id="my-agent"></breakout-agent>

    <script>
      const agent = document.getElementById('my-agent');

      // Change theme
      agent.setTheme('dark'); // or 'light'

      // Change position
      agent.setPosition('bottom-left'); // or 'bottom-right', 'top-right', 'top-left'
    </script>
  </body>
</html>
```

## 🛠️ Development

### Project Structure

```
apps/command-bar/
├── src/
│   ├── App.tsx                 # Main React component
│   ├── main.tsx               # Web component entry point (auto-generated)
│   ├── BreakoutAgentWebComponent.tsx  # Development web component
│   └── index.css              # Base styles
├── build-web-component-with-css.cjs  # Build script
├── test-web-component.html    # Test page
└── dist/                      # Build output
    └── breakout-agent.js      # Optimized web component
```

### Build Process

The build system automatically:

1. **Scans the component tree** - Extracts all Tailwind classes from `App.tsx` and its imports
2. **Generates optimized CSS** - Creates CSS only for the classes that are actually used
3. **Creates web component** - Generates a self-contained web component with embedded styles
4. **Supports themes** - Includes both light and dark theme CSS variables
5. **Minimizes bundle size** - Only includes necessary CSS, resulting in a small, fast component

### Available Scripts

```bash
# Development
pnpm dev                    # Start development server
pnpm build:dev             # Build for development (with all CSS)

# Production
pnpm build                 # Build optimized web component
pnpm build:web-component   # Alias for build

# Other
pnpm lint                  # Run ESLint
pnpm preview               # Preview production build
```

## 🎨 Theming

The web component supports both light and dark themes:

### CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:host {
  /* Light theme (default) */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 252 87% 59%;
  --primary-foreground: 210 40% 98%;
  /* ... more properties */

  /* Dark theme */
  --dark-background: 222.2 84% 4.9%;
  --dark-foreground: 210 40% 98%;
  /* ... more dark properties */
}
```

### Theme Switching

```javascript
const agent = document.querySelector('breakout-agent');

// Switch to dark theme
agent.setTheme('dark');

// Switch to light theme
agent.setTheme('light');
```

## 📍 Positioning

The component can be positioned in four different corners:

```javascript
const agent = document.querySelector('breakout-agent');

// Available positions
agent.setPosition('bottom-right'); // Default
agent.setPosition('bottom-left');
agent.setPosition('top-right');
agent.setPosition('top-left');
```

## 🔧 Customization

### Custom Colors

You can customize the theme colors by setting CSS custom properties:

```css
breakout-agent {
  --primary: 220 14% 96%; /* Custom primary color */
  --background: 0 0% 100%; /* Custom background */
}
```

### Custom Positioning

You can also position the component using CSS:

```css
breakout-agent {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
}
```

## 📊 Performance

The build system optimizes for performance:

- **Tree-shaking CSS** - Only includes used Tailwind classes
- **Minimal bundle size** - Typically under 50KB gzipped
- **Shadow DOM isolation** - No style conflicts with host page
- **Efficient animations** - Uses Framer Motion for 60fps animations

## 🧪 Testing

### Development Testing

1. Start the development server: `pnpm dev`
2. Open `test-web-component.html` in your browser
3. Test theme switching and positioning controls
4. Interact with the floating action buttons

### Production Testing

1. Build the component: `pnpm build`
2. Open `test-web-component.html` in your browser
3. Verify all functionality works as expected

## 🔍 Debugging

### Development Mode

In development mode, the component logs helpful information:

```javascript
// Check console for:
console.log('Web component mounted in development mode');
console.log('CSS injected into shadow DOM, length:', cssLength);
```

### Production Mode

The production build is optimized and includes minimal logging.

## 📝 API Reference

### Methods

| Method                  | Parameters                                                     | Description                          |
| ----------------------- | -------------------------------------------------------------- | ------------------------------------ |
| `setTheme(theme)`       | `'light' \| 'dark'`                                            | Switch between light and dark themes |
| `setPosition(position)` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | Change component position            |

### Events

The component doesn't emit custom events, but you can listen to standard DOM events:

```javascript
const agent = document.querySelector('breakout-agent');

agent.addEventListener('click', (e) => {
  console.log('Component clicked:', e);
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `pnpm dev` and `pnpm build`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
