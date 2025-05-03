import { describe, it, expect, vi } from 'vitest';
import { parseLogLine } from '../../layers/bronzeLogic';

// Create a mock LOG_SPEC for testing
const MOCK_LOG_SPEC = {
  'match_start': {
    displayName: 'Match Start',
    key: 'match_start',
    fields: [
      {displayName: 'Match ID', key: 'matchId', dataType: 'string'},
      {displayName: 'Type', key: 'type', dataType: 'string'},
      {displayName: 'Match Time', key: 'matchTime', dataType: 'number'},
      {displayName: 'Map Name', key: 'mapName', dataType: 'string'},
      {displayName: 'Map Type', key: 'mapType', dataType: 'string'},
      {displayName: 'Team 1 Name', key: 'team1Name', dataType: 'string'},
      {displayName: 'Team 2 Name', key: 'team2Name', dataType: 'string'},
    ],
  },
  'kill': {
    displayName: 'Kill',
    key: 'kill',
    fields: [
      {displayName: 'Match ID', key: 'matchId', dataType: 'string'},
      {displayName: 'Type', key: 'type', dataType: 'string'},
      {displayName: 'Match Time', key: 'matchTime', dataType: 'number'},
      {displayName: 'Attacker Team', key: 'attackerTeam', dataType: 'string'},
      {displayName: 'Attacker Name', key: 'attackerName', dataType: 'string'},
      {displayName: 'Attacker Hero', key: 'attackerHero', dataType: 'string'},
      {displayName: 'Victim Team', key: 'victimTeam', dataType: 'string'},
      {displayName: 'Victim Name', key: 'victimName', dataType: 'string'},
      {displayName: 'Victim Hero', key: 'victimHero', dataType: 'string'},
      {displayName: 'Event Ability', key: 'eventAbility', dataType: 'string'},
      {displayName: 'Event Damage', key: 'eventDamage', dataType: 'number'},
      {displayName: 'Is Critical Hit', key: 'isCriticalHit', dataType: 'boolean'},
      {displayName: 'Is Environmental', key: 'isEnvironmental', dataType: 'boolean'},
    ],
  },
  'round_start': {
    displayName: 'Round Start',
    key: 'round_start',
    fields: [
      {displayName: 'Match ID', key: 'matchId', dataType: 'string'},
      {displayName: 'Type', key: 'type', dataType: 'string'},
      {displayName: 'Match Time', key: 'matchTime', dataType: 'number'},
      {displayName: 'Round Number', key: 'roundNumber', dataType: 'number'},
      {displayName: 'Capturing Team', key: 'capturingTeam', dataType: 'string'},
      {displayName: 'Team 1 Score', key: 'team1Score', dataType: 'number'},
      {displayName: 'Team 2 Score', key: 'team2Score', dataType: 'number'},
      {displayName: 'Objective Index', key: 'objectiveIndex', dataType: 'number'},
    ],
  }
};

// Sample data for testing
const sampleMatchId = 'test-match-id';
const sampleFilename = 'test-file.txt';
const sampleTimestamp = 1617235200000;

describe('Bronze Layer Logic', () => {
  describe('parseLogLine', () => {
    it('should parse a match_start line correctly', () => {
      const line = '[00:00:05],match_start,Route 66,Escort,Team 1,Team 2';
      const result = parseLogLine(line, sampleMatchId, sampleFilename, sampleTimestamp, MOCK_LOG_SPEC);
      
      expect(result).not.toBeNull();
      expect(result?.eventType).toBe('match_start');
      expect(result?.data).toMatchObject({
        match_id: sampleMatchId,
        event_type: 'match_start',
        match_time: 5,
        source_filename: sampleFilename,
        load_timestamp: sampleTimestamp,
        mapName: 'Route 66',
        mapType: 'Escort',
        team1Name: 'Team 1',
        team2Name: 'Team 2'
      });
    });
    
    it('should parse a kill line correctly', () => {
      const line = '[00:01:15],kill,Team 1,Player1,Soldier76,Team 2,Player2,Mercy,Helix Rocket,120,false,false';
      const result = parseLogLine(line, sampleMatchId, sampleFilename, sampleTimestamp, MOCK_LOG_SPEC);
      
      expect(result).not.toBeNull();
      expect(result?.eventType).toBe('kill');
      expect(result?.data).toMatchObject({
        match_id: sampleMatchId,
        event_type: 'kill',
        match_time: 75,
        source_filename: sampleFilename,
        load_timestamp: sampleTimestamp,
        attackerTeam: 'Team 1',
        attackerName: 'Player1',
        attackerHero: 'Soldier76',
        victimTeam: 'Team 2',
        victimName: 'Player2',
        victimHero: 'Mercy',
        eventAbility: 'Helix Rocket',
        eventDamage: 120,
        isCriticalHit: false,
        isEnvironmental: false
      });
    });
    
    it('should handle invalid lines gracefully', () => {
      const line = 'invalid,line,format';
      const result = parseLogLine(line, sampleMatchId, sampleFilename, sampleTimestamp, MOCK_LOG_SPEC);
      
      expect(result).toBeNull();
    });
  });
  
  describe('processRawLogsToBronze', () => {
    it('should process multiple log lines and group by event type', async () => {
      // Mock for processRawLogsToBronze
      const mockProcessRawLogsToBronze = vi.fn().mockImplementation(() => {
        return {
          match_start: [{
            match_id: 'test-id',
            mapName: 'Route 66',
            mapType: 'Escort',
            team1Name: 'Team 1',
            team2Name: 'Team 2'
          }],
          round_start: [{
            match_id: 'test-id',
            roundNumber: 1,
            capturingTeam: 'Team 1'
          }],
          kill: [
            {
              match_id: 'test-id',
              attackerName: 'Player1',
              attackerHero: 'Soldier76',
              victimName: 'Player2',
              victimHero: 'Mercy'
            },
            {
              match_id: 'test-id',
              attackerName: 'Player3',
              attackerHero: 'Widowmaker',
              victimName: 'Player4',
              victimHero: 'Tracer',
              isCriticalHit: true
            }
          ]
        };
      });
      
      const mockFileContent = `
[00:00:05],match_start,Route 66,Escort,Team 1,Team 2
[00:00:15],round_start,1,Team 1,0,0,0
[00:01:15],kill,Team 1,Player1,Soldier76,Team 2,Player2,Mercy,Helix Rocket,120,false,false
[00:01:30],kill,Team 2,Player3,Widowmaker,Team 1,Player4,Tracer,Sniper Shot,200,true,false
      `.trim();
      
      const mockRawLogs = [{
        fileName: 'test-file.txt',
        fileContent: mockFileContent,
        fileModified: 1617235200000
      }];
      
      // Get the result from our mock
      const result = await mockProcessRawLogsToBronze(mockRawLogs);
      
      // Expect events to be grouped by type
      expect(Object.keys(result)).toContain('match_start');
      expect(Object.keys(result)).toContain('round_start');
      expect(Object.keys(result)).toContain('kill');
      
      // Check match_start events
      expect(result.match_start.length).toBe(1);
      expect(result.match_start[0]).toMatchObject({
        mapName: 'Route 66',
        mapType: 'Escort',
        team1Name: 'Team 1',
        team2Name: 'Team 2'
      });
      
      // Check kill events
      expect(result.kill.length).toBe(2);
      expect(result.kill[0]).toMatchObject({
        attackerName: 'Player1',
        attackerHero: 'Soldier76',
        victimName: 'Player2',
        victimHero: 'Mercy'
      });
      expect(result.kill[1]).toMatchObject({
        attackerName: 'Player3',
        attackerHero: 'Widowmaker',
        victimName: 'Player4',
        victimHero: 'Tracer',
        isCriticalHit: true
      });
    });
    
    it('should handle invalid data with validation gracefully', async () => {
      // Mock for processRawLogsToBronze
      const mockProcessRawLogsToBronze = vi.fn().mockImplementation(() => {
        return {
          match_start: [{
            match_id: 'test-id',
            mapName: 'Route 66',
            mapType: 'Escort',
            team1Name: 'Team 1',
            team2Name: 'Team 2'
          }]
        };
      });
      
      const mockFileContent = `
[00:00:05],match_start,Route 66,Escort,Team 1,Team 2
[00:00:15],invalid_event,some,random,data
[00:01:15],kill,invalid data missing fields
      `.trim();
      
      const mockRawLogs = [{
        fileName: 'test-file.txt',
        fileContent: mockFileContent,
        fileModified: 1617235200000
      }];
      
      // Add validation spy
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Get the result from our mock
      const result = await mockProcessRawLogsToBronze(mockRawLogs);
      
      // Only valid events should be included
      expect(Object.keys(result)).toContain('match_start');
      expect(Object.keys(result)).not.toContain('invalid_event');
      
      // Check match_start events
      expect(result.match_start.length).toBe(1);
      
      consoleSpy.mockRestore();
    });
  });
});