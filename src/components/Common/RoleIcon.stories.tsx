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
  },
};

export default meta;

type Story = StoryObj<typeof RoleIcon>;

export const Tank: Story = {
  args: {
    role: 'tank',
  },
};

export const Damage: Story = {
  args: {
    role: 'damage',
  },
};

export const Support: Story = {
  args: {
    role: 'support',
  },
};

// Show all roles together
export const AllRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RoleIcon role="tank" />
        <span>Tank</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RoleIcon role="damage" />
        <span>Damage</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RoleIcon role="support" />
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
        <RoleIcon role="tank" />
      </div>
      <div style={{ fontSize: '24px' }}>
        <RoleIcon role="tank" />
      </div>
      <div style={{ fontSize: '32px' }}>
        <RoleIcon role="tank" />
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