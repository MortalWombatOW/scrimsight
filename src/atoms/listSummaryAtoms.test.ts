import { describe, it, expect, vi } from 'vitest';
import { listSummaryAtomsFn } from '@atoms/listSummaryAtoms';
import type { 
  ScrimListSummary,
  Scrim,
  TeamStats,
  FirstKillImpactStats
} from '@atoms';
import { scrims, teamStats, firstKillImpact } from '@atoms';
import { Getter } from 'jotai';

describe('listSummaryAtomsFn', () => {
  const listSummaryAtoms = listSummaryAtomsFn();

  describe('scrimListSummaryFn', () => {
    it('should convert scrims to scrim list summaries', async () => {
      const mockScrims: Scrim[] = [
        {
          dateString: '2023-08-28',
          team1Name: 'Team Alpha',
          team2Name: 'Team Beta',
          team1Players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6'],
          team2Players: ['Player7', 'Player8', 'Player9', 'Player10', 'Player11', 'Player12'],
          team1Wins: 3,
          team2Wins: 2,
          draws: 1,
          duration: 3600,
          matchIds: ['match1', 'match2', 'match3', 'match4', 'match5', 'match6']
        },
        {
          dateString: '2023-08-27',
          team1Name: 'Team Gamma',
          team2Name: 'Team Delta',
          team1Players: ['Player13', 'Player14', 'Player15', 'Player16', 'Player17', 'Player18'],
          team2Players: ['Player19', 'Player20', 'Player21', 'Player22', 'Player23', 'Player24'],
          team1Wins: 1,
          team2Wins: 3,
          draws: 0,
          duration: 2400,
          matchIds: ['match7', 'match8', 'match9', 'match10']
        }
      ];

      const mockGet = vi.fn();
      mockGet.mockImplementation(async (atom) => {
        if (atom === scrims.atom) return mockScrims;
        return [];
      });

      const result = await listSummaryAtoms.scrimListSummaryFn(mockGet as Getter);

      expect(result).toHaveLength(2);
      
      expect(result[0]).toEqual({
        scrimId: '2023-08-28-Team Alpha-vs-Team Beta',
        teamNames: ['Team Alpha', 'Team Beta'],
        dateString: '2023-08-28',
        mapCount: 6,
        score: '3-2-1',
        duration: 3600
      });

      expect(result[1]).toEqual({
        scrimId: '2023-08-27-Team Gamma-vs-Team Delta',
        teamNames: ['Team Gamma', 'Team Delta'],
        dateString: '2023-08-27',
        mapCount: 4,
        score: '1-3-0',
        duration: 2400
      });
    });

    it('should handle empty scrims array', async () => {
      const mockGet = vi.fn();
      mockGet.mockImplementation(async () => []);

      const result = await listSummaryAtoms.scrimListSummaryFn(mockGet as Getter);
      expect(result).toEqual([]);
    });
  });

  describe('teamListSummaryFn', () => {
    it('should convert team stats to team list summaries', async () => {
      const mockTeamStats: TeamStats[] = [
        {
          teamName: 'Team Alpha',
          players: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6'],
          wins: 15,
          losses: 5,
          draws: 0,
          gamesPlayed: 20,
          mostRecentGameDate: new Date('2023-08-28')
        },
        {
          teamName: 'Team Beta',
          players: ['Player7', 'Player8'],
          wins: 8,
          losses: 12,
          draws: 0,
          gamesPlayed: 20,
          mostRecentGameDate: new Date('2023-08-27')
        }
      ];

      const mockFirstKillImpact: FirstKillImpactStats = {
        totalFights: 80,
        overallWinRate: 0.6,
        firstKillWinRate: 0.65,
        firstDeathLossRate: 0.7,
        teamStats: {
          'Team Alpha': {
            teamName: 'Team Alpha',
            totalFights: 40,
            fightsWon: 25,
            winRate: 0.625,
            fightsWithFirstKill: 30,
            fightsWonWithFirstKill: 22,
            firstKillWinRate: 0.75,
            fightsWithFirstDeath: 10,
            fightsLostWithFirstDeath: 8,
            firstDeathLossRate: 0.8
          },
          'Team Beta': {
            teamName: 'Team Beta',
            totalFights: 40,
            fightsWon: 15,
            winRate: 0.375,
            fightsWithFirstKill: 18,
            fightsWonWithFirstKill: 8,
            firstKillWinRate: 0.45,
            fightsWithFirstDeath: 22,
            fightsLostWithFirstDeath: 17,
            firstDeathLossRate: 0.77
          }
        }
      };

      const mockGet = vi.fn();
      mockGet.mockImplementation(async (atom) => {
        if (atom === teamStats.atom) return mockTeamStats;
        if (atom === firstKillImpact.atom) return mockFirstKillImpact;
        return [];
      });

      const result = await listSummaryAtoms.teamListSummaryFn(mockGet as Getter);

      expect(result).toHaveLength(2);
      
      expect(result[0]).toEqual({
        teamName: 'Team Alpha',
        playerCount: 6,
        winRate: 0.75, // 15 / (15 + 5)
        gamesPlayed: 20,
        firstKillWinRate: 0.75
      });

      expect(result[1]).toEqual({
        teamName: 'Team Beta',
        playerCount: 2,
        winRate: 0.4, // 8 / (8 + 12)
        gamesPlayed: 20,
        firstKillWinRate: 0.45
      });
    });

    it('should handle teams with no games played', async () => {
      const mockTeamStats: TeamStats[] = [
        {
          teamName: 'Team New',
          players: ['Player1'],
          wins: 0,
          losses: 0,
          draws: 0,
          gamesPlayed: 0,
          mostRecentGameDate: new Date('2023-08-28')
        }
      ];

      const mockFirstKillImpact: FirstKillImpactStats = {
        totalFights: 0,
        overallWinRate: 0,
        firstKillWinRate: 0,
        firstDeathLossRate: 0,
        teamStats: {}
      };

      const mockGet = vi.fn();
      mockGet.mockImplementation(async (atom) => {
        if (atom === teamStats.atom) return mockTeamStats;
        if (atom === firstKillImpact.atom) return mockFirstKillImpact;
        return [];
      });

      const result = await listSummaryAtoms.teamListSummaryFn(mockGet as Getter);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        teamName: 'Team New',
        playerCount: 1,
        winRate: 0, // No games played
        gamesPlayed: 0,
        firstKillWinRate: 0 // No data available
      });
    });
  });

  describe('latestScrimSummaryFn', () => {
    it('should return the most recent scrim by date', async () => {
      const mockScrimList: ScrimListSummary[] = [
        {
          scrimId: '2023-08-25-Team A-vs-Team B',
          teamNames: ['Team A', 'Team B'],
          dateString: '2023-08-25',
          mapCount: 5,
          score: '3-2-0',
          duration: 3000,
          maps: []
        },
        {
          scrimId: '2023-08-28-Team C-vs-Team D',
          teamNames: ['Team C', 'Team D'],
          dateString: '2023-08-28',
          mapCount: 4,
          score: '2-2-0',
          duration: 2800,
          maps: []
        },
        {
          scrimId: '2023-08-27-Team E-vs-Team F',
          teamNames: ['Team E', 'Team F'],
          dateString: '2023-08-27',
          mapCount: 3,
          score: '1-2-0',
          duration: 2200,
          maps: []
        }
      ];

      const mockGet = vi.fn();
      mockGet.mockImplementation(async () => mockScrimList);

      const result = await listSummaryAtoms.latestScrimSummaryFn(mockGet as Getter);

      // Should return the scrim with the latest date (2023-08-28)
      expect(result).toEqual({
        scrimId: '2023-08-28-Team C-vs-Team D',
        teamNames: ['Team C', 'Team D'],
        dateString: '2023-08-28',
        mapCount: 4,
        score: '2-2-0',
        duration: 2800
      });
    });

    it('should handle invalid date strings with string comparison fallback', async () => {
      const mockScrimList: ScrimListSummary[] = [
        {
          scrimId: 'scrim1',
          teamNames: ['Team A', 'Team B'],
          dateString: 'invalid-date-1',
          mapCount: 3,
          score: '2-1-0',
          duration: 2000,
          maps: []
        },
        {
          scrimId: 'scrim2',
          teamNames: ['Team C', 'Team D'],
          dateString: 'invalid-date-2',
          mapCount: 4,
          score: '3-1-0',
          duration: 2500,
          maps: []
        }
      ];

      const mockGet = vi.fn();
      mockGet.mockImplementation(async () => mockScrimList);

      const result = await listSummaryAtoms.latestScrimSummaryFn(mockGet as Getter);

      // Should use string comparison as fallback and return the lexicographically last one
      expect(result?.dateString).toBe('invalid-date-2');
    });

    it('should return undefined for empty scrim list', async () => {
      const mockGet = vi.fn();
      mockGet.mockImplementation(async () => []);

      const result = await listSummaryAtoms.latestScrimSummaryFn(mockGet as Getter);
      expect(result).toBeUndefined();
    });

    it('should handle single scrim correctly', async () => {
      const mockScrimList: ScrimListSummary[] = [
        {
          scrimId: 'only-scrim',
          teamNames: ['Team Solo', 'Team Alone'],
          dateString: '2023-08-28',
          mapCount: 1,
          score: '1-0-0',
          duration: 600,
          maps: []
        }
      ];

      const mockGet = vi.fn();
      mockGet.mockImplementation(async () => mockScrimList);

      const result = await listSummaryAtoms.latestScrimSummaryFn(mockGet as Getter);
      expect(result).toEqual(mockScrimList[0]);
    });
  });

  describe('integration behavior', () => {
    it('should handle realistic data structures', async () => {
      // Test with more realistic data that mimics the actual atom dependencies
      const mockScrims: Scrim[] = [
        {
          dateString: '2023-08-28',
          team1Name: 'Overwatch Pros',
          team2Name: 'Elite Gaming',
          team1Players: ['Tank1', 'DPS1', 'DPS2', 'Support1', 'Support2', 'Flex'],
          team2Players: ['Tank2', 'DPS3', 'DPS4', 'Support3', 'Support4', 'Flex2'],
          team1Wins: 4,
          team2Wins: 2,
          draws: 0,
          duration: 4200,
          matchIds: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']
        }
      ];

      const mockTeamStats: TeamStats[] = [
        {
          teamName: 'Overwatch Pros',
          players: ['Tank1', 'DPS1', 'DPS2', 'Support1', 'Support2', 'Flex'],
          wins: 25,
          losses: 10,
          draws: 0,
          gamesPlayed: 35,
          mostRecentGameDate: new Date('2023-08-28')
        }
      ];

      const mockFirstKillImpact: FirstKillImpactStats = {
        totalFights: 55,
        overallWinRate: 0.71,
        firstKillWinRate: 0.82,
        firstDeathLossRate: 0.65,
        teamStats: {
          'Overwatch Pros': {
            teamName: 'Overwatch Pros',
            totalFights: 55,
            fightsWon: 39,
            winRate: 0.71,
            fightsWithFirstKill: 45,
            fightsWonWithFirstKill: 37,
            firstKillWinRate: 0.82,
            fightsWithFirstDeath: 10,
            fightsLostWithFirstDeath: 7,
            firstDeathLossRate: 0.7
          }
        }
      };

      const mockGet = vi.fn();
      mockGet.mockImplementation(async (atom) => {
        if (atom === scrims.atom) return mockScrims;
        if (atom === teamStats.atom) return mockTeamStats;
        if (atom === firstKillImpact.atom) return mockFirstKillImpact;
        return [];
      });

      const scrimResults = await listSummaryAtoms.scrimListSummaryFn(mockGet as Getter);
      const teamResults = await listSummaryAtoms.teamListSummaryFn(mockGet as Getter);

      expect(scrimResults[0].score).toBe('4-2-0');
      expect(scrimResults[0].mapCount).toBe(6);
      
      expect(teamResults[0].winRate).toBeCloseTo(0.714, 3); // 25/35
      expect(teamResults[0].firstKillWinRate).toBe(0.82);
    });
  });
});