import type { Meta, StoryObj } from "@storybook/react";
import RoleIcon from "./RoleIcon";

const meta: Meta<typeof RoleIcon> = {
  component: RoleIcon,
  argTypes: {
    role: {
      control: 'select',
      options: ['tank', 'damage', 'support'],
      description: 'The role to display',
    },
    color: {
      control: 'select',
      options: ['inherit', 'primary', 'secondary', 'error', 'warning', 'info', 'success'],
      description: 'The color of the icon',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RoleIcon>;

export const Tank: Story = {
  args: {
    role: 'tank',
    color: 'primary',
  },
};

export const Damage: Story = {
  args: {
    role: 'damage',
    color: 'primary',
  },
};

export const Support: Story = {
  args: {
    role: 'support',
    color: 'primary',
  },
};

// Show all roles together
export const AllRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RoleIcon role="tank" color="primary" />
        <span>Tank</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RoleIcon role="damage" color="primary" />
        <span>Damage</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RoleIcon role="support" color="primary" />
        <span>Support</span>
      </div>
    </div>
  ),
};

// Show different sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ fontSize: '16px' }}>
        <RoleIcon role="tank" color="primary" />
      </div>
      <div style={{ fontSize: '24px' }}>
        <RoleIcon role="tank" color="primary" />
      </div>
      <div style={{ fontSize: '32px' }}>
        <RoleIcon role="tank" color="primary" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'RoleIcon inherits its size from the parent font-size.',
      },
    },
  },
};

// Show different colors
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <RoleIcon role="tank" color="inherit" />
      <RoleIcon role="tank" color="primary" />
      <RoleIcon role="tank" color="secondary" />
      <RoleIcon role="tank" color="error" />
      <RoleIcon role="tank" color="warning" />
      <RoleIcon role="tank" color="info" />
      <RoleIcon role="tank" color="success" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'RoleIcon supports all MUI color variants.',
      },
    },
  },
}; 