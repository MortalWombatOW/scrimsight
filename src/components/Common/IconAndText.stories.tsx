import IconAndTextButton from "./IconAndText";
import type { Meta, StoryObj } from "@storybook/react";
import HealingIcon from "~/components/Icons/HealingIcon";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

const meta: Meta<typeof IconAndTextButton> = {
  component: IconAndTextButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
    },
    colorKey: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
    },
    dynamic: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconAndTextButton>;

export const Default: Story = {
  args: {
    icon: <HealingIcon size={24} fill="black" />,
    text: 'Healing',
    dynamic: false,
    variant: "contained",
    padding: "12px",
    borderRadius: "10px",
    colorKey: "primary"
  },
};

export const DynamicHover: Story = {
  args: {
    icon: <InfoIcon />,
    text: 'Hover for more info',
    dynamic: true,
    variant: "contained",
    colorKey: "info",
    padding: "8px",
  },
};

export const OutlinedButton: Story = {
  args: {
    icon: <DeleteIcon />,
    text: 'Delete Item',
    dynamic: false,
    variant: "outlined",
    colorKey: "error",
    padding: "10px",
  },
};

export const TextButton: Story = {
  args: {
    icon: <WarningIcon />,
    text: 'Warning',
    dynamic: false,
    variant: "text",
    colorKey: "warning",
    padding: "6px",
  },
};

export const CompactButton: Story = {
  args: {
    icon: <HealingIcon size={16} fill="black" />,
    text: 'Quick Action',
    dynamic: false,
    variant: "contained",
    padding: "4px 8px",
    borderRadius: "4px",
    colorKey: "secondary",
  },
};

export const SuccessButton: Story = {
  args: {
    icon: <InfoIcon />,
    text: 'Operation Complete',
    dynamic: false,
    variant: "contained",
    colorKey: "success",
    padding: "12px",
    borderRadius: "8px",
  },
};
