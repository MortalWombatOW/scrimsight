import type { Meta, StoryObj } from "@storybook/react-vite";
import HeroIcon from "@icons/HeroIcon";
import { 
  TANK_HEROES, 
  DAMAGE_HEROES, 
  SUPPORT_HEROES,
  type Hero 
} from "@library/ScrimsightDataModel";

const allHeroes: Hero[] = [
  ...TANK_HEROES,
  ...DAMAGE_HEROES, 
  ...SUPPORT_HEROES
];

const meta: Meta<typeof HeroIcon> = {
  component: HeroIcon,
  argTypes: {
    hero: {
      control: "select",
      options: allHeroes,
      description: "The hero to display",
    },
    size: {
      control: { type: "range", min: 16, max: 128, step: 8 },
      description: "Size of the hero icon in pixels",
    },
    showTooltip: {
      control: "boolean",
      description: "Whether to show a tooltip with the hero name on hover",
    },
  },
};

export default meta;

type Story = StoryObj<typeof HeroIcon>;

export const Default: Story = {
  args: {
    hero: "Tracer",
    size: 48,
    showTooltip: false,
  },
};

export const Tank: Story = {
  args: {
    hero: "Reinhardt",
    size: 48,
    showTooltip: false,
  },
};

export const Damage: Story = {
  args: {
    hero: "Genji",
    size: 48,
    showTooltip: false,
  },
};

export const Support: Story = {
  args: {
    hero: "Mercy",
    size: 48,
    showTooltip: false,
  },
};

export const WithTooltip: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <HeroIcon hero="Tracer" size={64} showTooltip={false} />
        <div style={{ marginTop: "8px", fontSize: "14px" }}>No Tooltip</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <HeroIcon hero="Tracer" size={64} showTooltip={true} />
        <div style={{ marginTop: "8px", fontSize: "14px" }}>With Tooltip</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Compare hero icons with and without tooltips. Hover over the icons to see the difference.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <HeroIcon hero="Winston" size={24} />
        <div style={{ marginTop: "4px", fontSize: "12px" }}>24px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <HeroIcon hero="Winston" size={32} />
        <div style={{ marginTop: "4px", fontSize: "12px" }}>32px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <HeroIcon hero="Winston" size={48} />
        <div style={{ marginTop: "4px", fontSize: "12px" }}>48px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <HeroIcon hero="Winston" size={64} />
        <div style={{ marginTop: "4px", fontSize: "12px" }}>64px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <HeroIcon hero="Winston" size={96} />
        <div style={{ marginTop: "4px", fontSize: "12px" }}>96px</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "HeroIcon supports various sizes from small to large.",
      },
    },
  },
};

export const AllTankHeroes: Story = {
  render: () => (
    <div>
      <h3 style={{ marginBottom: "16px", color: "#1976d2" }}>Tank Heroes</h3>
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", 
          gap: "16px",
          maxWidth: "600px",
        }}
      >
        {TANK_HEROES.map((hero) => (
          <div key={hero} style={{ textAlign: "center" }}>
            <HeroIcon hero={hero} size={48} />
            <div style={{ marginTop: "4px", fontSize: "12px", lineHeight: "1.2" }}>
              {hero}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available tank heroes.",
      },
    },
  },
};

export const AllDamageHeroes: Story = {
  render: () => (
    <div>
      <h3 style={{ marginBottom: "16px", color: "#f57c00" }}>Damage Heroes</h3>
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", 
          gap: "16px",
          maxWidth: "600px",
        }}
      >
        {DAMAGE_HEROES.map((hero) => (
          <div key={hero} style={{ textAlign: "center" }}>
            <HeroIcon hero={hero} size={48} />
            <div style={{ marginTop: "4px", fontSize: "12px", lineHeight: "1.2" }}>
              {hero}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available damage heroes.",
      },
    },
  },
};

export const AllSupportHeroes: Story = {
  render: () => (
    <div>
      <h3 style={{ marginBottom: "16px", color: "#388e3c" }}>Support Heroes</h3>
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", 
          gap: "16px",
          maxWidth: "600px",
        }}
      >
        {SUPPORT_HEROES.map((hero) => (
          <div key={hero} style={{ textAlign: "center" }}>
            <HeroIcon hero={hero} size={48} />
            <div style={{ marginTop: "4px", fontSize: "12px", lineHeight: "1.2" }}>
              {hero}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available support heroes.",
      },
    },
  },
};

export const AllHeroesByRole: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Tank Heroes */}
      <div>
        <h3 style={{ marginBottom: "16px", color: "#1976d2", display: "flex", alignItems: "center", gap: "8px" }}>
          🛡️ Tank Heroes ({TANK_HEROES.length})
        </h3>
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", 
            gap: "12px",
            maxWidth: "800px",
          }}
        >
          {TANK_HEROES.map((hero) => (
            <div key={hero} style={{ textAlign: "center" }}>
              <HeroIcon hero={hero} size={40} />
              <div style={{ marginTop: "4px", fontSize: "11px", lineHeight: "1.2" }}>
                {hero}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Damage Heroes */}
      <div>
        <h3 style={{ marginBottom: "16px", color: "#f57c00", display: "flex", alignItems: "center", gap: "8px" }}>
          ⚔️ Damage Heroes ({DAMAGE_HEROES.length})
        </h3>
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", 
            gap: "12px",
            maxWidth: "800px",
          }}
        >
          {DAMAGE_HEROES.map((hero) => (
            <div key={hero} style={{ textAlign: "center" }}>
              <HeroIcon hero={hero} size={40} />
              <div style={{ marginTop: "4px", fontSize: "11px", lineHeight: "1.2" }}>
                {hero}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Heroes */}
      <div>
        <h3 style={{ marginBottom: "16px", color: "#388e3c", display: "flex", alignItems: "center", gap: "8px" }}>
          💚 Support Heroes ({SUPPORT_HEROES.length})
        </h3>
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", 
            gap: "12px",
            maxWidth: "800px",
          }}
        >
          {SUPPORT_HEROES.map((hero) => (
            <div key={hero} style={{ textAlign: "center" }}>
              <HeroIcon hero={hero} size={40} />
              <div style={{ marginTop: "4px", fontSize: "11px", lineHeight: "1.2" }}>
                {hero}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete overview of all heroes organized by role. Total: " + allHeroes.length + " heroes.",
      },
    },
  },
};

export const LargeWithTooltip: Story = {
  args: {
    hero: "D.Va",
    size: 96,
    showTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Large hero icon with tooltip enabled. Hover to see the hero name.",
      },
    },
  },
};