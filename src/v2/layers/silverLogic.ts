import { v4 as uuidv4 } from 'uuid';
import {
  MatchSilver,
  PlayerHeroRoundPlaytimeSilver,
  PlayerRoundStatsSilver,
  RoundSilver,
  TeamfightSilver,
  UnifiedInteractionEventSilver,
  UltimateCycleSilver,
  PlayerLifeSilver
} from '../schemas/silverSchema';
import { getRoleFromHero, TANK_HEROES, DAMAGE_HEROES, SUPPORT_HEROES } from '../../lib/hero';

// Helper function to validate hero names and provide a fallback
const validateHeroName = (heroName: string): string => {
  // List of all valid heroes
  const allHeroes = [...TANK_HEROES, ...DAMAGE_HEROES, ...SUPPORT_HEROES];
  
  // Check if the hero name is valid
  if (allHeroes.includes(heroName as any)) {
    return heroName;
  }
  
  // If not valid, log a warning and return a default hero
  console.warn(`Invalid hero name detected: "${heroName}". Defaulting to "Soldier: 76".`);
  return 'Soldier: 76'; // Default to a hero that's unlikely to cause issues
};

// Constants for teamfight detection
const TEAMFIGHT_BUFFER_TIME = 8; // seconds between deaths to be considered the same teamfight
const TEAMFIGHT_PADDING = 3; // seconds to add before first kill and after last kill

/**
 * Calculate Silver layer match data from Bronze events
 */
export const calculateSilverMatches = (bronzeData: Record<string, any[]>): MatchSilver[] => {
  const matchStarts = bronzeData['match_start'] || [];
  const matchEnds = bronzeData['match_end'] || [];
  const playerStats = bronzeData['player_stat'] || [];
  
  return matchStarts.map(start => {
    const end = matchEnds.find(e => e.match_id === start.match_id);
    const stats = playerStats.filter(s => s.match_id === start.match_id);
    
    // Get unique players for each team
    const team1Players = Array.from(new Set(
      stats
        .filter(s => s.playerTeam === start.team1Name)
        .map(s => s.playerName)
    ));
    
    const team2Players = Array.from(new Set(
      stats
        .filter(s => s.playerTeam === start.team2Name)
        .map(s => s.playerName)
    ));
    
    // Determine winner
    const team1Score = end?.team1Score ?? 0;
    const team2Score = end?.team2Score ?? 0;
    let winner = null;
    
    if (team1Score > team2Score) {
      winner = start.team1Name;
    } else if (team2Score > team1Score) {
      winner = start.team2Name;
    }
    
    // Calculate duration
    const startTime = start.match_time;
    const endTime = end?.match_time ?? startTime;
    const duration = endTime - startTime;
    
    return {
      id: `match_${start.match_id}`,
      match_id: start.match_id,
      source_filename: start.source_filename,
      load_timestamp: start.load_timestamp,
      map_name: start.mapName,
      map_type: start.mapType,
      team1_name: start.team1Name,
      team2_name: start.team2Name,
      team1_score: team1Score,
      team2_score: team2Score,
      duration,
      winner,
      start_time: startTime,
      end_time: endTime,
      team1_players: team1Players,
      team2_players: team2Players
    };
  });
};

/**
 * Calculate Silver layer round data from Bronze events
 */
export const calculateSilverRounds = (bronzeData: Record<string, any[]>): RoundSilver[] => {
  const roundStarts = bronzeData['round_start'] || [];
  const roundEnds = bronzeData['round_end'] || [];
  const setupCompletes = bronzeData['setup_complete'] || [];
  
  return roundStarts.map(start => {
    const end = roundEnds.find(e => 
      e.match_id === start.match_id && 
      e.roundNumber === start.roundNumber
    );
    
    const setupComplete = setupCompletes.find(s => 
      s.match_id === start.match_id && 
      s.roundNumber === start.roundNumber
    );
    
    // Calculate times and duration
    const startTime = start.match_time;
    const endTime = end?.match_time ?? startTime;
    const duration = endTime - startTime;
    
    // Determine winner
    let winner = null;
    if (end) {
      if (end.team1Score > end.team2Score) {
        winner = 'team1';
      } else if (end.team2Score > end.team1Score) {
        winner = 'team2';
      }
    }
    
    return {
      id: `round_${start.match_id}_${start.roundNumber}`,
      match_id: start.match_id,
      source_filename: start.source_filename,
      load_timestamp: start.load_timestamp,
      round_number: start.roundNumber,
      start_time: startTime,
      end_time: endTime,
      duration,
      setup_complete_time: setupComplete?.match_time,
      team1_score: end?.team1Score ?? start.team1Score,
      team2_score: end?.team2Score ?? start.team2Score,
      winner,
      objective_index: start.objectiveIndex,
      capturing_team: start.capturingTeam
    };
  });
};

/**
 * Calculate Silver layer hero playtime data from Bronze events
 */
export const calculateSilverPlaytime = (bronzeData: Record<string, any[]>): PlayerHeroRoundPlaytimeSilver[] => {
  const heroSpawns = bronzeData['hero_spawn'] || [];
  const heroSwaps = bronzeData['hero_swap'] || [];
  
  // Combine hero spawns and swaps for chronological processing
  const heroEvents = [...heroSpawns, ...heroSwaps].sort((a, b) => a.match_time - b.match_time);
  
  // Group by match and round
  const roundsMap = new Map<string, RoundSilver>();
  
  // Create round map for easy lookup
  calculateSilverRounds(bronzeData).forEach(round => {
    const key = `${round.match_id}_${round.round_number}`;
    roundsMap.set(key, round);
  });
  
  // Track active heroes per player
  const activeHeroes = new Map<string, {
    hero: string,
    startTime: number,
    roundKey: string
  }>();
  
  const playtimes: PlayerHeroRoundPlaytimeSilver[] = [];
  
  // Process hero events chronologically
  for (const event of heroEvents) {
    const playerKey = `${event.match_id}_${event.playerName}`;
    const roundKey = `${event.match_id}_${getRoundNumberForTime(event.match_id, event.match_time, roundsMap)}`;
    
    // If player already has an active hero, end that period
    if (activeHeroes.has(playerKey)) {
      const active = activeHeroes.get(playerKey)!;
      
      // Only process if in the same round
      if (active.roundKey === roundKey) {
        const round = roundsMap.get(active.roundKey);
        
        if (round) {
          const endTime = Math.min(event.match_time, round.end_time || Infinity);
          const playtime = endTime - active.startTime;
          
          if (playtime > 0) {
            playtimes.push({
              id: uuidv4(),
              match_id: event.match_id,
              source_filename: event.source_filename,
              load_timestamp: event.load_timestamp,
              player_name: event.playerName,
              player_team: event.playerTeam,
              hero: active.hero,
              round_number: round.round_number,
              playtime,
              start_time: active.startTime,
              end_time: endTime
            });
          }
        }
      }
    }
    
    // Update active hero
    activeHeroes.set(playerKey, {
      hero: event.playerHero,
      startTime: event.match_time,
      roundKey
    });
  }
  
  // Process remaining active heroes at the end of their rounds
  activeHeroes.forEach((active, playerKey) => {
    const round = roundsMap.get(active.roundKey);
    if (round) {
      const endTime = round.end_time || Infinity;
      const playtime = endTime - active.startTime;
      
      if (playtime > 0) {
        const [match_id, playerName] = playerKey.split('_');
        // Find player team from a hero event
        const playerEvent = heroEvents.find(e => 
          e.match_id === match_id && 
          e.playerName === playerName
        );
        
        if (playerEvent) {
          playtimes.push({
            id: uuidv4(),
            match_id,
            source_filename: playerEvent.source_filename,
            load_timestamp: playerEvent.load_timestamp,
            player_name: playerName,
            player_team: playerEvent.playerTeam,
            hero: active.hero,
            round_number: round.round_number,
            playtime,
            start_time: active.startTime,
            end_time: endTime
          });
        }
      }
    }
  });
  
  return playtimes;
};

/**
 * Helper function to determine round number for a given time
 * With improved handling of edge cases and timestamp inconsistencies
 */
function getRoundNumberForTime(
  matchId: string, 
  timestamp: number, 
  roundsMap: Map<string, RoundSilver>
): number {
  // First try exact match
  for (const [, round] of roundsMap.entries()) {
    if (
      round.match_id === matchId && 
      timestamp >= round.start_time && 
      timestamp <= (round.end_time || Infinity)
    ) {
      return round.round_number;
    }
  }
  
  // If no exact match, find closest round by collecting all rounds for the match
  const matchRounds = Array.from(roundsMap.values())
    .filter(round => round.match_id === matchId)
    .sort((a, b) => a.round_number - b.round_number);
  
  if (matchRounds.length > 0) {
    // If timestamp is before the first round start time
    if (timestamp < matchRounds[0].start_time) {
      return matchRounds[0].round_number;
    }
    
    // If timestamp is after the last round end time
    const lastRound = matchRounds[matchRounds.length - 1];
    if (timestamp > (lastRound.end_time || Infinity)) {
      return lastRound.round_number;
    }
    
    // Find the closest round
    for (let i = 0; i < matchRounds.length - 1; i++) {
      const currentRound = matchRounds[i];
      const nextRound = matchRounds[i + 1];
      
      // If timestamp is in the gap between rounds, assign to the closer one
      if (timestamp > (currentRound.end_time || Infinity) && timestamp < nextRound.start_time) {
        const distToCurrentEnd = timestamp - (currentRound.end_time || 0);
        const distToNextStart = nextRound.start_time - timestamp;
        
        return distToCurrentEnd < distToNextStart ? 
          currentRound.round_number : nextRound.round_number;
      }
    }
  }
  
  // Default to round 1 if no match
  console.warn(`No round found for match ${matchId} at timestamp ${timestamp}, defaulting to round 1`);
  return 1;
}

/**
 * Calculate Silver layer player round stats from Bronze events
 */
export const calculateSilverPlayerRoundStats = (
  bronzeData: Record<string, any[]>,
  playtimeData: PlayerHeroRoundPlaytimeSilver[]
): PlayerRoundStatsSilver[] => {
  const playerStats = bronzeData['player_stat'] || [];
  
  // Log correlation stats for debugging
  const totalStats = playerStats.length;
  let correlationCount = 0;
  let validHeroCount = 0;
  
  const processedStats = playerStats.map(stat => {
    // Find matching playtime record with more flexible matching
    // We're now handling potential inconsistencies between hero names and round numbers
    let playtime = playtimeData.find(p => 
      p.match_id === stat.match_id &&
      p.player_name === stat.playerName &&
      p.hero === stat.playerHero &&
      p.round_number === parseInt(stat.roundNumber, 10)
    );
    
    // If no exact match found, try with just match_id, player name and round number
    if (!playtime) {
      playtime = playtimeData.find(p => 
        p.match_id === stat.match_id &&
        p.player_name === stat.playerName &&
        p.round_number === parseInt(stat.roundNumber, 10)
      );
      
      // Log when we have to use a fallback match so we can debug
      if (playtime) {
        console.warn(`Using fallback playtime match for player ${stat.playerName} in round ${stat.roundNumber}. Expected hero: ${stat.playerHero}, Found hero: ${playtime.hero}`);
      }
    }
    
    // Make sure playerHero is actually a hero and not a player name or something else
    const validHero = validateHeroName(stat.playerHero);
    
    // Update correlation stats
    if (playtime) {
      correlationCount++;
    }
    
    if (validHero === stat.playerHero) {
      validHeroCount++;
    }
    
    return {
      id: uuidv4(),
      match_id: stat.match_id,
      source_filename: stat.source_filename,
      load_timestamp: stat.load_timestamp,
      player_name: stat.playerName,
      player_team: stat.playerTeam,
      hero: validHero,
      player_role: getRoleFromHero(validHero),
      round_number: parseInt(stat.roundNumber, 10),
      playtime: playtime?.playtime,
      eliminations: stat.eliminations,
      final_blows: stat.finalBlows,
      deaths: stat.deaths,
      all_damage_dealt: stat.allDamageDealt,
      barrier_damage_dealt: stat.barrierDamageDealt,
      hero_damage_dealt: stat.heroDamageDealt,
      healing_dealt: stat.healingDealt,
      healing_received: stat.healingReceived,
      self_healing: stat.selfHealing,
      damage_taken: stat.damageTaken,
      damage_blocked: stat.damageBlocked,
      defensive_assists: stat.defensiveAssists,
      offensive_assists: stat.offensiveAssists,
      ultimates_earned: stat.ultimatesEarned,
      ultimates_used: stat.ultimatesUsed,
      multikill_best: stat.multikillBest,
      multikills: stat.multikills,
      solo_kills: stat.soloKills,
      objective_kills: stat.objectiveKills,
      environmental_kills: stat.environmentalKills,
      environmental_deaths: stat.environmentalDeaths,
      critical_hits: stat.criticalHits,
      critical_hit_accuracy: stat.criticalHitAccuracy,
      scoped_accuracy: stat.scopedAccuracy,
      scoped_critical_hit_accuracy: stat.scopedCriticalHitAccuracy,
      scoped_critical_hit_kills: stat.scopedCriticalHitKills,
      shots_fired: stat.shotsFired,
      shots_hit: stat.shotsHit,
      shots_missed: stat.shotsMissed,
      scoped_shots_fired: stat.scopedShotsFired,
      scoped_shots_hit: stat.scopedShotsHit,
      weapon_accuracy: stat.weaponAccuracy
    };
  });
  
  // Log correlation statistics for debugging
  const correlationPercent = (correlationCount / totalStats * 100).toFixed(1);
  const validHeroPercent = (validHeroCount / totalStats * 100).toFixed(1);
  
  console.info(`Player stats correlation: ${correlationCount}/${totalStats} (${correlationPercent}%)`);
  console.info(`Valid hero names: ${validHeroCount}/${totalStats} (${validHeroPercent}%)`);
  
  if (correlationCount < totalStats * 0.9) {
    console.warn(`Warning: Less than 90% of player stats correlated with playtime data (${correlationPercent}%)`);
  }
  
  return processedStats;
};

/**
 * Create unified interaction events from various Bronze events
 */
export const calculateUnifiedInteractionEvents = (
  bronzeData: Record<string, any[]>
): UnifiedInteractionEventSilver[] => {
  const events: UnifiedInteractionEventSilver[] = [];
  
  // Process kills
  const kills = bronzeData['kill'] || [];
  kills.forEach(kill => {
    const eventId = uuidv4();
    const pairId = uuidv4();
    
    // Outgoing event (from attacker's perspective)
    events.push({
      id: eventId,
      event_id: eventId,
      event_type: 'kill',
      match_id: kill.match_id,
      source_filename: kill.source_filename,
      load_timestamp: kill.load_timestamp,
      match_time: kill.match_time,
      round_number: getRoundNumberFromTime(kill.match_id, kill.match_time, bronzeData),
      source_team: kill.attackerTeam,
      source_player: kill.attackerName,
      source_hero: kill.attackerHero,
      target_team: kill.victimTeam,
      target_player: kill.victimName,
      target_hero: kill.victimHero,
      ability: kill.eventAbility,
      amount: kill.eventDamage,
      is_critical: kill.isCriticalHit,
      is_environmental: kill.isEnvironmental,
      pair_id: pairId,
      is_outgoing: true
    });
    
    // Incoming event (from victim's perspective)
    events.push({
      id: uuidv4(),
      event_id: eventId, // Same event ID as outgoing
      event_type: 'death',
      match_id: kill.match_id,
      source_filename: kill.source_filename,
      load_timestamp: kill.load_timestamp,
      match_time: kill.match_time,
      round_number: getRoundNumberFromTime(kill.match_id, kill.match_time, bronzeData),
      source_team: kill.victimTeam,
      source_player: kill.victimName,
      source_hero: kill.victimHero,
      target_team: kill.attackerTeam,
      target_player: kill.attackerName,
      target_hero: kill.attackerHero,
      ability: kill.eventAbility,
      amount: kill.eventDamage,
      is_critical: kill.isCriticalHit,
      is_environmental: kill.isEnvironmental,
      pair_id: pairId,
      is_outgoing: false
    });
  });
  
  // Process damage
  const damages = bronzeData['damage'] || [];
  damages.forEach(damage => {
    const eventId = uuidv4();
    const pairId = uuidv4();
    
    // Outgoing event (from attacker's perspective)
    events.push({
      id: eventId,
      event_id: eventId,
      event_type: 'damage',
      match_id: damage.match_id,
      source_filename: damage.source_filename,
      load_timestamp: damage.load_timestamp,
      match_time: damage.match_time,
      round_number: getRoundNumberFromTime(damage.match_id, damage.match_time, bronzeData),
      source_team: damage.attackerTeam,
      source_player: damage.attackerName,
      source_hero: damage.attackerHero,
      target_team: damage.victimTeam,
      target_player: damage.victimName,
      target_hero: damage.victimHero,
      ability: damage.eventAbility,
      amount: damage.eventDamage,
      is_critical: damage.isCriticalHit,
      is_environmental: damage.isEnvironmental,
      pair_id: pairId,
      is_outgoing: true
    });
    
    // Incoming event (from victim's perspective)
    events.push({
      id: uuidv4(),
      event_id: eventId,
      event_type: 'damage_received',
      match_id: damage.match_id,
      source_filename: damage.source_filename,
      load_timestamp: damage.load_timestamp,
      match_time: damage.match_time,
      round_number: getRoundNumberFromTime(damage.match_id, damage.match_time, bronzeData),
      source_team: damage.victimTeam,
      source_player: damage.victimName,
      source_hero: damage.victimHero,
      target_team: damage.attackerTeam,
      target_player: damage.attackerName,
      target_hero: damage.attackerHero,
      ability: damage.eventAbility,
      amount: damage.eventDamage,
      is_critical: damage.isCriticalHit,
      is_environmental: damage.isEnvironmental,
      pair_id: pairId,
      is_outgoing: false
    });
  });
  
  // Process healing
  const healings = bronzeData['healing'] || [];
  healings.forEach(healing => {
    const eventId = uuidv4();
    const pairId = uuidv4();
    
    // Outgoing event (from healer's perspective)
    events.push({
      id: eventId,
      event_id: eventId,
      event_type: 'healing',
      match_id: healing.match_id,
      source_filename: healing.source_filename,
      load_timestamp: healing.load_timestamp,
      match_time: healing.match_time,
      round_number: getRoundNumberFromTime(healing.match_id, healing.match_time, bronzeData),
      source_team: healing.healerTeam,
      source_player: healing.healerName,
      source_hero: healing.healerHero,
      target_team: healing.healeeTeam,
      target_player: healing.healeeName,
      target_hero: healing.healeeHero,
      ability: healing.eventAbility,
      amount: healing.eventHealing,
      is_health_pack: healing.isHealthPack,
      pair_id: pairId,
      is_outgoing: true
    });
    
    // Incoming event (from healee's perspective)
    events.push({
      id: uuidv4(),
      event_id: eventId,
      event_type: 'healing_received',
      match_id: healing.match_id,
      source_filename: healing.source_filename,
      load_timestamp: healing.load_timestamp,
      match_time: healing.match_time,
      round_number: getRoundNumberFromTime(healing.match_id, healing.match_time, bronzeData),
      source_team: healing.healeeTeam,
      source_player: healing.healeeName,
      source_hero: healing.healeeHero,
      target_team: healing.healerTeam,
      target_player: healing.healerName,
      target_hero: healing.healerHero,
      ability: healing.eventAbility,
      amount: healing.eventHealing,
      is_health_pack: healing.isHealthPack,
      pair_id: pairId,
      is_outgoing: false
    });
  });
  
  // Process mercy resurrections
  const mercyRezs = bronzeData['mercy_rez'] || [];
  mercyRezs.forEach(rez => {
    const eventId = uuidv4();
    const pairId = uuidv4();
    
    // Outgoing event (from Mercy's perspective)
    events.push({
      id: eventId,
      event_id: eventId,
      event_type: 'resurrection',
      match_id: rez.match_id,
      source_filename: rez.source_filename,
      load_timestamp: rez.load_timestamp,
      match_time: rez.match_time,
      round_number: getRoundNumberFromTime(rez.match_id, rez.match_time, bronzeData),
      source_team: rez.mercyTeam,
      source_player: rez.mercyName,
      source_hero: 'Mercy',
      target_team: rez.revivedTeam,
      target_player: rez.revivedName,
      target_hero: rez.revivedHero,
      ability: rez.eventAbility,
      pair_id: pairId,
      is_outgoing: true
    });
    
    // Incoming event (from revived player's perspective)
    events.push({
      id: uuidv4(),
      event_id: eventId,
      event_type: 'resurrected',
      match_id: rez.match_id,
      source_filename: rez.source_filename,
      load_timestamp: rez.load_timestamp,
      match_time: rez.match_time,
      round_number: getRoundNumberFromTime(rez.match_id, rez.match_time, bronzeData),
      source_team: rez.revivedTeam,
      source_player: rez.revivedName,
      source_hero: rez.revivedHero,
      target_team: rez.mercyTeam,
      target_player: rez.mercyName,
      target_hero: 'Mercy',
      ability: rez.eventAbility,
      pair_id: pairId,
      is_outgoing: false
    });
  });
  
  // Process D.Va demechs (similar to kills)
  const dvaDemechs = bronzeData['dva_demech'] || [];
  dvaDemechs.forEach(demech => {
    const eventId = uuidv4();
    const pairId = uuidv4();
    
    // Outgoing event (from attacker's perspective)
    events.push({
      id: eventId,
      event_id: eventId,
      event_type: 'demech',
      match_id: demech.match_id,
      source_filename: demech.source_filename,
      load_timestamp: demech.load_timestamp,
      match_time: demech.match_time,
      round_number: getRoundNumberFromTime(demech.match_id, demech.match_time, bronzeData),
      source_team: demech.attackerTeam,
      source_player: demech.attackerName,
      source_hero: demech.attackerHero,
      target_team: demech.victimTeam,
      target_player: demech.victimName,
      target_hero: demech.victimHero,
      ability: demech.eventAbility,
      amount: demech.eventDamage,
      is_critical: demech.isCriticalHit,
      is_environmental: demech.isEnvironmental,
      pair_id: pairId,
      is_outgoing: true
    });
    
    // Incoming event (from D.Va's perspective)
    events.push({
      id: uuidv4(),
      event_id: eventId,
      event_type: 'demeched',
      match_id: demech.match_id,
      source_filename: demech.source_filename,
      load_timestamp: demech.load_timestamp,
      match_time: demech.match_time,
      round_number: getRoundNumberFromTime(demech.match_id, demech.match_time, bronzeData),
      source_team: demech.victimTeam,
      source_player: demech.victimName,
      source_hero: demech.victimHero,
      target_team: demech.attackerTeam,
      target_player: demech.attackerName,
      target_hero: demech.attackerHero,
      ability: demech.eventAbility,
      amount: demech.eventDamage,
      is_critical: demech.isCriticalHit,
      is_environmental: demech.isEnvironmental,
      pair_id: pairId,
      is_outgoing: false
    });
  });
  
  return events.sort((a, b) => a.match_time - b.match_time);
};

/**
 * Helper function to get round number for a given match time
 */
function getRoundNumberFromTime(match_id: string, time: number, bronzeData: Record<string, any[]>): number | undefined {
  const roundStarts = bronzeData['round_start'] || [];
  const roundEnds = bronzeData['round_end'] || [];
  
  // Sort rounds chronologically
  const rounds = [...roundStarts]
    .filter(r => r.match_id === match_id)
    .sort((a, b) => a.match_time - b.match_time);
  
  for (let i = 0; i < rounds.length; i++) {
    const start = rounds[i];
    
    // Find corresponding end, or use next round's start or infinity
    const end = roundEnds.find(e => e.match_id === match_id && e.roundNumber === start.roundNumber);
    const nextStart = rounds[i + 1];
    
    const endTime = end?.match_time || nextStart?.match_time || Infinity;
    
    if (time >= start.match_time && time <= endTime) {
      return start.roundNumber;
    }
  }
  
  // Default to first round if no match found
  return rounds[0]?.roundNumber;
}

/**
 * Calculate teamfights from unified interaction events
 */
export const calculateSilverTeamfights = (
  unifiedInteractions: UnifiedInteractionEventSilver[],
  matches: MatchSilver[]
): TeamfightSilver[] => {
  const teamfights: TeamfightSilver[] = [];
  
  // Process by match
  matches.forEach(match => {
    // Get death events for this match
    const deathEvents = unifiedInteractions.filter(e => 
      e.match_id === match.match_id && 
      e.event_type === 'death' &&
      e.is_outgoing === false
    ).sort((a, b) => a.match_time - b.match_time);
    
    if (deathEvents.length === 0) {
      return;
    }
    
    // Group deaths into teamfights
    let currentFight: {
      deaths: UnifiedInteractionEventSilver[],
      startTime: number,
      endTime: number
    } | null = null;
    
    for (const death of deathEvents) {
      if (
        !currentFight || 
        death.match_time > currentFight.endTime + TEAMFIGHT_BUFFER_TIME
      ) {
        // Start new fight
        if (currentFight) {
          // Process the completed fight
          const fight = processFight(currentFight, match);
          if (fight) {
            teamfights.push(fight);
          }
        }
        
        currentFight = {
          deaths: [death],
          startTime: death.match_time - TEAMFIGHT_PADDING,
          endTime: death.match_time + TEAMFIGHT_BUFFER_TIME
        };
      } else {
        // Add to current fight
        currentFight.deaths.push(death);
        currentFight.endTime = death.match_time + TEAMFIGHT_BUFFER_TIME;
      }
    }
    
    // Process the last fight
    if (currentFight) {
      const fight = processFight(currentFight, match);
      if (fight) {
        teamfights.push(fight);
      }
    }
  });
  
  return teamfights;
};

/**
 * Helper function to process a teamfight
 */
function processFight(
  fight: { deaths: UnifiedInteractionEventSilver[], startTime: number, endTime: number },
  match: MatchSilver
): TeamfightSilver | null {
  // Need at least one death to make a teamfight
  if (fight.deaths.length === 0) {
    return null;
  }
  
  // Get first death
  const firstDeath = fight.deaths[0];
  const roundNumber = firstDeath.round_number || 1;
  
  // Count kills per team
  const team1Kills = fight.deaths.filter(d => d.target_team === match.team1_name).length;
  const team2Kills = fight.deaths.filter(d => d.target_team === match.team2_name).length;
  
  // Determine winner
  let winner = null;
  if (team1Kills > team2Kills) {
    winner = match.team1_name;
  } else if (team2Kills > team1Kills) {
    winner = match.team2_name;
  }
  
  // Adjust end time to include padding
  const adjustedEndTime = fight.endTime + TEAMFIGHT_PADDING;
  
  // Generate ID
  const fightId = `${match.match_id}_fight_${firstDeath.match_time}`;
  
  return {
    id: uuidv4(),
    fight_id: fightId,
    match_id: match.match_id,
    source_filename: firstDeath.source_filename,
    load_timestamp: firstDeath.load_timestamp,
    round_number: roundNumber,
    start_time: fight.startTime,
    end_time: adjustedEndTime,
    duration: adjustedEndTime - fight.startTime,
    team1_name: match.team1_name,
    team2_name: match.team2_name,
    team1_kills: team2Kills, // Team 1 kills = deaths from team 2
    team2_kills: team1Kills, // Team 2 kills = deaths from team 1
    winner,
    first_kill_time: firstDeath.match_time,
    first_kill_player: firstDeath.target_player,
    first_kill_team: firstDeath.target_team,
    first_death_player: firstDeath.source_player,
    first_death_team: firstDeath.source_team
  };
}

/**
 * Calculate ultimate cycles from Bronze events
 */
export const calculateSilverUltimateCycles = (
  bronzeData: Record<string, any[]>
): UltimateCycleSilver[] => {
  const ultimateCharged = bronzeData['ultimate_charged'] || [];
  const ultimateStart = bronzeData['ultimate_start'] || [];
  const ultimateEnd = bronzeData['ultimate_end'] || [];
  
  const cycles: UltimateCycleSilver[] = [];
  
  // Process each charged ultimate
  ultimateCharged.forEach(charged => {
    // Find corresponding start
    const start = ultimateStart.find(s => 
      s.match_id === charged.match_id &&
      s.playerName === charged.playerName &&
      s.ultimateId === charged.ultimateId
    );
    
    // Find corresponding end if started
    const end = start ? ultimateEnd.find(e => 
      e.match_id === charged.match_id &&
      e.playerName === charged.playerName &&
      e.ultimateId === charged.ultimateId
    ) : null;
    
    cycles.push({
      id: uuidv4(),
      match_id: charged.match_id,
      source_filename: charged.source_filename,
      load_timestamp: charged.load_timestamp,
      player_name: charged.playerName,
      player_team: charged.playerTeam,
      hero: charged.playerHero,
      ultimate_id: charged.ultimateId,
      charged_time: charged.match_time,
      start_time: start?.match_time,
      end_time: end?.match_time,
      duration: start && end ? end.match_time - start.match_time : undefined,
      was_used: !!start
    });
  });
  
  return cycles;
};

/**
 * Calculate player lives from Bronze events
 */
export const calculateSilverPlayerLives = (
  bronzeData: Record<string, any[]>
): PlayerLifeSilver[] => {
  const heroSpawns = bronzeData['hero_spawn'] || [];
  const heroSwaps = bronzeData['hero_swap'] || [];
  const kills = bronzeData['kill'] || [];
  const damages = bronzeData['damage'] || [];
  const healings = bronzeData['healing'] || [];
  const rounds = calculateSilverRounds(bronzeData);
  
  // Sort all hero events chronologically
  const heroEvents = [...heroSpawns, ...heroSwaps].sort((a, b) => a.match_time - b.match_time);
  
  // Track active lives
  const activeLives: Record<string, {
    life: Partial<PlayerLifeSilver>,
    damageTaken: number,
    healingReceived: number
  }> = {};
  
  const lives: PlayerLifeSilver[] = [];
  
  // Process spawns and swaps to create lives
  for (const event of heroEvents) {
    const playerKey = `${event.match_id}_${event.playerName}`;
    const roundNumber = getRoundNumberFromTime(event.match_id, event.match_time, bronzeData) || 1;
    
    // End active life if exists
    if (activeLives[playerKey]) {
      const { life, damageTaken, healingReceived } = activeLives[playerKey];
      
      // Complete the life record
      life.end_time = event.match_time;
      life.duration = event.match_time - (life.start_time || 0);
      life.end_reason = 'swap';
      life.damage_taken = damageTaken;
      life.healing_received = healingReceived;
      
      lives.push(life as PlayerLifeSilver);
    }
    
    // Start new life
    const lifeId = uuidv4();
    activeLives[playerKey] = {
      life: {
        id: lifeId,
        life_id: lifeId,
        match_id: event.match_id,
        source_filename: event.source_filename,
        load_timestamp: event.load_timestamp,
        player_name: event.playerName,
        player_team: event.playerTeam,
        hero: event.playerHero,
        round_number: roundNumber,
        start_time: event.match_time
      },
      damageTaken: 0,
      healingReceived: 0
    };
  }
  
  // Process deaths to end lives
  for (const kill of kills) {
    const playerKey = `${kill.match_id}_${kill.victimName}`;
    
    if (activeLives[playerKey]) {
      const { life, damageTaken, healingReceived } = activeLives[playerKey];
      
      // Complete the life record
      life.end_time = kill.match_time;
      life.duration = kill.match_time - (life.start_time || 0);
      life.end_reason = 'death';
      life.damage_taken = damageTaken;
      life.healing_received = healingReceived;
      life.final_blow_player = kill.attackerName;
      life.final_blow_team = kill.attackerTeam;
      life.final_blow_hero = kill.attackerHero;
      life.final_blow_ability = kill.eventAbility;
      
      lives.push(life as PlayerLifeSilver);
      
      // Remove active life
      delete activeLives[playerKey];
    }
  }
  
  // Process damage for active lives
  for (const damage of damages) {
    const playerKey = `${damage.match_id}_${damage.victimName}`;
    
    if (activeLives[playerKey]) {
      activeLives[playerKey].damageTaken += damage.eventDamage;
    }
  }
  
  // Process healing for active lives
  for (const healing of healings) {
    const playerKey = `${healing.match_id}_${healing.healeeName}`;
    
    if (activeLives[playerKey]) {
      activeLives[playerKey].healingReceived += healing.eventHealing;
    }
  }
  
  // End remaining lives at round end
  rounds.forEach(round => {
    Object.keys(activeLives).forEach(key => {
      const [match_id] = key.split('_');
      
      if (match_id === round.match_id) {
        const { life, damageTaken, healingReceived } = activeLives[key];
        
        if (life.round_number === round.round_number) {
          // Complete the life record
          life.end_time = round.end_time;
          life.duration = (round.end_time || 0) - (life.start_time || 0);
          life.end_reason = 'round_end';
          life.damage_taken = damageTaken;
          life.healing_received = healingReceived;
          
          lives.push(life as PlayerLifeSilver);
          
          // Remove active life
          delete activeLives[key];
        }
      }
    });
  });
  
  return lives;
};