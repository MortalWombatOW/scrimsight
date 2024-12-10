import type { Meta, StoryObj } from "@storybook/react";
import RoleCheckbox from "./RoleCheckbox";

const meta: Meta<typeof RoleCheckbox> = {
  component: RoleCheckbox,
  argTypes: {
    role: {
      control: 'select',
      options: ['tank', 'damage', 'support'],
      description: 'The Overwatch role to display',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when checkbox state changes',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RoleCheckbox>;

export const Tank: Story = {
  args: {
    role: 'tank',
    checked: false,
    onChange: () => {},
  },
};

export const Damage: Story = {
  args: {
    role: 'damage',
    checked: false,
    onChange: () => {},
  },
};

export const Support: Story = {
  args: {
    role: 'support',
    checked: false,
    onChange: () => {},
  },
};

// Show all roles together
export const AllRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <RoleCheckbox role="tank" checked={false} onChange={() => {}} />
      <RoleCheckbox role="damage" checked={true} onChange={() => {}} />
      <RoleCheckbox role="support" checked={false} onChange={() => {}} />
    </div>
  ),
};

// Show different sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ fontSize: '16px' }}>
        <RoleCheckbox role="tank" checked={false} onChange={() => {}} />
      </div>
      <div style={{ fontSize: '24px' }}>
        <RoleCheckbox role="tank" checked={true} onChange={() => {}} />
      </div>
      <div style={{ fontSize: '32px' }}>
        <RoleCheckbox role="tank" checked={false} onChange={() => {}} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'RoleControl inherits its size from the parent font-size, just like RoleIcon.',
      },
    },
  },
};
