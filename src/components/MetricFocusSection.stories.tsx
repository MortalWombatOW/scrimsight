import type { Meta, StoryObj } from '@storybook/react';
import MetricFocusSection from './MetricFocusSection';
import { METRIC_FOCUS } from '../lib/ScrimsightDataModel';

const meta: Meta<typeof MetricFocusSection> = {
  title: 'Components/MetricFocusSection',
  component: MetricFocusSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlayerStats = {
  playtime: 1800,
  eliminations: 32,
  finalBlows: 18,
  deaths: 12,
  allDamageDealt: 15420,
  barrierDamageDealt: 3200,
  heroDamageDealt: 12220,
  healingDealt: 8500,
  healingReceived: 4200,
  selfHealing: 1800,
  damageTaken: 8900,
  damageBlocked: 5600,
  defensiveAssists: 8,
  offensiveAssists: 14,
  ultimatesEarned: 6,
  ultimatesUsed: 5,
  multikills: 3,
  soloKills: 4,
  objectiveKills: 8,
  environmentalKills: 1,
  environmentalDeaths: 0,
  criticalHits: 45,
  shotsFired: 180,
  shotsHit: 126,
  shotsMissed: 54,
  scopedShotsFired: 42,
  scopedShotsHit: 31,
  eliminationsPer10Minutes: 10.7,
  finalBlowsPer10Minutes: 6.0,
  deathsPer10Minutes: 4.0,
  allDamageDealtPer10Minutes: 5140,
  barrierDamageDealtPer10Minutes: 1067,
  heroDamageDealtPer10Minutes: 4073,
  healingDealtPer10Minutes: 2833,
  healingReceivedPer10Minutes: 1400,
  selfHealingPer10Minutes: 600,
  damageTakenPer10Minutes: 2967,
  damageBlockedPer10Minutes: 1867,
  defensiveAssistsPer10Minutes: 2.7,
  offensiveAssistsPer10Minutes: 4.7,
  ultimatesEarnedPer10Minutes: 2.0,
  ultimatesUsedPer10Minutes: 1.7,
  multikillsPer10Minutes: 1.0,
  soloKillsPer10Minutes: 1.3,
  objectiveKillsPer10Minutes: 2.7,
  environmentalKillsPer10Minutes: 0.3,
  environmentalDeathsPer10Minutes: 0.0,
  criticalHitsPer10Minutes: 15.0,
  shotsFiredPer10Minutes: 60.0,
  shotsHitPer10Minutes: 42.0,
  shotsMissedPer10Minutes: 18.0,
  scopedShotsFiredPer10Minutes: 14.0,
  scopedShotsHitPer10Minutes: 10.3,
  weaponAccuracy: 0.7,
  scopedWeaponAccuracy: 0.74,
  criticalHitRate: 0.36,
  ultsUsed: 5,
  ultKills: 12,
  killsPerUltimate: 2.4,
  teamfightsParticipated: 18,
  teamfightsWithFirstKill: 6,
  teamfightsWithFirstDeath: 3,
  firstKillRate: 0.33,
  firstDeathRate: 0.17,
  teamfightsWon: 12,
  teamfightsWonWithUlt: 4,
  teamfightsWonWithoutUlt: 8,
  teamfightWinRate: 0.67,
  teamfightWinRateWithUlt: 0.8,
  teamfightWinRateWithoutUlt: 0.62,
  teamfightsWonWithFirstKill: 5,
  teamfightsWonWithFirstDeath: 1,
  teamfightWinRateWithFirstKill: 0.83,
  teamfightWinRateWithFirstDeath: 0.33,
  ultimateChargeTime: 45.2,
  ultimateHoldTime: 8.5,
  ultimateUseTime: 6.8,
  deathsWithUltAvailable: 2,
  tankKills: 4,
  damageKills: 8,
  supportKills: 6,
  tankFocusRate: 0.22,
  damageFocusRate: 0.44,
  supportFocusRate: 0.33,
  averageLifeDuration: 82.5,
  totalAssists: 22,
  totalAssistsPer10Minutes: 7.3,
  damagePerKill: 481.25,
  damageDonePerHealingReceived: 3.67,
};

export const OffensiveImpact: Story = {
  args: {
    metricFocus: METRIC_FOCUS[0], // Offensive Impact
    playerStats: mockPlayerStats,
  },
};

export const Survivability: Story = {
  args: {
    metricFocus: METRIC_FOCUS[1], // Survivability
    playerStats: mockPlayerStats,
  },
};

export const Utility: Story = {
  args: {
    metricFocus: METRIC_FOCUS[2], // Utility
    playerStats: mockPlayerStats,
  },
};

export const Efficiency: Story = {
  args: {
    metricFocus: METRIC_FOCUS[3], // Efficiency
    playerStats: mockPlayerStats,
  },
};

export const AllFocusAreas: Story = {
  render: () => (
    <div className="space-y-8">
      {METRIC_FOCUS.map((focus) => (
        <MetricFocusSection
          key={focus.focus}
          metricFocus={focus}
          playerStats={mockPlayerStats}
        />
      ))}
    </div>
  ),
};

export const CompactLayout: Story = {
  args: {
    metricFocus: METRIC_FOCUS[0],
    playerStats: mockPlayerStats,
    className: "max-w-4xl",
  },
};