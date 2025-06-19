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
    });

    // Matches should be linked to existing scrims
    const scrimIds = new Set(dataModel.scrims.map(s => s.scrim));
    dataModel.matches.forEach(match => {
      expect(scrimIds.has(match.scrim) || match.scrim.startsWith('unknown-scrim-')).toBe(true);
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
    expect(dataModel.playerStats).toHaveLength(0);
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

  describe('playerStats', () => {
    it('should build player stats correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Player stats should be populated
      expect(dataModel.playerStats.length).toBeGreaterThan(0);

      // Each player stat should have required properties
      dataModel.playerStats.forEach(stat => {
        // Category fields
        expect(typeof stat.matchId).toBe('string');
        expect(typeof stat.roundNumber).toBe('string');
        expect(typeof stat.playerTeam).toBe('string');
        expect(typeof stat.playerName).toBe('string');
        expect(typeof stat.playerHero).toBe('string');
        expect(['tank', 'damage', 'support']).toContain(stat.playerRole);

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
        expect(stat.weaponAccuracy).toBeLessThanOrEqual(100);
        expect(typeof stat.criticalHitRate).toBe('number');
        expect(stat.criticalHitRate).toBeGreaterThanOrEqual(0);
        expect(stat.criticalHitRate).toBeLessThanOrEqual(100);
      });
    });

    it('should calculate per-10-minute stats correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.playerStats.forEach(stat => {
        const playtimeMinutes = stat.playtime / 60;
        
        if (playtimeMinutes > 0) {
          const expectedMultiplier = 10 / playtimeMinutes;
          
          // Check that per-10-minute calculations are correct
          expect(stat.eliminationsPer10Minutes).toBeCloseTo(stat.eliminations * expectedMultiplier, 1);
          expect(stat.deathsPer10Minutes).toBeCloseTo(stat.deaths * expectedMultiplier, 1);
          expect(stat.allDamageDealtPer10Minutes).toBeCloseTo(stat.allDamageDealt * expectedMultiplier, 1);
        } else {
          // If no playtime, per-10-minute stats should be 0
          expect(stat.eliminationsPer10Minutes).toBe(0);
          expect(stat.deathsPer10Minutes).toBe(0);
          expect(stat.allDamageDealtPer10Minutes).toBe(0);
        }
      });
    });

    it('should calculate accuracy percentages correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.playerStats.forEach(stat => {
        // Weapon accuracy should be calculated correctly
        if (stat.shotsFired > 0) {
          const expectedAccuracy = (stat.shotsHit / stat.shotsFired) * 100;
          expect(stat.weaponAccuracy).toBeCloseTo(expectedAccuracy, 1);
        } else {
          expect(stat.weaponAccuracy).toBe(0);
        }

        // Scoped weapon accuracy should be calculated correctly
        if (stat.scopedShotsFired > 0) {
          const expectedScopedAccuracy = (stat.scopedShotsHit / stat.scopedShotsFired) * 100;
          expect(stat.scopedWeaponAccuracy).toBeCloseTo(expectedScopedAccuracy, 1);
        } else {
          expect(stat.scopedWeaponAccuracy).toBe(0);
        }

        // Critical hit rate should be calculated correctly
        if (stat.shotsHit > 0) {
          const expectedCritRate = (stat.criticalHits / stat.shotsHit) * 100;
          expect(stat.criticalHitRate).toBeCloseTo(expectedCritRate, 1);
        } else {
          expect(stat.criticalHitRate).toBe(0);
        }
      });
    });

    it('should assign correct player roles', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Group stats by hero to check role assignments
      const statsByHero = dataModel.playerStats.reduce((acc, stat) => {
        if (!acc[stat.playerHero]) {
          acc[stat.playerHero] = [];
        }
        acc[stat.playerHero].push(stat);
        return acc;
      }, {} as Record<string, typeof dataModel.playerStats>);

      Object.entries(statsByHero).forEach(([hero, stats]) => {
        // All stats for the same hero should have the same role
        const roles = [...new Set(stats.map(s => s.playerRole))];
        expect(roles).toHaveLength(1);

        // Verify some known hero role assignments
        const role = roles[0];
        
        // Common tank heroes
        if (['D.Va', 'Reinhardt', 'Winston', 'Zarya'].includes(hero)) {
          expect(role).toBe('tank');
        }
        
        // Common damage heroes
        if (['Tracer', 'Genji', 'Soldier: 76', 'Widowmaker'].includes(hero)) {
          expect(role).toBe('damage');
        }
        
        // Common support heroes
        if (['Mercy', 'Ana', 'Lúcio', 'Zenyatta'].includes(hero)) {
          expect(role).toBe('support');
        }
      });
    });

    it('should link player stats to existing matches and players', () => {
      const dataModel = buildDataModel(sampleFiles);

      const matchIds = new Set(dataModel.matches.map(m => m.match));
      const playerNames = new Set(dataModel.players.map(p => p.player));

      dataModel.playerStats.forEach(stat => {
        // Match should exist
        expect(matchIds.has(stat.matchId)).toBe(true);
        // Player should exist
        expect(playerNames.has(stat.playerName)).toBe(true);
      });
    });

    it('should have consistent data with raw playerStat events', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Player stats count should match raw playerStat events count
      expect(dataModel.playerStats.length).toBe(dataModel.playerStat.length);

      // Create lookup for raw events
      const rawStatsByKey = dataModel.playerStat.reduce((acc, event) => {
        const key = `${event.matchId}-${event.roundNumber}-${event.playerName}-${event.playerHero}`;
        acc[key] = event;
        return acc;
      }, {} as Record<string, typeof dataModel.playerStat[0]>);

      dataModel.playerStats.forEach(stat => {
        const key = `${stat.matchId}-${stat.roundNumber}-${stat.playerName}-${stat.playerHero}`;
        const rawStat = rawStatsByKey[key];
        
        expect(rawStat).toBeDefined();

        // Verify that base stats match raw events
        expect(stat.eliminations).toBe(rawStat.eliminations);
        expect(stat.finalBlows).toBe(rawStat.finalBlows);
        expect(stat.deaths).toBe(rawStat.deaths);
        expect(stat.allDamageDealt).toBe(rawStat.allDamageDealt);
        expect(stat.heroDamageDealt).toBe(rawStat.heroDamageDealt);
        expect(stat.healingDealt).toBe(rawStat.healingDealt);
        expect(stat.shotsFired).toBe(rawStat.shotsFired);
        expect(stat.shotsHit).toBe(rawStat.shotsHit);
      });
    });

    it('should handle edge cases correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      dataModel.playerStats.forEach(stat => {
        // Should handle division by zero gracefully
        if (stat.shotsFired === 0) {
          expect(stat.weaponAccuracy).toBe(0);
        }
        
        if (stat.scopedShotsFired === 0) {
          expect(stat.scopedWeaponAccuracy).toBe(0);
        }
        
        if (stat.shotsHit === 0) {
          expect(stat.criticalHitRate).toBe(0);
        }

        if (stat.playtime === 0) {
          expect(stat.eliminationsPer10Minutes).toBe(0);
          expect(stat.deathsPer10Minutes).toBe(0);
          expect(stat.allDamageDealtPer10Minutes).toBe(0);
        }

        // All numerical values should be finite
        expect(Number.isFinite(stat.playtime)).toBe(true);
        expect(Number.isFinite(stat.weaponAccuracy)).toBe(true);
        expect(Number.isFinite(stat.eliminationsPer10Minutes)).toBe(true);
      });
    });

    it('should calculate playtime from player lives correctly', () => {
      const dataModel = buildDataModel(sampleFiles);

      // Group player stats by match/round/player for validation
      const statsGrouped = dataModel.playerStats.reduce((acc, stat) => {
        const key = `${stat.matchId}-${stat.roundNumber}-${stat.playerName}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(stat);
        return acc;
      }, {} as Record<string, typeof dataModel.playerStats>);

      Object.entries(statsGrouped).forEach(([key, stats]) => {
        const [matchId, roundNumber, playerName] = key.split('-');
        
        // Find corresponding player lives
        const relevantLives = dataModel.playerLives.filter(life =>
          life.matchId === matchId &&
          life.roundIndex === parseInt(roundNumber) &&
          life.player === playerName
        );

        const expectedPlaytime = relevantLives.reduce((sum, life) => sum + life.duration, 0);

        // All stats for this player/match/round should have the same playtime
        const playtimes = [...new Set(stats.map(s => s.playtime))];
        expect(playtimes).toHaveLength(1);
        
        // Playtime should match sum of player life durations
        expect(playtimes[0]).toBeCloseTo(expectedPlaytime, 1);
      });
    });
  });
});