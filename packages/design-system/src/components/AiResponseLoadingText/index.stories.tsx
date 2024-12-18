import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { SamRespondingText } from './index';

export default {
  title: 'Components/SamRespondingText',
  component: SamRespondingText,
  argTypes: {
    color: { control: 'color' },
    text: { control: 'text' },
  },
} as Meta;

const Template: StoryFn<{ color: string | null; text: string }> = (args) => <SamRespondingText {...args} />;

export const Default = Template.bind({});
Default.args = {
  color: null,
  text: 'Sam is thinking...',
};

export const CustomColor = Template.bind({});
CustomColor.args = {
  color: 'blue',
  text: 'Sam is thinking...',
};

export const CustomText = Template.bind({});
CustomText.args = {
  color: null,
  text: 'Sam has responded!',
};
