import { Meta } from '@storybook/react';
import AudioOrb from './index';

export default {
  title: 'Components/AudioOrb',
  component: AudioOrb,
  argTypes: {
    color: { control: 'color' },
  },
} as Meta;

const Template = (args) => (
  <div className="flex items-center justify-center">
    <AudioOrb {...args} />
  </div>
);

export const OrbArgs = Template.bind({});
OrbArgs.args = {
  color: '#acb2eb',
  waveSize: 8,
  width: 56,
  height: 56,
};
