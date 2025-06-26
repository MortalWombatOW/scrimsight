import type { Meta, StoryObj } from "@storybook/react-vite";
import TeamColorDot from "./TeamColorDot";

const meta: Meta<typeof TeamColorDot> = {
  title: "Components/TeamColorDot",
  component: TeamColorDot,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    teamName: {
      control: "text",
      description: "Team name used to generate the color",
    },
    size: {
      control: { type: "number", min: 8, max: 64, step: 2 },
      description: "Size of the dot in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    teamName: "Team Alpha",
  },
};

export const Small: Story = {
  args: {
    teamName: "Team Alpha",
    size: 8,
  },
};

export const Large: Story = {
  args: {
    teamName: "Team Alpha",
    size: 32,
  },
};

export const DifferentTeams: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Team Alpha" />
        <span>Team Alpha</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Team Beta" />
        <span>Team Beta</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Team Gamma" />
        <span>Team Gamma</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Team Delta" />
        <span>Team Delta</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Fnatic" />
        <span>Fnatic</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Cloud9" />
        <span>Cloud9</span>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const SizeVariations: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Team Alpha" size={8} />
        <span>8px</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Team Alpha" size={12} />
        <span>12px (default)</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Team Alpha" size={16} />
        <span>16px</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Team Alpha" size={24} />
        <span>24px</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TeamColorDot teamName="Team Alpha" size={32} />
        <span>32px</span>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
