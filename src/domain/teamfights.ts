import {
  Teamfight,
  MatchEvents,
  MatchMetadata,
  UltimateEvent,
} from '../types';

interface PlayerInteractionEvent {
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerInteractionEventTime: number;
  playerInteractionEventType: string;
  otherPlayerName: string;
}

const TEAMFIGHT_BUFFER_TIME = 10; // seconds
const TEAMFIGHT_PADDING = 2; // seconds to add before/after deaths

function createPlayerInteractionEvents(events: MatchEvents): PlayerInteractionEvent[] {
  const interactions: PlayerInteractionEvent[] = [];

  for (const kill of events.kills) {
    interactions.push({
      matchId: kill.matchId,
      playerName: kill.attackerName,
      playerTeam: kill.attackerTeam,
      playerInteractionEventTime: kill.matchTime,
      playerInteractionEventType: 'Killed player',
      otherPlayerName: kill.victimName,
    });
  }

  return interactions.sort((a, b) => a.playerInteractionEventTime - b.playerInteractionEventTime);
}

export function calculateTeamfights(
  events: MatchEvents,
  metadata: MatchMetadata,
  ultimateEvents: UltimateEvent[]
): Teamfight[] {
  const playerInteractionEvents = createPlayerInteractionEvents(events);

  const killEvents = playerInteractionEvents.filter(
    (event) => event.playerInteractionEventType === 'Killed player'
  );

  if (killEvents.length === 0) {
    return [];
  }

  const { matchId, team1Name, team2Name, team1Players, team2Players } = metadata;

  const teamfights: Teamfight[] = [];

  const allPlayersWithTeams = [
    ...team1Players.map((p) => ({ playerName: p, teamName: team1Name })),
    ...team2Players.map((p) => ({ playerName: p, teamName: team2Name })),
  ];

  let teamfightStartTime: number | null = null;
  let teamfightKills: typeof killEvents = [];

  for (let i = 0; i < killEvents.length; i++) {
    const currentKill = killEvents[i];
    const currentTime = currentKill.playerInteractionEventTime;

    if (
      teamfightStartTime === null ||
      (i > 0 && currentTime - killEvents[i - 1].playerInteractionEventTime > TEAMFIGHT_BUFFER_TIME)
    ) {
      if (teamfightStartTime !== null && i > 0) {
        const fight = createTeamfight(
          teamfightStartTime,
          killEvents[i - 1].playerInteractionEventTime,
          teamfightKills,
          matchId,
          team1Name,
          team2Name,
          allPlayersWithTeams,
          ultimateEvents
        );
        teamfights.push(fight);
      }

      teamfightStartTime = currentTime;
      teamfightKills = [currentKill];
    } else {
      teamfightKills.push(currentKill);
    }

    if (i === killEvents.length - 1 && teamfightStartTime !== null) {
      const fight = createTeamfight(
        teamfightStartTime,
        currentTime,
        teamfightKills,
        matchId,
        team1Name,
        team2Name,
        allPlayersWithTeams,
        ultimateEvents
      );
      teamfights.push(fight);
    }
  }

  return teamfights;
}

function createTeamfight(
  startTime: number,
  endTime: number,
  kills: PlayerInteractionEvent[],
  matchId: string,
  team1Name: string,
  team2Name: string,
  allPlayersWithTeams: { playerName: string; teamName: string }[],
  ultimateEvents: UltimateEvent[]
): Teamfight {
  const adjustedStartTime = Math.max(0, startTime - TEAMFIGHT_PADDING);
  const adjustedEndTime = endTime + TEAMFIGHT_PADDING;

  let team1Kills = 0;
  let team2Kills = 0;

  kills.forEach((kill) => {
    if (kill.playerTeam === team1Name) {
      team1Kills++;
    } else {
      team2Kills++;
    }
  });

  let winner: string | null;
  if (team1Kills > team2Kills) {
    winner = team1Name;
  } else if (team2Kills > team1Kills) {
    winner = team2Name;
  } else {
    winner = null;
  }

  const fightId = `${matchId}-${adjustedStartTime.toFixed(3)}`;

  let firstKillPlayer: string | undefined;
  let firstKillTeam: string | undefined;
  let firstKillTime: number | undefined;
  let firstDeathPlayer: string | undefined;
  let firstDeathTeam: string | undefined;
  let firstDeathTime: number | undefined;

  const sortedKills = kills.sort((a, b) => a.playerInteractionEventTime - b.playerInteractionEventTime);

  if (sortedKills.length > 0) {
    const firstKillEvent = sortedKills[0];
    firstKillPlayer = firstKillEvent.playerName;
    firstKillTeam = firstKillEvent.playerTeam;
    firstKillTime = firstKillEvent.playerInteractionEventTime;
    firstDeathPlayer = firstKillEvent.otherPlayerName;
    firstDeathTime = firstKillEvent.playerInteractionEventTime;

    const victimPlayerData = allPlayersWithTeams.find((p) => p.playerName === firstDeathPlayer);
    firstDeathTeam = victimPlayerData?.teamName;
  }

  const team1PlayersWithUltimatesChargedAtStart = ultimateEvents
    .filter(
      (ult) =>
        ult.matchId === matchId &&
        ult.playerTeam === team1Name &&
        ult.ultimateChargedTime <= adjustedStartTime &&
        ult.ultimateStartTime >= adjustedEndTime
    )
    .map((e) => e.playerName);

  const team2PlayersWithUltimatesChargedAtStart = ultimateEvents
    .filter(
      (ult) =>
        ult.matchId === matchId &&
        ult.playerTeam === team2Name &&
        ult.ultimateChargedTime <= adjustedStartTime &&
        ult.ultimateStartTime >= adjustedEndTime
    )
    .map((e) => e.playerName);

  const team1PlayersWithUltimatesUsed = ultimateEvents
    .filter(
      (ult) =>
        ult.matchId === matchId &&
        ult.playerTeam === team1Name &&
        ult.ultimateStartTime >= adjustedStartTime &&
        ult.ultimateStartTime <= adjustedEndTime
    )
    .map((e) => e.playerName);

  const team2PlayersWithUltimatesUsed = ultimateEvents
    .filter(
      (ult) =>
        ult.matchId === matchId &&
        ult.playerTeam === team2Name &&
        ult.ultimateStartTime >= adjustedStartTime &&
        ult.ultimateStartTime <= adjustedEndTime
    )
    .map((e) => e.playerName);

  return {
    fightId,
    matchId,
    startTime: adjustedStartTime,
    endTime: adjustedEndTime,
    team1Name,
    team2Name,
    winner,
    duration: adjustedEndTime - adjustedStartTime,
    team1Kills,
    team2Kills,
    team1PlayersWithUltimatesChargedAtStart,
    team2PlayersWithUltimatesChargedAtStart,
    team1PlayersWithUltimatesUsed,
    team2PlayersWithUltimatesUsed,
    firstKillPlayer,
    firstKillTeam,
    firstKillTime,
    firstDeathPlayer,
    firstDeathTeam,
    firstDeathTime,
  };
}
