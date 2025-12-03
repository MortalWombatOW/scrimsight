import { describe, it, expect } from 'vitest';
import { generateTimelineSegments } from './timelineSegmentsAtom';
import type { MatchData, MapTimes, RoundTimes, Teamfight, RoundEndLogEvent } from '@atoms';

describe('timelineSegmentsAtom', () => {
  describe('generateTimelineSegments', () => {
    it('should return empty array when matchData is undefined', () => {
      const result = generateTimelineSegments(undefined, undefined, [], [], []);
      expect(result).toEqual([]);
    });

    it('should return empty array when mapTime is undefined', () => {
      const matchData: MatchData = {
        matchId: 'match1',
        fileName: 'test.log',
        fileModified: 0,
        dateString: '2024-01-01',
        map: 'Dorado',
        mode: 'Escort',
        team1Name: 'Team A',
        team2Name: 'Team B',
        team1Score: 3,
        team2Score: 2,
        team1Players: ['Player1', 'Player2'],
        team2Players: ['Player3', 'Player4'],
        duration: 600,
        roundWinners: ['team1', 'team2', 'team1'],
        winner: 'Team A',
      };

      const result = generateTimelineSegments(matchData, undefined, [], [], []);
      expect(result).toEqual([]);
    });

    it('should generate timeline segments with teamfights, rounds, and map result', () => {
      const matchData: MatchData = {
        matchId: 'match1',
        fileName: 'test.log',
        fileModified: 0,
        dateString: '2024-01-01',
        map: 'Dorado',
        mode: 'Escort',
        team1Name: 'Team A',
        team2Name: 'Team B',
        team1Score: 3,
        team2Score: 2,
        team1Players: ['Player1', 'Player2'],
        team2Players: ['Player3', 'Player4'],
        duration: 600,
        roundWinners: ['team1', 'team2', 'team1'],
        winner: 'Team A',
      };

      const mapTime: MapTimes = {
        matchId: 'match1',
        startTime: 0,
        endTime: 600,
        duration: 600,
      };

      const roundTimes: RoundTimes[] = [
        {
          matchId: 'match1',
          roundNumber: 1,
          roundStartTime: 0,
          roundSetupCompleteTime: 30,
          roundEndTime: 200,
          roundDuration: 200,
        },
        {
          matchId: 'match1',
          roundNumber: 2,
          roundStartTime: 200,
          roundSetupCompleteTime: 230,
          roundEndTime: 400,
          roundDuration: 200,
        },
      ];

      const teamfights: Teamfight[] = [
        {
          fightId: 'match1-50',
          matchId: 'match1',
          startTime: 50,
          endTime: 70,
          duration: 20,
          team1Name: 'Team A',
          team2Name: 'Team B',
          winner: 'Team A',
          team1Kills: 3,
          team2Kills: 1,
          team1PlayersWithUltimatesChargedAtStart: [],
          team2PlayersWithUltimatesChargedAtStart: [],
          team1PlayersWithUltimatesUsed: [],
          team2PlayersWithUltimatesUsed: [],
        },
        {
          fightId: 'match1-250',
          matchId: 'match1',
          startTime: 250,
          endTime: 270,
          duration: 20,
          team1Name: 'Team A',
          team2Name: 'Team B',
          winner: 'Team B',
          team1Kills: 2,
          team2Kills: 4,
          team1PlayersWithUltimatesChargedAtStart: [],
          team2PlayersWithUltimatesChargedAtStart: [],
          team1PlayersWithUltimatesUsed: [],
          team2PlayersWithUltimatesUsed: [],
        },
      ];

      const roundEnds: RoundEndLogEvent[] = [
        {
          matchId: 'match1',
          type: 'round_end',
          matchTime: 200,
          roundNumber: 1,
          capturingTeam: 'Team A',
          team1Score: 1,
          team2Score: 0,
          objectiveIndex: 0,
          controlTeam1Progress: 0,
          controlTeam2Progress: 0,
          matchTimeRemaining: 400,
        },
        {
          matchId: 'match1',
          type: 'round_end',
          matchTime: 400,
          roundNumber: 2,
          capturingTeam: 'Team B',
          team1Score: 1,
          team2Score: 1,
          objectiveIndex: 0,
          controlTeam1Progress: 0,
          controlTeam2Progress: 0,
          matchTimeRemaining: 200,
        },
      ];

      const result = generateTimelineSegments(matchData, mapTime, roundTimes, teamfights, roundEnds);

      // Should have 2 teamfights + 2 rounds + 1 map = 5 segments
      expect(result).toHaveLength(5);

      // Check teamfights
      const teamfightSegments = result.filter(s => s.type === 'teamfight');
      expect(teamfightSegments).toHaveLength(2);
      expect(teamfightSegments[0]).toMatchObject({
        id: 'tf-1',
        type: 'teamfight',
        startTime: 50,
        endTime: 70,
        sortTime: 50,
        winner: 'Team A',
        team1Name: 'Team A',
        team2Name: 'Team B',
      });

      // Check rounds
      const roundSegments = result.filter(s => s.type === 'round');
      expect(roundSegments).toHaveLength(2);
      expect(roundSegments[0]).toMatchObject({
        id: 'round-1',
        type: 'round',
        roundNumber: 1,
        winner: 'Team A',
        startTime: 0,
        endTime: 200,
        sortTime: 200,
      });

      // Check map result
      const mapSegments = result.filter(s => s.type === 'map');
      expect(mapSegments).toHaveLength(1);
      expect(mapSegments[0]).toMatchObject({
        id: 'map-result',
        type: 'map',
        winner: 'Team A',
        startTime: 0,
        endTime: 600,
        sortTime: 600,
      });

      // Verify segments are sorted by sortTime
      for (let i = 1; i < result.length; i++) {
        expect(result[i].sortTime).toBeGreaterThanOrEqual(result[i - 1].sortTime);
      }
    });

    it('should filter teamfights to only include those within round boundaries', () => {
      const matchData: MatchData = {
        matchId: 'match1',
        fileName: 'test.log',
        fileModified: 0,
        dateString: '2024-01-01',
        map: 'Dorado',
        mode: 'Escort',
        team1Name: 'Team A',
        team2Name: 'Team B',
        team1Score: 1,
        team2Score: 0,
        team1Players: ['Player1'],
        team2Players: ['Player2'],
        duration: 300,
        roundWinners: ['team1'],
        winner: 'Team A',
      };

      const mapTime: MapTimes = {
        matchId: 'match1',
        startTime: 0,
        endTime: 300,
        duration: 300,
      };

      const roundTimes: RoundTimes[] = [
        {
          matchId: 'match1',
          roundNumber: 1,
          roundStartTime: 0,
          roundSetupCompleteTime: 30,
          roundEndTime: 200,
          roundDuration: 200,
        },
      ];

      // Teamfight outside round boundaries should be excluded
      const teamfights: Teamfight[] = [
        {
          fightId: 'match1-50',
          matchId: 'match1',
          startTime: 50,
          endTime: 70,
          duration: 20,
          team1Name: 'Team A',
          team2Name: 'Team B',
          winner: 'Team A',
          team1Kills: 3,
          team2Kills: 1,
          team1PlayersWithUltimatesChargedAtStart: [],
          team2PlayersWithUltimatesChargedAtStart: [],
          team1PlayersWithUltimatesUsed: [],
          team2PlayersWithUltimatesUsed: [],
        },
        {
          fightId: 'match1-250',
          matchId: 'match1',
          startTime: 250, // After round end
          endTime: 270,
          duration: 20,
          team1Name: 'Team A',
          team2Name: 'Team B',
          winner: 'Team B',
          team1Kills: 2,
          team2Kills: 4,
          team1PlayersWithUltimatesChargedAtStart: [],
          team2PlayersWithUltimatesChargedAtStart: [],
          team1PlayersWithUltimatesUsed: [],
          team2PlayersWithUltimatesUsed: [],
        },
      ];

      const result = generateTimelineSegments(matchData, mapTime, roundTimes, teamfights, []);

      // Should only include the teamfight within round boundaries
      const teamfightSegments = result.filter(s => s.type === 'teamfight');
      expect(teamfightSegments).toHaveLength(1);
      expect(teamfightSegments[0].startTime).toBe(50);
    });
  });
});
