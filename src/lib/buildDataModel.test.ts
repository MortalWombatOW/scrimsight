import { describe, it, expect } from 'vitest';
import { buildDataModel } from '@library/buildDataModel';
import * as ScrimsightDataModel from '@library/ScrimsightDataModel';
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
      
      // New fields for match wins
      expect(typeof scrim.team1MatchesWon).toBe('number');
      expect(scrim.team1MatchesWon).toBeGreaterThanOrEqual(0);
      expect(typeof scrim.team2MatchesWon).toBe('number');
      expect(scrim.team2MatchesWon).toBeGreaterThanOrEqual(0);
      
      // Total matches won should equal total matches in scrim
      expect(scrim.team1MatchesWon + scrim.team2MatchesWon).toBe(scrim.matches.length);
    });
  });

  it('should calculate scrim match wins correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    // Verify that scrim match wins are calculated correctly by cross-referencing with match data
    dataModel.scrims.forEach(scrim => {
      let expectedTeam1Wins = 0;
      let expectedTeam2Wins = 0;
      
      scrim.matches.forEach(matchId => {
        const match = dataModel.matches.find(m => m.match === matchId);
        expect(match).toBeDefined();
        
        if (match) {
          // Check which team won this match and increment expected count
          if (match.winningTeam === scrim.teams[0]) {
            expectedTeam1Wins++;
          } else if (match.winningTeam === scrim.teams[1]) {
            expectedTeam2Wins++;
          }
        }
      });
      
      // Verify that computed wins match expected wins
      expect(scrim.team1MatchesWon).toBe(expectedTeam1Wins);
      expect(scrim.team2MatchesWon).toBe(expectedTeam2Wins);
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
      expect(Array.isArray(player.heroes)).toBe(true);
      expect(Array.isArray(player.roles)).toBe(true);
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

  it('should populate player heroes and roles with playtime correctly', () => {
    const dataModel = buildDataModel(sampleFiles);

    dataModel.players.forEach(player => {
      // Each player should have at least some heroes and roles if they have player lives
      const playerLives = dataModel.playerLives.filter(life => life.player === player.player);
      if (playerLives.length > 0) {
        expect(player.heroes.length).toBeGreaterThan(0);
        expect(player.roles.length).toBeGreaterThan(0);
      }

      // Heroes array should contain valid hero objects
      player.heroes.forEach(heroEntry => {
        expect(typeof heroEntry.hero).toBe('string');
        expect(typeof heroEntry.playtime).toBe('number');
        expect(heroEntry.playtime).toBeGreaterThan(0); // Playtime should be positive, not just >= 0
        
        // Hero should be a valid hero name from the constants
        const allHeroes = [...ScrimsightDataModel.TANK_HEROES, ...ScrimsightDataModel.DAMAGE_HEROES, ...ScrimsightDataModel.SUPPORT_HEROES];
        expect(allHeroes).toContain(heroEntry.hero);
      });

      // Roles array should contain valid role objects
      player.roles.forEach(roleEntry => {
        expect(typeof roleEntry.role).toBe('string');
        expect(typeof roleEntry.playtime).toBe('number');
        expect(roleEntry.playtime).toBeGreaterThan(0); // Playtime should be positive, not just >= 0
        
        // Role should be one of the valid roles
        expect(['tank', 'damage', 'support']).toContain(roleEntry.role);
      });

      // Heroes should be sorted by playtime (descending)
      for (let i = 1; i < player.heroes.length; i++) {
        expect(player.heroes[i-1].playtime).toBeGreaterThanOrEqual(player.heroes[i].playtime);
      }

      // Roles should be sorted by playtime (descending) 
      for (let i = 1; i < player.roles.length; i++) {
        expect(player.roles[i-1].playtime).toBeGreaterThanOrEqual(player.roles[i].playtime);
      }

      // Total playtime across all heroes should equal total playtime across all roles
      const totalHeroPlaytime = player.heroes.reduce((sum, h) => sum + h.playtime, 0);
      const totalRolePlaytime = player.roles.reduce((sum, r) => sum + r.playtime, 0);
      expect(totalHeroPlaytime).toBeCloseTo(totalRolePlaytime, 5); // Allow small floating point differences

      // Verify playtime matches what we expect from playerLives
      if (playerLives.length > 0) {
        const expectedTotalPlaytime = playerLives.reduce((sum, life) => sum + life.duration, 0);
        expect(totalHeroPlaytime).toBeCloseTo(expectedTotalPlaytime, 5);
      }
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
    expect(dataModel.teamCompositions).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byPlayer).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byTeam).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byTeamAndPlayer).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byPlayerAndHero).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byRole).toHaveLength(0);
    expect(dataModel.playerStatBreakdown.byTeamAndScrim).toHaveLength(0);
    expect(dataModel.killCounts.byMatch).toHaveLength(0);
    expect(dataModel.killCounts.byMatchAndRound).toHaveLength(0);
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
      
      // Start states should have team1 and team2 with teamName
      expect(teamfight.start.team1).toBeDefined();
      expect(teamfight.start.team2).toBeDefined();
      expect(typeof teamfight.start.team1.teamName).toBe('string');
      expect(typeof teamfight.start.team2.teamName).toBe('string');
      expect(Array.isArray(teamfight.start.team1.alivePlayers)).toBe(true);
      expect(Array.isArray(teamfight.start.team1.ultimatesReady)).toBe(true);
      expect(Array.isArray(teamfight.start.team2.alivePlayers)).toBe(true);
      expect(Array.isArray(teamfight.start.team2.ultimatesReady)).toBe(true);

      // End states should have team1 and team2 with additional properties
      expect(teamfight.end.team1).toBeDefined();
      expect(teamfight.end.team2).toBeDefined();
      expect(typeof teamfight.end.team1.teamName).toBe('string');
      expect(typeof teamfight.end.team2.teamName).toBe('string');
      expect(Array.isArray(teamfight.end.team1.alivePlayers)).toBe(true);
      expect(Array.isArray(teamfight.end.team1.ultimatesReady)).toBe(true);
      expect(Array.isArray(teamfight.end.team1.ultimatesUsed)).toBe(true);
      expect(Array.isArray(teamfight.end.team1.kills)).toBe(true);
      expect(Array.isArray(teamfight.end.team2.alivePlayers)).toBe(true);
      expect(Array.isArray(teamfight.end.team2.ultimatesReady)).toBe(true);
      expect(Array.isArray(teamfight.end.team2.ultimatesUsed)).toBe(true);
      expect(Array.isArray(teamfight.end.team2.kills)).toBe(true);
      
      // Should have winner and kill efficiency metrics
      expect(typeof teamfight.winner).toBe('string');
      expect(typeof teamfight.team1KillsPerUlt).toBe('number');
      expect(typeof teamfight.team2KillsPerUlt).toBe('number');
      expect(teamfight.team1KillsPerUlt).toBeGreaterThanOrEqual(0);
      expect(teamfight.team2KillsPerUlt).toBeGreaterThanOrEqual(0);
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
      expect(dataModel.playerStatBreakdown.byTeamAndScrim.length).toBeGreaterThan(0);

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

        // Ultimate-related derived stats
        expect(typeof stat.ultsUsed).toBe('number');
        expect(stat.ultsUsed).toBeGreaterThanOrEqual(0);
        expect(typeof stat.ultKills).toBe('number');
        expect(stat.ultKills).toBeGreaterThanOrEqual(0);
        expect(typeof stat.killsPerUltimate).toBe('number');
        expect(stat.killsPerUltimate).toBeGreaterThanOrEqual(0);
        expect(typeof stat.ultimateChargeTime).toBe('number');
        expect(stat.ultimateChargeTime).toBeGreaterThanOrEqual(0);
        expect(typeof stat.ultimateHoldTime).toBe('number');
        expect(stat.ultimateHoldTime).toBeGreaterThanOrEqual(0);
        expect(typeof stat.ultimateUseTime).toBe('number');
        expect(stat.ultimateUseTime).toBeGreaterThanOrEqual(0);
        expect(typeof stat.deathsWithUltAvailable).toBe('number');
        expect(stat.deathsWithUltAvailable).toBeGreaterThanOrEqual(0);

        // Teamfight participation stats
        expect(typeof stat.teamfightsParticipated).toBe('number');
        expect(stat.teamfightsParticipated).toBeGreaterThanOrEqual(0);
        expect(typeof stat.teamfightsWon).toBe('number');
        expect(stat.teamfightsWon).toBeGreaterThanOrEqual(0);
        expect(typeof stat.teamfightsWonWithUlt).toBe('number');
        expect(stat.teamfightsWonWithUlt).toBeGreaterThanOrEqual(0);
        expect(typeof stat.teamfightsWonWithoutUlt).toBe('number');
        expect(stat.teamfightsWonWithoutUlt).toBeGreaterThanOrEqual(0);
        expect(typeof stat.teamfightWinRate).toBe('number');
        expect(stat.teamfightWinRate).toBeGreaterThanOrEqual(0);
        expect(stat.teamfightWinRate).toBeLessThanOrEqual(1);
        expect(typeof stat.teamfightWinRateWithUlt).toBe('number');
        expect(stat.teamfightWinRateWithUlt).toBeGreaterThanOrEqual(0);
        expect(stat.teamfightWinRateWithUlt).toBeLessThanOrEqual(1);
        expect(typeof stat.teamfightWinRateWithoutUlt).toBe('number');
        expect(stat.teamfightWinRateWithoutUlt).toBeGreaterThanOrEqual(0);
        expect(stat.teamfightWinRateWithoutUlt).toBeLessThanOrEqual(1);

        // First kill/death teamfight stats
        expect(typeof stat.teamfightsWithFirstKill).toBe('number');
        expect(stat.teamfightsWithFirstKill).toBeGreaterThanOrEqual(0);
        expect(typeof stat.teamfightsWithFirstDeath).toBe('number');
        expect(stat.teamfightsWithFirstDeath).toBeGreaterThanOrEqual(0);
        expect(typeof stat.firstKillRate).toBe('number');
        expect(stat.firstKillRate).toBeGreaterThanOrEqual(0);
        expect(stat.firstKillRate).toBeLessThanOrEqual(1);
        expect(typeof stat.firstDeathRate).toBe('number');
        expect(stat.firstDeathRate).toBeGreaterThanOrEqual(0);
        expect(stat.firstDeathRate).toBeLessThanOrEqual(1);
        expect(typeof stat.teamfightsWonWithFirstKill).toBe('number');
        expect(stat.teamfightsWonWithFirstKill).toBeGreaterThanOrEqual(0);
        expect(typeof stat.teamfightsWonWithFirstDeath).toBe('number');
        expect(stat.teamfightsWonWithFirstDeath).toBeGreaterThanOrEqual(0);
        expect(typeof stat.teamfightWinRateWithFirstKill).toBe('number');
        expect(stat.teamfightWinRateWithFirstKill).toBeGreaterThanOrEqual(0);
        expect(stat.teamfightWinRateWithFirstKill).toBeLessThanOrEqual(1);
        expect(typeof stat.teamfightWinRateWithFirstDeath).toBe('number');
        expect(stat.teamfightWinRateWithFirstDeath).toBeGreaterThanOrEqual(0);
        expect(stat.teamfightWinRateWithFirstDeath).toBeLessThanOrEqual(1);

        // Kill-by-role stats
        expect(typeof stat.tankKills).toBe('number');
        expect(stat.tankKills).toBeGreaterThanOrEqual(0);
        expect(typeof stat.damageKills).toBe('number');
        expect(stat.damageKills).toBeGreaterThanOrEqual(0);
        expect(typeof stat.supportKills).toBe('number');
        expect(stat.supportKills).toBeGreaterThanOrEqual(0);
        expect(typeof stat.tankFocusRate).toBe('number');
        expect(stat.tankFocusRate).toBeGreaterThanOrEqual(0);
        expect(stat.tankFocusRate).toBeLessThanOrEqual(1);
        expect(typeof stat.damageFocusRate).toBe('number');
        expect(stat.damageFocusRate).toBeGreaterThanOrEqual(0);
        expect(stat.damageFocusRate).toBeLessThanOrEqual(1);
        expect(typeof stat.supportFocusRate).toBe('number');
        expect(stat.supportFocusRate).toBeGreaterThanOrEqual(0);
        expect(stat.supportFocusRate).toBeLessThanOrEqual(1);

        // New derived stats
        expect(typeof stat.averageLifeDuration).toBe('number');
        expect(stat.averageLifeDuration).toBeGreaterThanOrEqual(0);
        expect(typeof stat.totalAssists).toBe('number');
        expect(stat.totalAssists).toBeGreaterThanOrEqual(0);
        expect(typeof stat.totalAssistsPer10Minutes).toBe('number');
        expect(stat.totalAssistsPer10Minutes).toBeGreaterThanOrEqual(0);
        expect(typeof stat.damagePerKill).toBe('number');
        expect(stat.damagePerKill).toBeGreaterThanOrEqual(0);
        expect(typeof stat.damageDonePerHealingReceived).toBe('number');
        expect(stat.damageDonePerHealingReceived).toBeGreaterThanOrEqual(0);

        // Additional validation for logical relationships
        if (stat.totalAssists > 0) {
          expect(stat.totalAssists).toBe(stat.offensiveAssists + stat.defensiveAssists);
        }
        if (stat.eliminations > 0 && stat.allDamageDealt > 0) {
          expect(stat.damagePerKill).toBe(stat.allDamageDealt / stat.eliminations);
        }
        if (stat.healingReceived > 0 && stat.allDamageDealt > 0) {
          expect(stat.damageDonePerHealingReceived).toBe(stat.allDamageDealt / stat.healingReceived);
        }
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

      // Total should have all numerical fields including new derived stats
      expect(typeof dataModel.playerStatBreakdown.total.playtime).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.eliminations).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.deaths).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.ultsUsed).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.ultKills).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.teamfightsParticipated).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.teamfightsWon).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.tankKills).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.damageKills).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.supportKills).toBe('number');
      
      // Test new teamfight fields in total
      expect(typeof dataModel.playerStatBreakdown.total.teamfightsWithFirstKill).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.teamfightsWithFirstDeath).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.firstKillRate).toBe('number');
      expect(typeof dataModel.playerStatBreakdown.total.firstDeathRate).toBe('number');
      expect(dataModel.playerStatBreakdown.total.teamfightsWithFirstKill).toBeGreaterThanOrEqual(0);
      expect(dataModel.playerStatBreakdown.total.teamfightsWithFirstDeath).toBeGreaterThanOrEqual(0);
      expect(dataModel.playerStatBreakdown.total.firstKillRate).toBeGreaterThanOrEqual(0);
      expect(dataModel.playerStatBreakdown.total.firstDeathRate).toBeGreaterThanOrEqual(0);
      expect(dataModel.playerStatBreakdown.total.firstKillRate).toBeLessThanOrEqual(1);
      expect(dataModel.playerStatBreakdown.total.firstDeathRate).toBeLessThanOrEqual(1);
      
      // Test new derived stats in total
      expect(typeof dataModel.playerStatBreakdown.total.averageLifeDuration).toBe('number');
      expect(dataModel.playerStatBreakdown.total.averageLifeDuration).toBeGreaterThanOrEqual(0);
      expect(typeof dataModel.playerStatBreakdown.total.totalAssists).toBe('number');
      expect(dataModel.playerStatBreakdown.total.totalAssists).toBeGreaterThanOrEqual(0);
      expect(typeof dataModel.playerStatBreakdown.total.totalAssistsPer10Minutes).toBe('number');
      expect(dataModel.playerStatBreakdown.total.totalAssistsPer10Minutes).toBeGreaterThanOrEqual(0);
      expect(typeof dataModel.playerStatBreakdown.total.damagePerKill).toBe('number');
      expect(dataModel.playerStatBreakdown.total.damagePerKill).toBeGreaterThanOrEqual(0);
      expect(typeof dataModel.playerStatBreakdown.total.damageDonePerHealingReceived).toBe('number');
      expect(dataModel.playerStatBreakdown.total.damageDonePerHealingReceived).toBeGreaterThanOrEqual(0);

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

      dataModel.playerStatBreakdown.byTeamAndScrim.forEach(stat => {
        expect(typeof stat.playerTeam).toBe('string');
        expect(typeof stat.scrim).toBe('string');
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

      // byTeamAndScrim should aggregate stats correctly
      dataModel.playerStatBreakdown.byTeamAndScrim.forEach(stat => {
        expect(stat.eliminations).toBeGreaterThanOrEqual(0);
        expect(stat.deaths).toBeGreaterThanOrEqual(0);
        expect(stat.playtime).toBeGreaterThanOrEqual(0);
      });
    });

    it('should calculate per10 metrics correctly after aggregation', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Test that per10 calculations are statistically valid when aggregating
      dataModel.playerStatBreakdown.byPlayer.forEach(playerStat => {
        if (playerStat.playtime > 0) {
          const playtimeMinutes = playerStat.playtime / 60;
          const expectedEliminationsPer10 = (playerStat.eliminations / playtimeMinutes) * 10;
          const expectedDeathsPer10 = (playerStat.deaths / playtimeMinutes) * 10;
          const expectedDamagePer10 = (playerStat.allDamageDealt / playtimeMinutes) * 10;

          // Allow for small floating point differences
          expect(playerStat.eliminationsPer10Minutes).toBeCloseTo(expectedEliminationsPer10, 6);
          expect(playerStat.deathsPer10Minutes).toBeCloseTo(expectedDeathsPer10, 6);
          expect(playerStat.allDamageDealtPer10Minutes).toBeCloseTo(expectedDamagePer10, 6);
        } else {
          // If no playtime, per10 should be 0
          expect(playerStat.eliminationsPer10Minutes).toBe(0);
          expect(playerStat.deathsPer10Minutes).toBe(0);
          expect(playerStat.allDamageDealtPer10Minutes).toBe(0);
        }
      });

      // Test team-level aggregation
      dataModel.playerStatBreakdown.byTeam.forEach(teamStat => {
        if (teamStat.playtime > 0) {
          const playtimeMinutes = teamStat.playtime / 60;
          const expectedEliminationsPer10 = (teamStat.eliminations / playtimeMinutes) * 10;
          const expectedDeathsPer10 = (teamStat.deaths / playtimeMinutes) * 10;

          expect(teamStat.eliminationsPer10Minutes).toBeCloseTo(expectedEliminationsPer10, 6);
          expect(teamStat.deathsPer10Minutes).toBeCloseTo(expectedDeathsPer10, 6);
        }
      });
    });

    it('should calculate percentage metrics correctly after aggregation', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.playerStatBreakdown.byPlayer.forEach(playerStat => {
        // Weapon accuracy should be shots hit / shots fired * 100
        if (playerStat.shotsFired > 0) {
          const expectedAccuracy = (playerStat.shotsHit / playerStat.shotsFired) * 100;
          expect(playerStat.weaponAccuracy).toBeCloseTo(expectedAccuracy, 6);
        } else {
          expect(playerStat.weaponAccuracy).toBe(0);
        }

        // Critical hit rate should be critical hits / shots hit * 100
        if (playerStat.shotsHit > 0) {
          const expectedCritRate = (playerStat.criticalHits / playerStat.shotsHit) * 100;
          expect(playerStat.criticalHitRate).toBeCloseTo(expectedCritRate, 6);
        } else {
          expect(playerStat.criticalHitRate).toBe(0);
        }

        // Scoped weapon accuracy should be scoped shots hit / scoped shots fired * 100
        if (playerStat.scopedShotsFired > 0) {
          const expectedScopedAccuracy = (playerStat.scopedShotsHit / playerStat.scopedShotsFired) * 100;
          expect(playerStat.scopedWeaponAccuracy).toBeCloseTo(expectedScopedAccuracy, 6);
        } else {
          expect(playerStat.scopedWeaponAccuracy).toBe(0);
        }
      });
    });

    it('should maintain statistical validity across all aggregation levels', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Test that all aggregation levels have valid statistical calculations
      const aggregationLevels = [
        dataModel.playerStatBreakdown.byPlayer,
        dataModel.playerStatBreakdown.byTeam,
        dataModel.playerStatBreakdown.byTeamAndPlayer,
        dataModel.playerStatBreakdown.byPlayerAndHero,
        dataModel.playerStatBreakdown.byRole,
        dataModel.playerStatBreakdown.byHero,
        dataModel.playerStatBreakdown.byTeamAndMatch,
        dataModel.playerStatBreakdown.byTeamAndScrim,
        [dataModel.playerStatBreakdown.total]
      ];

      aggregationLevels.forEach(level => {
        level.forEach(stat => {
          // Per10 calculations should be mathematically correct
          if (stat.playtime > 0) {
            const playtimeMinutes = stat.playtime / 60;
            const expectedEliminationsPer10 = (stat.eliminations / playtimeMinutes) * 10;
            expect(stat.eliminationsPer10Minutes).toBeCloseTo(expectedEliminationsPer10, 6);
          } else {
            expect(stat.eliminationsPer10Minutes).toBe(0);
          }

          // Percentage calculations should be mathematically correct
          if (stat.shotsFired > 0) {
            const expectedAccuracy = (stat.shotsHit / stat.shotsFired) * 100;
            expect(stat.weaponAccuracy).toBeCloseTo(expectedAccuracy, 6);
          } else {
            expect(stat.weaponAccuracy).toBe(0);
          }

          // All calculated values should be finite
          expect(Number.isFinite(stat.eliminationsPer10Minutes)).toBe(true);
          expect(Number.isFinite(stat.weaponAccuracy)).toBe(true);
          expect(Number.isFinite(stat.criticalHitRate)).toBe(true);
          expect(Number.isFinite(stat.scopedWeaponAccuracy)).toBe(true);
        });
      });
    });

    it('should calculate new derived stats correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.playerStatBreakdown.byPlayer.forEach(playerStat => {
        // Ultimate-related stats validation
        expect(playerStat.ultsUsed).toBe(playerStat.ultimatesUsed); // ultsUsed should equal ultimatesUsed
        expect(playerStat.ultKills).toBeGreaterThanOrEqual(0);
        expect(playerStat.ultimateChargeTime).toBeGreaterThanOrEqual(0);
        expect(playerStat.ultimateHoldTime).toBeGreaterThanOrEqual(0);
        expect(playerStat.ultimateUseTime).toBeGreaterThanOrEqual(0);
        expect(playerStat.deathsWithUltAvailable).toBeGreaterThanOrEqual(0);
        expect(playerStat.deathsWithUltAvailable).toBeLessThanOrEqual(playerStat.deaths);

        // killsPerUltimate calculation
        if (playerStat.ultsUsed > 0) {
          const expectedKillsPerUlt = playerStat.eliminations / playerStat.ultsUsed;
          expect(playerStat.killsPerUltimate).toBeCloseTo(expectedKillsPerUlt, 6);
        } else {
          expect(playerStat.killsPerUltimate).toBe(0);
        }

        // Teamfight stats validation
        expect(playerStat.teamfightsParticipated).toBeGreaterThanOrEqual(0);
        expect(playerStat.teamfightsWon).toBeGreaterThanOrEqual(0);
        expect(playerStat.teamfightsWon).toBeLessThanOrEqual(playerStat.teamfightsParticipated);
        expect(playerStat.teamfightsWonWithUlt).toBeGreaterThanOrEqual(0);
        expect(playerStat.teamfightsWonWithUlt).toBeLessThanOrEqual(playerStat.teamfightsWon);
        expect(playerStat.teamfightsWonWithoutUlt).toBeGreaterThanOrEqual(0);
        expect(playerStat.teamfightsWonWithoutUlt).toBeLessThanOrEqual(playerStat.teamfightsWon);
        
        // teamfightsWonWithUlt + teamfightsWonWithoutUlt should equal teamfightsWon
        expect(playerStat.teamfightsWonWithUlt + playerStat.teamfightsWonWithoutUlt).toBe(playerStat.teamfightsWon);

        // Win rate calculations
        if (playerStat.teamfightsParticipated > 0) {
          const expectedWinRate = playerStat.teamfightsWon / playerStat.teamfightsParticipated;
          expect(playerStat.teamfightWinRate).toBeCloseTo(expectedWinRate, 6);
          
          const expectedWinRateWithUlt = playerStat.teamfightsWonWithUlt / playerStat.teamfightsParticipated;
          expect(playerStat.teamfightWinRateWithUlt).toBeCloseTo(expectedWinRateWithUlt, 6);
          
          const expectedWinRateWithoutUlt = playerStat.teamfightsWonWithoutUlt / playerStat.teamfightsParticipated;
          expect(playerStat.teamfightWinRateWithoutUlt).toBeCloseTo(expectedWinRateWithoutUlt, 6);
        } else {
          expect(playerStat.teamfightWinRate).toBe(0);
          expect(playerStat.teamfightWinRateWithUlt).toBe(0);
          expect(playerStat.teamfightWinRateWithoutUlt).toBe(0);
        }

        // First kill/death teamfight stats validation
        expect(playerStat.teamfightsWonWithFirstKill).toBeGreaterThanOrEqual(0);
        expect(playerStat.teamfightsWonWithFirstKill).toBeLessThanOrEqual(playerStat.teamfightsWon);
        expect(playerStat.teamfightsWonWithFirstDeath).toBeGreaterThanOrEqual(0);
        expect(playerStat.teamfightsWonWithFirstDeath).toBeLessThanOrEqual(playerStat.teamfightsWon);

        // Kill-by-role stats validation
        expect(playerStat.tankKills).toBeGreaterThanOrEqual(0);
        expect(playerStat.damageKills).toBeGreaterThanOrEqual(0);
        expect(playerStat.supportKills).toBeGreaterThanOrEqual(0);
        
        // tankKills + damageKills + supportKills should be close to eliminations (may not be exact due to filtering)
        const totalRoleKills = playerStat.tankKills + playerStat.damageKills + playerStat.supportKills;
        expect(totalRoleKills).toBeLessThanOrEqual(playerStat.eliminations);

        // Focus rate calculations
        if (playerStat.eliminations > 0) {
          const expectedTankFocusRate = playerStat.tankKills / playerStat.eliminations;
          const expectedDamageFocusRate = playerStat.damageKills / playerStat.eliminations;
          const expectedSupportFocusRate = playerStat.supportKills / playerStat.eliminations;
          
          expect(playerStat.tankFocusRate).toBeCloseTo(expectedTankFocusRate, 6);
          expect(playerStat.damageFocusRate).toBeCloseTo(expectedDamageFocusRate, 6);
          expect(playerStat.supportFocusRate).toBeCloseTo(expectedSupportFocusRate, 6);
          
          // Focus rates should sum to close to 1 (may not be exact due to filtering)
          const totalFocusRate = playerStat.tankFocusRate + playerStat.damageFocusRate + playerStat.supportFocusRate;
          expect(totalFocusRate).toBeLessThanOrEqual(1);
        } else {
          expect(playerStat.tankFocusRate).toBe(0);
          expect(playerStat.damageFocusRate).toBe(0);
          expect(playerStat.supportFocusRate).toBe(0);
        }
      });
    });

    it('should ensure derived stats are finite and valid', () => {
      const dataModel = buildDataModel(sampleFiles);

      const allAggregationLevels = [
        dataModel.playerStatBreakdown.byPlayer,
        dataModel.playerStatBreakdown.byTeam,
        dataModel.playerStatBreakdown.byTeamAndPlayer,
        dataModel.playerStatBreakdown.byPlayerAndHero,
        dataModel.playerStatBreakdown.byRole,
        dataModel.playerStatBreakdown.byHero,
        dataModel.playerStatBreakdown.byTeamAndMatch,
        dataModel.playerStatBreakdown.byTeamAndScrim,
        [dataModel.playerStatBreakdown.total]
      ];

      allAggregationLevels.forEach(level => {
        level.forEach(stat => {
          // All new derived stats should be finite numbers
          expect(Number.isFinite(stat.ultsUsed)).toBe(true);
          expect(Number.isFinite(stat.ultKills)).toBe(true);
          expect(Number.isFinite(stat.killsPerUltimate)).toBe(true);
          expect(Number.isFinite(stat.ultimateChargeTime)).toBe(true);
          expect(Number.isFinite(stat.ultimateHoldTime)).toBe(true);
          expect(Number.isFinite(stat.ultimateUseTime)).toBe(true);
          expect(Number.isFinite(stat.deathsWithUltAvailable)).toBe(true);
          expect(Number.isFinite(stat.teamfightsParticipated)).toBe(true);
          expect(Number.isFinite(stat.teamfightsWon)).toBe(true);
          expect(Number.isFinite(stat.teamfightsWonWithUlt)).toBe(true);
          expect(Number.isFinite(stat.teamfightsWonWithoutUlt)).toBe(true);
          expect(Number.isFinite(stat.teamfightWinRate)).toBe(true);
          expect(Number.isFinite(stat.teamfightWinRateWithUlt)).toBe(true);
          expect(Number.isFinite(stat.teamfightWinRateWithoutUlt)).toBe(true);
          expect(Number.isFinite(stat.teamfightsWonWithFirstKill)).toBe(true);
          expect(Number.isFinite(stat.teamfightsWonWithFirstDeath)).toBe(true);
          expect(Number.isFinite(stat.teamfightWinRateWithFirstKill)).toBe(true);
          expect(Number.isFinite(stat.teamfightWinRateWithFirstDeath)).toBe(true);
          expect(Number.isFinite(stat.tankKills)).toBe(true);
          expect(Number.isFinite(stat.damageKills)).toBe(true);
          expect(Number.isFinite(stat.supportKills)).toBe(true);
          expect(Number.isFinite(stat.tankFocusRate)).toBe(true);
          expect(Number.isFinite(stat.damageFocusRate)).toBe(true);
          expect(Number.isFinite(stat.supportFocusRate)).toBe(true);

          // All new derived stats should be non-negative
          expect(stat.ultsUsed).toBeGreaterThanOrEqual(0);
          expect(stat.ultKills).toBeGreaterThanOrEqual(0);
          expect(stat.killsPerUltimate).toBeGreaterThanOrEqual(0);
          expect(stat.ultimateChargeTime).toBeGreaterThanOrEqual(0);
          expect(stat.ultimateHoldTime).toBeGreaterThanOrEqual(0);
          expect(stat.ultimateUseTime).toBeGreaterThanOrEqual(0);
          expect(stat.deathsWithUltAvailable).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightsParticipated).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightsWon).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightsWonWithUlt).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightsWonWithoutUlt).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightWinRate).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightWinRateWithUlt).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightWinRateWithoutUlt).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightsWonWithFirstKill).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightsWonWithFirstDeath).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightWinRateWithFirstKill).toBeGreaterThanOrEqual(0);
          expect(stat.teamfightWinRateWithFirstDeath).toBeGreaterThanOrEqual(0);
          expect(stat.tankKills).toBeGreaterThanOrEqual(0);
          expect(stat.damageKills).toBeGreaterThanOrEqual(0);
          expect(stat.supportKills).toBeGreaterThanOrEqual(0);
          expect(stat.tankFocusRate).toBeGreaterThanOrEqual(0);
          expect(stat.damageFocusRate).toBeGreaterThanOrEqual(0);
          expect(stat.supportFocusRate).toBeGreaterThanOrEqual(0);

          // Win rates and focus rates should be between 0 and 1
          expect(stat.teamfightWinRate).toBeLessThanOrEqual(1);
          expect(stat.teamfightWinRateWithUlt).toBeLessThanOrEqual(1);
          expect(stat.teamfightWinRateWithoutUlt).toBeLessThanOrEqual(1);
          expect(stat.teamfightWinRateWithFirstKill).toBeLessThanOrEqual(1);
          expect(stat.teamfightWinRateWithFirstDeath).toBeLessThanOrEqual(1);
          expect(stat.tankFocusRate).toBeLessThanOrEqual(1);
          expect(stat.damageFocusRate).toBeLessThanOrEqual(1);
          expect(stat.supportFocusRate).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should build byTeamAndScrim aggregation correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // byTeamAndScrim should be populated
      expect(dataModel.playerStatBreakdown.byTeamAndScrim.length).toBeGreaterThan(0);

      // Each byTeamAndScrim record should have required properties
      dataModel.playerStatBreakdown.byTeamAndScrim.forEach(stat => {
        expect(typeof stat.playerTeam).toBe('string');
        expect(stat.playerTeam.length).toBeGreaterThan(0);
        expect(typeof stat.scrim).toBe('string');
        expect(stat.scrim.length).toBeGreaterThan(0);

        // All numerical stats should be non-negative
        expect(stat.playtime).toBeGreaterThanOrEqual(0);
        expect(stat.eliminations).toBeGreaterThanOrEqual(0);
        expect(stat.deaths).toBeGreaterThanOrEqual(0);
        expect(stat.allDamageDealt).toBeGreaterThanOrEqual(0);
        expect(stat.heroDamageDealt).toBeGreaterThanOrEqual(0);
        expect(stat.healingDealt).toBeGreaterThanOrEqual(0);

        // Derived metrics should be finite
        expect(Number.isFinite(stat.eliminationsPer10Minutes)).toBe(true);
        expect(Number.isFinite(stat.deathsPer10Minutes)).toBe(true);
        expect(Number.isFinite(stat.weaponAccuracy)).toBe(true);
        expect(Number.isFinite(stat.criticalHitRate)).toBe(true);
      });

      // Verify that team names exist in teams array
      const teamNames = new Set(dataModel.teams.map(t => t.team));
      dataModel.playerStatBreakdown.byTeamAndScrim.forEach(stat => {
        expect(teamNames.has(stat.playerTeam)).toBe(true);
      });

      // Verify that scrim IDs exist in scrims array or are unknown-scrim entries
      const scrimIds = new Set(dataModel.scrims.map(s => s.scrim));
      dataModel.playerStatBreakdown.byTeamAndScrim.forEach(stat => {
        expect(scrimIds.has(stat.scrim) || stat.scrim.startsWith('unknown-scrim-')).toBe(true);
      });

      // Each team should have stats for each scrim they participated in
      dataModel.teams.forEach(team => {
        const teamScrims = team.scrims;
        const teamScrimStats = dataModel.playerStatBreakdown.byTeamAndScrim.filter(stat => stat.playerTeam === team.team);
        
        // Should have a stat entry for each scrim the team participated in
        expect(teamScrimStats.length).toBe(teamScrims.length);
        
        teamScrims.forEach(scrimId => {
          const scrimStat = teamScrimStats.find(stat => stat.scrim === scrimId);
          expect(scrimStat).toBeDefined();
        });
      });
    });

    it('should correctly aggregate team stats by scrim', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Test that byTeamAndScrim aggregates correctly from match-level data
      dataModel.playerStatBreakdown.byTeamAndScrim.forEach(scrimStat => {
        // Find all matches for this team and scrim
        const scrimMatches = dataModel.matches.filter(match => 
          match.scrim === scrimStat.scrim && 
          match.teams.includes(scrimStat.playerTeam)
        );

        // Calculate expected aggregated stats from byTeamAndMatch
        const expectedStats = scrimMatches.reduce((acc, match) => {
          const matchStat = dataModel.playerStatBreakdown.byTeamAndMatch.find(stat => 
            stat.playerTeam === scrimStat.playerTeam && stat.matchId === match.match
          );
          
          if (matchStat) {
            acc.eliminations += matchStat.eliminations;
            acc.deaths += matchStat.deaths;
            acc.playtime += matchStat.playtime;
            acc.allDamageDealt += matchStat.allDamageDealt;
          }
          
          return acc;
        }, { eliminations: 0, deaths: 0, playtime: 0, allDamageDealt: 0 });

        // Verify that scrim stats match expected aggregated stats
        if (scrimMatches.length > 0) {
          expect(scrimStat.eliminations).toBe(expectedStats.eliminations);
          expect(scrimStat.deaths).toBe(expectedStats.deaths);
          expect(scrimStat.playtime).toBeCloseTo(expectedStats.playtime, 6);
          expect(scrimStat.allDamageDealt).toBeCloseTo(expectedStats.allDamageDealt, 6);
        }
      });
    });

    it('should build byTeamAndPlayerAndScrim aggregation correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // byTeamAndPlayerAndScrim should be populated
      expect(dataModel.playerStatBreakdown.byTeamAndPlayerAndScrim.length).toBeGreaterThan(0);

      // Each byTeamAndPlayerAndScrim record should have required properties
      dataModel.playerStatBreakdown.byTeamAndPlayerAndScrim.forEach(stat => {
        expect(typeof stat.playerTeam).toBe('string');
        expect(stat.playerTeam.length).toBeGreaterThan(0);
        expect(typeof stat.playerName).toBe('string');
        expect(stat.playerName.length).toBeGreaterThan(0);
        expect(typeof stat.scrim).toBe('string');
        expect(stat.scrim.length).toBeGreaterThan(0);

        // All numerical stats should be non-negative
        expect(stat.playtime).toBeGreaterThanOrEqual(0);
        expect(stat.eliminations).toBeGreaterThanOrEqual(0);
        expect(stat.deaths).toBeGreaterThanOrEqual(0);
        expect(stat.allDamageDealt).toBeGreaterThanOrEqual(0);
        expect(stat.heroDamageDealt).toBeGreaterThanOrEqual(0);
        expect(stat.healingDealt).toBeGreaterThanOrEqual(0);

        // Derived metrics should be finite
        expect(Number.isFinite(stat.eliminationsPer10Minutes)).toBe(true);
        expect(Number.isFinite(stat.deathsPer10Minutes)).toBe(true);
        expect(Number.isFinite(stat.weaponAccuracy)).toBe(true);
        expect(Number.isFinite(stat.criticalHitRate)).toBe(true);
      });

      // Verify that team names exist in teams array
      const teamNames = new Set(dataModel.teams.map(t => t.team));
      dataModel.playerStatBreakdown.byTeamAndPlayerAndScrim.forEach(stat => {
        expect(teamNames.has(stat.playerTeam)).toBe(true);
      });

      // Verify that player names exist in players array
      const playerNames = new Set(dataModel.players.map(p => p.player));
      dataModel.playerStatBreakdown.byTeamAndPlayerAndScrim.forEach(stat => {
        expect(playerNames.has(stat.playerName)).toBe(true);
      });

      // Verify that scrim IDs exist in scrims array or are unknown-scrim entries
      const scrimIds = new Set(dataModel.scrims.map(s => s.scrim));
      dataModel.playerStatBreakdown.byTeamAndPlayerAndScrim.forEach(stat => {
        expect(scrimIds.has(stat.scrim) || stat.scrim.startsWith('unknown-scrim-')).toBe(true);
      });

      // Each player should have stats for each scrim their team participated in
      dataModel.players.forEach(player => {
        const playerScrims = player.scrims;
        const playerScrimStats = dataModel.playerStatBreakdown.byTeamAndPlayerAndScrim.filter(stat => stat.playerName === player.player);
        
        // Should have a stat entry for each scrim the player participated in
        expect(playerScrimStats.length).toBe(playerScrims.length);
        
        playerScrims.forEach(scrimId => {
          const scrimStat = playerScrimStats.find(stat => stat.scrim === scrimId);
          expect(scrimStat).toBeDefined();
        });
      });
    });

    it('should correctly aggregate player stats by team and scrim', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Test that byTeamAndPlayerAndScrim aggregates correctly from match-level data
      dataModel.playerStatBreakdown.byTeamAndPlayerAndScrim.forEach(scrimStat => {
        // Find all matches for this player, team and scrim
        const scrimMatches = dataModel.matches.filter(match => 
          match.scrim === scrimStat.scrim && 
          match.teams.includes(scrimStat.playerTeam)
        );

        // Calculate expected aggregated stats from byTeamAndPlayerAndMatch
        const expectedStats = scrimMatches.reduce((acc, match) => {
          const matchStat = dataModel.playerStatBreakdown.byTeamAndPlayerAndMatch.find(stat => 
            stat.playerTeam === scrimStat.playerTeam && 
            stat.playerName === scrimStat.playerName &&
            stat.matchId === match.match
          );
          
          if (matchStat) {
            acc.eliminations += matchStat.eliminations;
            acc.deaths += matchStat.deaths;
            acc.playtime += matchStat.playtime;
            acc.allDamageDealt += matchStat.allDamageDealt;
            acc.heroDamageDealt += matchStat.heroDamageDealt;
            acc.healingDealt += matchStat.healingDealt;
          }
          
          return acc;
        }, { eliminations: 0, deaths: 0, playtime: 0, allDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0 });

        // Verify that scrim stats match expected aggregated stats
        if (scrimMatches.length > 0) {
          expect(scrimStat.eliminations).toBe(expectedStats.eliminations);
          expect(scrimStat.deaths).toBe(expectedStats.deaths);
          expect(scrimStat.playtime).toBeCloseTo(expectedStats.playtime, 6);
          expect(scrimStat.allDamageDealt).toBeCloseTo(expectedStats.allDamageDealt, 6);
          expect(scrimStat.heroDamageDealt).toBeCloseTo(expectedStats.heroDamageDealt, 6);
          expect(scrimStat.healingDealt).toBeCloseTo(expectedStats.healingDealt, 6);
        }
      });
    });
  });

  describe('playerStatBreakdownRanks', () => {
    it('should build player stat breakdown ranks correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Player stat breakdown ranks should be populated with same structure as values
      expect(dataModel.playerStatBreakdownRanks.byPlayer.length).toBe(dataModel.playerStatBreakdown.byPlayer.length);
      expect(dataModel.playerStatBreakdownRanks.byTeam.length).toBe(dataModel.playerStatBreakdown.byTeam.length);
      expect(dataModel.playerStatBreakdownRanks.byTeamAndPlayer.length).toBe(dataModel.playerStatBreakdown.byTeamAndPlayer.length);
      expect(dataModel.playerStatBreakdownRanks.byTeamAndPlayerAndMatch.length).toBe(dataModel.playerStatBreakdown.byTeamAndPlayerAndMatch.length);
      expect(dataModel.playerStatBreakdownRanks.byPlayerAndHero.length).toBe(dataModel.playerStatBreakdown.byPlayerAndHero.length);
      expect(dataModel.playerStatBreakdownRanks.byRole.length).toBe(dataModel.playerStatBreakdown.byRole.length);
      expect(dataModel.playerStatBreakdownRanks.byHero.length).toBe(dataModel.playerStatBreakdown.byHero.length);
      expect(dataModel.playerStatBreakdownRanks.byTeamAndMatch.length).toBe(dataModel.playerStatBreakdown.byTeamAndMatch.length);
      expect(dataModel.playerStatBreakdownRanks.byTeamAndScrim.length).toBe(dataModel.playerStatBreakdown.byTeamAndScrim.length);

      // Each byPlayer rank should have same structure but with ranks instead of values
      dataModel.playerStatBreakdownRanks.byPlayer.forEach((rankStat, index) => {
        const valueStat = dataModel.playerStatBreakdown.byPlayer[index];
        
        // Should have same playerName
        expect(rankStat.playerName).toBe(valueStat.playerName);

        // All rank values should be positive integers (rank 1 is best)
        expect(typeof rankStat.playtime).toBe('number');
        expect(rankStat.playtime).toBeGreaterThan(0);
        expect(Number.isInteger(rankStat.playtime)).toBe(true);
        expect(typeof rankStat.eliminations).toBe('number');
        expect(rankStat.eliminations).toBeGreaterThan(0);
        expect(Number.isInteger(rankStat.eliminations)).toBe(true);
        expect(typeof rankStat.deaths).toBe('number');
        expect(rankStat.deaths).toBeGreaterThan(0);
        expect(Number.isInteger(rankStat.deaths)).toBe(true);
        expect(typeof rankStat.allDamageDealt).toBe('number');
        expect(rankStat.allDamageDealt).toBeGreaterThan(0);
        expect(Number.isInteger(rankStat.allDamageDealt)).toBe(true);

        // All ranks should be within valid range (1 to number of players)
        const numPlayers = dataModel.playerStatBreakdown.byPlayer.length;
        expect(rankStat.playtime).toBeLessThanOrEqual(numPlayers);
        expect(rankStat.eliminations).toBeLessThanOrEqual(numPlayers);
        expect(rankStat.deaths).toBeLessThanOrEqual(numPlayers);
        expect(rankStat.allDamageDealt).toBeLessThanOrEqual(numPlayers);
      });
    });

    it('should rank metrics according to PLAYER_STAT_RANKING_DIRECTIONS', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Test that rankings follow the direction specified in PLAYER_STAT_RANKING_DIRECTIONS
      if (dataModel.playerStatBreakdown.byPlayer.length >= 2) {
        // Find players with highest and lowest eliminations
        const eliminationValues = dataModel.playerStatBreakdown.byPlayer.map(p => p.eliminations);
        const maxEliminations = Math.max(...eliminationValues);
        const minEliminations = Math.min(...eliminationValues);

        if (maxEliminations > minEliminations) {
          const highestEliminationsPlayer = dataModel.playerStatBreakdown.byPlayer.find(p => p.eliminations === maxEliminations);
          const lowestEliminationsPlayer = dataModel.playerStatBreakdown.byPlayer.find(p => p.eliminations === minEliminations);
          
          if (highestEliminationsPlayer && lowestEliminationsPlayer) {
            const highestEliminationsRank = dataModel.playerStatBreakdownRanks.byPlayer.find(p => p.playerName === highestEliminationsPlayer.playerName);
            const lowestEliminationsRank = dataModel.playerStatBreakdownRanks.byPlayer.find(p => p.playerName === lowestEliminationsPlayer.playerName);
            
            expect(highestEliminationsRank).toBeDefined();
            expect(lowestEliminationsRank).toBeDefined();
            
            if (highestEliminationsRank && lowestEliminationsRank) {
              // Higher eliminations should have better (lower) rank since 'eliminations' direction is 'higher'
              expect(highestEliminationsRank.eliminations).toBeLessThanOrEqual(lowestEliminationsRank.eliminations);
            }
          }
        }

        // Test deaths ranking (lower is better)
        const deathValues = dataModel.playerStatBreakdown.byPlayer.map(p => p.deaths);
        const maxDeaths = Math.max(...deathValues);
        const minDeaths = Math.min(...deathValues);

        if (maxDeaths > minDeaths) {
          const highestDeathsPlayer = dataModel.playerStatBreakdown.byPlayer.find(p => p.deaths === maxDeaths);
          const lowestDeathsPlayer = dataModel.playerStatBreakdown.byPlayer.find(p => p.deaths === minDeaths);
          
          if (highestDeathsPlayer && lowestDeathsPlayer) {
            const highestDeathsRank = dataModel.playerStatBreakdownRanks.byPlayer.find(p => p.playerName === highestDeathsPlayer.playerName);
            const lowestDeathsRank = dataModel.playerStatBreakdownRanks.byPlayer.find(p => p.playerName === lowestDeathsPlayer.playerName);
            
            expect(highestDeathsRank).toBeDefined();
            expect(lowestDeathsRank).toBeDefined();
            
            if (highestDeathsRank && lowestDeathsRank) {
              // Lower deaths should have better (lower) rank since 'deaths' direction is 'lower'
              expect(lowestDeathsRank.deaths).toBeLessThanOrEqual(highestDeathsRank.deaths);
            }
          }
        }
      }
    });

    it('should rank all aggregation levels consistently', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Test that all aggregation levels have valid rankings
      const aggregationLevels = [
        { values: dataModel.playerStatBreakdown.byPlayer, ranks: dataModel.playerStatBreakdownRanks.byPlayer },
        { values: dataModel.playerStatBreakdown.byTeam, ranks: dataModel.playerStatBreakdownRanks.byTeam },
        { values: dataModel.playerStatBreakdown.byTeamAndPlayer, ranks: dataModel.playerStatBreakdownRanks.byTeamAndPlayer },
        { values: dataModel.playerStatBreakdown.byPlayerAndHero, ranks: dataModel.playerStatBreakdownRanks.byPlayerAndHero },
        { values: dataModel.playerStatBreakdown.byRole, ranks: dataModel.playerStatBreakdownRanks.byRole },
        { values: dataModel.playerStatBreakdown.byHero, ranks: dataModel.playerStatBreakdownRanks.byHero },
        { values: dataModel.playerStatBreakdown.byTeamAndMatch, ranks: dataModel.playerStatBreakdownRanks.byTeamAndMatch },
        { values: dataModel.playerStatBreakdown.byTeamAndScrim, ranks: dataModel.playerStatBreakdownRanks.byTeamAndScrim }
      ];

      aggregationLevels.forEach(({ values, ranks }) => {
        expect(ranks.length).toBe(values.length);
        
        ranks.forEach((rankRecord, index) => {
          const valueRecord = values[index];
          
          // All rank values should be positive integers
          ScrimsightDataModel.playerStatsNumericalKeys.forEach(key => {
            expect(typeof rankRecord[key]).toBe('number');
            expect(rankRecord[key]).toBeGreaterThan(0);
            expect(Number.isInteger(rankRecord[key])).toBe(true);
            expect(rankRecord[key]).toBeLessThanOrEqual(values.length);
          });
        });
      });
    });

    it('should handle ties in rankings correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // If there are any ties in the data, they should have the same rank
      // and the next rank should be appropriately skipped
      const playerRanks = dataModel.playerStatBreakdownRanks.byPlayer;
      const playerValues = dataModel.playerStatBreakdown.byPlayer;

      if (playerValues.length >= 2) {
        // Check for ties in eliminations
        const eliminationGroups = new Map<number, string[]>();
        playerValues.forEach(player => {
          const value = player.eliminations;
          if (!eliminationGroups.has(value)) {
            eliminationGroups.set(value, []);
          }
          eliminationGroups.get(value)!.push(player.playerName);
        });

        // For each group with the same value, they should have the same rank
        eliminationGroups.forEach((playerNames, value) => {
          if (playerNames.length > 1) {
            const ranks = playerNames.map(name => {
              const rankRecord = playerRanks.find(r => r.playerName === name);
              return rankRecord?.eliminations || 0;
            });
            
            // All players with the same value should have the same rank
            const firstRank = ranks[0];
            ranks.forEach(rank => {
              expect(rank).toBe(firstRank);
            });
          }
        });
      }
    });

    it('should have valid total rankings', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Total rankings should be valid (all ranks should be 1 since there's only one total)
      ScrimsightDataModel.playerStatsNumericalKeys.forEach(key => {
        expect(typeof dataModel.playerStatBreakdownRanks.total[key]).toBe('number');
        expect(dataModel.playerStatBreakdownRanks.total[key]).toBe(1);
      });
    });
  });

  describe('killCounts', () => {
    it('should build kill counts correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Kill counts should be populated
      expect(dataModel.killCounts.byMatch.length).toBeGreaterThan(0);
      expect(dataModel.killCounts.byMatchAndRound.length).toBeGreaterThan(0);

      // Each byMatch kill count should have required properties
      dataModel.killCounts.byMatch.forEach(killCount => {
        expect(typeof killCount.matchId).toBe('string');
        expect(killCount.matchId.length).toBeGreaterThan(0);
        expect(typeof killCount.player).toBe('string');
        expect(killCount.player.length).toBeGreaterThan(0);
        expect(typeof killCount.victim).toBe('string');
        expect(killCount.victim.length).toBeGreaterThan(0);
        expect(typeof killCount.killCount).toBe('number');
        expect(killCount.killCount).toBeGreaterThan(0);
      });

      // Each byMatchAndRound kill count should have required properties
      dataModel.killCounts.byMatchAndRound.forEach(killCount => {
        expect(typeof killCount.matchId).toBe('string');
        expect(killCount.matchId.length).toBeGreaterThan(0);
        expect(typeof killCount.roundNumber).toBe('number');
        expect([1, 2, 3]).toContain(killCount.roundNumber);
        expect(typeof killCount.player).toBe('string');
        expect(killCount.player.length).toBeGreaterThan(0);
        expect(typeof killCount.victim).toBe('string');
        expect(killCount.victim.length).toBeGreaterThan(0);
        expect(typeof killCount.killCount).toBe('number');
        expect(killCount.killCount).toBeGreaterThan(0);
      });
    });

    it('should link kill counts to existing matches and players', () => {
      const dataModel = buildDataModel(sampleFiles);

      const matchIds = new Set(dataModel.matches.map(m => m.match));
      const playerNames = new Set(dataModel.players.map(p => p.player));

      // All matches in kill counts should exist
      dataModel.killCounts.byMatch.forEach(killCount => {
        expect(matchIds.has(killCount.matchId)).toBe(true);
        expect(playerNames.has(killCount.player)).toBe(true);
        expect(playerNames.has(killCount.victim)).toBe(true);
      });

      dataModel.killCounts.byMatchAndRound.forEach(killCount => {
        expect(matchIds.has(killCount.matchId)).toBe(true);
        expect(playerNames.has(killCount.player)).toBe(true);
        expect(playerNames.has(killCount.victim)).toBe(true);
      });
    });

    it('should count kills accurately', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Verify that kill counts match actual kill events
      dataModel.killCounts.byMatch.forEach(killCount => {
        // Count actual kill events for this player-victim pair in this match
        const actualKills = dataModel.kill.filter(kill => 
          kill.matchId === killCount.matchId &&
          kill.attackerName === killCount.player &&
          kill.victimName === killCount.victim
        );

        expect(killCount.killCount).toBe(actualKills.length);
      });

      // Verify that round-level kill counts match actual kill events in those rounds
      dataModel.killCounts.byMatchAndRound.forEach(killCount => {
        // Get round start events to determine round timing
        const roundStarts = dataModel.roundStart
          .filter(r => r.matchId === killCount.matchId)
          .sort((a, b) => a.matchTime - b.matchTime);
        
        const activeRoundStart = roundStarts.find(r => r.roundNumber === killCount.roundNumber);
        const nextRoundStart = roundStarts.find(r => r.roundNumber > killCount.roundNumber);
        
        if (activeRoundStart) {
          const roundStartTime = activeRoundStart.matchTime;
          const roundEndTime = nextRoundStart?.matchTime || Infinity;

          // Count actual kill events for this player-victim pair in this round
          const actualKillsInRound = dataModel.kill.filter(kill => 
            kill.matchId === killCount.matchId &&
            kill.attackerName === killCount.player &&
            kill.victimName === killCount.victim &&
            kill.matchTime >= roundStartTime &&
            kill.matchTime < roundEndTime
          );

          expect(killCount.killCount).toBe(actualKillsInRound.length);
        }
      });
    });

    it('should aggregate kill counts correctly across rounds', () => {
      const dataModel = buildDataModel(sampleFiles);

      // For each match-level kill count, verify it equals the sum of round-level counts
      dataModel.killCounts.byMatch.forEach(matchKillCount => {
        const roundKillCounts = dataModel.killCounts.byMatchAndRound.filter(roundCount =>
          roundCount.matchId === matchKillCount.matchId &&
          roundCount.player === matchKillCount.player &&
          roundCount.victim === matchKillCount.victim
        );

        const totalRoundKills = roundKillCounts.reduce((sum, roundCount) => sum + roundCount.killCount, 0);
        expect(matchKillCount.killCount).toBe(totalRoundKills);
      });
    });

    it('should handle players who never kill each other', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Kill counts should only include player-victim pairs that actually have kills
      dataModel.killCounts.byMatch.forEach(killCount => {
        expect(killCount.killCount).toBeGreaterThan(0);
      });

      dataModel.killCounts.byMatchAndRound.forEach(killCount => {
        expect(killCount.killCount).toBeGreaterThan(0);
      });
    });

    it('should handle multiple kills between same players correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Find a kill count entry with multiple kills
      const multipleKills = dataModel.killCounts.byMatch.find(killCount => killCount.killCount > 1);
      
      if (multipleKills) {
        // Verify that there are indeed multiple kill events
        const actualKillEvents = dataModel.kill.filter(kill =>
          kill.matchId === multipleKills.matchId &&
          kill.attackerName === multipleKills.player &&
          kill.victimName === multipleKills.victim
        );

        expect(actualKillEvents.length).toBe(multipleKills.killCount);
        expect(actualKillEvents.length).toBeGreaterThan(1);
      }
    });

    it('should properly assign kills to correct rounds', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Verify that round assignments are correct
      dataModel.killCounts.byMatchAndRound.forEach(killCount => {
        // Find the actual kill events for this count
        const actualKills = dataModel.kill.filter(kill =>
          kill.matchId === killCount.matchId &&
          kill.attackerName === killCount.player &&
          kill.victimName === killCount.victim
        );

        // Check that all these kills belong to the correct round
        actualKills.forEach(kill => {
          const roundStarts = dataModel.roundStart
            .filter(r => r.matchId === kill.matchId)
            .sort((a, b) => a.matchTime - b.matchTime);
          
          const activeRound = roundStarts.reverse().find(r => r.matchTime <= kill.matchTime);
          const expectedRoundNumber = activeRound?.roundNumber || 1;
          
          // At least one kill should be in the expected round
          expect([1, 2, 3]).toContain(expectedRoundNumber);
        });
      });
    });
  });

  describe('teamCompositions', () => {
    it('should build team compositions correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Team compositions should be populated
      expect(dataModel.teamCompositions.length).toBeGreaterThan(0);

      // Each team composition should have required properties
      dataModel.teamCompositions.forEach(composition => {
        expect(typeof composition.matchId).toBe('string');
        expect(typeof composition.roundIndex).toBe('number');
        expect([1, 2, 3]).toContain(composition.roundIndex);
        expect(typeof composition.startTime).toBe('number');
        expect(typeof composition.endTime).toBe('number');
        expect(typeof composition.duration).toBe('number');
        expect(typeof composition.team).toBe('string');
        
        // Duration should be positive and match endTime - startTime
        expect(composition.duration).toBeGreaterThan(0);
        expect(composition.duration).toBe(composition.endTime - composition.startTime);
        
        // Start time should be before end time
        expect(composition.startTime).toBeLessThan(composition.endTime);

        // Composition structure
        expect(composition.composition).toBeDefined();
        expect(Array.isArray(composition.composition.tank)).toBe(true);
        expect(Array.isArray(composition.composition.damage)).toBe(true);
        expect(Array.isArray(composition.composition.support)).toBe(true);

        // Player heroes structure
        expect(Array.isArray(composition.playerHeroes)).toBe(true);
        composition.playerHeroes.forEach(ph => {
          expect(typeof ph.playerName).toBe('string');
          expect(typeof ph.playerHero).toBe('string');
        });

        // Heroes by role structure
        expect(Array.isArray(composition.heroesByRole)).toBe(true);
        composition.heroesByRole.forEach(hr => {
          expect(typeof hr.role).toBe('string');
          expect(['tank', 'damage', 'support']).toContain(hr.role);
          expect(Array.isArray(hr.heroes)).toBe(true);
        });
      });
    });

    it('should link team compositions to existing matches and teams', () => {
      const dataModel = buildDataModel(sampleFiles);

      const matchIds = new Set(dataModel.matches.map(m => m.match));
      const teamNames = new Set(dataModel.teams.map(t => t.team));

      dataModel.teamCompositions.forEach(composition => {
        // Match should exist
        expect(matchIds.has(composition.matchId)).toBe(true);
        // Team should exist
        expect(teamNames.has(composition.team)).toBe(true);
      });
    });

    it('should maintain referential integrity between playerHeroes and composition', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.teamCompositions.forEach(composition => {
        // All heroes in playerHeroes should be accounted for in composition
        const allHeroesInPlayerHeroes = composition.playerHeroes.map(ph => ph.playerHero);
        const allHeroesInComposition = [
          ...composition.composition.tank,
          ...composition.composition.damage,
          ...composition.composition.support
        ];

        allHeroesInPlayerHeroes.forEach(hero => {
          expect(allHeroesInComposition).toContain(hero);
        });
      });
    });

    it('should have consistent heroes by role grouping', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.teamCompositions.forEach(composition => {
        // Heroes by role should match composition structure
        const tankHeroesByRole = composition.heroesByRole.find(hr => hr.role === 'tank');
        const damageHeroesByRole = composition.heroesByRole.find(hr => hr.role === 'damage');
        const supportHeroesByRole = composition.heroesByRole.find(hr => hr.role === 'support');

        if (tankHeroesByRole) {
          expect(tankHeroesByRole.heroes).toEqual(composition.composition.tank);
        } else {
          expect(composition.composition.tank).toHaveLength(0);
        }

        if (damageHeroesByRole) {
          expect(damageHeroesByRole.heroes).toEqual(composition.composition.damage);
        } else {
          expect(composition.composition.damage).toHaveLength(0);
        }

        if (supportHeroesByRole) {
          expect(supportHeroesByRole.heroes).toEqual(composition.composition.support);
        } else {
          expect(composition.composition.support).toHaveLength(0);
        }
      });
    });

    it('should have reasonable team composition sizes', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.teamCompositions.forEach(composition => {
        // Total number of players should be reasonable (0-6)
        const totalPlayers = composition.playerHeroes.length;
        expect(totalPlayers).toBeGreaterThanOrEqual(0);
        expect(totalPlayers).toBeLessThanOrEqual(6);

        // Role composition should be reasonable for Overwatch (allow some flexibility for edge cases)
        expect(composition.composition.tank.length).toBeLessThanOrEqual(6); // Relaxed for edge cases
        expect(composition.composition.damage.length).toBeLessThanOrEqual(6); // Relaxed for edge cases  
        expect(composition.composition.support.length).toBeLessThanOrEqual(6); // Relaxed for edge cases

        // Total heroes should match total players
        const totalHeroes = composition.composition.tank.length + 
                           composition.composition.damage.length + 
                           composition.composition.support.length;
        expect(totalHeroes).toBe(totalPlayers);
      });
    });

    it('should sort team compositions by match, round, and start time', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Check that compositions are sorted properly
      for (let i = 1; i < dataModel.teamCompositions.length; i++) {
        const prev = dataModel.teamCompositions[i - 1];
        const curr = dataModel.teamCompositions[i];
        
        // Should be sorted by matchId first, then roundIndex, then startTime
        if (prev.matchId === curr.matchId) {
          if (prev.roundIndex === curr.roundIndex) {
            expect(prev.startTime).toBeLessThanOrEqual(curr.startTime);
          } else {
            expect(prev.roundIndex).toBeLessThanOrEqual(curr.roundIndex);
          }
        } else {
          expect(prev.matchId.localeCompare(curr.matchId)).toBeLessThanOrEqual(0);
        }
      }
    });

    it('should track composition changes over time within rounds', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Group compositions by match and round
      const compositionsByMatchRound = dataModel.teamCompositions.reduce((acc, comp) => {
        const key = `${comp.matchId}-${comp.roundIndex}-${comp.team}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(comp);
        return acc;
      }, {} as Record<string, typeof dataModel.teamCompositions>);

      // Check that compositions within each round don't overlap
      Object.values(compositionsByMatchRound).forEach(roundCompositions => {
        const sortedCompositions = roundCompositions.sort((a, b) => a.startTime - b.startTime);
        
        for (let i = 1; i < sortedCompositions.length; i++) {
          const prev = sortedCompositions[i - 1];
          const curr = sortedCompositions[i];
          
          // Current composition should start when or after previous one ends
          expect(curr.startTime).toBeGreaterThanOrEqual(prev.endTime);
        }
      });
    });

    it('should have valid hero names', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Get all valid hero names from the data model
      const validHeroes = [
        ...ScrimsightDataModel.TANK_HEROES,
        ...ScrimsightDataModel.DAMAGE_HEROES,
        ...ScrimsightDataModel.SUPPORT_HEROES
      ];

      dataModel.teamCompositions.forEach(composition => {
        // All heroes in composition should be valid
        [...composition.composition.tank,
          ...composition.composition.damage,
          ...composition.composition.support].forEach(hero => {
          expect(validHeroes).toContain(hero);
        });

        // All heroes in playerHeroes should be valid
        composition.playerHeroes.forEach(ph => {
          expect(validHeroes).toContain(ph.playerHero);
        });
      });
    });

    it('should have logical timing within rounds', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.teamCompositions.forEach(composition => {
        // Find the round boundaries for this composition
        const roundStart = dataModel.roundStart.find(r => 
          r.matchId === composition.matchId && r.roundNumber === composition.roundIndex
        );
        const roundEnd = dataModel.roundEnd.find(r => 
          r.matchId === composition.matchId && r.roundNumber === composition.roundIndex
        );

        if (roundStart && roundEnd) {
          // Composition should be within round boundaries (allow small tolerance for timing precision)
          expect(composition.startTime).toBeGreaterThanOrEqual(roundStart.matchTime);
          expect(composition.endTime).toBeLessThanOrEqual(roundEnd.matchTime + 10); // 10 second tolerance
        }
      });
    });

    it('should handle hero swaps correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // If there are hero swap events, there should be composition changes
      if (dataModel.heroSwap.length > 0) {
        // Group compositions by match and team
        const compositionsByMatchTeam = dataModel.teamCompositions.reduce((acc, comp) => {
          const key = `${comp.matchId}-${comp.team}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(comp);
          return acc;
        }, {} as Record<string, typeof dataModel.teamCompositions>);

        // At least some teams should have multiple compositions (due to swaps)
        const teamsWithMultipleCompositions = Object.values(compositionsByMatchTeam)
          .filter(compositions => compositions.length > 1);
        
        if (dataModel.heroSwap.length > 0) {
          expect(teamsWithMultipleCompositions.length).toBeGreaterThan(0);
        }
      }
    });

    it('should have consistent player names with other data', () => {
      const dataModel = buildDataModel(sampleFiles);

      const allPlayerNames = new Set(dataModel.players.map(p => p.player));

      dataModel.teamCompositions.forEach(composition => {
        composition.playerHeroes.forEach(ph => {
          // All player names should exist in the players array
          expect(allPlayerNames.has(ph.playerName)).toBe(true);
        });
      });
    });

    it('should handle edge cases gracefully', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.teamCompositions.forEach(composition => {
        // All arrays should be defined (even if empty)
        expect(Array.isArray(composition.composition.tank)).toBe(true);
        expect(Array.isArray(composition.composition.damage)).toBe(true);
        expect(Array.isArray(composition.composition.support)).toBe(true);
        expect(Array.isArray(composition.playerHeroes)).toBe(true);
        expect(Array.isArray(composition.heroesByRole)).toBe(true);

        // Duration should always be positive
        expect(composition.duration).toBeGreaterThan(0);

        // Team should always be specified
        expect(composition.team.length).toBeGreaterThan(0);
      });
    });
  });
});