import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import { withActions } from '@storybook/addon-actions/decorator';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    actions: {
      handles: ['mouseover', 'click'],
    },
  },
  decorators: [withActions],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    label: {
      table: {
        disable: true,
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'regular'],
    },
    buttonStyle: {
      control: { type: 'select' },
      options: ['default', 'icon'],
    },
    variant: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'tertiary',
        'destructive',
        'destructive_secondary',
        'destructive_tertiary',
        'system',
        'system_secondary',
        'system_tertiary',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

// Primary Button Stories
export const PrimarySmall: Story = {
  args: {
    children: 'Primary Small Button',
    variant: 'primary',
    size: 'small',
  },
};

export const PrimaryMedium: Story = {
  args: {
    children: 'Primary Medium',
    size: 'medium',
    variant: 'primary',
  },
};

export const PrimaryRegular: Story = {
  args: {
    children: 'Primary Regular',
    size: 'regular',
    variant: 'primary',
  },
};

export const PrimaryIcon: Story = {
  args: {
    children: 'P',
    size: 'small',
    buttonStyle: 'icon',
    variant: 'primary',
  },
};

// Secondary Button Stories
export const SecondarySmall: Story = {
  args: {
    children: 'Secondary Small',
    size: 'small',
    variant: 'secondary',
  },
};

export const SecondaryMedium: Story = {
  args: {
    children: 'Secondary Medium',
    size: 'medium',
    variant: 'secondary',
  },
};

export const SecondaryRegular: Story = {
  args: {
    children: 'Secondary Regular',
    size: 'regular',
    variant: 'secondary',
  },
};

export const SecondaryIcon: Story = {
  args: {
    children: 'S',
    size: 'small',
    buttonStyle: 'icon',
    variant: 'secondary',
  },
};

// Tertiary Button Stories
export const TertiarySmall: Story = {
  args: {
    children: 'Tertiary Small',
    size: 'small',
    variant: 'tertiary',
  },
};

export const TertiaryMedium: Story = {
  args: {
    children: 'Tertiary Medium',
    size: 'medium',
    variant: 'tertiary',
  },
};

export const TertiaryRegular: Story = {
  args: {
    children: 'Tertiary Regular',
    size: 'regular',
    variant: 'tertiary',
  },
};

// Destructive Button Stories
export const DestructiveSmall: Story = {
  args: {
    children: 'Destructive Small',
    size: 'small',
    variant: 'destructive',
  },
};

export const DestructiveSecondarySmall: Story = {
  args: {
    children: 'Destructive Secondary Small',
    size: 'small',
    variant: 'destructive_secondary',
  },
};

export const DestructiveTertiarySmall: Story = {
  args: {
    children: 'Destructive Tertiary Small',
    size: 'small',
    variant: 'destructive_tertiary',
  },
};

// System Button Stories
export const SystemSmall: Story = {
  args: {
    children: 'System Small',
    size: 'small',
    variant: 'system',
  },
};

export const SystemSecondarySmall: Story = {
  args: {
    children: 'System Secondary Small',
    size: 'small',
    variant: 'system_secondary',
  },
};

export const SystemTertiarySmall: Story = {
  args: {
    children: 'System Tertiary Small',
    size: 'small',
    variant: 'system_tertiary',
  },
};
