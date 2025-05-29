import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { playerStatusTimelineAtom, PlayerStatusTimeline } from '~/atoms/derived_state/playerStatusTimelineAtom';
import { playerInteractionEventsAtom, PlayerInteractionEvent } from '~/atoms/derived_events/playerInteractionEventsAtom';
import { ultimateEventsAtom, UltimateEvent } from '~/atoms/derived_events/ultimateEventsAtom';
import { teamfightsAtom } from '~/atoms/teamfightsAtom'; // Removed unused Teamfight type import
import { matchDataAtom } from '~/atoms/matchDataAtom';

export interface SegmentParams {
  matchId: string;
  startTime: number;
  endTime: number;
  type: 'map' | 'round' | 'teamfight';
}

export interface SegmentStats {
  team1Kills: number;
  team2Kills: number;
  team1UltsUsed: number;
  team2UltsUsed: number;
  startPlayerCountTeam1: number;
  startPlayerCountTeam2: number;
  endPlayerCountTeam1: number;
  endPlayerCountTeam2: number;
}

// Helper function to find player counts at a specific time
const getPlayerCountsAtTime = (timeline: PlayerStatusTimeline | undefined, time: number): { team1Count: number; team2Count: number } => {
  if (!timeline || timeline.length === 0) {
    return { team1Count: 0, team2Count: 0 }; // Default or error state
  }
  // Find the latest entry at or before the target time
  let relevantEntry = timeline[0];
  for (let i = timeline.length - 1; i >= 0; i--) {
    if (timeline[i].timestamp <= time) {
      relevantEntry = timeline[i];
      break;
    }
  }
  return {
    team1Count: relevantEntry.team1Players.size,
    team2Count: relevantEntry.team2Players.size,
  };
};

export const segmentStatsAtomFamily = atomFamily((params: SegmentParams) =>
  atom(async (get): Promise<SegmentStats | null> => {
    const { matchId, startTime, endTime, type } = params;

    // Get necessary data sources
    const allPlayerStatusTimelines = await get(playerStatusTimelineAtom);
    const allMatchData = await get(matchDataAtom);
    const allTeamfights = await get(teamfightsAtom);
    const allInteractionEvents = await get(playerInteractionEventsAtom);
    const allUltimateEvents = await get(ultimateEventsAtom);

    // Find data specific to this match
    const playerStatusTimeline = allPlayerStatusTimelines.get(matchId);
    const matchData = allMatchData.find(md => md.matchId === matchId);

    if (!matchData) {
      console.error(`segmentStatsAtomFamily: MatchData not found for matchId ${matchId}`);
      return null; // Or return default stats
    }
    const { team1Name, team2Name } = matchData;

    // --- Calculate Player Counts ---
    const startCounts = getPlayerCountsAtTime(playerStatusTimeline, startTime);
    const endCounts = getPlayerCountsAtTime(playerStatusTimeline, endTime);

    let team1Kills = 0;
    let team2Kills = 0;
    let team1UltsUsed = 0;
    let team2UltsUsed = 0;

    // --- Calculate Kills & Ults ---
    if (type === 'teamfight') {
      const teamfight = allTeamfights.find(tf => tf.matchId === matchId && tf.startTime === startTime && tf.endTime === endTime);
      if (teamfight) {
        team1Kills = teamfight.team1Kills;
        team2Kills = teamfight.team2Kills;
        team1UltsUsed = teamfight.team1PlayersWithUltimatesUsed.length;
        team2UltsUsed = teamfight.team2PlayersWithUltimatesUsed.length;
      } else {
        console.warn(`segmentStatsAtomFamily: Teamfight data not found for segment`, params);
        // Optionally calculate from raw events as a fallback?
      }
    } else { // 'map' or 'round'
      // Calculate Kills
      const killEventsInSegment = allInteractionEvents.filter(
        (event): event is PlayerInteractionEvent & { playerInteractionEventType: 'Killed player' } =>
          event.matchId === matchId &&
          event.playerInteractionEventType === 'Killed player' &&
          event.playerInteractionEventTime >= startTime &&
          event.playerInteractionEventTime <= endTime
      );
      killEventsInSegment.forEach(kill => {
        if (kill.playerTeam === team1Name) {
          team1Kills++;
        } else if (kill.playerTeam === team2Name) {
          team2Kills++;
        }
      });

      // Calculate Ults Used
      const ultEventsInSegment = allUltimateEvents.filter(
        (event: UltimateEvent) =>
          event.matchId === matchId &&
          event.ultimateStartTime >= startTime &&
          event.ultimateStartTime <= endTime
      );
      ultEventsInSegment.forEach(ult => {
        if (ult.playerTeam === team1Name) {
          team1UltsUsed++;
        } else if (ult.playerTeam === team2Name) {
          team2UltsUsed++;
        }
      });
    }

    return {
      team1Kills,
      team2Kills,
      team1UltsUsed,
      team2UltsUsed,
      startPlayerCountTeam1: startCounts.team1Count,
      startPlayerCountTeam2: startCounts.team2Count,
      endPlayerCountTeam1: endCounts.team1Count,
      endPlayerCountTeam2: endCounts.team2Count,
    };
  })
);
