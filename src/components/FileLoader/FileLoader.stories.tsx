import { Meta, StoryFn } from '@storybook/react';
import FileLoader from './FileLoader'; // Adjust the path if needed

const meta: Meta<typeof FileLoader> = {
  component: FileLoader,
};

export default meta;

const Template: StoryFn<typeof FileLoader> = (args) => <FileLoader {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSubmit: (files) => {
    console.log('Files submitted:', files);
    alert(`Files submitted. Check the console for details.`);
  },
};
