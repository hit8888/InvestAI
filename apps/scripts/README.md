### Supported Attributes

| Attribute                | Type    | Default    | Description                                        |
| ------------------------ | ------- | ---------- | -------------------------------------------------- |
| `tenant-id`              | string  | _Required_ | Your unique tenant identifier                      |
| `agent-id`               | string  | "1"        | The ID of the chat agent to use                    |
| `container-id`           | string  | null       | ID of a container element to embed the chat widget |
| `hide-bottom-bar`        | boolean | false      | Controls bottom bar visibility                     |
| `show-bottom-bar`        | boolean | false      | Forces bottom bar to show even in embedded mode    |
| `max-height`             | string  | "88vh"     | Maximum height of the widget                       |
| `allow-external-buttons` | boolean | false      | Enables external button triggers                   |
| `is-collapsible`         | boolean | true       | Controls collapsible behavior                      |

## Integration Methods

### 1. Bottom Bar Widget

The default mode where the chat appears as a floating window on your website.

### 2. Embedded Widget

Embed the chat directly into a specific container on your page.

### 3. Form Integration

You can trigger the chat widget from any form on your website:

Add the `data-breakout-form` attribute to any form to enable chat integration. When the form is submitted:

- The chat widget will open in an overlay
- The form input will be sent as a message to the chat
- The overlay can be closed by clicking outside the chat window

### External Button Integration

Enable external buttons to trigger the chat:

1. Enable external buttons in the widget:

2. Add buttons to your page:
