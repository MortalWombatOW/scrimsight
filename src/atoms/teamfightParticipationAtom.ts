import { atom } from 'jotai';
import { teamfights, Teamfight, TeamfightParticipation } from '@atoms';
import { PlayerInteractionEvent, playerInteractionEvents } from '@atoms';

/**
 * Pure function that calculates player participation for each teamfight
 */
export const teamfightParticipationAtomFn = (
  teamfightData: Teamfight[],
  playerInteractionEventsData: PlayerInteractionEvent[]
): Map<string, TeamfightParticipation> => {
  const participationMap = new Map<string, TeamfightParticipation>();

  // Group interactions by matchId for faster lookup
  const interactionsByMatch = playerInteractionEventsData.reduce((acc: Record<string, PlayerInteractionEvent[]>, event: PlayerInteractionEvent) => {
    if (!acc[event.matchId]) {
      acc[event.matchId] = [];
    }
    acc[event.matchId].push(event);
    return acc;
  }, {} as Record<string, PlayerInteractionEvent[]>);

  for (const fight of teamfightData) {
    const { fightId, matchId, startTime, endTime, team1Name, team2Name } = fight;
    const relevantInteractions = interactionsByMatch[matchId] || [];

    const participatingPlayers = new Set<string>();

    // Find all players involved in interactions during the fight
    relevantInteractions.forEach((event: PlayerInteractionEvent) => {
      if (event.playerInteractionEventTime >= startTime && event.playerInteractionEventTime <= endTime) {
        participatingPlayers.add(event.playerName);
        // Also add the 'otherPlayer' if applicable (e.g., victim in a kill, healer in healing)
        if (event.otherPlayerName && event.otherPlayerName !== event.playerName) {
          participatingPlayers.add(event.otherPlayerName);
        }
      }
    });

    const team1Players = new Set<string>();
    const team2Players = new Set<string>();

    // Assign players to teams based on their team affiliation in the interaction events
    // Note: This assumes player team affiliation is consistent within a fight timeframe.
    // A more robust approach might involve checking player team at the start of the fight if needed.
    relevantInteractions.forEach((event: PlayerInteractionEvent) => {
      if (participatingPlayers.has(event.playerName)) {
        if (event.playerTeam === team1Name) {
          team1Players.add(event.playerName);
        } else if (event.playerTeam === team2Name) {
          team2Players.add(event.playerName);
        }
      }
      // Check otherPlayer as well, if they exist and are participating
      if (event.otherPlayerName && participatingPlayers.has(event.otherPlayerName)) {
        // Need to find an event involving the otherPlayer to determine their team
        // This could be inefficient; consider pre-calculating player teams per match if needed.
        const otherPlayerEvent = relevantInteractions.find((e: PlayerInteractionEvent) => e.playerName === event.otherPlayerName && e.playerInteractionEventTime >= startTime && e.playerInteractionEventTime <= endTime);
        if (otherPlayerEvent) {
          if (otherPlayerEvent.playerTeam === team1Name) {
            team1Players.add(otherPlayerEvent.playerName);
          } else if (otherPlayerEvent.playerTeam === team2Name) {
            team2Players.add(otherPlayerEvent.playerName);
          }
        }
      }
    });


    participationMap.set(fightId, {
      team1Players: Array.from(team1Players),
      team2Players: Array.from(team2Players),
    });
  }

  return participationMap;
};

export default atom(async (get): Promise<Map<string, TeamfightParticipation>> => {
  const teamfightData = await get(teamfights.atom);
  const playerInteractionEventsData = await get(playerInteractionEvents.atom);

  return teamfightParticipationAtomFn(teamfightData, playerInteractionEventsData);
});
