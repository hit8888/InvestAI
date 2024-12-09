import { Meta } from '@storybook/react';
import Orb, { OrbStatusEnum } from './index';

export default {
  title: 'Components/Orb',
  component: Orb,
  argTypes: {
    color: { control: 'color' },
  },
} as Meta;

const Template = (args) => (
  <div className="flex items-center justify-center">
    <Orb {...args} />
  </div>
);

export const TakingInput = Template.bind({});
TakingInput.args = {
  color: '#acb2eb',
  state: OrbStatusEnum.takingInput,
};

export const Thinking = Template.bind({});
Thinking.args = {
  color: '#acb2eb',
  state: OrbStatusEnum.thinking,
};

export const Responding = Template.bind({});
Responding.args = {
  color: '#acb2eb',
  state: OrbStatusEnum.responding,
};

export const Waiting = Template.bind({});
Waiting.args = {
  color: '#acb2eb',
  state: OrbStatusEnum.waiting,
};
