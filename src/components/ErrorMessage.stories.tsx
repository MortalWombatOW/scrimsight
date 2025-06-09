import { ErrorMessage } from "./ErrorMessage";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ErrorMessage> = {
  component: ErrorMessage,
  argTypes: {
    message: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
  args: {
    message: "An error occurred while loading the data.",
  },
};

export const ValidationError: Story = {
  args: {
    message: "Please check your input and try again.",
  },
};

export const NetworkError: Story = {
  args: {
    message: "Failed to connect to the server. Please check your internet connection.",
  },
};

export const PermissionError: Story = {
  args: {
    message: "You do not have permission to access this resource.",
  },
};

export const LongMessage: Story = {
  args: {
    message: "This is a very long error message that might wrap to multiple lines and should still be displayed properly within the alert component layout.",
  },
};

export const FileError: Story = {
  args: {
    message: "The selected file format is not supported. Please choose a .txt log file.",
  },
};