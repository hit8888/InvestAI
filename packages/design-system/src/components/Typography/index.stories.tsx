import { Meta, StoryObj } from '@storybook/react';
import Typography from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Design System/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'title-24',
        'title-18',
        'body-16',
        'body-14',
        'label-16-medium',
        'label-16-semibold',
        'label-14-medium',
        'label-14-medium-italic',
        'label-14-semibold',
        'caption-12-normal',
        'caption-12-medium',
        'caption-12-semibold',
        'caption-10-normal',
        'caption-10-medium',
      ],
    },
    textColor: {
      control: 'select',
      options: [
        'default',
        'primary',
        'gray400',
        'gray500',
        'white',
        'error',
        'error600',
        'textPrimary',
        'textSecondary',
      ],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify', 'inherit'],
    },
    noWrap: {
      control: 'boolean',
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

// Title Variants
export const Title24: Story = {
  args: {
    variant: 'title-24',
    children: 'Title 24px - Semibold',
  },
};

export const Title18: Story = {
  args: {
    variant: 'title-18',
    children: 'Title 18px - Semibold',
  },
};

// Body Variants
export const Body16: Story = {
  args: {
    variant: 'body-16',
    children: 'Body 16px - Regular',
  },
};

export const Body14: Story = {
  args: {
    variant: 'body-14',
    children: 'Body 14px - Regular',
  },
};

// Label Variants
export const Label16Medium: Story = {
  args: {
    variant: 'label-16-medium',
    children: 'Label 16px - Medium',
  },
};

export const Label16Semibold: Story = {
  args: {
    variant: 'label-16-semibold',
    children: 'Label 16px - Semibold',
  },
};

export const Label14Medium: Story = {
  args: {
    variant: 'label-14-medium',
    children: 'Label 14px - Medium',
  },
};

export const Label14MediumItalic: Story = {
  args: {
    variant: 'label-14-medium-italic',
    children: 'Label 14px - Medium Italic',
  },
};

export const Label14Semibold: Story = {
  args: {
    variant: 'label-14-semibold',
    children: 'Label 14px - Semibold',
  },
};

// Caption Variants
export const Caption12Normal: Story = {
  args: {
    variant: 'caption-12-normal',
    children: 'Caption 12px - Normal',
  },
};

export const Caption12Medium: Story = {
  args: {
    variant: 'caption-12-medium',
    children: 'Caption 12px - Medium',
  },
};

export const Caption12Semibold: Story = {
  args: {
    variant: 'caption-12-semibold',
    children: 'Caption 12px - Semibold',
  },
};

export const Caption10Normal: Story = {
  args: {
    variant: 'caption-10-normal',
    children: 'Caption 10px - Normal',
  },
};

export const Caption10Medium: Story = {
  args: {
    variant: 'caption-10-medium',
    children: 'Caption 10px - Medium',
  },
};

// Color Examples
export const PrimaryColor: Story = {
  args: {
    variant: 'body-16',
    textColor: 'primary',
    children: 'Primary Color Text',
  },
};

export const ErrorColor: Story = {
  args: {
    variant: 'body-16',
    textColor: 'error',
    children: 'Error Color Text',
  },
};

// Alignment Examples
export const CenterAligned: Story = {
  args: {
    variant: 'body-16',
    align: 'center',
    children: 'Center Aligned Text',
  },
};

export const RightAligned: Story = {
  args: {
    variant: 'body-16',
    align: 'right',
    children: 'Right Aligned Text',
  },
};

// No Wrap Example
export const NoWrap: Story = {
  args: {
    variant: 'body-16',
    noWrap: true,
    children: 'This text will not wrap and will truncate with ellipsis if it overflows its container',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
};
