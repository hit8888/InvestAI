import type { Meta, StoryObj } from '@storybook/react';
import { CalendarDays, MessageCircle, Phone, FileText, Users } from 'lucide-react';
import AIBlockCard from './AIBlockCard';

const meta: Meta<typeof AIBlockCard> = {
  title: 'Design System/AIBlockCard',
  component: AIBlockCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable card component for displaying AI blocks with icons, titles, descriptions, and status badges.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['displayed', 'hidden', 'draft'],
    },
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <CalendarDays className="h-6 w-6 text-blue-600" />,
    title: 'Book a Meeting',
    description: 'Let visitors schedule time with your team.',
    status: 'displayed',
  },
};

export const Hidden: Story = {
  args: {
    icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
    title: 'Live Chat Support',
    description: 'Provide instant support to your website visitors.',
    status: 'hidden',
  },
};

export const Draft: Story = {
  args: {
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    title: 'Newsletter Signup',
    description: 'Build your email list with newsletter subscriptions.',
    status: 'draft',
  },
};

export const Disabled: Story = {
  args: {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: 'Meet the Team',
    description: 'Introduce your team members to build trust.',
    status: 'displayed',
    disabled: true,
  },
};

export const Clickable: Story = {
  args: {
    icon: <Phone className="h-6 w-6 text-blue-600" />,
    title: 'Contact Form',
    description: 'Collect visitor information and inquiries.',
    status: 'displayed',
    onClick: () => alert('Block clicked!'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AIBlockCard
        icon={<CalendarDays className="h-6 w-6 text-blue-600" />}
        title="Book a Meeting"
        description="Let visitors schedule time with your team."
        status="displayed"
      />
      <AIBlockCard
        icon={<MessageCircle className="h-6 w-6 text-blue-600" />}
        title="Live Chat Support"
        description="Provide instant support to your website visitors."
        status="hidden"
      />
      <AIBlockCard
        icon={<FileText className="h-6 w-6 text-blue-600" />}
        title="Newsletter Signup"
        description="Build your email list with newsletter subscriptions."
        status="draft"
      />
      <AIBlockCard
        icon={<Users className="h-6 w-6 text-blue-600" />}
        title="Meet the Team"
        description="Introduce your team members to build trust."
        status="displayed"
        disabled
      />
      <AIBlockCard
        icon={<Phone className="h-6 w-6 text-blue-600" />}
        title="Contact Form"
        description="Collect visitor information and inquiries."
        status="displayed"
        onClick={() => alert('Contact form clicked!')}
      />
    </div>
  ),
};
