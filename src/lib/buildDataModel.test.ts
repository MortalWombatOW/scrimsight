import { describe, it, expect } from 'vitest';
import { buildDataModel } from '@library/buildDataModel';
import file1 from "@library/sampledata/Log-2023-08-28-17-05-38.txt?raw";
import file2 from "@library/sampledata/Log-2023-08-28-17-29-57.txt?raw";
import file3 from "@library/sampledata/Log-2023-08-28-17-52-17.txt?raw";
import file4 from "@library/sampledata/Log-2023-08-28-18-28-25.txt?raw";
import file5 from "@library/sampledata/Log-2023-08-28-18-40-39.txt?raw";

describe('buildDataModel', () => {
  const sampleFiles = [
    {
      fileName: 'Log-2023-08-28-17-05-38.txt',
      fileModified: new Date("2023-08-28T17:05:38.000Z").getTime(),
      fileContent: file1
    },
    {
      fileName: 'Log-2023-08-28-17-29-57.txt',
      fileModified: new Date("2023-08-28T17:29:57.000Z").getTime(),
      fileContent: file2
    },
    {
      fileName: 'Log-2023-08-28-17-52-17.txt',
      fileModified: new Date("2023-08-28T17:52:17.000Z").getTime(),
      fileContent: file3
    },
    {
      fileName: 'Log-2023-08-28-18-28-25.txt',
      fileModified: new Date("2023-08-28T18:28:25.000Z").getTime(),
      fileContent: file4
    },
    {
      fileName: 'Log-2023-08-28-18-40-39.txt',
      fileModified: new Date("2023-08-28T18:40:39.000Z").getTime(),
      fileContent: file5
    }
  ];

  it('should build a complete data model from sample files', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Test that all main sections are populated
    expect(dataModel.scrims.length).toBeGreaterThan(0);
    expect(dataModel.matches.length).toBeGreaterThan(0);
    expect(dataModel.teams.length).toBeGreaterThan(0);
    expect(dataModel.players.length).toBeGreaterThan(0);

    // Test that events are extracted
    expect(dataModel.matchStart.length).toBeGreaterThan(0);
    expect(dataModel.roundStart.length).toBeGreaterThan(0);
    expect(dataModel.kill.length).toBeGreaterThan(0);
  });

  it('should correctly build scrim relationships', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Each scrim should have required properties
    dataModel.scrims.forEach(scrim => {
      expect(typeof scrim.scrim).toBe('string');
      expect(scrim.teams).toHaveLength(2);
      expect(scrim.matches.length).toBeGreaterThan(0);
      expect(scrim.date).toBeInstanceOf(Date);
    });
  });

  it('should correctly build match relationships', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Each match should have required properties
    dataModel.matches.forEach(match => {
      expect(typeof match.match).toBe('string');
      expect(typeof match.scrim).toBe('string');
      expect(match.teams).toHaveLength(2);
      expect(typeof match.map).toBe('string');
      expect(match.date).toBeInstanceOf(Date);
      expect(Array.isArray(match.rounds)).toBe(true);
      
      // New fields added
      expect(typeof match.duration).toBe('number');
      expect(match.duration).toBeGreaterThanOrEqual(0);
      expect(typeof match.team1Score).toBe('number');
      expect(match.team1Score).toBeGreaterThanOrEqual(0);
      expect(typeof match.team2Score).toBe('number');
      expect(match.team2Score).toBeGreaterThanOrEqual(0);
      expect(typeof match.winningTeam).toBe('string');
      expect(match.teams).toContain(match.winningTeam);
      expect(typeof match.gameMode).toBe('string');
      expect(['Control', 'Escort', 'Hybrid', 'Flashpoint', 'Push', 'Clash']).toContain(match.gameMode);
    });

    // Matches should be linked to existing scrims
    const scrimIds = new Set(dataModel.scrims.map(s => s.scrim));
    dataModel.matches.forEach(match => {
      expect(scrimIds.has(match.scrim) || match.scrim.startsWith('unknown-scrim-')).toBe(true);
    });
  });

  it('should calculate match duration correctly excluding time between rounds', () => {
    const dataModel = buildDataModel(sampleFiles);

    dataModel.matches.forEach(match => {
      // Find round start and end events for this match
      const roundStarts = dataModel.roundStart
        .filter(event => event.matchId === match.match)
        .sort((a, b) => a.matchTime - b.matchTime);
      
      const roundEnds = dataModel.roundEnd
        .filter(event => event.matchId === match.match)
        .sort((a, b) => a.matchTime - b.matchTime);

      if (roundStarts.length > 0 && roundEnds.length > 0) {
        // Calculate expected duration by summing individual round durations
        const expectedDuration = match.rounds.reduce((sum, roundNumber) => {
          const roundStart = roundStarts.find(r => r.roundNumber === roundNumber);
          const roundEnd = roundEnds.find(r => r.roundNumber === roundNumber);
          
          if (roundStart && roundEnd) {
            return sum + (roundEnd.matchTime - roundStart.matchTime);
          }
          return sum;
        }, 0);

        expect(match.duration).toBeCloseTo(expectedDuration, 1);
      }
    });
  });

  it('should determine winning team correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    dataModel.matches.forEach(match => {
      // Winning team should be the one with higher score, or team1 in case of tie
      if (match.team1Score > match.team2Score) {
        expect(match.winningTeam).toBe(match.teams[0]);
      } else if (match.team2Score > match.team1Score) {
        expect(match.winningTeam).toBe(match.teams[1]);
      } else {
        // In case of tie, should default to team1
        expect(match.winningTeam).toBe(match.teams[0]);
      }
    });
  });

  it('should correctly build team relationships', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Each team should have required properties
    dataModel.teams.forEach(team => {
      expect(typeof team.team).toBe('string');
      expect(Array.isArray(team.players)).toBe(true);
      expect(Array.isArray(team.scrims)).toBe(true);
    });

    // Teams should be linked to existing scrims
    const scrimIds = new Set(dataModel.scrims.map(s => s.scrim));
    dataModel.teams.forEach(team => {
      team.scrims.forEach(scrimId => {
        expect(scrimIds.has(scrimId)).toBe(true);
      });
    });
  });

  it('should correctly build player relationships', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Each player should have required properties
    dataModel.players.forEach(player => {
      expect(typeof player.player).toBe('string');
      expect(Array.isArray(player.teams)).toBe(true);
      expect(Array.isArray(player.scrims)).toBe(true);
      expect(Array.isArray(player.matches)).toBe(true);
    });

    // Players should be linked to existing teams, scrims, and matches
    const teamNames = new Set(dataModel.teams.map(t => t.team));
    const scrimIds = new Set(dataModel.scrims.map(s => s.scrim));
    const matchIds = new Set(dataModel.matches.map(m => m.match));

    dataModel.players.forEach(player => {
      player.teams.forEach(teamName => {
        expect(teamNames.has(teamName)).toBe(true);
      });
      player.scrims.forEach(scrimId => {
        expect(scrimIds.has(scrimId)).toBe(true);
      });
      player.matches.forEach(matchId => {
        expect(matchIds.has(matchId)).toBe(true);
      });
    });
  });

  it('should maintain referential integrity between relationships', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Every team mentioned in scrims should exist in teams array
    const teamNames = new Set(dataModel.teams.map(t => t.team));
    dataModel.scrims.forEach(scrim => {
      scrim.teams.forEach(teamName => {
        expect(teamNames.has(teamName)).toBe(true);
      });
    });

    // Every match mentioned in scrims should exist in matches array
    const matchIds = new Set(dataModel.matches.map(m => m.match));
    dataModel.scrims.forEach(scrim => {
      scrim.matches.forEach(matchId => {
        expect(matchIds.has(matchId)).toBe(true);
      });
    });

    // Every player mentioned in teams should exist in players array
    const playerNames = new Set(dataModel.players.map(p => p.player));
    dataModel.teams.forEach(team => {
      team.players.forEach(playerName => {
        expect(playerNames.has(playerName)).toBe(true);
      });
    });
  });

  it('should extract events correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Test that different event types are extracted
    expect(dataModel.matchStart.length).toBeGreaterThan(0);
    expect(dataModel.roundStart.length).toBeGreaterThan(0);
    expect(dataModel.kill.length).toBeGreaterThan(0);
    expect(dataModel.heroSpawn.length).toBeGreaterThan(0);
    expect(dataModel.heroSwap.length).toBeGreaterThan(0);
    expect(dataModel.ultimateCharged.length).toBeGreaterThan(0);

    // All events should have matchId
    [...dataModel.matchStart, ...dataModel.kill, ...dataModel.heroSpawn].forEach(event => {
      expect(typeof event.matchId).toBe('string');
      expect(event.matchId.length).toBeGreaterThan(0);
    });
  });

  it('should handle empty file list', () => {
    const dataModel = buildDataModel([]);

    expect(dataModel.scrims).toHaveLength(0);
    expect(dataModel.matches).toHaveLength(0);
    expect(dataModel.teams).toHaveLength(0);
    expect(dataModel.players).toHaveLength(0);
    expect(dataModel.matchStart).toHaveLength(0);
    expect(dataModel.playerLives).toHaveLength(0);
    expect(dataModel.rounds).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byPlayer).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byTeam).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byTeamAndPlayer).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byPlayerAndHero).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byRole).toHaveLength(0);
  });

  it('should build player lives correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Player lives should be populated
    expect(dataModel.playerLives.length).toBeGreaterThan(0);

    // Each player life should have required properties
    dataModel.playerLives.forEach(life => {
      expect(typeof life.matchId).toBe('string');
      expect(typeof life.player).toBe('string');
      expect(typeof life.hero).toBe('string');
      expect(typeof life.startTime).toBe('number');
      expect(typeof life.endTime).toBe('number');
      expect(typeof life.duration).toBe('number');
      expect(typeof life.roundIndex).toBe('number');
      expect(['spawn', 'swap']).toContain(life.causeOfStart);
      expect(['death', 'swap', 'round_end']).toContain(life.causeOfEnd);
      expect(typeof life.eliminations).toBe('number');
      expect(typeof life.assists).toBe('number');
      expect(typeof life.ultimatesUsed).toBe('number');
    });
  });

  it('should calculate player life durations correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    dataModel.playerLives.forEach(life => {
      // Duration should be positive
      expect(life.duration).toBeGreaterThanOrEqual(0);
      // Duration should match endTime - startTime
      expect(life.duration).toBe(life.endTime - life.startTime);
      // Start time should be before end time
      expect(life.startTime).toBeLessThanOrEqual(life.endTime);
    });
  });

  it('should link player lives to existing matches and players', () => {
    const dataModel = buildDataModel(sampleFiles);

    const matchIds = new Set(dataModel.matches.map(m => m.match));
    const playerNames = new Set(dataModel.players.map(p => p.player));

    dataModel.playerLives.forEach(life => {
      // Match should exist
      expect(matchIds.has(life.matchId)).toBe(true);
      // Player should exist
      expect(playerNames.has(life.player)).toBe(true);
    });
  });

  it('should sort player lives by match and start time', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Check that lives are sorted properly
    for (let i = 1; i < dataModel.playerLives.length; i++) {
      const prev = dataModel.playerLives[i - 1];
      const curr = dataModel.playerLives[i];
      
      // Should be sorted by matchId first, then by startTime
      if (prev.matchId === curr.matchId) {
        expect(prev.startTime).toBeLessThanOrEqual(curr.startTime);
      } else {
        expect(prev.matchId.localeCompare(curr.matchId)).toBeLessThanOrEqual(0);
      }
    }
  });

  it('should have valid round indices for player lives', () => {
    const dataModel = buildDataModel(sampleFiles);

    dataModel.playerLives.forEach(life => {
      // Round index should be a valid round number (1, 2, or 3)
      expect([1, 2, 3]).toContain(life.roundIndex);
    });
  });

  it('should handle hero spawns and swaps correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Should have lives that start with both spawn and swap
    const spawnLives = dataModel.playerLives.filter(life => life.causeOfStart === 'spawn');
    const swapLives = dataModel.playerLives.filter(life => life.causeOfStart === 'swap');

    expect(spawnLives.length).toBeGreaterThan(0);
    if (dataModel.heroSwap.length > 0) {
      expect(swapLives.length).toBeGreaterThan(0);
    }
  });

  it('should handle different causes of life end correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Should have lives that end with different causes
    const deathLives = dataModel.playerLives.filter(life => life.causeOfEnd === 'death');
    const roundEndLives = dataModel.playerLives.filter(life => life.causeOfEnd === 'round_end');

    expect(deathLives.length).toBeGreaterThan(0);
    expect(roundEndLives.length).toBeGreaterThan(0);
  });

  it('should build teamfights correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Teamfights should be populated
    expect(dataModel.teamfights.length).toBeGreaterThan(0);

    // Each teamfight should have required properties
    dataModel.teamfights.forEach(teamfight => {
      expect(typeof teamfight.matchId).toBe('string');
      expect(typeof teamfight.roundIndex).toBe('number');
      expect([1, 2, 3]).toContain(teamfight.roundIndex);
      expect(typeof teamfight.startTime).toBe('number');
      expect(typeof teamfight.endTime).toBe('number');
      expect(typeof teamfight.duration).toBe('number');
      
      // Duration should be positive and match endTime - startTime
      expect(teamfight.duration).toBeGreaterThan(0);
      expect(teamfight.duration).toBe(teamfight.endTime - teamfight.startTime);
      
      // Start time should be before end time
      expect(teamfight.startTime).toBeLessThan(teamfight.endTime);
    });
  });

  it('should have correct teamfight structure', () => {
    const dataModel = buildDataModel(sampleFiles);

    dataModel.teamfights.forEach(teamfight => {
      // Should have start and end states
      expect(teamfight.start).toBeDefined();
      expect(teamfight.end).toBeDefined();
      
      // Start states should have team1 and team2
      expect(teamfight.start.team1).toBeDefined();
      expect(teamfight.start.team2).toBeDefined();
      expect(Array.isArray(teamfight.start.team1.alivePlayers)).toBe(true);
      expect(Array.isArray(teamfight.start.team1.ultimatesReady)).toBe(true);
      expect(Array.isArray(teamfight.start.team2.alivePlayers)).toBe(true);
      expect(Array.isArray(teamfight.start.team2.ultimatesReady)).toBe(true);

      // End states should have team1 and team2 with additional properties
      expect(teamfight.end.team1).toBeDefined();
      expect(teamfight.end.team2).toBeDefined();
      expect(Array.isArray(teamfight.end.team1.alivePlayers)).toBe(true);
      expect(Array.isArray(teamfight.end.team1.ultimatesReady)).toBe(true);
      expect(Array.isArray(teamfight.end.team1.ultimatesUsed)).toBe(true);
      expect(Array.isArray(teamfight.end.team1.kills)).toBe(true);
      expect(Array.isArray(teamfight.end.team2.alivePlayers)).toBe(true);
      expect(Array.isArray(teamfight.end.team2.ultimatesReady)).toBe(true);
      expect(Array.isArray(teamfight.end.team2.ultimatesUsed)).toBe(true);
      expect(Array.isArray(teamfight.end.team2.kills)).toBe(true);
    });
  });

  it('should link teamfights to existing matches', () => {
    const dataModel = buildDataModel(sampleFiles);

    const matchIds = new Set(dataModel.matches.map(m => m.match));

    dataModel.teamfights.forEach(teamfight => {
      // Match should exist
      expect(matchIds.has(teamfight.matchId)).toBe(true);
    });
  });

  it('should have logical teamfight timing', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Group teamfights by match
    const teamfightsByMatch = dataModel.teamfights.reduce((acc, teamfight) => {
      if (!acc[teamfight.matchId]) {
        acc[teamfight.matchId] = [];
      }
      acc[teamfight.matchId].push(teamfight);
      return acc;
    }, {} as Record<string, typeof dataModel.teamfights>);

    // Check that teamfights within each match don't overlap
    Object.values(teamfightsByMatch).forEach(matchTeamfights => {
      const sortedTeamfights = matchTeamfights.sort((a, b) => a.startTime - b.startTime);
      
      for (let i = 1; i < sortedTeamfights.length; i++) {
        const prev = sortedTeamfights[i - 1];
        const curr = sortedTeamfights[i];
        
        // Current teamfight should start after previous one ends
        expect(curr.startTime).toBeGreaterThanOrEqual(prev.endTime);
      }
    });
  });

  it('should handle matches with no kills (no teamfights)', () => {
    // Create a minimal file with no kill events - just use empty file
    const noKillFiles = [{
      fileName: 'no-kills.txt',
      fileModified: new Date("2023-08-28T17:00:00.000Z").getTime(),
      fileContent: ``
    }];

    const dataModel = buildDataModel(noKillFiles);
    
    // Should have no teamfights for matches with no kills
    expect(dataModel.teamfights).toHaveLength(0);
  });

  it('should have valid player names in teamfight states', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Get all known players
    const allPlayers = new Set(dataModel.players.map(p => p.player));

    dataModel.teamfights.forEach(teamfight => {
      // All alive players should be valid player names
      [...teamfight.start.team1.alivePlayers, ...teamfight.start.team2.alivePlayers].forEach(player => {
        expect(allPlayers.has(player)).toBe(true);
      });
      
      [...teamfight.end.team1.alivePlayers, ...teamfight.end.team2.alivePlayers].forEach(player => {
        expect(allPlayers.has(player)).toBe(true);
      });

      // All killed players should be valid player names
      [...teamfight.end.team1.kills, ...teamfight.end.team2.kills].forEach(player => {
        expect(allPlayers.has(player)).toBe(true);
      });
    });
  });

  it('should track ultimate usage correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    dataModel.teamfights.forEach(teamfight => {
      // Ultimate names should be strings
      [...teamfight.start.team1.ultimatesReady, ...teamfight.start.team2.ultimatesReady].forEach(heroName => {
        expect(typeof heroName).toBe('string');
        expect(heroName.length).toBeGreaterThan(0);
      });

      [...teamfight.end.team1.ultimatesReady, ...teamfight.end.team2.ultimatesReady].forEach(heroName => {
        expect(typeof heroName).toBe('string');
        expect(heroName.length).toBeGreaterThan(0);
      });

      [...teamfight.end.team1.ultimatesUsed, ...teamfight.end.team2.ultimatesUsed].forEach(heroName => {
        expect(typeof heroName).toBe('string');
        expect(heroName.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have consistent teamfight data', () => {
    const dataModel = buildDataModel(sampleFiles);

    dataModel.teamfights.forEach(teamfight => {
      // The number of alive players should be reasonable (0-6 per team)
      expect(teamfight.start.team1.alivePlayers.length).toBeLessThanOrEqual(6);
      expect(teamfight.start.team2.alivePlayers.length).toBeLessThanOrEqual(6);
      expect(teamfight.end.team1.alivePlayers.length).toBeLessThanOrEqual(6);
      expect(teamfight.end.team2.alivePlayers.length).toBeLessThanOrEqual(6);

      // Total kills by both teams should be reasonable for a teamfight
      const totalKills = teamfight.end.team1.kills.length + teamfight.end.team2.kills.length;
      expect(totalKills).toBeGreaterThanOrEqual(0);
      expect(totalKills).toBeLessThanOrEqual(12); // Max possible kills in a teamfight

      // The number of ultimates should be reasonable (0-6 per team)
      expect(teamfight.start.team1.ultimatesReady.length).toBeLessThanOrEqual(6);
      expect(teamfight.start.team2.ultimatesReady.length).toBeLessThanOrEqual(6);
      expect(teamfight.end.team1.ultimatesUsed.length).toBeLessThanOrEqual(6);
      expect(teamfight.end.team2.ultimatesUsed.length).toBeLessThanOrEqual(6);
    });
  });

  describe('rounds', () => {
    it('should build rounds correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Rounds should be populated
      expect(dataModel.rounds.length).toBeGreaterThan(0);

      // Each round should have required properties
      dataModel.rounds.forEach(round => {
        expect(typeof round.matchId).toBe('string');
        expect(typeof round.roundIndex).toBe('number');
        expect([1, 2, 3]).toContain(round.roundIndex);
        expect(typeof round.startTime).toBe('number');
        expect(typeof round.endTime).toBe('number');
        expect(typeof round.duration).toBe('number');
        expect(typeof round.team1Score).toBe('number');
        expect(typeof round.team2Score).toBe('number');
        expect(typeof round.winningTeam).toBe('string');
        
        // Duration should be positive and match endTime - startTime
        expect(round.duration).toBeGreaterThan(0);
        expect(round.duration).toBe(round.endTime - round.startTime);
        
        // Start time should be before end time
        expect(round.startTime).toBeLessThan(round.endTime);
        
        // Scores should be non-negative
        expect(round.team1Score).toBeGreaterThanOrEqual(0);
        expect(round.team2Score).toBeGreaterThanOrEqual(0);
      });
    });

    it('should link rounds to existing matches', () => {
      const dataModel = buildDataModel(sampleFiles);

      const matchIds = new Set(dataModel.matches.map(m => m.match));

      dataModel.rounds.forEach(round => {
        // Match should exist
        expect(matchIds.has(round.matchId)).toBe(true);
      });
    });

    it('should determine round winners correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.rounds.forEach(round => {
        // Find the match for this round to get team names
        const match = dataModel.matches.find(m => m.match === round.matchId);
        expect(match).toBeDefined();
        
        if (match) {
          // Winning team should be one of the match teams
          expect(match.teams).toContain(round.winningTeam);
          
          // Winning team should be the one with higher score, or team1 in case of tie
          if (round.team1Score > round.team2Score) {
            expect(round.winningTeam).toBe(match.teams[0]);
          } else if (round.team2Score > round.team1Score) {
            expect(round.winningTeam).toBe(match.teams[1]);
          } else {
            // In case of tie, should default to team1
            expect(round.winningTeam).toBe(match.teams[0]);
          }
        }
      });
    });

    it('should sort rounds by match and round index', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Check that rounds are sorted properly
      for (let i = 1; i < dataModel.rounds.length; i++) {
        const prev = dataModel.rounds[i - 1];
        const curr = dataModel.rounds[i];
        
        // Should be sorted by matchId first, then by roundIndex
        if (prev.matchId === curr.matchId) {
          expect(prev.roundIndex).toBeLessThanOrEqual(curr.roundIndex);
        } else {
          expect(prev.matchId.localeCompare(curr.matchId)).toBeLessThanOrEqual(0);
        }
      }
    });

    it('should have consistent data with match information', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Group rounds by match
      const roundsByMatch = dataModel.rounds.reduce((acc, round) => {
        if (!acc[round.matchId]) {
          acc[round.matchId] = [];
        }
        acc[round.matchId].push(round);
        return acc;
      }, {} as Record<string, typeof dataModel.rounds>);

      // Check that each match has the expected rounds
      dataModel.matches.forEach(match => {
        const matchRounds = roundsByMatch[match.match] || [];
        
        // Should have rounds for each round number in the match
        const roundNumbers = matchRounds.map(r => r.roundIndex).sort();
        const expectedRounds = match.rounds.sort();
        
        expect(roundNumbers).toEqual(expectedRounds);
      });
    });

    it('should calculate round durations correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.rounds.forEach(round => {
        // Duration should be positive
        expect(round.duration).toBeGreaterThan(0);
        // Duration should match endTime - startTime
        expect(round.duration).toBe(round.endTime - round.startTime);
        // Start time should be before end time
        expect(round.startTime).toBeLessThan(round.endTime);
      });
    });
  });

  describe('playerStatBreakdown', () => {
    it('should build player stat breakdown correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Player stat breakdown should be populated
      expect(dataModel.playerStatBreakdown.byPlayer.length).toBeGreaterThan(0);
      expect(dataModel.playerStatBreakdown.byTeam.length).toBeGreaterThan(0);
      expect(dataModel.playerStatBreakdown.byTeamAndPlayer.length).toBeGreaterThan(0);
      expect(dataModel.playerStatBreakdown.byTeamAndPlayerAndMatch.length).toBeGreaterThan(0);
      expect(dataModel.playerStatBreakdown.byPlayerAndHero.length).toBeGreaterThan(0);
      expect(dataModel.playerStatBreakdown.byRole.length).toBeGreaterThan(0);
      expect(dataModel.playerStatBreakdown.byHero.length).toBeGreaterThan(0);
      expect(dataModel.playerStatBreakdown.byTeamAndMatch.length).toBeGreaterThan(0);

      // Each byPlayer record should have required properties
      dataModel.playerStatBreakdown.byPlayer.forEach(stat => {
        // Should have playerName
        expect(typeof stat.playerName).toBe('string');
        expect(stat.playerName.length).toBeGreaterThan(0);

        // Base numerical fields
        expect(typeof stat.playtime).toBe('number');
        expect(stat.playtime).toBeGreaterThanOrEqual(0);
        expect(typeof stat.eliminations).toBe('number');
        expect(typeof stat.finalBlows).toBe('number');
        expect(typeof stat.deaths).toBe('number');
        expect(typeof stat.allDamageDealt).toBe('number');
        expect(typeof stat.heroDamageDealt).toBe('number');
        expect(typeof stat.healingDealt).toBe('number');

        // Derived per-10-minute fields
        expect(typeof stat.eliminationsPer10Minutes).toBe('number');
        expect(stat.eliminationsPer10Minutes).toBeGreaterThanOrEqual(0);
        expect(typeof stat.deathsPer10Minutes).toBe('number');
        expect(stat.deathsPer10Minutes).toBeGreaterThanOrEqual(0);
        expect(typeof stat.allDamageDealtPer10Minutes).toBe('number');
        expect(stat.allDamageDealtPer10Minutes).toBeGreaterThanOrEqual(0);

        // Derived percentage fields
        expect(typeof stat.weaponAccuracy).toBe('number');
        expect(stat.weaponAccuracy).toBeGreaterThanOrEqual(0);
        expect(typeof stat.criticalHitRate).toBe('number');
        expect(stat.criticalHitRate).toBeGreaterThanOrEqual(0);
      });

      // Each byTeam record should have required properties
      dataModel.playerStatBreakdown.byTeam.forEach(stat => {
        // Should have playerTeam
        expect(typeof stat.playerTeam).toBe('string');
        expect(stat.playerTeam.length).toBeGreaterThan(0);

        // Base numerical fields
        expect(typeof stat.playtime).toBe('number');
        expect(stat.playtime).toBeGreaterThanOrEqual(0);
        expect(typeof stat.eliminations).toBe('number');
        expect(typeof stat.finalBlows).toBe('number');
        expect(typeof stat.deaths).toBe('number');
      });

      // Total should have all numerical fields
      expect(typeof dataModel.playerStatBreakdown.total.playtime).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.eliminations).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.deaths).toBe('number');

      // Validate new breakdown types have correct structure
      dataModel.playerStatBreakdown.byTeamAndPlayer.forEach(stat => {
        expect(typeof stat.playerTeam).toBe('string');
        expect(typeof stat.playerName).toBe('string');
        expect(typeof stat.playtime).toBe('number');
      });

      dataModel.playerStatBreakdown.byPlayerAndHero.forEach(stat => {
        expect(typeof stat.playerName).toBe('string');
        expect(typeof stat.playerHero).toBe('string');
        expect(typeof stat.playtime).toBe('number');
      });

      dataModel.playerStatBreakdown.byRole.forEach(stat => {
        expect(typeof stat.playerRole).toBe('string');
        expect(['tank', 'damage', 'support']).toContain(stat.playerRole);
        expect(typeof stat.playtime).toBe('number');
      });

      dataModel.playerStatBreakdown.byHero.forEach(stat => {
        expect(typeof stat.playerHero).toBe('string');
        expect(typeof stat.playtime).toBe('number');
      });

      dataModel.playerStatBreakdown.byTeamAndMatch.forEach(stat => {
        expect(typeof stat.playerTeam).toBe('string');
        expect(typeof stat.matchId).toBe('string');
        expect(typeof stat.playtime).toBe('number');
      });
    });

    it('should aggregate stats correctly by player and team', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Check that byPlayer aggregation makes sense
      dataModel.playerStatBreakdown.byPlayer.forEach(playerStat => {
        // All numerical values should be non-negative
        expect(playerStat.eliminations).toBeGreaterThanOrEqual(0);
        expect(playerStat.deaths).toBeGreaterThanOrEqual(0);
        expect(playerStat.playtime).toBeGreaterThanOrEqual(0);
        expect(playerStat.allDamageDealt).toBeGreaterThanOrEqual(0);
      });

      // Check that byTeam aggregation makes sense
      dataModel.playerStatBreakdown.byTeam.forEach(teamStat => {
        // All numerical values should be non-negative
        expect(teamStat.eliminations).toBeGreaterThanOrEqual(0);
        expect(teamStat.deaths).toBeGreaterThanOrEqual(0);
        expect(teamStat.playtime).toBeGreaterThanOrEqual(0);
        expect(teamStat.allDamageDealt).toBeGreaterThanOrEqual(0);
      });

      // Total should be sum of all individual stats
      expect(dataModel.playerStatBreakdown.total.eliminations).toBeGreaterThanOrEqual(0);
      expect(dataModel.playerStatBreakdown.total.deaths).toBeGreaterThanOrEqual(0);
      expect(dataModel.playerStatBreakdown.total.playtime).toBeGreaterThanOrEqual(0);
    });

    it('should link aggregated stats to existing players and teams', () => {
      const dataModel = buildDataModel(sampleFiles);

      const playerNames = new Set(dataModel.players.map(p => p.player));
      const teamNames = new Set(dataModel.teams.map(t => t.team));

      // All players in byPlayer should exist in players array
      dataModel.playerStatBreakdown.byPlayer.forEach(stat => {
        expect(playerNames.has(stat.playerName)).toBe(true);
      });

      // All teams in byTeam should exist in teams array
      dataModel.playerStatBreakdown.byTeam.forEach(stat => {
        expect(teamNames.has(stat.playerTeam)).toBe(true);
      });
    });

    it('should handle edge cases correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Check byPlayer stats
      dataModel.playerStatBreakdown.byPlayer.forEach(stat => {
        // All numerical values should be finite
        expect(Number.isFinite(stat.playtime)).toBe(true);
        expect(Number.isFinite(stat.weaponAccuracy)).toBe(true);
        expect(Number.isFinite(stat.eliminationsPer10Minutes)).toBe(true);
        expect(Number.isFinite(stat.criticalHitRate)).toBe(true);
      });

      // Check byTeam stats
      dataModel.playerStatBreakdown.byTeam.forEach(stat => {
        // All numerical values should be finite
        expect(Number.isFinite(stat.playtime)).toBe(true);
        expect(Number.isFinite(stat.weaponAccuracy)).toBe(true);
        expect(Number.isFinite(stat.eliminationsPer10Minutes)).toBe(true);
      });

      // Check total stats
      Object.values(dataModel.playerStatBreakdown.total).forEach(value => {
        expect(Number.isFinite(value)).toBe(true);
      });
    });

    it('should create correct grouping relationships in breakdowns', () => {
      const dataModel = buildDataModel(sampleFiles);

      // byTeamAndPlayer should have more records than byTeam (since each team has multiple players)
      expect(dataModel.playerStatBreakdown.byTeamAndPlayer.length).toBeGreaterThanOrEqual(dataModel.playerStatBreakdown.byTeam.length);

      // byTeamAndPlayerAndMatch should have more records than byTeamAndPlayer (since players play multiple matches)
      expect(dataModel.playerStatBreakdown.byTeamAndPlayerAndMatch.length).toBeGreaterThanOrEqual(dataModel.playerStatBreakdown.byTeamAndPlayer.length);

      // byPlayerAndHero should have more records than byPlayer (since players play multiple heroes)
      expect(dataModel.playerStatBreakdown.byPlayerAndHero.length).toBeGreaterThanOrEqual(dataModel.playerStatBreakdown.byPlayer.length);

      // byRole should have exactly 3 records or fewer (tank, damage, support)
      expect(dataModel.playerStatBreakdown.byRole.length).toBeLessThanOrEqual(3);
      expect(dataModel.playerStatBreakdown.byRole.length).toBeGreaterThan(0);

      // Check that role aggregation contains expected roles
      const roles = dataModel.playerStatBreakdown.byRole.map(r => r.playerRole);
      expect(roles.every(role => ['tank', 'damage', 'support'].includes(role))).toBe(true);

      // byTeamAndMatch should aggregate stats correctly
      dataModel.playerStatBreakdown.byTeamAndMatch.forEach(stat => {
        expect(stat.eliminations).toBeGreaterThanOrEqual(0);
        expect(stat.deaths).toBeGreaterThanOrEqual(0);
        expect(stat.playtime).toBeGreaterThanOrEqual(0);
      });
    });
  });
});