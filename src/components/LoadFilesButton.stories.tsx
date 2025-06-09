import { LoadFilesButton } from "./LoadFilesButton";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LoadFilesButton> = {
  component: LoadFilesButton,
  parameters: {
    docs: {
      description: {
        component: "Button for loading log files using the File System Access API. Note: This requires a browser that supports the File System Access API and user interaction.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LoadFilesButton>;

export const Default: Story = {
  args: {},
};

export const WithDescription: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "The LoadFilesButton component allows users to select a directory and load all text files from it. This requires user interaction and a compatible browser.",
      },
    },
  },
};

// Note: Since this component relies on browser APIs and user interaction,
// the stories serve more as documentation than interactive examples