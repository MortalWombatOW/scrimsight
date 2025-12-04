import { renderHook } from '@testing-library/react';
import { useFightAnalysis } from './useFightAnalysis';
import { Teamfight } from '../types/domain';

describe('useFightAnalysis', () => {
  const mockTeamfights: Teamfight[] = [
    {
      startTime: 100,
      endTime: 120,
      type: 'standard',
      winner: 'Team A',
      team1Kills: 5,
      team2Kills: 0,
      team1UltsUsed: ['Pulse Bomb'],
      team2UltsUsed: [],
      firstPick: {
        time: 105,
        team: 'Team A',
        player: 'Player A1',
        victim: 'Player B1',
      },
      events: [
        { type: 'ult_start', playerName: 'Player A1', playerTeam: 'Team A' } as any,
      ],
    },
    {
      startTime: 200,
      endTime: 220,
      type: 'standard',
      winner: 'Team B',
      team1Kills: 0,
      team2Kills: 5,
      team1UltsUsed: [],
      team2UltsUsed: ['Dragonblade'],
      firstPick: {
        time: 205,
        team: 'Team B',
        player: 'Player B1',
        victim: 'Player A1',
      },
      events: [
         { type: 'ult_start', playerName: 'Player B1', playerTeam: 'Team B' } as any,
      ],
    },
    {
      startTime: 300,
      endTime: 320,
      type: 'dry',
      winner: 'Team A',
      team1Kills: 3,
      team2Kills: 0,
      team1UltsUsed: [],
      team2UltsUsed: [],
      firstPick: null,
      events: [],
    },
  ];

  describe('getTeamWinConditions', () => {
    it('should calculate win rates with first pick', () => {
      const { result } = renderHook(() => useFightAnalysis(mockTeamfights));
      const stats = result.current.getTeamWinConditions('Team A');

      // Team A got first pick in fight 1 and won.
      // Team A did NOT get first pick in fight 2 (Team B did).
      // Fight 3 was dry, no first pick.
      
      expect(stats.totalFightsWithFirstPick).toBe(1);
      expect(stats.winRateWithFirstPick).toBe(100); // 1/1
    });

    it('should calculate win rates against first pick', () => {
      const { result } = renderHook(() => useFightAnalysis(mockTeamfights));
      const stats = result.current.getTeamWinConditions('Team A');

      // Team B got first pick in fight 2. Team A lost.
      expect(stats.totalFightsAgainstFirstPick).toBe(1);
      expect(stats.winRateAgainstFirstPick).toBe(0); // 0/1
    });

    it('should calculate dry fight win rate', () => {
      const { result } = renderHook(() => useFightAnalysis(mockTeamfights));
      const stats = result.current.getTeamWinConditions('Team A');

      // Fight 3 was dry and Team A won.
      expect(stats.totalDryFights).toBe(1);
      expect(stats.dryFightWinRate).toBe(100);
    });
  });

  describe('getPlayerImpact', () => {
    it('should calculate entry pick rate', () => {
      const { result } = renderHook(() => useFightAnalysis(mockTeamfights));
      const stats = result.current.getPlayerImpact('Player A1');

      // Player A1 got 1 first pick in 3 fights.
      expect(stats.totalFirstPicks).toBe(1);
      expect(stats.entryPickRate).toBeCloseTo(33.33);
    });

    it('should calculate first death rate', () => {
      const { result } = renderHook(() => useFightAnalysis(mockTeamfights));
      const stats = result.current.getPlayerImpact('Player A1');

      // Player A1 died first in fight 2.
      expect(stats.totalFirstDeaths).toBe(1);
      expect(stats.firstDeathRate).toBeCloseTo(33.33);
    });

    it('should calculate ult win rate', () => {
      const { result } = renderHook(() => useFightAnalysis(mockTeamfights));
      const stats = result.current.getPlayerImpact('Player A1');

      // Player A1 used ult in fight 1 and won.
      expect(stats.totalUltsUsed).toBe(1);
      expect(stats.totalUltsWon).toBe(1);
      expect(stats.ultWinRate).toBe(100);
    });
  });
});
