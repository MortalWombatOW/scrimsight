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

const mockPlayerStatRanks = {
  playtime: 8,
  eliminations: 2,
  finalBlows: 3,
  deaths: 1,
  allDamageDealt: 4,
  barrierDamageDealt: 5,
  heroDamageDealt: 3,
  healingDealt: 2,
  healingReceived: 6,
  selfHealing: 4,
  damageTaken: 3,
  damageBlocked: 2,
  defensiveAssists: 4,
  offensiveAssists: 2,
  ultimatesEarned: 3,
  ultimatesUsed: 3,
  multikills: 1,
  soloKills: 2,
  objectiveKills: 3,
  environmentalKills: 2,
  environmentalDeaths: 1,
  criticalHits: 1,
  shotsFired: 5,
  shotsHit: 2,
  shotsMissed: 8,
  scopedShotsFired: 4,
  scopedShotsHit: 3,
  eliminationsPer10Minutes: 2,
  finalBlowsPer10Minutes: 3,
  deathsPer10Minutes: 1,
  allDamageDealtPer10Minutes: 4,
  barrierDamageDealtPer10Minutes: 5,
  heroDamageDealtPer10Minutes: 3,
  healingDealtPer10Minutes: 2,
  healingReceivedPer10Minutes: 6,
  selfHealingPer10Minutes: 4,
  damageTakenPer10Minutes: 2,
  damageBlockedPer10Minutes: 2,
  defensiveAssistsPer10Minutes: 4,
  offensiveAssistsPer10Minutes: 2,
  ultimatesEarnedPer10Minutes: 3,
  ultimatesUsedPer10Minutes: 3,
  multikillsPer10Minutes: 1,
  soloKillsPer10Minutes: 2,
  objectiveKillsPer10Minutes: 3,
  environmentalKillsPer10Minutes: 2,
  environmentalDeathsPer10Minutes: 1,
  criticalHitsPer10Minutes: 1,
  shotsFiredPer10Minutes: 5,
  shotsHitPer10Minutes: 2,
  shotsMissedPer10Minutes: 8,
  scopedShotsFiredPer10Minutes: 4,
  scopedShotsHitPer10Minutes: 3,
  weaponAccuracy: 2,
  scopedWeaponAccuracy: 1,
  criticalHitRate: 1,
  ultsUsed: 3,
  ultKills: 2,
  killsPerUltimate: 1,
  teamfightsParticipated: 6,
  teamfightsWithFirstKill: 3,
  teamfightsWithFirstDeath: 2,
  firstKillRate: 3,
  firstDeathRate: 1,
  teamfightsWon: 4,
  teamfightsWonWithUlt: 2,
  teamfightsWonWithoutUlt: 5,
  teamfightWinRate: 2,
  teamfightWinRateWithUlt: 1,
  teamfightWinRateWithoutUlt: 3,
  teamfightsWonWithFirstKill: 2,
  teamfightsWonWithFirstDeath: 3,
  teamfightWinRateWithFirstKill: 1,
  teamfightWinRateWithFirstDeath: 2,
  ultimateChargeTime: 4,
  ultimateHoldTime: 6,
  ultimateUseTime: 3,
  deathsWithUltAvailable: 1,
  tankKills: 3,
  damageKills: 2,
  supportKills: 4,
  tankFocusRate: 5,
  damageFocusRate: 2,
  supportFocusRate: 4,
  averageLifeDuration: 1,
  totalAssists: 3,
  totalAssistsPer10Minutes: 3,
  damagePerKill: 6,
  damageDonePerHealingReceived: 2,
};

const mockPlayerAverageStats = {
  playtime: 1620,
  eliminations: 24,
  finalBlows: 14,
  deaths: 10,
  allDamageDealt: 12850,
  barrierDamageDealt: 2800,
  heroDamageDealt: 10050,
  healingDealt: 6200,
  healingReceived: 3800,
  selfHealing: 1400,
  damageTaken: 7500,
  damageBlocked: 4200,
  defensiveAssists: 6,
  offensiveAssists: 11,
  ultimatesEarned: 5,
  ultimatesUsed: 4,
  multikills: 2,
  soloKills: 3,
  objectiveKills: 6,
  environmentalKills: 0.8,
  environmentalDeaths: 0.2,
  criticalHits: 35,
  shotsFired: 150,
  shotsHit: 102,
  shotsMissed: 48,
  scopedShotsFired: 35,
  scopedShotsHit: 25,
  eliminationsPer10Minutes: 8.9,
  finalBlowsPer10Minutes: 5.2,
  deathsPer10Minutes: 3.7,
  allDamageDealtPer10Minutes: 4750,
  barrierDamageDealtPer10Minutes: 1040,
  heroDamageDealtPer10Minutes: 3710,
  healingDealtPer10Minutes: 2290,
  healingReceivedPer10Minutes: 1400,
  selfHealingPer10Minutes: 520,
  damageTakenPer10Minutes: 2770,
  damageBlockedPer10Minutes: 1550,
  defensiveAssistsPer10Minutes: 2.2,
  offensiveAssistsPer10Minutes: 4.1,
  ultimatesEarnedPer10Minutes: 1.8,
  ultimatesUsedPer10Minutes: 1.5,
  multikillsPer10Minutes: 0.7,
  soloKillsPer10Minutes: 1.1,
  objectiveKillsPer10Minutes: 2.2,
  environmentalKillsPer10Minutes: 0.3,
  environmentalDeathsPer10Minutes: 0.1,
  criticalHitsPer10Minutes: 13.0,
  shotsFiredPer10Minutes: 55.5,
  shotsHitPer10Minutes: 37.7,
  shotsMissedPer10Minutes: 17.8,
  scopedShotsFiredPer10Minutes: 13.0,
  scopedShotsHitPer10Minutes: 9.2,
  weaponAccuracy: 0.68,
  scopedWeaponAccuracy: 0.71,
  criticalHitRate: 0.34,
  ultsUsed: 4,
  ultKills: 9,
  killsPerUltimate: 2.1,
  teamfightsParticipated: 15,
  teamfightsWithFirstKill: 4,
  teamfightsWithFirstDeath: 4,
  firstKillRate: 0.27,
  firstDeathRate: 0.27,
  teamfightsWon: 9,
  teamfightsWonWithUlt: 3,
  teamfightsWonWithoutUlt: 6,
  teamfightWinRate: 0.60,
  teamfightWinRateWithUlt: 0.75,
  teamfightWinRateWithoutUlt: 0.55,
  teamfightsWonWithFirstKill: 3,
  teamfightsWonWithFirstDeath: 1,
  teamfightWinRateWithFirstKill: 0.75,
  teamfightWinRateWithFirstDeath: 0.25,
  ultimateChargeTime: 48.5,
  ultimateHoldTime: 12.2,
  ultimateUseTime: 5.8,
  deathsWithUltAvailable: 3,
  tankKills: 3,
  damageKills: 6,
  supportKills: 5,
  tankFocusRate: 0.21,
  damageFocusRate: 0.42,
  supportFocusRate: 0.36,
  averageLifeDuration: 75.2,
  totalAssists: 17,
  totalAssistsPer10Minutes: 6.3,
  damagePerKill: 535.4,
  damageDonePerHealingReceived: 3.3,
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

export const OffensiveImpactWithRanks: Story = {
  args: {
    metricFocus: METRIC_FOCUS[0], // Offensive Impact
    playerStats: mockPlayerStats,
    playerStatRanks: mockPlayerStatRanks,
    playerAverageStats: mockPlayerAverageStats,
    totalCount: 8,
  },
};

export const SurvivabilityWithRanks: Story = {
  args: {
    metricFocus: METRIC_FOCUS[1], // Survivability
    playerStats: mockPlayerStats,
    playerStatRanks: mockPlayerStatRanks,
    playerAverageStats: mockPlayerAverageStats,
    totalCount: 8,
  },
};

export const UtilityWithRanks: Story = {
  args: {
    metricFocus: METRIC_FOCUS[2], // Utility
    playerStats: mockPlayerStats,
    playerStatRanks: mockPlayerStatRanks,
    playerAverageStats: mockPlayerAverageStats,
    totalCount: 8,
  },
};

export const EfficiencyWithRanks: Story = {
  args: {
    metricFocus: METRIC_FOCUS[3], // Efficiency
    playerStats: mockPlayerStats,
    playerStatRanks: mockPlayerStatRanks,
    playerAverageStats: mockPlayerAverageStats,
    totalCount: 8,
  },
};

export const AllFocusAreasWithRanks: Story = {
  render: () => (
    <div className="space-y-8">
      {METRIC_FOCUS.map((focus) => (
        <MetricFocusSection
          key={focus.focus}
          metricFocus={focus}
          playerStats={mockPlayerStats}
          playerStatRanks={mockPlayerStatRanks}
          playerAverageStats={mockPlayerAverageStats}
          totalCount={8}
        />
      ))}
    </div>
  ),
};